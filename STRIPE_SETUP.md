# Stripe Integration Setup Guide

## 1. Environment Variables

Add the following environment variables to your `.env` file:

```bash
# Stripe Configuration
# Get these from your Stripe Dashboard: https://dashboard.stripe.com/

# Public key (starts with pk_)
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Secret key (starts with sk_) - KEEP THIS SECRET!
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Webhook signing secret (starts with whsec_)
# Get this when you create a webhook endpoint in Stripe Dashboard
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

## 2. Getting Your Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create an account or log in
3. Navigate to "Developers" → "API keys"
4. Copy the "Publishable key" and "Secret key"
5. Use the test keys (starting with `pk_test_` and `sk_test_`) for development

## 3. Setting Up Webhooks

1. In Stripe Dashboard, go to "Developers" → "Webhooks"
2. Click "Add endpoint"
3. Set the endpoint URL to: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the "Signing secret" (starts with `whsec_`)

## 4. Testing the Integration

1. **Make sure you've added the environment variables** to your `.env` file (this is required!)
2. Start your development server: `npm run dev`
3. Visit `/payment-demo` to test the payment flow
4. Use Stripe's test card numbers:
   - **Success**: `4242424242424242`
   - **Decline**: `4000000000000002`
   - **3D Secure**: `4000002500003155`

**Note**: If you see "Stripe is not initialized" error, ensure your `STRIPE_PUBLISHABLE_KEY` is properly set in your `.env` file.

## 5. Using the Components

### Basic Payment Component Usage

```vue
<template>
  <ClientOnly>
    <StripePayment
      :amount="1999"
      currency="usd"
      :enable-apple-pay="true"
      country="US"
      :metadata="{ order_id: 'order_123' }"
      @success="handlePaymentSuccess"
      @error="handlePaymentError"
    />
  </ClientOnly>
</template>

<script setup>
const handlePaymentSuccess = (paymentIntent) => {
  console.log('Payment successful:', paymentIntent);
  // Handle successful payment
};

const handlePaymentError = (error) => {
  console.error('Payment error:', error);
  // Handle payment error
};
</script>
```

### Using the Composable

```vue
<script setup>
const { createPaymentIntent, confirmPayment } = useStripe();

const processPayment = async () => {
  try {
    // Create payment intent
    const { client_secret } = await createPaymentIntent(2000, 'usd', {
      customer_id: 'cus_123'
    });
    
    // Continue with payment confirmation...
  } catch (error) {
    console.error('Payment error:', error);
  }
};
</script>
```

## 6. Production Deployment

1. Replace test keys with live keys (starting with `pk_live_` and `sk_live_`)
2. Update webhook endpoint URL to your production domain
3. Ensure webhook endpoint is accessible and properly secured
4. Test thoroughly with small amounts before going live

## 7. Security Best Practices

- Never expose secret keys in client-side code
- Always validate payments on the server side
- Use webhooks to handle payment state changes
- Implement proper error handling and logging
- Use HTTPS in production

## 8. Available API Endpoints

- `POST /api/stripe/create-payment-intent` - Create a payment intent
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## 9. Features & Customization

### Dark/Light Mode Support
The payment component automatically adapts to your app's color mode:
- Dark and light theme styling for card elements
- Automatic color scheme detection
- Responsive theme switching

### Apple Pay Integration
Enable Apple Pay for supported devices:
```vue
<StripePayment
  :amount="1999"
  :enable-apple-pay="true"
  country="US"
  @success="handleSuccess"
/>
```

### Customization Options
The payment component supports:
- Arabic text and RTL layout
- Dark/light mode automatic switching
- Apple Pay and digital wallets
- Customizable styling via CSS classes
- Currency and amount formatting
- Error and success messages
- Payment metadata

## 10. Support

For issues with this integration:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Check Stripe Dashboard for payment logs
4. Review webhook logs for processing errors

For Stripe-specific questions, refer to the [Stripe Documentation](https://stripe.com/docs). 