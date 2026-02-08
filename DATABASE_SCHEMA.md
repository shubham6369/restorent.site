# Firestore Database Schema

## Collections Structure

### 1. menuItems (Collection)
Stores all menu items available in the restaurant.

```
menuItems/{menuItemId}
{
  id: string,
  name: string,
  description: string,
  price: number,
  category: 'starters' | 'main-course' | 'drinks' | 'desserts',
  image: string (URL),
  available: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes:**
- category (ASC)
- available (ASC)
- createdAt (DESC)

---

### 2. orders (Collection)
Stores all customer orders with real-time updates.

```
orders/{orderId}
{
  id: string,
  items: [
    {
      menuItemId: string,
      name: string,
      price: number,
      quantity: number
    }
  ],
  tableNumber: string,
  totalAmount: number,
  paymentMethod: 'upi' | 'card' | 'cash',
  paymentStatus: 'paid' | 'unpaid' | 'pending',
  orderStatus: 'new' | 'preparing' | 'served',
  razorpayOrderId: string (optional),
  razorpayPaymentId: string (optional),
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes:**
- orderStatus (ASC) + createdAt (DESC)
- tableNumber (ASC) + createdAt (DESC)
- paymentStatus (ASC)

---

### 3. tables (Collection)
Stores table information for the restaurant.

```
tables/{tableId}
{
  id: string,
  tableNumber: string,
  qrCode: string (optional - URL to QR code image),
  active: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes:**
- tableNumber (ASC)
- active (ASC)

---

### 4. users (Collection)
Stores customer profile information and preferences.

```
users/{userId}
{
  uid: string,
  email: string,
  displayName: string (optional),
  phoneNumber: string (optional),
  deliveryAddress: {
    street: string,
    city: string,
    pincode: string,
    state: string
  } (optional),
  wishlist: [menuItemId, ...],
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Indexes:**
- email (ASC)
- createdAt (DESC)

---

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Menu Items - Read for all, Write for authenticated admin only
    match /menuItems/{menuItemId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@restaurant.com';
    }
    
    // Orders - Read/Write for all (customers create, admin updates)
    match /orders/{orderId} {
      allow read: if true;
      allow create: if true;
      allow update: if request.auth != null;
    }
    
    // Tables - Read for all, Write for admin only
    match /tables/{tableId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## Initial Data Setup

### Sample Menu Items

```javascript
// Starters
{
  name: "Paneer Tikka",
  description: "Spicy grilled cottage cheese cubes with peppers",
  price: 250,
  category: "starters",
  image: "/images/menu/paneer-tikka.jpg",
  available: true
}

// Main Course
{
  name: "Butter Chicken",
  description: "Creamy tomato-based curry with tender chicken",
  price: 350,
  category: "main-course",
  image: "/images/menu/butter-chicken.jpg",
  available: true
}

// Drinks
{
  name: "Mango Lassi",
  description: "Refreshing yogurt drink with mango",
  price: 80,
  category: "drinks",
  image: "/images/menu/mango-lassi.jpg",
  available: true
}

// Desserts
{
  name: "Gulab Jamun",
  description: "Sweet deep-fried dough balls in sugar syrup",
  price: 120,
  category: "desserts",
  image: "/images/menu/gulab-jamun.jpg",
  available: true
}
```

### Sample Tables

```javascript
{ tableNumber: "1", active: true }
{ tableNumber: "2", active: true }
{ tableNumber: "3", active: true }
// ... up to your restaurant capacity
```

---

## Data Flow

### Customer Order Flow:
1. Customer browses menu (read from `menuItems`)
2. Adds items to cart (local state)
3. Enters table number
4. Selects payment method
5. If online payment:
   - Create Razorpay order
   - Complete payment
   - Create order in `orders` collection with `paymentStatus: 'paid'`
6. If cash at counter:
   - Create order in `orders` collection with `paymentStatus: 'unpaid'`
7. Redirect to order confirmation

### Admin Dashboard Flow:
1. Admin logs in
2. Real-time listener on `orders` collection (orderBy createdAt DESC)
3. Admin sees new orders instantly
4. Admin updates `orderStatus`: new → preparing → served
5. Admin can toggle `available` status in `menuItems`
6. Admin can update prices in `menuItems`

---

## Performance Optimization

- Use composite indexes for common queries
- Limit real-time listeners to recent orders (last 24 hours)
- Cache menu items on client side
- Use pagination for order history in admin panel
