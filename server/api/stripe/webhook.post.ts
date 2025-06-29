import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  if (!config.stripeSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe secret key is not configured'
    });
  }

  if (!config.stripeWebhookSecret) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe webhook secret is not configured'
    });
  }

  const stripe = new Stripe(config.stripeSecretKey, {
    apiVersion: '2025-05-28.basil',
  });

  let stripeEvent: Stripe.Event;

  try {
    const body = await readRawBody(event);
    const signature = getHeader(event, 'stripe-signature');

    if (!body || !signature) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing body or signature'
      });
    }

    // Verify the webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      signature,
      config.stripeWebhookSecret
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    throw createError({
      statusCode: 400,
      statusMessage: 'Webhook signature verification failed'
    });
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        // Handle successful payment here
        // You can update your database, send confirmation emails, etc.
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = stripeEvent.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', failedPayment.id);
        // Handle failed payment here
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        console.log('Subscription event:', stripeEvent.type, subscription.id);
        // Handle subscription events here
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return { received: true };
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Error processing webhook'
    });
  }
}); 