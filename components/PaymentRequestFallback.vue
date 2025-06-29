<template>
  <div v-if="showPaymentRequest" class="mb-4">
    <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
      🔄 Fallback Payment Methods:
    </div>
    <div ref="paymentRequestElement" class="min-h-[48px] border border-gray-300 dark:border-gray-600 rounded-lg"></div>
    <div v-if="paymentRequestError" class="text-red-500 text-sm mt-2">
      {{ paymentRequestError }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  amount: number;
  currency: string;
  metadata?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  currency: 'usd',
  metadata: () => ({})
});

const emit = defineEmits<{
  paymentSuccess: [paymentIntent: any];
  paymentError: [error: string];
}>();

const { stripe, createPaymentIntent } = useStripe();

const paymentRequestElement = ref<HTMLElement>();
let stripePaymentRequestButton: any = null;
let paymentRequest: any = null;

const showPaymentRequest = ref(false);
const paymentRequestError = ref('');

const initializePaymentRequest = async () => {
  try {
    if (!stripe.value) {
      console.log('❌ Stripe not available for PaymentRequest fallback');
      return;
    }

    console.log('🔄 Initializing PaymentRequest fallback...');

    // Create payment request
    paymentRequest = stripe.value.paymentRequest({
      country: 'US',
      currency: props.currency.toLowerCase(),
      total: {
        label: 'Payment',
        amount: props.amount,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: false,
    });

    // Check if payment request is available (Apple Pay, Google Pay, etc.)
    const canMakePayment = await paymentRequest.canMakePayment();
    console.log('🔍 PaymentRequest canMakePayment:', canMakePayment);

    if (canMakePayment) {
      console.log('✅ PaymentRequest is available');
      
      // Create payment request button element
      await nextTick();
      
      if (paymentRequestElement.value) {
        // Create payment request button using the Stripe elements API directly
        if (stripe.value) {
          const elements = stripe.value.elements();
          stripePaymentRequestButton = elements.create('paymentRequestButton', {
            paymentRequest,
            style: {
              paymentRequestButton: {
                theme: 'dark',
                height: '48px',
                type: 'donate', // or 'buy' or 'default'
              },
            },
          });

          stripePaymentRequestButton.mount(paymentRequestElement.value);
        }
        showPaymentRequest.value = true;
        console.log('✅ PaymentRequest button mounted');

        // Handle payment
        if (paymentRequest) {
          paymentRequest.on('paymentmethod', async (event: any) => {
          console.log('💳 PaymentRequest paymentmethod event:', event);
          
          try {
            // Create payment intent
            const response = await createPaymentIntent(
              props.amount,
              props.currency,
              { 
                ...props.metadata, 
                payment_method: 'payment_request',
                payment_method_types: ['card']
              }
            );

            if (!response || !response.client_secret) {
              throw new Error('Failed to create payment intent');
            }

            // Confirm payment
            const confirmResult = await stripe.value!.confirmCardPayment(
              response.client_secret,
              {
                payment_method: event.paymentMethod.id
              }
            );

            if (confirmResult.error) {
              console.error('❌ Payment confirmation failed:', confirmResult.error);
              event.complete('fail');
              emit('paymentError', confirmResult.error.message || 'Payment failed');
            } else {
              console.log('✅ Payment successful:', confirmResult.paymentIntent);
              event.complete('success');
              emit('paymentSuccess', confirmResult.paymentIntent);
            }
          } catch (error: any) {
            console.error('❌ Payment processing error:', error);
            event.complete('fail');
            emit('paymentError', error.message || 'Payment processing failed');
          }
        });
        }

        // Handle errors
        if (stripePaymentRequestButton) {
          stripePaymentRequestButton.on('error', (event: any) => {
            console.error('❌ PaymentRequest button error:', event.error);
            paymentRequestError.value = event.error.message;
          });
        }

      } else {
        console.log('❌ PaymentRequest element not found');
      }
    } else {
      console.log('❌ PaymentRequest not available');
    }
  } catch (error: any) {
    console.error('❌ PaymentRequest initialization error:', error);
    paymentRequestError.value = error.message;
  }
};

// Initialize when mounted
onMounted(async () => {
  // Wait a bit to ensure Stripe is ready and other components have loaded
  await new Promise(resolve => setTimeout(resolve, 2000));
  await initializePaymentRequest();
});

// Cleanup on unmount
onUnmounted(() => {
  if (stripePaymentRequestButton) {
    stripePaymentRequestButton.destroy();
  }
});
</script> 