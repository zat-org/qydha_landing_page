<template>
  <div class="stripe-payment">
    <div class="mb-6">
      <h3 class="text-lg font-semibold mb-4 dark:text-white">معلومات الدفع</h3>
      
      <!-- Amount Display -->
      <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6 border dark:border-gray-700">
        <div class="flex justify-between items-center">
          <span class="text-gray-600 dark:text-gray-300">المبلغ الإجمالي:</span>
          <span class="text-xl font-bold dark:text-white">{{ formatAmount(amount) }} {{ currency.toUpperCase() }}</span>
        </div>
      </div>

      <!-- Express Checkout (Apple Pay / Google Pay) -->
      <div v-show="!isLoading && expressCheckoutReady" class="mb-6">
        <div 
          ref="expressCheckoutElement" 
          class="min-h-[48px]"
        ></div>
        
        <div class="text-center mt-2">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">أو ادفع بالبطاقة</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Card Element -->
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <Icon name="i-heroicons-credit-card" class="w-4 h-4 inline ml-1" />
          معلومات البطاقة
        </label>
        
        <!-- Loading state -->
        <div v-show="isLoading" class="border border-gray-300 dark:border-gray-600 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div class="flex items-center justify-center py-6">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span class="ml-2 text-gray-600 dark:text-gray-300">جاري تحميل معالج الدفع...</span>
          </div>
        </div>
        
        <!-- Stripe card element container -->
        <div v-show="!isLoading" class="relative">
          <div 
            ref="cardElement" 
            class="border-2 border-gray-300 dark:border-gray-600 p-4 rounded-lg bg-white dark:bg-gray-800 transition-all duration-200 min-h-[50px]"
            :class="{ 
              'border-red-500 dark:border-red-400': cardError,
              'border-blue-500 dark:border-blue-400': !cardError && cardElementMounted,
              'hover:border-gray-400 dark:hover:border-gray-500': !cardError
            }"
          ></div>
        </div>
        
        <!-- Helper text -->
        <div v-if="!cardError && !isLoading" class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
          <Icon name="i-heroicons-shield-check" class="w-3 h-3" />
          استخدم رقم البطاقة التجريبي: 4242 4242 4242 4242
        </div>
        
        <div v-if="cardError" class="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1">
          <Icon name="i-heroicons-exclamation-circle" class="w-4 h-4" />
          {{ cardError }}
        </div>
      </div>

      <!-- Payment Button -->
      <UButton
        @click="handleCardPayment"
        :loading="processing"
        :disabled="isLoading || !cardElementMounted || processing"
        class="w-full"
        color="primary"
        size="lg"
      >
        <Icon name="i-heroicons-credit-card" class="w-5 h-5 ml-2" />
        {{ processing ? 'جاري المعالجة...' : isLoading ? 'جاري التحميل...' : `دفع ${formatAmount(amount)} ${currency.toUpperCase()}` }}
      </UButton>

      <!-- Status Messages -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
      </div>

      <div v-if="success" class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <p class="text-green-600 dark:text-green-400 text-sm">تم الدفع بنجاح!</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { StripeCardElement } from '@stripe/stripe-js';

interface Props {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
  enableApplePay?: boolean;
  country?: string;
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'usd',
  metadata: () => ({}),
  enableApplePay: true,
  country: 'US'
});

const emit = defineEmits<{
  success: [paymentIntent: any];
  error: [error: string];
}>();

// Use the Stripe module composable
const { stripe, isLoading: stripeLoading } = useClientStripe();
const { createPaymentIntent, confirmPayment, confirmPaymentWithExpressCheckout, createElement } = useStripe();
const colorMode = useColorMode();

// Template refs
const cardElement = useTemplateRef('cardElement');
const expressCheckoutElement = useTemplateRef('expressCheckoutElement');

// Component state
const processing = ref(false);
const cardError = ref('');
const error = ref('');
const success = ref(false);
const isLoading = ref(true);
const expressCheckoutReady = ref(false);
const cardElementMounted = ref(false);
// Stripe elements
let stripeCardElement: StripeCardElement | null = null;
let stripeExpressCheckoutElement: any = null;
let paymentIntentClientSecret: string | null = null;

// Utils
const formatAmount = (amount: number) => {
  return (amount / 100).toFixed(2);
};

// Card Payment Handler
const handleCardPayment = async () => {
  if (!stripeCardElement) {
    error.value = 'معلومات البطاقة غير صحيحة';
    return;
  }

  processing.value = true;
  error.value = '';
  success.value = false;

  try {
    console.log('💳 Creating payment intent...');
    const response = await createPaymentIntent(props.amount, props.currency, props.metadata);

    if (!response?.client_secret) {
      throw new Error('Invalid payment intent response');
    }

    console.log('💳 Confirming payment...');
    const paymentIntent = await confirmPayment(response.client_secret, stripeCardElement);

    console.log('💳 Payment confirmed:', paymentIntent);
    success.value = true;
    emit('success', paymentIntent);
  } catch (err: any) {
    console.error('💳 Payment error:', err);
    error.value = err.message || 'حدث خطأ أثناء المعالجة';
    emit('error', error.value);
  } finally {
    processing.value = false;
  }
};

// Express Checkout Handler
const handleExpressCheckoutConfirm = async (event: any) => {
  processing.value = true;
  error.value = '';
  success.value = false;

  try {
    console.log('🍎 Processing Express Checkout confirmation...');
    
    if (!paymentIntentClientSecret) {
      throw new Error('No payment intent available for Express Checkout');
    }

    const elements = stripeExpressCheckoutElement.elements || stripeExpressCheckoutElement._elements;
    const paymentIntent = await confirmPaymentWithExpressCheckout(paymentIntentClientSecret, elements);

    console.log('🍎 Express Checkout payment confirmed:', paymentIntent);
    success.value = true;
    emit('success', paymentIntent);
  } catch (err: any) {
    console.error('🍎 Express Checkout error:', err);
    error.value = err.message || 'حدث خطأ أثناء المعالجة';
    emit('error', error.value);
    
    if (event?.complete) {
      event.complete('fail');
    }
  } finally {
    processing.value = false;
  }
};

// Initialize Express Checkout
const initializeExpressCheckout = async () => {
  if (!props.enableApplePay || !expressCheckoutElement.value) return;

  try {
    console.log('🍎 Initializing Express Checkout...');
    
    // Create payment intent for Express Checkout
    const response = await createPaymentIntent(props.amount, props.currency, {
      ...props.metadata,
      payment_method: 'express_checkout_init'
    });

    if (!response?.client_secret) {
      console.warn('Could not create payment intent for Express Checkout');
      return;
    }

    paymentIntentClientSecret = response.client_secret;
    console.log('✅ Payment intent created for Express Checkout');

    // Create Express Checkout Element
    stripeExpressCheckoutElement = createElement('expressCheckout', {
      clientSecret: paymentIntentClientSecret,
      theme: colorMode.value === 'dark' ? 'dark' : 'light',
      buttonHeight: 48,
    });

    // Mount the element
    stripeExpressCheckoutElement.mount(expressCheckoutElement.value);
    console.log('✅ Express Checkout mounted');

    // Set up event handlers
    stripeExpressCheckoutElement.on('ready', (event: any) => {
      console.log('✅ Express Checkout ready:', event);
      expressCheckoutReady.value = true;
    });

    stripeExpressCheckoutElement.on('confirm', handleExpressCheckoutConfirm);

    stripeExpressCheckoutElement.on('error', (event: any) => {
      console.error('❌ Express Checkout error:', event.error);
      error.value = event.error.message;
    });

  } catch (err) {
    console.error('❌ Express Checkout initialization error:', err);
  }
};

// Initialize Card Element
const initializeCardElement = async () => {
  console.log('🔄 Initializing Card Element...');
  try {
    console.log('💳 Creating card element...');
    
    stripeCardElement = createElement('card', {
      style: {
        base: {
          fontSize: '16px',
          color: colorMode.value === 'dark' ? '#f3f4f6' : '#374151',
          backgroundColor: colorMode.value === 'dark' ? '#1f2937' : '#ffffff',
          '::placeholder': {
            color: colorMode.value === 'dark' ? '#9ca3af' : '#6b7280',
          },
        },
        invalid: {
          color: '#ef4444',
          iconColor: '#ef4444',
        },
        complete: {
          color: '#10b981',
          iconColor: '#10b981',
        },
      },
    }) as StripeCardElement;

    stripeCardElement.mount(cardElement.value as HTMLElement);
    cardElementMounted.value = true;
    console.log('✅ Card element mounted');

    stripeCardElement.on('change', ({ error }) => {
      cardError.value = error ? error.message : '';
    });

  } catch (err) {
    console.error('❌ Card element initialization error:', err);
    error.value = 'فشل في تحميل معالج الدفع';
    throw err; // Re-throw so the parent function can handle it
  }
};

// Initialize all Stripe elements
const initializeStripeElements = async () => {
  isLoading.value = true;
  
  try {
    // Wait for Stripe to be ready
    while (!stripe.value && stripeLoading.value) {
      console.log('🔄 Waiting for Stripe to be ready...');
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (!stripe.value) {
      throw new Error('Stripe failed to initialize');
    }

    console.log('✅ Stripe is ready');

    // Set loading to false first so DOM elements can render
    isLoading.value = false;
    
    // Wait for DOM elements to be ready
    await nextTick();
    await new Promise(resolve => setTimeout(resolve, 100));

    // Initialize elements
    await initializeCardElement();
    console.log('🔄 Card element initialized');
    await initializeExpressCheckout();
    console.log('🔄 Express Checkout initialized');

    console.log('✅ All Stripe elements initialized');
  } catch (err: any) {
    console.error('❌ Error initializing Stripe elements:', err);
    error.value = 'فشل في تحميل معالج الدفع';
    isLoading.value = false; // Make sure to set this even on error
  }
};

// Watch for theme changes
watch(() => colorMode.value, async () => {
  if (stripeCardElement && cardElement.value) {
    stripeCardElement.destroy();
    stripeCardElement = null;
    cardElementMounted.value = false;
    await initializeCardElement();
  }
  
  if (stripeExpressCheckoutElement && expressCheckoutElement.value && paymentIntentClientSecret) {
    stripeExpressCheckoutElement.destroy();
    stripeExpressCheckoutElement = null;
    expressCheckoutReady.value = false;
    await initializeExpressCheckout();
  }
});

// Lifecycle
onMounted(async () => {
  await initializeStripeElements();
});

onUnmounted(() => {
  if (stripeCardElement) {
    stripeCardElement.destroy();
  }
  if (stripeExpressCheckoutElement) {
    stripeExpressCheckoutElement.destroy();
  }
});
</script>

<style scoped>
.stripe-payment {
  max-width: 500px;
}
</style> 