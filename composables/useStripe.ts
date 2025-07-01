import type { StripeCardElement } from '@stripe/stripe-js';

export const useStripe = () => {
  // Use the module's client-side composable
  const { stripe, isLoading } =  useClientStripe();

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
        console.log('💰 Payment Intent Response:', response);
        return response;
      }
      
      throw new Error('Invalid response from payment intent API');
    } catch (error: any) {
      console.error('💰 Payment Intent Error:', error);
      throw new Error(error.data?.message || error.message || 'Failed to create payment intent');
    }
  };

  const confirmPayment = async (clientSecret: string, cardElement: StripeCardElement) => {
    await waitForStripe();
    
    if (!stripe.value) {
      throw new Error('Stripe is not initialized');
    }

    try {
      const { error, paymentIntent } = await stripe.value.confirmCardPayment(clientSecret, {
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
    if (!stripe.value) {
      throw new Error('Stripe is not initialized');
    }

    // For Express Checkout, we need to create elements with client secret
    const elementsOptions: any = {};
    console.log('🔧 Creating Element:', options.clientSecret);
    if (type === 'expressCheckout' && options.clientSecret) {
      elementsOptions.clientSecret = options.clientSecret;
    }

    const elements = stripe.value.elements(elementsOptions);
    
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
      // Modern Express Checkout Element configuration with updated API
      const expressCheckoutOptions = {
        layout: {
          maxColumns: 3,
          maxRows: 2,
          overflow: 'auto', // Fixed: 'never' only works with maxRows: 0
        },
        buttonHeight: options.buttonHeight || 48,
        buttonTheme: {
          applePay: 'black',
          googlePay: 'black',
        },
        // Updated: Use modern paymentMethods instead of legacy wallets
        paymentMethods: {
          applePay: 'auto',
          googlePay: 'auto',
          link: 'auto',
        }
      };

      console.log('🔧 Creating Express Checkout with modern options:', expressCheckoutOptions);
      const element = (elements as any).create('expressCheckout', expressCheckoutOptions);
      
      // Store the elements instance on the element for later use
      // (element as any).elements = elements;
      
      return element;
    }

    // return elements.create('payment', options);
  };

  const confirmPaymentWithExpressCheckout = async (clientSecret: string, elements: any) => {
    await waitForStripe();
    
    if (!stripe.value) {
      throw new Error('Stripe is not initialized');
    }

    try {
      const { error, paymentIntent } = await stripe.value.confirmPayment({
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

  const waitForStripe = async () => {
    return new Promise((resolve, reject) => {
      if (stripe.value) {
        resolve(stripe.value);
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Stripe failed to initialize within 10 seconds'));
      }, 10000);

      const unwatch = watch(stripe, (stripeInstance) => {
        if (stripeInstance) {
          clearTimeout(timeout);
          unwatch();
          resolve(stripeInstance);
        }
      }, { immediate: true });
    });
  };

  return {
    stripe: readonly(stripe),
    isReady: computed(() => !isLoading.value && !!stripe.value),
    createPaymentIntent,
    confirmPayment,
    confirmPaymentWithExpressCheckout,
    createElement,
    waitForStripe,
  };
}; 