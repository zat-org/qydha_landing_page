import type { Stripe, StripeCardElement } from '@stripe/stripe-js';

export const useStripe = () => {
  const { $stripe } = useNuxtApp();

  // Create a reactive ref that will update when Stripe is ready
  const stripeInstance = ref<Stripe | null>($stripe);
  const isReady = computed(() => !!stripeInstance.value);

  // Watch for Stripe to become available
  watchEffect(() => {
    if ($stripe && !stripeInstance.value) {
      stripeInstance.value = $stripe;
      console.log('Stripe initialized successfully');
    }
  });

  const createPaymentIntent = async (amount: number, currency: string = 'usd', metadata: Record<string, string> = {}) => {
    try {
      const response = await $fetch('/api/stripe/create-payment-intent', {
        method: 'POST',
        body: {
          amount,
          currency,
          metadata
        }
      });

      console.log('💰 Payment Intent Response:', response);
      
      // Handle the response properly
      if (response && typeof response === 'object') {
        return response;
      }
      
      throw new Error('Invalid response from payment intent API');
    } catch (error: any) {
      console.error('💰 Payment Intent Error:', error);
      throw new Error(error.data?.message || error.message || 'Failed to create payment intent');
    }
  };

  const confirmPayment = async (clientSecret: string, cardElement: StripeCardElement) => {
    if (!stripeInstance.value) {
      throw new Error('Stripe is not initialized');
    }

    try {
      const { error, paymentIntent } = await stripeInstance.value.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error: any) {
      throw new Error(error.message || 'Payment confirmation failed');
    }
  };

  const createElement = (type: 'card' | 'payment' | 'paymentRequestButton', options: any = {}) => {
    if (!stripeInstance.value) {
      throw new Error('Stripe is not initialized');
    }

    const elements = stripeInstance.value.elements();
    
    if (type === 'card') {
      // Get current color mode for styling
      const colorMode = useColorMode();
      const isDark = computed(() => colorMode.value === 'dark');
      
      const cardStyle = {
        base: {
          fontSize: '16px',
          color: isDark.value ? '#f3f4f6' : '#374151',
          backgroundColor: isDark.value ? '#1f2937' : '#ffffff',
          '::placeholder': {
            color: isDark.value ? '#9ca3af' : '#6b7280',
          },
          ':-webkit-autofill': {
            color: isDark.value ? '#f3f4f6' : '#374151',
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
      };

      return elements.create('card', {
        style: cardStyle,
        ...options
      });
    }

    if (type === 'paymentRequestButton') {
      return elements.create('paymentRequestButton', {
        paymentRequest: options.paymentRequest,
        style: {
          paymentRequestButton: {
            type: options.buttonType || 'default',
            theme: options.theme || 'dark',
            height: '48px',
          },
        },
      });
    }

    return elements.create('payment', options);
  };

  const createPaymentRequest = (options: {
    country: string;
    currency: string;
    total: {
      label: string;
      amount: number;
    };
    requestPayerName?: boolean;
    requestPayerEmail?: boolean;
  }) => {
    if (!stripeInstance.value) {
      throw new Error('Stripe is not initialized');
    }

    return stripeInstance.value.paymentRequest({
      country: options.country,
      currency: options.currency,
      total: options.total,
      requestPayerName: options.requestPayerName || false,
      requestPayerEmail: options.requestPayerEmail || false,
    });
  };

  const waitForStripe = async (): Promise<Stripe> => {
    if (stripeInstance.value) {
      return stripeInstance.value;
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Stripe failed to initialize within 10 seconds'));
      }, 10000);

      const unwatch = watch(stripeInstance, (stripe) => {
        if (stripe) {
          clearTimeout(timeout);
          unwatch();
          resolve(stripe);
        }
      }, { immediate: true });
    });
  };

  return {
    stripe: readonly(stripeInstance),
    isReady: readonly(isReady),
    createPaymentIntent,
    confirmPayment,
    createElement,
    createPaymentRequest,
    waitForStripe,
  };
}; 