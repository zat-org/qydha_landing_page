# 🚀 Stripe Express Checkout Setup Guide

## ✅ Fixed Issues
- **Configuration Error**: Fixed `overflow: 'never'` error by using `overflow: 'auto'`
- **Legacy API Warning**: Updated from `wallets` to modern `paymentMethods` API
- **Layout Configuration**: Simplified to use default Stripe configurations

## 🔧 Remaining Setup Tasks

### 1. **Enable Link Payment Method**
```bash
# Go to Stripe Dashboard
https://dashboard.stripe.com/settings/payment_methods

# Enable:
☑️ Link (for instant checkout)
☑️ Cards (Visa, Mastercard, etc.)
☑️ Apple Pay (requires domain verification)
☑️ Google Pay (auto-enabled with cards)
```

### 2. **Register Domain for Apple Pay**
```bash
# Go to Apple Pay Settings
https://dashboard.stripe.com/settings/payment_methods/apple_pay

# Add your domains:
☑️ qydha-staging.netlify.app (for staging)
☑️ your-production-domain.com (for production)
☑️ localhost (for local development)

# Download domain verification file and upload to:
# https://qydha-staging.netlify.app/.well-known/apple-developer-merchantid-domain-association
```

### 3. **Update Stripe Configuration**

#### 3.1 Test Mode Settings
```javascript
// In your Stripe Dashboard (Test Mode):
- Payment Methods: Enable Link, Apple Pay, Google Pay
- Webhooks: Ensure webhook endpoint is configured
- API Keys: Use test keys for development
```

#### 3.2 Production Preparation
```javascript
// For production:
- Domain verification for Apple Pay
- Business verification for some payment methods
- Switch to live API keys
- Configure production webhooks
```

## 🧪 Testing Instructions

### 1. **Test in Different Browsers**
```bash
# Chrome (Best for Google Pay)
✅ Should show: Google Pay + Link + Cards

# Safari on Mac (Best for Apple Pay)
✅ Should show: Apple Pay + Link + Cards

# Edge/Firefox
✅ Should show: Link + Cards
```

### 2. **Test Payment Methods**
```bash
# Test Cards (always available)
4242 4242 4242 4242 - Success
4000 0000 0000 0002 - Declined

# Google Pay (Chrome, cards added to Google account)
- Requires HTTPS
- Requires cards in Google Pay wallet

# Apple Pay (Safari on Apple devices)
- Requires HTTPS
- Requires registered domain
- Requires cards in Apple Wallet

# Link (Most compatible)
- Works on most browsers
- Stripe's one-click checkout
- Requires user to create Link account
```

## 🔍 Debugging Console Output

### ✅ **Successful Initialization**
```javascript
🔧 Creating Express Checkout with modern options: {...}
✅ Express Checkout Element is ready
✅ Express Checkout container shown
```

### ❌ **Common Issues & Solutions**

#### Issue: "Domain not registered for Apple Pay"
```javascript
// Solution: Register domain in Stripe Dashboard
// Dashboard → Settings → Payment Methods → Apple Pay
```

#### Issue: "Link payment method not activated"
```javascript
// Solution: Enable Link in Stripe Dashboard
// Dashboard → Settings → Payment Methods → Enable Link
```

#### Issue: "No payment methods available"
```javascript
// Check:
1. HTTPS enabled ✓
2. Domain registered ✓
3. Payment methods enabled in dashboard ✓
4. Browser supports payment method ✓
```

## 🎯 Expected Behavior

### Development (HTTP localhost)
- ✅ Cards: Always work
- ✅ Link: Works if enabled
- ❌ Apple Pay: Requires HTTPS
- ❌ Google Pay: Requires HTTPS

### Staging/Production (HTTPS)
- ✅ Cards: Always work
- ✅ Link: Works if enabled
- ✅ Apple Pay: Works if domain registered + Safari + Apple device
- ✅ Google Pay: Works if Chrome + Google account with cards

## 🚀 Quick Setup Commands

```bash
# 1. Enable payment methods in Stripe Dashboard
echo "Go to: https://dashboard.stripe.com/settings/payment_methods"
echo "Enable: Link, Apple Pay, Google Pay"

# 2. For local HTTPS testing
npx localtunnel --port 3001
# or
npx ngrok http 3001

# 3. Register the tunnel domain for Apple Pay testing
echo "Add tunnel domain to Apple Pay settings in Stripe Dashboard"
```

## 📱 Mobile Testing

### iOS Safari
```bash
# Requirements for Apple Pay:
- iOS Safari browser
- Cards added to Apple Wallet
- HTTPS website
- Domain registered with Stripe
```

### Android Chrome
```bash
# Requirements for Google Pay:
- Chrome browser
- Google account with payment methods
- HTTPS website
```

## 🔧 Troubleshooting Commands

```bash
# Check if Express Checkout is working
# Open browser console and look for:
✅ "Express Checkout Element is ready"
✅ Payment method buttons appear

# If no payment methods show:
1. Check console for errors
2. Verify HTTPS
3. Check Stripe Dashboard settings
4. Try different browser
5. Use /wallet-debug page for detailed diagnostics
```

## 📊 Success Metrics

- ✅ Express Checkout initializes without errors
- ✅ At least one payment method is visible
- ✅ Payment methods work in appropriate browsers
- ✅ Fallback card payments always work

Visit `/wallet-debug` page for comprehensive testing and diagnostics! 