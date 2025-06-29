<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">🔍 Wallet Debug Page</h1>
    
    <div class="space-y-6">
      <!-- Environment Check -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">🌍 Environment Check</h2>
        </template>
        
        <div class="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 class="font-medium mb-2">Basic Info:</h3>
            <ul class="space-y-1">
              <li>HTTPS: {{ isHTTPS ? '✅ Yes' : '❌ No' }}</li>
              <li>Hostname: {{ hostname }}</li>
              <li>User Agent: {{ userAgent?.substring(0, 50) }}...</li>
              <li>Platform: {{ platform }}</li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-medium mb-2">Browser Detection:</h3>
            <ul class="space-y-1">
              <li>Safari: {{ isSafari ? '✅' : '❌' }}</li>
              <li>Chrome: {{ isChrome ? '✅' : '❌' }}</li>
              <li>Edge: {{ isEdge ? '✅' : '❌' }}</li>
              <li>Apple Device: {{ isAppleDevice ? '✅' : '❌' }}</li>
            </ul>
          </div>
        </div>
      </UCard>

      <!-- Wallet API Tests -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">🧪 Wallet API Tests</h2>
        </template>
        
        <div class="space-y-4">
          <div class="grid md:grid-cols-2 gap-4">
            <UButton @click="testApplePay" :loading="testingApple" variant="outline">
              🍎 Test Apple Pay API
            </UButton>
            <UButton @click="testGooglePay" :loading="testingGoogle" variant="outline">
              🅶 Test Google Pay API
            </UButton>
          </div>
          
          <div v-if="testResults" class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h4 class="font-medium mb-2">Test Results:</h4>
            <pre class="text-xs overflow-x-auto">{{ JSON.stringify(testResults, null, 2) }}</pre>
          </div>
        </div>
      </UCard>

      <!-- Stripe Elements Test -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">💳 Stripe Elements Test</h2>
        </template>
        
        <div class="space-y-4">
          <UButton @click="testStripePaymentRequest" :loading="testingStripe" variant="outline">
            Test Stripe Payment Request
          </UButton>
          
          <div v-if="stripeTestResults" class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h4 class="font-medium mb-2">Stripe Test Results:</h4>
            <pre class="text-xs overflow-x-auto">{{ JSON.stringify(stripeTestResults, null, 2) }}</pre>
          </div>
        </div>
      </UCard>

      <!-- Express Checkout Element Test -->
      <UCard>
        <template #header>
          <h2 class="text-xl font-semibold">🚀 Express Checkout Test</h2>
        </template>
        
        <div class="space-y-4">
          <UButton @click="initExpressCheckout" :loading="testingExpress" variant="outline">
            Initialize Express Checkout
          </UButton>
          
          <div v-if="expressTestResults" class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h4 class="font-medium mb-2">Express Checkout Results:</h4>
            <pre class="text-xs overflow-x-auto">{{ JSON.stringify(expressTestResults, null, 2) }}</pre>
          </div>
          
          <!-- Express Checkout Container -->
          <div v-if="showExpressContainer" class="border border-gray-300 rounded-lg p-4">
            <h4 class="font-medium mb-2">Express Checkout Element:</h4>
            <div ref="expressElement" class="min-h-[48px] bg-gray-50 rounded border"></div>
          </div>
        </div>
      </UCard>

      <!-- Recommendations -->
      <UCard v-if="recommendations.length > 0">
        <template #header>
          <h2 class="text-xl font-semibold">💡 Recommendations</h2>
        </template>
        
        <ul class="space-y-2">
          <li v-for="rec in recommendations" :key="rec" class="flex items-start gap-2">
            <span class="text-blue-500">•</span>
            <span>{{ rec }}</span>
          </li>
        </ul>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { stripe, createPaymentIntent } = useStripe();

// Environment info
const isHTTPS = computed(() => {
  if (typeof window === 'undefined') return false;
  return window.location.protocol === 'https:';
});

const hostname = computed(() => {
  if (typeof window === 'undefined') return 'unknown';
  return window.location.hostname;
});

const userAgent = computed(() => {
  if (typeof navigator === 'undefined') return 'unknown';
  return navigator.userAgent;
});

const platform = computed(() => {
  if (typeof navigator === 'undefined') return 'unknown';
  return navigator.platform;
});

// Browser detection
const isSafari = computed(() => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome/.test(ua);
});

const isChrome = computed(() => {
  if (typeof navigator === 'undefined') return false;
  return /Chrome/.test(navigator.userAgent);
});

const isEdge = computed(() => {
  if (typeof navigator === 'undefined') return false;
  return /Edge/.test(navigator.userAgent);
});

const isAppleDevice = computed(() => {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);
});

// Test state
const testingApple = ref(false);
const testingGoogle = ref(false);
const testingStripe = ref(false);
const testingExpress = ref(false);
const testResults = ref<any>(null);
const stripeTestResults = ref<any>(null);
const expressTestResults = ref<any>(null);

// Express checkout
const expressElement = ref<HTMLElement>();
const showExpressContainer = ref(false);

// Test functions
const testApplePay = async () => {
  testingApple.value = true;
  testResults.value = null;
  
  try {
    if (typeof window === 'undefined' || !('ApplePaySession' in window)) {
      testResults.value = { applePay: { error: 'Apple Pay not supported' } };
      return;
    }

    const ApplePaySession = (window as any).ApplePaySession;
    const results = {
      apiAvailable: true,
      version: ApplePaySession.version || 'unknown',
      canMakePayments: false,
      canMakePaymentsWithActiveCard: false
    };

    if (ApplePaySession.canMakePayments) {
      results.canMakePayments = ApplePaySession.canMakePayments();
      
      if (results.canMakePayments && ApplePaySession.canMakePaymentsWithActiveCard) {
        try {
          results.canMakePaymentsWithActiveCard = await ApplePaySession.canMakePaymentsWithActiveCard('merchant.example');
        } catch (e) {
          results.canMakePaymentsWithActiveCard = false;
        }
      }
    }

    testResults.value = { applePay: results };
  } catch (error: any) {
    testResults.value = { applePay: { error: error.message } };
  } finally {
    testingApple.value = false;
  }
};

const testGooglePay = async () => {
  testingGoogle.value = true;
  testResults.value = null;
  
  try {
    if (typeof window === 'undefined' || !(window as any).google || !(window as any).google.payments) {
      testResults.value = { googlePay: { error: 'Google Pay API not available' } };
      return;
    }

    const paymentsClient = new (window as any).google.payments.api.PaymentsClient({
      environment: 'TEST'
    });

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [{
        type: 'CARD',
        parameters: {
          allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
          allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA']
        }
      }]
    };

    const isReadyToPay = await paymentsClient.isReadyToPay(paymentDataRequest);
    testResults.value = { googlePay: isReadyToPay };
  } catch (error: any) {
    testResults.value = { googlePay: { error: error.message } };
  } finally {
    testingGoogle.value = false;
  }
};

const testStripePaymentRequest = async () => {
  testingStripe.value = true;
  stripeTestResults.value = null;
  
  try {
    if (!stripe.value) {
      stripeTestResults.value = { error: 'Stripe not available' };
      return;
    }

    const paymentRequest = stripe.value.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Test Payment',
        amount: 1000,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });

    const canMakePayment = await paymentRequest.canMakePayment();
    stripeTestResults.value = { 
      paymentRequest: canMakePayment,
      stripeAvailable: true 
    };
  } catch (error: any) {
    stripeTestResults.value = { error: error.message };
  } finally {
    testingStripe.value = false;
  }
};

const initExpressCheckout = async () => {
  testingExpress.value = true;
  expressTestResults.value = null;
  
  try {
    if (!stripe.value) {
      expressTestResults.value = { error: 'Stripe not available' };
      return;
    }

    // Create payment intent first
    const response = await createPaymentIntent(1000, 'usd', { test: 'express_checkout' });
    
    if (!response?.client_secret) {
      expressTestResults.value = { error: 'Failed to create payment intent' };
      return;
    }

    // Create elements with client secret
    const elements = stripe.value.elements({
      clientSecret: response.client_secret
    });

    // Create express checkout element
    const expressCheckout = (elements as any).create('expressCheckout', {
      layout: {
        maxColumns: 1,
        maxRows: 1,
        overflow: 'never',
      },
      buttonHeight: 48,
      wallets: {
        applePay: 'auto',
        googlePay: 'auto',
      },
      paymentMethodOrder: ['apple_pay', 'google_pay', 'link'],
    });

    showExpressContainer.value = true;
    await nextTick();

    if (expressElement.value) {
      expressCheckout.mount(expressElement.value);
      
      expressCheckout.on('ready', (event: any) => {
        expressTestResults.value = { 
          ready: true, 
          event,
          clientSecret: response.client_secret?.substring(0, 20) + '...'
        };
      });

      expressCheckout.on('error', (event: any) => {
        expressTestResults.value = { error: event.error };
      });
    }
  } catch (error: any) {
    expressTestResults.value = { error: error.message };
  } finally {
    testingExpress.value = false;
  }
};

// Recommendations
const recommendations = computed(() => {
  const recs: string[] = [];

  if (!isHTTPS.value) {
    recs.push('Use HTTPS for wallet support. Try: npx localtunnel --port 3000');
  }

  if (isAppleDevice.value && !isSafari.value) {
    recs.push('Use Safari on Apple devices for best Apple Pay support');
  }

  if (!isAppleDevice.value && !isChrome.value) {
    recs.push('Use Chrome for Google Pay support on non-Apple devices');
  }

    if (hostname.value === 'localhost') {
    recs.push('Use a tunnel service for testing payment methods with HTTPS');
  }

  return recs;
});
</script> 