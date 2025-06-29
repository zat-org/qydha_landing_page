<template>
  <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
    <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
      <Icon name="i-heroicons-bug-ant" class="w-4 h-4" />
      🔍 Express Checkout Debug
    </h4>
    
    <div class="space-y-3 text-sm">
      <!-- Browser Detection -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <h5 class="font-medium mb-1">Browser Info:</h5>
          <ul class="space-y-1 text-xs">
            <li>Browser: {{ browserInfo.browser }}</li>
            <li>Platform: {{ browserInfo.platform }}</li>
            <li>Is Apple Device: {{ isAppleDevice ? 'Yes' : 'No' }}</li>
            <li>User Agent: {{ browserInfo.userAgent?.substring(0, 50) }}...</li>
          </ul>
        </div>
        
        <div>
          <h5 class="font-medium mb-1">Environment:</h5>
          <ul class="space-y-1 text-xs">
            <li>HTTPS: {{ isHTTPS ? '✅ Yes' : '❌ No' }}</li>
            <li>Hostname: {{ hostname }}</li>
            <li>Is LocalTunnel: {{ isLocalTunnel ? '✅ Yes' : '❌ No' }}</li>
            <li>Port: {{ port }}</li>
          </ul>
        </div>
      </div>
      
      <!-- Wallet Detection -->
      <div>
        <h5 class="font-medium mb-2">Wallet Availability Check:</h5>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div class="p-2 border rounded" :class="applePayStatus.available ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'">
            <div class="font-medium">🍎 Apple Pay</div>
            <div>API: {{ applePayStatus.apiAvailable ? '✅' : '❌' }}</div>
            <div>Can Make Payments: {{ applePayStatus.canMakePayments ? '✅' : '❌' }}</div>
            <div>Has Cards: {{ applePayStatus.hasCards ? '✅' : '❌' }}</div>
          </div>
          
          <div class="p-2 border rounded" :class="googlePayStatus.available ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-red-500 bg-red-50 dark:bg-red-900/20'">
            <div class="font-medium">🅶 Google Pay</div>
            <div>API: {{ googlePayStatus.apiAvailable ? '✅' : '❌' }}</div>
            <div>Is Ready: {{ googlePayStatus.isReady ? '✅' : '❌' }}</div>
          </div>
          
          <div class="p-2 border rounded" :class="linkStatus.available ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-500 bg-gray-50 dark:bg-gray-900/20'">
            <div class="font-medium">🔗 Link</div>
            <div>Available: {{ linkStatus.available ? '✅' : '⚪' }}</div>
            <div>Auto-detect by Stripe</div>
          </div>
        </div>
      </div>
      
      <!-- Manual Tests -->
      <div>
        <h5 class="font-medium mb-2">Manual Tests:</h5>
        <div class="flex flex-wrap gap-2">
          <UButton @click="testApplePay" size="xs" variant="outline" :loading="testingApplePay">
            Test Apple Pay
          </UButton>
          <UButton @click="testGooglePay" size="xs" variant="outline" :loading="testingGooglePay">
            Test Google Pay
          </UButton>
          <UButton @click="checkPaymentRequest" size="xs" variant="outline" :loading="testingPaymentRequest">
            Test Payment Request
          </UButton>
        </div>
        
        <div v-if="testResults" class="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
          <pre>{{ JSON.stringify(testResults, null, 2) }}</pre>
        </div>
      </div>
      
      <!-- Recommendations -->
      <div v-if="recommendations.length > 0" class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
        <h5 class="font-medium mb-1">💡 Recommendations:</h5>
        <ul class="space-y-1 text-xs">
          <li v-for="rec in recommendations" :key="rec" class="flex items-start gap-1">
            <span>•</span>
            <span>{{ rec }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { stripe } = useStripe();

// Browser detection
const browserInfo = computed(() => {
  if (typeof navigator === 'undefined') return { browser: 'unknown', platform: 'unknown', userAgent: 'unknown' };
  
  const userAgent = navigator.userAgent;
  const isAppleDevice = /iPad|iPhone|iPod|Mac/.test(userAgent);
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent);
  const isChrome = /Chrome/.test(userAgent);
  const isEdge = /Edge/.test(userAgent);
  const isFirefox = /Firefox/.test(userAgent);
  
  let browser = 'unknown';
  if (isSafari) browser = 'safari';
  else if (isChrome) browser = 'chrome';
  else if (isEdge) browser = 'edge';
  else if (isFirefox) browser = 'firefox';
  
  return {
    browser,
    platform: navigator.platform,
    userAgent,
    isAppleDevice
  };
});

const isAppleDevice = computed(() => browserInfo.value.isAppleDevice);

// Environment info
const isHTTPS = computed(() => {
  if (typeof window === 'undefined') return false;
  return window.location.protocol === 'https:';
});

const hostname = computed(() => {
  if (typeof window === 'undefined') return 'unknown';
  return window.location.hostname;
});

const port = computed(() => {
  if (typeof window === 'undefined') return 'unknown';
  return window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
});

const isLocalTunnel = computed(() => {
  return hostname.value.includes('loca.lt');
});

// Wallet status
const applePayStatus = ref({
  apiAvailable: false,
  canMakePayments: false,
  hasCards: false,
  available: false
});

const googlePayStatus = ref({
  apiAvailable: false,
  isReady: false,
  available: false
});

const linkStatus = ref({
  available: false
});

// Test states
const testingApplePay = ref(false);
const testingGooglePay = ref(false);
const testingPaymentRequest = ref(false);
const testResults = ref<any>(null);

// Check wallet availability
const checkWalletAvailability = async () => {
  // Check Apple Pay
  if (typeof window !== 'undefined' && 'ApplePaySession' in window) {
    const ApplePaySession = (window as any).ApplePaySession;
    applePayStatus.value.apiAvailable = true;
    
    if (ApplePaySession.canMakePayments) {
      applePayStatus.value.canMakePayments = ApplePaySession.canMakePayments();
      
      if (ApplePaySession.canMakePaymentsWithActiveCard && applePayStatus.value.canMakePayments) {
        try {
          applePayStatus.value.hasCards = await ApplePaySession.canMakePaymentsWithActiveCard('merchant.example');
        } catch (e) {
          applePayStatus.value.hasCards = false;
        }
      }
    }
    
    applePayStatus.value.available = applePayStatus.value.canMakePayments && applePayStatus.value.hasCards;
  }
  
  // Check Google Pay
  if (typeof window !== 'undefined' && (window as any).google && (window as any).google.payments) {
    googlePayStatus.value.apiAvailable = true;
    
    try {
      const paymentsClient = new (window as any).google.payments.api.PaymentsClient({
        environment: 'TEST'
      });
      
      const isReadyToPay = await paymentsClient.isReadyToPay({
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['AMEX', 'DISCOVER', 'INTERAC', 'JCB', 'MASTERCARD', 'VISA']
          }
        }]
      });
      
      googlePayStatus.value.isReady = isReadyToPay.result;
      googlePayStatus.value.available = isReadyToPay.result;
    } catch (e) {
      googlePayStatus.value.isReady = false;
    }
  }
  
  // Link is auto-detected by Stripe
  linkStatus.value.available = true; // Always available
};

// Test functions
const testApplePay = async () => {
  testingApplePay.value = true;
  testResults.value = null;
  
  try {
    if (!stripe.value) {
      throw new Error('Stripe not available');
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
    testResults.value = { applePay: canMakePayment };
  } catch (error: any) {
    testResults.value = { error: error.message };
  } finally {
    testingApplePay.value = false;
  }
};

const testGooglePay = async () => {
  testingGooglePay.value = true;
  testResults.value = null;
  
  try {
    if (typeof window !== 'undefined' && (window as any).google && (window as any).google.payments) {
      const paymentsClient = new (window as any).google.payments.api.PaymentsClient({
        environment: 'TEST'
      });
      
      const result = await paymentsClient.isReadyToPay({
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['VISA', 'MASTERCARD']
          }
        }]
      });
      
      testResults.value = { googlePay: result };
    } else {
      testResults.value = { googlePay: { error: 'Google Pay API not available' } };
    }
  } catch (error: any) {
    testResults.value = { error: error.message };
  } finally {
    testingGooglePay.value = false;
  }
};

const checkPaymentRequest = async () => {
  testingPaymentRequest.value = true;
  testResults.value = null;
  
  try {
    if (!stripe.value) {
      throw new Error('Stripe not available');
    }
    
    const paymentRequest = stripe.value.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Test Payment',
        amount: 1000,
      },
    });
    
    const canMakePayment = await paymentRequest.canMakePayment();
    testResults.value = { paymentRequest: canMakePayment };
  } catch (error: any) {
    testResults.value = { error: error.message };
  } finally {
    testingPaymentRequest.value = false;
  }
};

// Recommendations
const recommendations = computed(() => {
  const recs: string[] = [];
  
  if (!isHTTPS.value) {
    recs.push('Use HTTPS for Apple Pay support (use LocalTunnel)');
  }
  
  if (!applePayStatus.value.available && isAppleDevice.value) {
    if (browserInfo.value.browser !== 'safari') {
      recs.push('Use Safari on Apple devices for Apple Pay');
    }
    if (!applePayStatus.value.hasCards) {
      recs.push('Add a card to Apple Wallet for testing');
    }
  }
  
  if (!googlePayStatus.value.available && browserInfo.value.browser === 'chrome') {
    recs.push('Ensure Google Pay is set up in Chrome');
  }
  
  if (!isLocalTunnel.value && !isHTTPS.value) {
    recs.push('Use LocalTunnel for HTTPS testing: npx localtunnel --port 3002');
  }
  
  if (recs.length === 0) {
    recs.push('Environment looks good! Express Checkout should work.');
  }
  
  return recs;
});

// Initialize checks
onMounted(async () => {
  await nextTick();
  await checkWalletAvailability();
});
</script> 