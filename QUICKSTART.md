# 🚀 Quick Start Guide - TasteHub Restaurant

Get your restaurant ordering system up and running in 15 minutes!

## ⚡ Prerequisites

- Node.js 18+ installed
- A Firebase account (free)
- A Razorpay account (free to start)

## 📋 Step-by-Step Setup

### 1️⃣ Install Dependencies (2 minutes)

```bash
cd "c:\Users\hp\restorent website"
npm install
```

### 2️⃣ Firebase Setup (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it (e.g., "TasteHub")
4. Disable Google Analytics (optional)
5. Click "Create project"

**Enable Firestore:**
1. In left sidebar → Build → Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose location closest to you
5. Click "Enable"

**Enable Authentication:**
1. In left sidebar → Build → Authentication
2. Click "Get started"
3. Click "Email/Password"
4. Enable the **first toggle** (Email/Password)
5. Click "Save"

**Create Admin User:**
1. Still in Authentication → Users tab
2. Click "Add user"
3. Email: `admin@restaurant.com`
4. Password: Choose a strong password
5. Click "Add user"

**Get Firebase Config:**
1. Click gear icon ⚙️ → Project settings
2. Scroll to "Your apps" → Click web icon (</>)
3. Register app (name: "TasteHub Web")
4. Copy the `firebaseConfig` values

### 3️⃣ Configure Environment (2 minutes)

Edit `.env.local` with your Firebase values:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_value_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_value_here

# Leave Razorpay blank for now (optional)
NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

NEXT_PUBLIC_ADMIN_EMAIL=admin@restaurant.com
```

### 4️⃣ Update Firestore Rules (1 minute)

In Firebase Console → Firestore → Rules, replace content with:

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
  }
}
```

Click "Publish".

### 5️⃣ Start Development Server (1 minute)

```bash
npm run dev
```

Wait for "Ready" message, then open: **http://localhost:3000**

### 6️⃣ Add Your First Menu Item (2 minutes)

1. Go to **http://localhost:3000/admin**
2. Login with `admin@restaurant.com` and your password
3. Click "Manage Menu"
4. Click "Add New Item"
5. Fill in:
   - Name: "Paneer Tikka"
   - Description: "Spicy grilled cottage cheese"
   - Price: 250
   - Category: Starters
   - Leave image blank (optional)
   - Check "Available for ordering"
6. Click "Add Item"

### 7️⃣ Test Customer Flow (2 minutes)

1. Go to **http://localhost:3000?table=1**
2. You'll see "Paneer Tikka" in the menu
3. Click "Add" button
4. Click "View Cart" at bottom
5. Review order
6. Table number should show "1" (from URL)
7. Select "Pay at Counter"
8. Click "Place Order"
9. You'll see order confirmation! 🎉

### 8️⃣ See Order in Admin Dashboard (1 minute)

1. Go back to admin dashboard: **http://localhost:3000/admin/dashboard**
2. You'll see your order in real-time!
3. Click "Start Preparing"
4. Click "Mark as Served"

## ✅ You're Done!

Your restaurant ordering system is working! 🎊

## 🎯 Next Steps

### Add More Menu Items

Go to `/admin/menu` and add:
- Starters: Spring Rolls, Garlic Bread
- Main Course: Butter Chicken, Dal Makhani
- Drinks: Lassi, Soft Drinks
- Desserts: Gulab Jamun, Ice Cream

### Setup Razorpay (Optional - For Online Payments)

1. Sign up at [Razorpay](https://dashboard.razorpay.com/signup)
2. Complete KYC verification
3. Go to Settings → API Keys
4. Generate Test Keys (for testing)
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxx
   RAZORPAY_KEY_SECRET=your_secret_key
   ```
6. Restart dev server

Now you can test online payments!

### Generate QR Codes for Tables

1. Use [QR Code Generator](https://www.qr-code-generator.com/)
2. Create QR codes for:
   - Table 1: `http://localhost:3000?table=1`
   - Table 2: `http://localhost:3000?table=2`
   - Table 3: `http://localhost:3000?table=3`
   - (and so on...)
3. Print and place on tables

## 🆘 Troubleshooting

### "Firebase not configured" error
- Check `.env.local` values are correct
- Restart dev server with `Ctrl+C` then `npm run dev`

### Can't login to admin
- Verify you created user in Firebase Authentication
- Check email is exactly `admin@restaurant.com`
- Try resetting password in Firebase Console

### Orders not showing
- Check Firestore security rules are published
- Open browser console (F12) for errors
- Verify Firebase config is correct

### Menu items not appearing
- Make sure item is marked as "Available"
- Check Firestore → menuItems collection exists
- Refresh the page

## 📱 Test on Mobile

1. Find your computer's IP address:
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. On same WiFi network, open on phone:
   ```
   http://192.168.1.100:3000?table=5
   ```

## 🚀 Ready for Production?

See **DEPLOYMENT.md** for complete deployment guide to Vercel.

## 💡 Pro Tips

1. **Keep admin dashboard open** on a tablet in kitchen
2. **Enable sound notifications** (bell icon in dashboard)
3. **Test all payment methods** before going live
4. **Train staff** on order status updates
5. **Monitor orders** during first few days

---

**Need help?** Check **README.md** for detailed documentation!

**Ready to deploy?** See **DEPLOYMENT.md** for production setup!
