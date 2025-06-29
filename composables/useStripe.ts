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

  const createElement = (type: 'card' | 'expressCheckout', options: any = {}) => {
    if (!stripeInstance.value) {
      throw new Error('Stripe is not initialized');
    }

    // For Express Checkout, we need to create elements with client secret
    const elementsOptions: any = {};
    if (type === 'expressCheckout' && options.clientSecret) {
      elementsOptions.clientSecret = options.clientSecret;
    }

    const elements = stripeInstance.value.elements(elementsOptions);
    
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

    if (type === 'expressCheckout') {
      // Modern Express Checkout Element configuration
      const expressCheckoutOptions = {
        layout: {
          maxColumns: 1,
          maxRows: 1,
          overflow: 'never',
        },
        buttonHeight: options.buttonHeight || 48,
        buttonTheme: {
          applePay: options.theme === 'dark' ? 'black' : 'black',
          googlePay: options.theme === 'dark' ? 'black' : 'black',
        },
        paymentMethodOrder: ['apple_pay', 'google_pay', 'link'],
        wallets: {
          applePay: 'auto',
          googlePay: 'auto',
        }
      };

      console.log('🔧 Creating Express Checkout with options:', expressCheckoutOptions);
      const element = (elements as any).create('expressCheckout', expressCheckoutOptions);
      
      // Store the elements instance on the element for later use
      (element as any).elements = elements;
      
      return element;
    }

    return elements.create('payment', options);
  };

  const confirmPaymentWithExpressCheckout = async (clientSecret: string, elements: any) => {
    if (!stripeInstance.value) {
      throw new Error('Stripe is not initialized');
    }

    try {
      const { error, paymentIntent } = await stripeInstance.value.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required',
      });

      if (error) {
        throw new Error(error.message);
      }

      return paymentIntent;
    } catch (error: any) {
      throw new Error(error.message || 'Express checkout payment confirmation failed');
    }
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
    confirmPaymentWithExpressCheckout,
    createElement,
    waitForStripe,
  };
}; 