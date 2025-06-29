<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <div>
            <h1 class="text-3xl font-bold dark:text-white">Stripe Payment System Testing</h1>
            <p class="text-gray-600 dark:text-gray-300 mt-2">Comprehensive testing suite for payment integration</p>
          </div>
          <div class="flex items-center gap-4">
            <ColorModeToggle />
            <UButton to="/payment-demo" variant="outline">
              💳 Payment Demo
            </UButton>
          </div>
        </div>

        <!-- Environment Status -->
        <div class="mb-8">
          <ClientOnly>
            <StripeDebug />
          </ClientOnly>
        </div>

        <!-- Main Test Component -->
        <ClientOnly>
          <StripePaymentTest />
        </ClientOnly>

        <!-- Manual Testing Guide -->
        <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
          <h2 class="text-xl font-semibold dark:text-white mb-4 flex items-center gap-2">
            <Icon name="i-heroicons-book-open" class="w-5 h-5" />
            Manual Testing Guide
          </h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <!-- Card Testing -->
            <div>
              <h3 class="font-medium dark:text-white mb-3">🃏 Card Payment Testing</h3>
              <div class="space-y-2 text-sm">
                <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                  <p class="font-medium text-green-800 dark:text-green-200">Successful Payment:</p>
                  <p class="font-mono">4242 4242 4242 4242</p>
                  <p class="text-xs text-green-600 dark:text-green-400">Use any future date and any 3-digit CVC</p>
                </div>
                <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                  <p class="font-medium text-red-800 dark:text-red-200">Card Declined:</p>
                  <p class="font-mono">4000 0000 0000 0002</p>
                </div>
                <div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                  <p class="font-medium text-yellow-800 dark:text-yellow-200">Insufficient Funds:</p>
                  <p class="font-mono">4000 0000 0000 9995</p>
                </div>
              </div>
            </div>

            <!-- Express Checkout Testing -->
            <div>
              <h3 class="font-medium dark:text-white mb-3">🍎 Express Checkout Testing</h3>
              <div class="space-y-2 text-sm">
                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                  <p class="font-medium text-blue-800 dark:text-blue-200">Apple Pay:</p>
                  <p>• Requires HTTPS (use tunnel URL)</p>
                  <p>• Works best in Safari on Mac/iOS</p>
                  <p>• Check browser console for detection logs</p>
                </div>
                <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                  <p class="font-medium text-purple-800 dark:text-purple-200">Google Pay:</p>
                  <p>• Available in Chrome and supported browsers</p>
                  <p>• Auto-detects based on browser</p>
                  <p>• Works on both mobile and desktop</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- API Test Results -->
        <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
          <h2 class="text-xl font-semibold dark:text-white mb-4 flex items-center gap-2">
            <Icon name="i-heroicons-server" class="w-5 h-5" />
            Live API Testing
          </h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium dark:text-white mb-2">Quick API Test</h3>
              <UButton @click="quickAPITest" :loading="testingAPI" variant="outline" size="sm">
                🚀 Test Payment Intent Creation
              </UButton>
              <div v-if="apiTestResult" class="mt-3 p-3 rounded text-sm"
                   :class="apiTestResult.success ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200'">
                <p class="font-medium">{{ apiTestResult.success ? '✅ Success' : '❌ Failed' }}</p>
                <p>{{ apiTestResult.message }}</p>
              </div>
            </div>
            
            <div>
              <h3 class="font-medium dark:text-white mb-2">Environment Check</h3>
              <div class="space-y-1 text-sm">
                <div class="flex justify-between">
                  <span>HTTPS:</span>
                  <span :class="isHTTPS ? 'text-green-600' : 'text-red-600'">
                    {{ isHTTPS ? '✅ Yes' : '❌ No' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>Stripe Keys:</span>
                  <span :class="hasStripeKeys ? 'text-green-600' : 'text-red-600'">
                    {{ hasStripeKeys ? '✅ Configured' : '❌ Missing' }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>Local Tunnel:</span>
                  <span :class="isLocalTunnel ? 'text-green-600' : 'text-yellow-600'">
                    {{ isLocalTunnel ? '✅ Active' : '⚠️ Not detected' }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Testing Checklist -->
        <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
          <h2 class="text-xl font-semibold dark:text-white mb-4 flex items-center gap-2">
            <Icon name="i-heroicons-clipboard-document-check" class="w-5 h-5" />
            Testing Checklist
          </h2>
          
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h3 class="font-medium dark:text-white mb-3">✅ Automated Tests</h3>
              <ul class="space-y-1 text-sm">
                <li class="flex items-center gap-2">
                  <Icon name="i-heroicons-check" class="w-4 h-4 text-green-500" />
                  Environment configuration
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="i-heroicons-check" class="w-4 h-4 text-green-500" />
                  Stripe initialization
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="i-heroicons-check" class="w-4 h-4 text-green-500" />
                  API connectivity
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="i-heroicons-check" class="w-4 h-4 text-green-500" />
                  Payment intent creation
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="i-heroicons-check" class="w-4 h-4 text-green-500" />
                  Express checkout detection
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="i-heroicons-check" class="w-4 h-4 text-green-500" />
                  Card element creation
                </li>
              </ul>
            </div>
            
            <div>
              <h3 class="font-medium dark:text-white mb-3">🧪 Manual Tests</h3>
              <ul class="space-y-1 text-sm">
                <li class="flex items-center gap-2">
                  <Icon name="i-heroicons-arrow-right" class="w-4 h-4 text-blue-500" />
                  <a href="/payment-demo" class="text-blue-600 hover:underline">Full payment flow</a>
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="i-heroicons-arrow-right" class="w-4 h-4 text-blue-500" />
                  Test different browsers
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="i-heroicons-arrow-right" class="w-4 h-4 text-blue-500" />
                  Apple Pay in Safari
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="i-heroicons-arrow-right" class="w-4 h-4 text-blue-500" />
                  Google Pay in Chrome
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="i-heroicons-arrow-right" class="w-4 h-4 text-blue-500" />
                  Error scenarios
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="i-heroicons-arrow-right" class="w-4 h-4 text-blue-500" />
                  Dark/light mode switching
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const testingAPI = ref(false);
const apiTestResult = ref<{ success: boolean; message: string } | null>(null);

// Environment checks
const isHTTPS = computed(() => {
  if (typeof window === 'undefined') return false;
  return window.location.protocol === 'https:';
});

const hasStripeKeys = computed(() => {
  return !!config.public.stripePublishableKey;
});

const isLocalTunnel = computed(() => {
  if (typeof window === 'undefined') return false;
  return window.location.hostname.includes('loca.lt');
});

const quickAPITest = async () => {
  testingAPI.value = true;
  apiTestResult.value = null;

  try {
    const response = await $fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      body: {
        amount: 1000, // $10.00
        currency: 'usd',
        metadata: { test: 'quick-test', timestamp: Date.now().toString() }
      }
    });

    if (response && response.client_secret) {
      apiTestResult.value = {
        success: true,
        message: `Payment intent created successfully (${response.payment_intent_id?.substring(0, 20)}...)`
      };
    } else {
      throw new Error('Invalid response format');
    }
  } catch (error: any) {
    apiTestResult.value = {
      success: false,
      message: error.message || 'API test failed'
    };
  } finally {
    testingAPI.value = false;
  }
};

// Set page meta
useSeoMeta({
  title: 'Stripe Payment Testing - Qydha',
  description: 'Comprehensive testing suite for Stripe payment integration'
});
</script> 