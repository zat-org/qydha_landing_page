<template>
  <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
    <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2">🔍 Stripe Module Debug Info</h4>
    <div class="text-sm space-y-1">
      <div>
        <span class="font-medium">Module Configuration:</span>
        <span :class="moduleConfigured ? 'text-green-600' : 'text-red-600'">
          {{ moduleConfigured ? '✅ Configured' : '❌ Missing' }}
        </span>
      </div>
      <div>
        <span class="font-medium">Stripe Instance:</span>
        <span :class="stripe ? 'text-green-600' : 'text-red-600'">
          {{ stripe ? '✅ Loaded' : '❌ Not Loaded' }}
        </span>
      </div>
      <div>
        <span class="font-medium">Module Loading:</span>
        <span :class="!isLoading ? 'text-green-600' : 'text-yellow-600'">
          {{ !isLoading ? '✅ Ready' : '🔄 Loading...' }}
        </span>
      </div>
      <div>
        <span class="font-medium">Client Ready:</span>
        <span :class="isReady ? 'text-green-600' : 'text-red-600'">
          {{ isReady ? '✅ Ready' : '❌ Not Ready' }}
        </span>
      </div>
      <div v-if="stripeVersion">
        <span class="font-medium">Stripe.js Version:</span>
        <span class="text-blue-600">{{ stripeVersion }}</span>
      </div>
      <div v-if="error" class="text-red-600">
        <span class="font-medium">Error:</span> {{ error }}
      </div>
      <div class="text-xs text-gray-500 mt-2">
        Module: @unlok-co/nuxt-stripe
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { stripe, isLoading } = useClientStripe();
const { isReady } = useStripe();

const moduleConfigured = computed(() => {
  // Check if the module is properly configured by checking if Stripe loading has started
  return !isLoading.value || !!stripe.value;
});

const stripeVersion = computed(() => {
  return stripe.value?.VERSION || null;
});

const error = ref('');

onMounted(() => {
  // Check for common configuration issues
  setTimeout(() => {
    if (isLoading.value && !stripe.value) {
      error.value = 'Stripe is taking too long to load. Check your configuration.';
    } else if (!stripe.value && !isLoading.value) {
      error.value = 'Stripe failed to initialize. Check console for errors.';
    }
  }, 5000);
});
</script> 