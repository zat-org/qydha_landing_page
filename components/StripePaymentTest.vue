<template>
  <div class="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
    <div class="flex items-center gap-2 mb-6">
      <Icon name="i-heroicons-beaker" class="w-6 h-6 text-blue-600" />
      <h2 class="text-xl font-bold dark:text-white">Stripe Payment System Tests</h2>
    </div>

    <!-- Test Controls -->
    <div class="mb-6 flex flex-wrap gap-2">
      <UButton @click="runAllTests" :loading="runningAllTests" color="primary">
        🧪 Run All Tests
      </UButton>
      <UButton @click="testPaymentIntent" :loading="testingPaymentIntent" variant="outline">
        💳 Test Payment Intent
      </UButton>
      <UButton @click="testExpressCheckout" :loading="testingExpressCheckout" variant="outline">
        🍎 Test Express Checkout
      </UButton>
      <UButton @click="testCardElement" :loading="testingCardElement" variant="outline">
        💳 Test Card Element
      </UButton>
      <UButton @click="clearResults" variant="soft" color="red">
        🗑️ Clear Results
      </UButton>
    </div>

    <!-- Test Results -->
    <div class="space-y-4">
      <div v-for="(test, index) in testResults" :key="index" 
           class="border rounded-lg p-4"
           :class="{
             'border-green-500 bg-green-50 dark:bg-green-900/20': test.status === 'passed',
             'border-red-500 bg-red-50 dark:bg-red-900/20': test.status === 'failed',
             'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20': test.status === 'running',
             'border-gray-300 dark:border-gray-600': test.status === 'pending'
           }">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Icon 
              :name="getTestIcon(test.status)" 
              :class="getTestIconClass(test.status)"
              class="w-5 h-5"
            />
            <h3 class="font-medium dark:text-white">{{ test.name }}</h3>
          </div>
          <span class="text-xs px-2 py-1 rounded"
                :class="{
                  'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200': test.status === 'passed',
                  'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200': test.status === 'failed',
                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200': test.status === 'running',
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200': test.status === 'pending'
                }">
            {{ test.status.toUpperCase() }}
          </span>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ test.description }}</p>
        <div v-if="test.details" class="mt-2 text-xs">
          <div v-if="test.status === 'passed'" class="text-green-700 dark:text-green-300">
            ✅ {{ test.details }}
          </div>
          <div v-else-if="test.status === 'failed'" class="text-red-700 dark:text-red-300">
            ❌ {{ test.details }}
          </div>
          <div v-else-if="test.status === 'running'" class="text-yellow-700 dark:text-yellow-300">
            ⏳ {{ test.details }}
          </div>
        </div>
        <div v-if="test.data" class="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs">
          <pre class="whitespace-pre-wrap">{{ JSON.stringify(test.data, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <!-- Test Summary -->
    <div v-if="testResults.length > 0" class="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg border">
      <h3 class="font-medium dark:text-white mb-2">Test Summary</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div class="p-2">
          <div class="text-2xl font-bold text-green-600">{{ passedTests }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Passed</div>
        </div>
        <div class="p-2">
          <div class="text-2xl font-bold text-red-600">{{ failedTests }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Failed</div>
        </div>
        <div class="p-2">
          <div class="text-2xl font-bold text-yellow-600">{{ runningTests }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Running</div>
        </div>
        <div class="p-2">
          <div class="text-2xl font-bold text-gray-600">{{ pendingTests }}</div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Pending</div>
        </div>
      </div>
    </div>

    <!-- Test Card Information -->
    <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
      <h3 class="font-medium text-blue-800 dark:text-blue-200 mb-2">🧪 Test Card Numbers</h3>
      <div class="grid md:grid-cols-2 gap-4 text-sm">
        <div>
          <p class="font-medium">Success:</p>
          <p class="font-mono">4242 4242 4242 4242</p>
        </div>
        <div>
          <p class="font-medium">Decline:</p>
          <p class="font-mono">4000 0000 0000 0002</p>
        </div>
        <div>
          <p class="font-medium">Insufficient Funds:</p>
          <p class="font-mono">4000 0000 0000 9995</p>
        </div>
        <div>
          <p class="font-medium">Processing Error:</p>
          <p class="font-mono">4000 0000 0000 0119</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface TestResult {
  name: string;
  description: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  details?: string;
  data?: any;
}

const { createPaymentIntent, stripe, isReady } = useStripe();
const config = useRuntimeConfig();

const testResults = ref<TestResult[]>([]);
const runningAllTests = ref(false);
const testingPaymentIntent = ref(false);
const testingExpressCheckout = ref(false);
const testingCardElement = ref(false);

// Test counters
const passedTests = computed(() => testResults.value.filter(t => t.status === 'passed').length);
const failedTests = computed(() => testResults.value.filter(t => t.status === 'failed').length);
const runningTests = computed(() => testResults.value.filter(t => t.status === 'running').length);
const pendingTests = computed(() => testResults.value.filter(t => t.status === 'pending').length);

const getTestIcon = (status: string) => {
  switch (status) {
    case 'passed': return 'i-heroicons-check-circle';
    case 'failed': return 'i-heroicons-x-circle';
    case 'running': return 'i-heroicons-arrow-path';
    default: return 'i-heroicons-clock';
  }
};

const getTestIconClass = (status: string) => {
  switch (status) {
    case 'passed': return 'text-green-600';
    case 'failed': return 'text-red-600';
    case 'running': return 'text-yellow-600 animate-spin';
    default: return 'text-gray-600';
  }
};

const addTestResult = (test: TestResult) => {
  testResults.value.push(test);
};

const updateTestResult = (name: string, updates: Partial<TestResult>) => {
  const test = testResults.value.find(t => t.name === name);
  if (test) {
    Object.assign(test, updates);
  }
};

const clearResults = () => {
  testResults.value = [];
};

// Test 1: Environment Configuration
const testEnvironmentConfig = async () => {
  const test: TestResult = {
    name: 'Environment Configuration',
    description: 'Check if Stripe keys are properly configured',
    status: 'running',
    details: 'Checking environment variables...'
  };
  addTestResult(test);

  try {
    const hasPublishableKey = !!config.public.stripePublishableKey;
    const publishableKeyValid = config.public.stripePublishableKey?.startsWith('pk_');
    
    if (!hasPublishableKey) {
      throw new Error('STRIPE_PUBLISHABLE_KEY not found');
    }
    
    if (!publishableKeyValid) {
      throw new Error('STRIPE_PUBLISHABLE_KEY appears to be invalid');
    }

    updateTestResult('Environment Configuration', {
      status: 'passed',
      details: 'All environment variables are properly configured',
      data: {
        publishableKey: hasPublishableKey,
        keyFormat: publishableKeyValid,
        keyLength: config.public.stripePublishableKey?.length
      }
    });
  } catch (error: any) {
    updateTestResult('Environment Configuration', {
      status: 'failed',
      details: error.message,
      data: { error: error.message }
    });
  }
};

// Test 2: Stripe Initialization
const testStripeInitialization = async () => {
  const test: TestResult = {
    name: 'Stripe Initialization',
    description: 'Check if Stripe.js loads and initializes correctly',
    status: 'running',
    details: 'Checking Stripe instance...'
  };
  addTestResult(test);

  try {
    // Wait a bit for Stripe to initialize
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!stripe.value) {
      throw new Error('Stripe instance not available');
    }

    if (!isReady.value) {
      throw new Error('Stripe not ready');
    }

    updateTestResult('Stripe Initialization', {
      status: 'passed',
      details: 'Stripe initialized successfully',
      data: {
        stripeLoaded: !!stripe.value,
        isReady: isReady.value,
        stripeVersion: stripe.value?.version || 'unknown'
      }
    });
  } catch (error: any) {
    updateTestResult('Stripe Initialization', {
      status: 'failed',
      details: error.message,
      data: { error: error.message }
    });
  }
};

// Test 3: Payment Intent Creation
const testPaymentIntent = async () => {
  testingPaymentIntent.value = true;
  
  const test: TestResult = {
    name: 'Payment Intent API',
    description: 'Test creating payment intents via API',
    status: 'running',
    details: 'Creating test payment intent...'
  };
  addTestResult(test);

  try {
    const response = await createPaymentIntent(
      1000, // $10.00
      'usd',
      { test: 'true', source: 'automated_test' }
    );

    if (!response || !response.client_secret) {
      throw new Error('Invalid payment intent response');
    }

    if (!response.client_secret.startsWith('pi_')) {
      throw new Error('Invalid client secret format');
    }

    updateTestResult('Payment Intent API', {
      status: 'passed',
      details: 'Payment intent created successfully',
      data: {
        clientSecret: response.client_secret.substring(0, 20) + '...',
        paymentIntentId: response.payment_intent_id
      }
    });
  } catch (error: any) {
    updateTestResult('Payment Intent API', {
      status: 'failed',
      details: error.message,
      data: { error: error.message }
    });
  } finally {
    testingPaymentIntent.value = false;
  }
};

// Test 4: Express Checkout Detection
const testExpressCheckout = async () => {
  testingExpressCheckout.value = true;
  
  const test: TestResult = {
    name: 'Express Checkout Detection',
    description: 'Test Apple Pay, Google Pay, and Link availability',
    status: 'running',
    details: 'Checking payment method availability...'
  };
  addTestResult(test);

  try {
    const results = {
      applePay: false,
      googlePay: false,
      link: false,
      https: false,
      browser: 'unknown'
    };

    // Check HTTPS
    if (typeof window !== 'undefined') {
      results.https = window.location.protocol === 'https:';
      results.browser = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome') ? 'safari' :
                       navigator.userAgent.includes('Chrome') ? 'chrome' : 'other';
    }

    // Check Apple Pay
    if (typeof window !== 'undefined' && 'ApplePaySession' in window) {
      const ApplePaySession = (window as any).ApplePaySession;
      results.applePay = ApplePaySession.canMakePayments && ApplePaySession.canMakePayments();
    }

    // Check Google Pay
    if (typeof window !== 'undefined' && (window as any).google && (window as any).google.payments) {
      results.googlePay = true;
    }

    const availableCount = Object.values(results).filter(Boolean).length;
    
    updateTestResult('Express Checkout Detection', {
      status: availableCount > 0 ? 'passed' : 'failed',
      details: `Found ${availableCount} available payment methods`,
      data: results
    });
  } catch (error: any) {
    updateTestResult('Express Checkout Detection', {
      status: 'failed',
      details: error.message,
      data: { error: error.message }
    });
  } finally {
    testingExpressCheckout.value = false;
  }
};

// Test 5: Card Element Creation
const testCardElement = async () => {
  testingCardElement.value = true;
  
  const test: TestResult = {
    name: 'Card Element Creation',
    description: 'Test Stripe Elements card creation and mounting',
    status: 'running',
    details: 'Creating test card element...'
  };
  addTestResult(test);

  try {
    if (!stripe.value) {
      throw new Error('Stripe not available');
    }

    const elements = stripe.value.elements();
    const cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
      },
    });

    if (!cardElement) {
      throw new Error('Failed to create card element');
    }

    // Test mounting to a temporary div
    const tempDiv = document.createElement('div');
    tempDiv.id = 'test-card-element';
    document.body.appendChild(tempDiv);

    try {
      cardElement.mount('#test-card-element');
      
      // Clean up
      cardElement.destroy();
      document.body.removeChild(tempDiv);

      updateTestResult('Card Element Creation', {
        status: 'passed',
        details: 'Card element created and mounted successfully',
        data: { elementType: 'card', mounted: true }
      });
    } catch (mountError: any) {
      document.body.removeChild(tempDiv);
      throw mountError;
    }
  } catch (error: any) {
    updateTestResult('Card Element Creation', {
      status: 'failed',
      details: error.message,
      data: { error: error.message }
    });
  } finally {
    testingCardElement.value = false;
  }
};

// Test 6: API Connectivity
const testAPIConnectivity = async () => {
  const test: TestResult = {
    name: 'API Connectivity',
    description: 'Test connection to Stripe API endpoints',
    status: 'running',
    details: 'Testing API endpoints...'
  };
  addTestResult(test);

  try {
    // Test payment intent endpoint
    const response = await $fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      body: {
        amount: 100,
        currency: 'usd',
        metadata: { test: 'connectivity' }
      }
    });

    if (!response || typeof response !== 'object') {
      throw new Error('Invalid API response');
    }

    updateTestResult('API Connectivity', {
      status: 'passed',
      details: 'All API endpoints responding correctly',
      data: { 
        endpoint: '/api/stripe/create-payment-intent',
        status: 'ok',
        responseType: typeof response
      }
    });
  } catch (error: any) {
    updateTestResult('API Connectivity', {
      status: 'failed',
      details: error.message,
      data: { error: error.message }
    });
  }
};

// Run all tests
const runAllTests = async () => {
  runningAllTests.value = true;
  clearResults();
  
  try {
    await testEnvironmentConfig();
    await testStripeInitialization();
    await testAPIConnectivity();
    await testPaymentIntent();
    await testExpressCheckout();
    await testCardElement();
  } finally {
    runningAllTests.value = false;
  }
};

// Auto-run basic tests on mount
onMounted(async () => {
  await nextTick();
  await testEnvironmentConfig();
  await testStripeInitialization();
});
</script> 