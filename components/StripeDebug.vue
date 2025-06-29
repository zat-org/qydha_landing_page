<template>
  <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
    <h4 class="font-medium text-yellow-800 dark:text-yellow-200 mb-2">🔍 Stripe Debug Info</h4>
    <div class="text-sm space-y-1">
      <div>
        <span class="font-medium">Stripe Publishable Key:</span>
        <span :class="publishableKey ? 'text-green-600' : 'text-red-600'">
          {{ publishableKey ? '✅ Configured' : '❌ Missing' }}
        </span>
      </div>
      <div>
        <span class="font-medium">Stripe Instance:</span>
        <span :class="stripe ? 'text-green-600' : 'text-red-600'">
          {{ stripe ? '✅ Loaded' : '❌ Not Loaded' }}
        </span>
      </div>
      <div>
        <span class="font-medium">Stripe Ready:</span>
        <span :class="isReady ? 'text-green-600' : 'text-red-600'">
          {{ isReady ? '✅ Ready' : '❌ Not Ready' }}
        </span>
      </div>
      <div v-if="error" class="text-red-600">
        <span class="font-medium">Error:</span> {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();
const { stripe, isReady } = useStripe();

const publishableKey = computed(() => !!config.public.stripePublishableKey);
const error = ref('');

onMounted(() => {
  if (!config.public.stripePublishableKey) {
    error.value = 'STRIPE_PUBLISHABLE_KEY not found in environment variables';
  } else if (config.public.stripePublishableKey.length < 20) {
    error.value = 'STRIPE_PUBLISHABLE_KEY appears to be invalid (too short)';
  }
});
</script> 