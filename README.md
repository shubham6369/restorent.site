# TasteHub - Restaurant Ordering System

A modern, production-ready restaurant website for QR-code based table ordering with integrated payment processing.

## 🚀 Features

### ⚡ Offline / Demo Mode
- **No Setup Required** - The application fully functions with **Mock Data** if Firebase keys are missing.
- **Demo Admin Access** - Explore the dashboard without real credentials.
- **Simulated Workflow** - Test ordering, tracking, and reservations instantly.

### Customer Features
- **Digital Menu** - Browse categorized menu items with high-quality images.
- **Online Table Reservation** - Secure a table via a beautiful 2-step booking flow.
- **Real-Time Order Tracking** - Watch your order move from the kitchen to your table.
- **Customer Profiles** - Manage personal details, delivery addresses, and wishlists.
- **Loyalty Program** - Earn points for every order placed.
- **Table Detection** - Auto-detect table number from QR code URL (`?table=1`).
- **Multiple Payment Options** - Razorpay (UPI/Card) or Pay at Counter.
- **WhatsApp Support** - Instant floating chat button for customer assistance.

### Admin Dashboard
- **Kitchen Dashboard** - Live order updates with sound notifications and visual progress tracking.
- **Order Management** - Manage the full lifecycle: New → Preparing → Ready → Served.
- **Menu Management** - Dynamic menu editing with instant frontend updates.

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Firestore + Auth)
- **Payments:** Razorpay
- **Icons:** Lucide React
- **Notifications:** React Hot Toast
- **Date Formatting:** date-fns

## 📁 Project Structure

```
restorent-website/
├── app/
│   ├── admin/
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Admin order management
│   │   ├── menu/
│   │   │   └── page.tsx          # Menu management
│   │   └── page.tsx              # Admin login
│   ├── api/
│   │   ├── create-razorpay-order/
│   │   │   └── route.ts          # Create Razorpay order
│   │   └── verify-payment/
│   │       └── route.ts          # Verify payment signature
│   ├── checkout/
│   │   └── page.tsx              # Cart review & payment
│   ├── order-success/
│   │   └── page.tsx              # Order confirmation
│   ├── layout.tsx                # Root layout with providers
│   ├── page.tsx                  # Menu browsing (home)
│   └── globals.css               # Global styles
├── components/
│   ├── MenuCard.tsx              # Menu item card
│   ├── Navbar.tsx                # Navigation bar
│   └── StickyCartButton.tsx      # Floating cart button
├── context/
│   └── CartContext.tsx           # Cart state management
├── lib/
│   └── firebase.ts               # Firebase configuration
├── types/
│   └── index.ts                  # TypeScript types
├── .env.local                    # Environment variables
└── DATABASE_SCHEMA.md            # Firestore schema
```

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
cd "c:\Users\hp\restorent website"
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Firestore Database**
4. Enable **Authentication** → Email/Password
5. Go to Project Settings → Add Web App
6. Copy configuration values

### 3. Configure Environment Variables

Edit `.env.local` with your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret

NEXT_PUBLIC_ADMIN_EMAIL=admin@restaurant.com
```

### 4. Firestore Security Rules

In Firebase Console → Firestore → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /menuItems/{menuItemId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /orders/{orderId} {
      allow read: if true;
      allow create: if true;
      allow update: if request.auth != null;
    }
    
    match /tables/{tableId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 5. Create Admin User

In Firebase Console → Authentication → Add User:
- Email: `admin@restaurant.com`
- Password: (choose secure password)

### 6. Add Sample Menu Items

Use Firebase Console → Firestore → Create Collection `menuItems`:

```javascript
{
  name: "Paneer Tikka",
  description: "Spicy grilled cottage cheese with peppers",
  price: 250,
  category: "starters",
  image: "",
  available: true,
  createdAt: (timestamp),
  updatedAt: (timestamp)
}
```

Or use the admin dashboard menu management after logging in.

### 7. Razorpay Setup

1. Sign up at [Razorpay](https://dashboard.razorpay.com/)
2. Get API keys from Settings → API Keys
3. Add keys to `.env.local`

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

Visit:
- Customer menu: `http://localhost:3000`
- With table number: `http://localhost:3000?table=5`
- Admin login: `http://localhost:3000/admin`

### Production Build

```bash
npm run build
npm start
```

## 📱 How to Use

### For Customers

1. Scan QR code at table (includes table number in URL)
2. Browse menu by category
3. Add items to cart with + / - controls
4. Click "View Cart" button at bottom
5. Review order and enter table number (auto-filled from QR)
6. Select payment method:
   - **Online Payment**: Pay via UPI/Card through Razorpay
   - **Cash at Counter**: Order now, pay later
7. Receive order confirmation with Order ID

### For Restaurant Staff

1. Login at `/admin` with admin credentials
2. View real-time incoming orders on dashboard
3. Update order status:
   - **New** → Click "Start Preparing"
   - **Preparing** → Click "Mark as Served"
   - **Served** → Order complete
4. Manage menu via "Manage Menu" button:
   - Add new items
   - Edit existing items
   - Toggle availability (enable/disable)
   - Update prices
   - Delete items

## 🔐 Security Features

- Firebase Authentication for admin access
- Razorpay signature verification for payments
- Firestore security rules
- Environment variable protection
- HTTPS required for production

## 📊 Database Collections

### menuItems
- Stores all menu items
- Fields: name, description, price, category, image, available

### orders
- Stores customer orders
- Fields: items, tableNumber, totalAmount, paymentMethod, paymentStatus, orderStatus, timestamps

### tables
- Stores table information
- Fields: tableNumber, qrCode, active

## 🎨 Customization

### Change Restaurant Name
Edit `components/Navbar.tsx` and `app/layout.tsx`

### Change Colors
Edit `tailwind.config.js` and global CSS

### Add More Categories
Update `types/index.ts` and category filters in `app/page.tsx`

## 🚢 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings
4. Deploy

### Domain Setup
1. Add custom domain in Vercel
2. Update QR codes with new domain
3. Update Razorpay webhook URLs if needed

## 🐛 Troubleshooting

### Orders not appearing in real-time
- Check Firestore security rules
- Verify Firebase configuration in `.env.local`

### Payment failing
- Verify Razorpay keys are correct
- Check if Razorpay script is loading
- Ensure HTTPS in production

### Admin can't login
- Verify user exists in Firebase Authentication
- Check email/password
- Clear browser cache

## 📞 Support

For issues or questions:
1. Check Firebase Console for errors
2. Check browser console for JavaScript errors
3. Verify all environment variables are set correctly

## 📝 License

This project is free to use for restaurant purposes.

---

**Built with ❤️ for modern restaurant experiences**
