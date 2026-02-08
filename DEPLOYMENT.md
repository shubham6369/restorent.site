# Deployment Guide - TasteHub Restaurant

## Prerequisites

- GitHub account
- Vercel account (free)
- Firebase project set up
- Razorpay account with API keys

## Step-by-Step Deployment

### 1. Prepare Firebase for Production

#### Firestore Indexes

Go to Firebase Console → Firestore → Indexes and create:

```
Collection: orders
Fields:
  - orderStatus (Ascending)
  - createdAt (Descending)

Collection: orders  
Fields:
  - tableNumber (Ascending)
  - createdAt (Descending)

Collection: menuItems
Fields:
  - category (Ascending)
  - name (Ascending)
```

These indexes will be auto-created when you first query, but you can create them manually for immediate availability.

#### Firestore Security Rules

Update your security rules for production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Menu Items - Public read, admin-only write
    match /menuItems/{menuItemId} {
      allow read: if true;
      allow create, update, delete: if request.auth != null 
        && request.auth.token.email == 'admin@restaurant.com';
    }
    
    // Orders - Public create, admin update
    match /orders/{orderId} {
      allow read: if true;
      allow create: if true;
      allow update: if request.auth != null;
      allow delete: if false; // Never allow deletion
    }
    
    // Tables - Public read, admin write
    match /tables/{tableId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - TasteHub Restaurant"

# Create repository on GitHub, then:
git remote add origin https://github.com/your-username/tastehub-restaurant.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel

#### Option A: Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Follow prompts, then deploy to production
vercel --prod
```

### 4. Add Environment Variables in Vercel

Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add all variables from `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
NEXT_PUBLIC_FIREBASE_APP_ID=your_value
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_value
RAZORPAY_KEY_SECRET=your_value
NEXT_PUBLIC_ADMIN_EMAIL=admin@restaurant.com
```

**Important**: Set environment for **Production**, **Preview**, and **Development**

### 5. Redeploy After Adding Variables

After adding environment variables:
1. Go to Deployments tab
2. Click on latest deployment → ⋯ menu → Redeploy
3. Check "Use existing build cache" → Redeploy

### 6. Configure Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `order.yourrestaurant.com`)
3. Follow DNS configuration instructions
4. Wait for SSL certificate provisioning (automatic)

### 7. Generate QR Codes for Tables

Use a QR code generator with your production URL:

**Format**: `https://your-domain.vercel.app?table=TABLE_NUMBER`

**Examples**:
- Table 1: `https://your-domain.vercel.app?table=1`
- Table 2: `https://your-domain.vercel.app?table=2`
- Table 10: `https://your-domain.vercel.app?table=10`

**QR Code Generators**:
- [QR Code Generator](https://www.qr-code-generator.com/)
- [QRCode Monkey](https://www.qrcode-monkey.com/)
- Bulk generation: Use API services like goqr.me

**Print QR Codes**:
1. Generate QR codes for all tables
2. Print on waterproof paper
3. Place in acrylic stands on each table
4. Include instructions: "Scan to Order"

### 8. Update Firebase Auth Domain

1. Go to Firebase Console → Authentication → Settings
2. Add your Vercel domain to **Authorized domains**:
   - `your-domain.vercel.app`
   - Your custom domain (if any)

### 9. Test Production Deployment

1. Visit your production URL
2. Test customer flow:
   - Scan QR code (or visit with ?table=1)
   - Browse menu
   - Add items to cart
   - Complete checkout
   - Test both online payment and cash payment
3. Test admin flow:
   - Login at `/admin`
   - Verify orders appear in real-time
   - Update order status
   - Manage menu items

### 10. Monitor and Maintain

#### Vercel Analytics
- Enable in Vercel Dashboard → Your Project → Analytics
- Monitor page views, performance, and errors

#### Firebase Usage
- Monitor Firestore reads/writes in Firebase Console
- Set up budget alerts

#### Error Monitoring
- Check Vercel Functions logs for API errors
- Monitor browser console in production

## Production Checklist

- [ ] Firebase project created and configured
- [ ] Firestore security rules updated
- [ ] Admin user created in Firebase Auth
- [ ] Menu items added to Firestore
- [ ] Razorpay account set up (Production mode)
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added in Vercel
- [ ] Custom domain configured (optional)
- [ ] Firebase authorized domains updated
- [ ] QR codes generated and printed
- [ ] Production testing completed
- [ ] Admin login tested
- [ ] Payment flow tested
- [ ] Order notifications working

## Updating the Application

### For Code Changes

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel will automatically deploy on push to main branch.

### For Menu Changes

Use the admin dashboard at `/admin/menu` - no deployment needed!

### For Price Updates

Use the admin dashboard - changes reflect immediately.

## Scaling Considerations

### For High Traffic

1. **Firestore**:
   - Monitor quotas in Firebase Console
   - Upgrade to Blaze plan if needed
   - Add caching with React Query

2. **Vercel**:
   - Free tier: 100GB bandwidth/month
   - Upgrade to Pro if needed

3. **Razorpay**:
   - Check transaction limits
   - Upgrade plan as business grows

## Backup Strategy

### Firestore Backups

1. Enable automatic backups in Google Cloud Console
2. Export data periodically:

```bash
gcloud firestore export gs://[BUCKET_NAME]
```

### Code Backups

- Git repository serves as backup
- Consider multiple remotes (GitHub + GitLab)

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Use environment variables** for all secrets
3. **Regularly update dependencies**:
   ```bash
   npm audit
   npm update
   ```
4. **Monitor Firebase Auth** for suspicious login attempts
5. **Enable Firebase App Check** for additional security
6. **Use HTTPS only** - Enforced by Vercel
7. **Rotate API keys** periodically

## Troubleshooting Deployment Issues

### Build Fails on Vercel

- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json`
- Test build locally: `npm run build`

### Environment Variables Not Working

- Ensure variables are added for correct environment (Production)
- Redeploy after adding variables
- Check variable names match code exactly

### Firebase Connection Issues

- Verify Firebase config values
- Check Firebase quotas
- Ensure authorized domains include Vercel domain

### Payment Not Working

- Verify Razorpay is in Live mode (not Test mode)
- Check API keys are for production
- Ensure HTTPS is enabled (automatic on Vercel)

## Cost Estimation

### Free Tier Limits

**Vercel (Hobby)**:
- Unlimited deployments
- 100GB bandwidth/month
- Serverless function executions included

**Firebase (Spark - Free)**:
- 50K reads, 20K writes, 20K deletes per day
- 1GB storage
- 10GB/month network egress

**Razorpay**:
- 2% transaction fee (industry standard)
- No setup or monthly fees

### When to Upgrade

Upgrade when you exceed:
- 1500 orders/day (Firebase)
- 100GB bandwidth/month (Vercel)
- Need advanced analytics

---

## Post-Deployment

1. **Train Staff** on using admin dashboard
2. **Create User Manual** for restaurant staff
3. **Set up Support** process for technical issues
4. **Monitor Performance** for first few days
5. **Collect Feedback** from customers and staff
6. **Iterate and Improve** based on usage patterns

**Your restaurant ordering system is now live! 🎉**
