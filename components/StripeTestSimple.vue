<template>
  <div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h3 class="text-lg font-semibold mb-4 dark:text-white">Stripe Module Test</h3>
    
    <!-- Module Status -->
    <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div class="space-y-2 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" :class="moduleReady ? 'bg-green-500' : 'bg-red-500'"></div>
          <span>Module: {{ moduleReady ? 'Ready ✅' : 'Loading...' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full" :class="stripe ? 'bg-green-500' : 'bg-red-500'"></div>
          <span>Stripe: {{ stripe ? 'Loaded ✅' : 'Not Loaded ❌' }}</span>
        </div>
      </div>
    </div>

    <!-- Payment Component -->
    <ClientOnly>
      <StripePaymentNew
        :amount="1000"
        currency="usd"
        :metadata="{ test: 'stripe-module' }"
        :enable-apple-pay="true"
        @success="handleSuccess"
        @error="handleError"
      />
    </ClientOnly>

    <!-- Test Results -->
    <div v-if="lastResult" class="mt-4 p-3 rounded-lg" :class="lastResult.success ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'">
      <h4 class="font-medium" :class="lastResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'">
        {{ lastResult.success ? 'Payment Successful! 🎉' : 'Payment Failed ❌' }}
      </h4>
      <p class="text-sm mt-1" :class="lastResult.success ? 'text-green-600 dark:text-green-300' : 'text-red-600 dark:text-red-300'">
        {{ lastResult.message }}
      </p>
    </div>

    <!-- Features Test -->
    <div class="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
      <h4 class="text-sm font-medium mb-2 dark:text-white">Features Available:</h4>
      <div class="space-y-1 text-xs">
        <div class="flex items-center gap-2">
          <Icon name="i-heroicons-credit-card" class="w-4 h-4 text-blue-500" />
          <span>Card Payments</span>
          <span class="text-green-600">✅</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">🍎</span>
          <span>Apple Pay</span>
          <span class="text-blue-600">Auto-detect</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-lg">🅶</span>
          <span>Google Pay</span>
          <span class="text-blue-600">Auto-detect</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { stripe, isLoading } = useClientStripe();
const { isReady } = useStripe();

const moduleReady = computed(() => !isLoading.value && !!stripe.value);

const lastResult = ref<{success: boolean, message: string} | null>(null);

const handleSuccess = (paymentIntent: any) => {
  console.log('✅ Payment successful:', paymentIntent);
  lastResult.value = {
    success: true,
    message: `Payment ID: ${paymentIntent.id}`
  };
};

const handleError = (error: string) => {
  console.error('❌ Payment error:', error);
  lastResult.value = {
    success: false,
    message: error
  };
};
</script> 