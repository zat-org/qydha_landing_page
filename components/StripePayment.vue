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

      <!-- Digital Wallets (Apple Pay / Google Pay) -->
      <div v-if="!isLoading && showDigitalWallets" class="mb-6">
        <div class="text-center">
          <!-- Payment method info -->
          <div class="mb-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
            <Icon name="i-heroicons-information-circle" class="w-3 h-3" />
            <span v-if="isAppleDevice && browserInfo.browser === 'safari'">🍎 Apple Pay متاح</span>
            <span v-else-if="isAppleDevice">المحفظة الرقمية متاحة على جهاز Apple</span>
            <span v-else-if="browserInfo.browser === 'chrome'">Google Pay متاح (Chrome)</span>
            <span v-else>المحفظة الرقمية متاحة ({{ browserInfo.browser }})</span>
          </div>
          
          <div 
            ref="expressCheckoutElement" 
            class="mb-4"
          ></div>
          
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
        <div v-if="isLoading" class="border border-gray-300 dark:border-gray-600 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <div class="flex items-center justify-center py-6">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span class="ml-2 text-gray-600 dark:text-gray-300">جاري تحميل معالج الدفع...</span>
          </div>
        </div>
        
        <!-- Stripe card element container -->
        <div v-else class="relative">
          <div 
            ref="cardElement" 
            class="border-2 border-gray-300 dark:border-gray-600 p-4 rounded-lg bg-white dark:bg-gray-800 transition-all duration-200 min-h-[50px]"
            :class="{ 
              'border-red-500 dark:border-red-400': cardError,
              'border-blue-500 dark:border-blue-400': !cardError && stripeCardElement,
              'hover:border-gray-400 dark:hover:border-gray-500': !cardError
            }"
          ></div>
          
          <!-- Placeholder text when card element is not ready -->
          <!-- <div v-if="!stripeCardElement && !isLoading" class="absolute inset-0 flex items-center px-4 pointer-events-none">
            <span class="text-gray-400 dark:text-gray-500 text-sm">
              <Icon name="i-heroicons-credit-card" class="w-4 h-4 inline ml-1" />
              أدخل معلومات البطاقة هنا...
            </span>
          </div> -->
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

      <!-- Debug: Force Re-init Button -->
      <UButton 
        v-if="!stripeCardElement && !isLoading"
        @click="initializeStripeElements"
        variant="outline"
        size="sm"
        class="w-full mb-4"
      >
        🔄 إعادة تحميل معالج الدفع
      </UButton>

      <!-- Debug Info for Apple Pay -->
      <div v-if="!showDigitalWallets && !isLoading" class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div class="text-xs text-blue-600 dark:text-blue-400">
          <p><strong>🔍 معلومات تشخيصية:</strong></p>
          <p>المتصفح: {{ browserInfo.browser }}</p>
          <p>الجهاز: {{ isAppleDevice ? 'Apple Device' : 'Other Device' }}</p>
          <p>HTTPS: {{ isHTTPS ? 'Yes ✅' : 'No ❌' }}</p>
          <p v-if="!showDigitalWallets">Apple Pay/Google Pay: غير متاح في هذا المتصفح</p>
        </div>
      </div>

      <!-- Payment Button -->
      <UButton
        @click="handleCardPayment"
        :loading="processing"
        :disabled="isLoading || !stripeCardElement || processing"
        class="w-full"
        color="primary"
        size="lg"
      >
        <Icon name="i-heroicons-credit-card" class="w-5 h-5 ml-2" />
        {{ processing ? 'جاري المعالجة...' : isLoading ? 'جاري التحميل...' : `دفع ${formatAmount(amount)} ${currency.toUpperCase()}` }}
      </UButton>

      <!-- Error Display -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-red-600 dark:text-red-400 text-sm">{{ error }}</p>
      </div>

      <!-- Success Display -->
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

const { createPaymentIntent, confirmPayment, confirmPaymentWithExpressCheckout, createElement, waitForStripe } = useStripe();
const colorMode = useColorMode();

const cardElement = ref<HTMLElement>();
const expressCheckoutElement = ref<HTMLElement>();
let stripeCardElement: StripeCardElement | null = null;
console.log(stripeCardElement);
let stripeExpressCheckoutElement: any = null;

const processing = ref(false);
const cardError = ref('');
const error = ref('');
const success = ref(false);
const isLoading = ref(true);
const showDigitalWallets = ref(false);
const paymentIntentClientSecret = ref<string | null>(null);

const formatAmount = (amount: number) => {
  return (amount / 100).toFixed(2);
};

// Detect browser and device info (let Stripe decide what's available)
const browserInfo = computed(() => {
  if (typeof navigator === 'undefined') return { device: 'unknown', browser: 'unknown' };
  
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
    device: isAppleDevice ? 'apple' : 'other',
    browser,
    userAgent
  };
});

const isAppleDevice = computed(() => browserInfo.value.device === 'apple');

const isHTTPS = computed(() => {
  if (typeof window === 'undefined') return false;
  return window.location.protocol === 'https:';
});

const handleCardPayment = async () => {
  if (!stripeCardElement) {
    error.value = 'معلومات البطاقة غير صحيحة';
    return;
  }

  processing.value = true;
  error.value = '';
  success.value = false;

  try {
    // Create payment intent
    console.log('💳 Creating payment intent...');
    const response = await createPaymentIntent(
      props.amount,
      props.currency,
      props.metadata
    );

    console.log('💳 Payment intent response:', response);
    
    if (!response || !response.client_secret) {
      throw new Error('Invalid payment intent response - missing client_secret');
    }

    // Confirm payment
    console.log('💳 Confirming payment...');
    const paymentIntent = await confirmPayment(
      response.client_secret!,
      stripeCardElement
    );

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

function handleExpressCheckoutConfirm(event: any) {
  processing.value = true;
  error.value = '';
  success.value = false;

  return new Promise<void>(async (resolve, reject) => {
    try {
      console.log('💳 Processing Express Checkout confirmation...');
      
      // Use the existing payment intent client secret
      if (!paymentIntentClientSecret.value) {
        throw new Error('No payment intent available for Express Checkout');
      }
      
      // Get the elements instance from the Express Checkout element
      const elements = stripeExpressCheckoutElement.elements || stripeExpressCheckoutElement._elements;
      
      // Confirm payment with Express Checkout using existing payment intent
      const paymentIntent = await confirmPaymentWithExpressCheckout(
        paymentIntentClientSecret.value,
        elements
      );

      console.log('💳 Express Checkout payment confirmed:', paymentIntent);
      success.value = true;
      emit('success', paymentIntent);
      resolve();
    } catch (err: any) {
      console.error('💳 Express Checkout error:', err);
      error.value = err.message || 'حدث خطأ أثناء المعالجة';
      emit('error', error.value);
      
      // Call event.complete if available to notify Stripe of the error
      if (event && typeof event.complete === 'function') {
        event.complete('fail');
      }
      reject(err);
    } finally {
      processing.value = false;
    }
  });
}

// Legacy function - keeping for backwards compatibility but not used
function handleExpressCheckoutPayment(event: any) {
  // Redirects to the new confirm handler
  return handleExpressCheckoutConfirm(event);
}

const initializeExpressCheckout = async () => {
  if (!props.enableApplePay) return;

  try {
    // First create a payment intent so Express Checkout can detect available methods
    console.log('💳 Creating payment intent for Express Checkout detection...');
    const response = await createPaymentIntent(
      props.amount,
      props.currency,
      { ...props.metadata, payment_method: 'express_checkout_init' }
    );

    if (!response || !response.client_secret) {
      console.error('❌ Could not create payment intent for Express Checkout');
      return;
    }

    paymentIntentClientSecret.value = response.client_secret;
    console.log('✅ Payment intent created for Express Checkout');

    // Log browser info for debugging
    console.log('🔍 Browser detection:', browserInfo.value);
    
    await nextTick();
    
    if (expressCheckoutElement.value) {
      // Create Express Checkout Element with payment intent client secret
      stripeExpressCheckoutElement = createElement('expressCheckout', {
        clientSecret: paymentIntentClientSecret.value,
        theme: colorMode.value === 'dark' ? 'dark' : 'light',
        buttonHeight: 48,
      });
      
      // Mount the element
      stripeExpressCheckoutElement.mount(expressCheckoutElement.value);
      
      // Set up event handlers for Express Checkout
      stripeExpressCheckoutElement.on('confirm', async (event: any) => {
        console.log('💳 Express Checkout confirm event triggered', event);
        await handleExpressCheckoutConfirm(event);
      });
      
      // Check if the element is ready and show it
      stripeExpressCheckoutElement.on('ready', (event: any) => {
        console.log('✅ Express Checkout Element is ready', event);
        showDigitalWallets.value = true;
        console.log('🍎 Express Checkout ready - payment methods auto-detected');
        
        // Log available payment methods for debugging
        console.log('🔍 Checking available payment methods...');
        console.log('🔍 Browser info:', {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          vendor: navigator.vendor,
          isHTTPS: typeof window !== 'undefined' && window.location.protocol === 'https:'
        });
        
        // Test Apple Pay availability specifically
        if (typeof window !== 'undefined' && 'ApplePaySession' in window && (window as any).ApplePaySession) {
          const ApplePaySession = (window as any).ApplePaySession;
          if (ApplePaySession.canMakePayments) {
            console.log('🍎 Apple Pay is supported by browser');
            if (ApplePaySession.canMakePaymentsWithActiveCard) {
              ApplePaySession.canMakePaymentsWithActiveCard('merchant.example').then((canPay: boolean) => {
                console.log('🍎 Apple Pay with active card:', canPay);
              }).catch(() => {
                console.log('🍎 Apple Pay check failed');
              });
            }
          }
        } else {
          console.log('🍎 Apple Pay not supported by browser');
        }
        
        // Test Google Pay availability
        if (typeof window !== 'undefined' && (window as any).google && (window as any).google.payments) {
          console.log('🅶 Google Pay API is available');
        } else {
          console.log('🅶 Google Pay API not available');
        }
      });
      
      // Handle errors
      stripeExpressCheckoutElement.on('error', (event: any) => {
        console.error('❌ Express Checkout Element error:', event.error);
        error.value = event.error.message;
      });
      
      console.log('✅ Express Checkout Element initialized');
    }
  } catch (err) {
    console.log('Express Checkout not available:', err);
    console.log('💡 Browser info on error:', browserInfo.value);
  }
};

const initializeStripeElements = async () => {
  try {
    console.log('🔄 Starting Stripe initialization...');
    
    // Wait for Stripe to be ready
    await waitForStripe();
    console.log('✅ Stripe is ready');
    
    // First, set loading to false so the DOM element renders
    isLoading.value = false;
    
    // Wait for DOM to update and render the cardElement
    await nextTick();
    await nextTick(); // Double nextTick to ensure DOM is fully rendered
    console.log('✅ DOM is ready');
    
    // Wait a bit more for the element to be available
    let retries = 0;
    while (!cardElement.value && retries < 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retries++;
      console.log(`🔍 Waiting for cardElement... attempt ${retries}`);
    }
    
    // Initialize Express Checkout
    await initializeExpressCheckout();
    console.log('✅ Express Checkout initialized');
    
    // Initialize card element
    console.log('🔍 Checking cardElement.value:', !!cardElement.value);
    console.log('🔍 Checking stripeCardElement:', !!stripeCardElement);
    
    if (cardElement.value && !stripeCardElement) {
      console.log('🔄 Creating card element...');
      stripeCardElement = createElement('card') as StripeCardElement;
      console.log('✅ Card element created:', !!stripeCardElement);
      
      console.log('🔄 Mounting card element...');
      stripeCardElement.mount(cardElement.value);
      console.log('✅ Card element mounted');

      stripeCardElement.on('change', ({ error }) => {
        cardError.value = error ? error.message : '';
        console.log('💳 Card change event:', { error: !!error });
      });
    } else {
      console.log('❌ Cannot create card element:', {
        hasCardElement: !!cardElement.value,
        hasExistingStripeElement: !!stripeCardElement
      });
    }
    
    console.log('✅ Stripe initialization complete');
  } catch (err: any) {
    console.error('❌ Error initializing Stripe elements:', err);
    error.value = 'فشل في تحميل معالج الدفع';
    isLoading.value = false;
  }
};

// Watch for color mode changes and update Stripe elements
watch(() => colorMode.value, async () => {
  if (stripeCardElement && cardElement.value) {
    stripeCardElement.destroy();
    stripeCardElement = createElement('card') as StripeCardElement;
    stripeCardElement.mount(cardElement.value);
    stripeCardElement.on('change', ({ error }) => {
      cardError.value = error ? error.message : '';
    });
  }
  
  if (stripeExpressCheckoutElement && expressCheckoutElement.value && paymentIntentClientSecret.value) {
    stripeExpressCheckoutElement.destroy();
    stripeExpressCheckoutElement = createElement('expressCheckout', {
      clientSecret: paymentIntentClientSecret.value,
      theme: colorMode.value === 'dark' ? 'dark' : 'light',
      buttonHeight: 48,
    });
    stripeExpressCheckoutElement.mount(expressCheckoutElement.value);
    stripeExpressCheckoutElement.on('confirm', async (event: any) => {
      console.log('💳 Express Checkout confirm event triggered', event);
      await handleExpressCheckoutConfirm(event);
    });
  }
});

onMounted(() => {
  initializeStripeElements();
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