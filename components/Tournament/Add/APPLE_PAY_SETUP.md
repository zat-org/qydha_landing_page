# Apple Pay Integration Guide

This guide explains how to integrate Apple Pay into your Qydha tournament application.

## 🍎 Overview

The Apple Pay integration consists of:
- **Frontend Component**: `payment.vue` - Handles the UI and Apple Pay session
- **Backend APIs**: Merchant validation and payment processing endpoints
- **Type Definitions**: TypeScript types for Apple Pay

## 📋 Prerequisites

### 1. Apple Developer Account
- Enroll in the Apple Developer Program
- Create a Merchant ID in your Apple Developer account
- Generate merchant certificates for production

### 2. Domain Verification
- Add your domain to Apple Pay merchant configuration
- Verify domain ownership with Apple

### 3. Payment Processor
- Set up account with a payment processor that supports Apple Pay
- Get API credentials for payment processing

## 🚀 Setup Instructions

### 1. Environment Variables

Add these environment variables to your `.env` file:

```env
# Apple Pay Configuration
APPLE_PAY_MERCHANT_ID=merchant.qydha.app
APPLE_PAY_DOMAIN=qydha.app
APPLE_PAY_DISPLAY_NAME=Qydha Tournament

# Payment Processor (replace with your processor)
PAYMENT_PROCESSOR_API_KEY=your_payment_processor_api_key
```

### 2. SSL Certificate (Production Only)

For production, you need to:
1. Download your merchant certificate from Apple Developer Console
2. Convert it to the required format
3. Store it securely on your server
4. Update the merchant validation endpoint to use the certificate

### 3. Domain Verification

1. Go to Apple Developer Console → Certificates, Identifiers & Profiles → Merchant IDs
2. Select your Merchant ID
3. Add your domain (e.g., `qydha.app`)
4. Download the domain verification file
5. Host it at `https://yourdomain.com/.well-known/apple-developer-merchantid-domain-association`

## 💻 Usage

### Basic Usage

```vue
<template>
  <ApplePayPayment
    :amount="100"
    label="رسوم البطولة"
    @payment-success="handleSuccess"
    @payment-error="handleError"
    @payment-cancel="handleCancel"
  />
</template>

<script setup lang="ts">
import ApplePayPayment from '~/components/Tournament/Add/payment.vue'

const handleSuccess = (result) => {
  console.log('Payment successful:', result)
  // Handle successful payment
}

const handleError = (error) => {
  console.error('Payment failed:', error)
  // Handle payment error
}

const handleCancel = () => {
  console.log('Payment cancelled')
  // Handle payment cancellation
}
</script>
```

### Advanced Usage with Dynamic Data

```vue
<template>
  <ApplePayPayment
    :amount="tournamentFee"
    :label="`رسوم تسجيل - ${tournamentName}`"
    :merchant-id="merchantId"
    @payment-success="registerForTournament"
    @payment-error="showPaymentError"
    @payment-cancel="resetForm"
  />
</template>

<script setup lang="ts">
const tournamentFee = ref(150)
const tournamentName = ref('بطولة البلوت الشتوية')
const merchantId = ref('merchant.qydha.app')

const registerForTournament = async (paymentResult) => {
  try {
    // Register user for tournament
    await $fetch('/api/tournaments/register', {
      method: 'POST',
      body: {
        tournamentId: tournamentId.value,
        paymentResult
      }
    })
    
    // Show success message
    showSuccessToast('تم التسجيل بنجاح!')
  } catch (error) {
    console.error('Registration failed:', error)
  }
}
</script>
```

## 🔧 Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `amount` | `number` | Required | Payment amount in SAR |
| `label` | `string` | `'رسوم البطولة'` | Payment description |
| `merchantId` | `string` | `'merchant.qydha.app'` | Apple Pay merchant ID |

## 📡 Component Events

| Event | Payload | Description |
|-------|---------|-------------|
| `payment-success` | `PaymentResult` | Emitted when payment succeeds |
| `payment-error` | `Error` | Emitted when payment fails |
| `payment-cancel` | - | Emitted when user cancels payment |

## 🔒 Security Considerations

### Production Checklist

- [ ] Use HTTPS for all Apple Pay interactions
- [ ] Validate merchant certificates properly
- [ ] Encrypt payment tokens before processing
- [ ] Implement proper error handling
- [ ] Log all payment attempts for audit
- [ ] Use environment variables for sensitive data
- [ ] Implement rate limiting for API endpoints
- [ ] Validate all input data on the server

### Testing

1. **Development**: Use Apple Pay simulator in Safari
2. **Staging**: Test with Apple Pay sandbox environment
3. **Production**: Test with real cards in production environment

## 🐛 Troubleshooting

### Common Issues

1. **"Apple Pay not available"**: 
   - Check if running on Safari/iOS
   - Verify merchant ID configuration
   - Ensure domain is verified with Apple

2. **Merchant validation fails**:
   - Check merchant certificate installation
   - Verify domain verification file is accessible
   - Check network connectivity to Apple servers

3. **Payment processing fails**:
   - Verify payment processor API credentials
   - Check payment token format
   - Review server logs for errors

### Debug Mode

Enable debug logging by setting:

```env
APPLE_PAY_DEBUG=true
```

This will log detailed information about the Apple Pay flow.

## 📚 Resources

- [Apple Pay Web Documentation](https://developer.apple.com/documentation/apple_pay_on_the_web)
- [Apple Pay Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/apple-pay)
- [Payment Processing Guide](https://developer.apple.com/documentation/apple_pay_on_the_web/processing_an_apple_pay_session)

## 🆘 Support

For additional support:
1. Check the browser console for errors
2. Review server logs
3. Test with Apple Pay debug tools
4. Contact your payment processor support if needed 