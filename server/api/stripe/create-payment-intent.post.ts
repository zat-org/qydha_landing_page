import Stripe from 'stripe';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  // Get Stripe secret key from environment
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
  
  if (!stripeSecretKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Stripe secret key is not configured'
    });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-05-28.basil',
  });

  try {
    const { amount, currency = 'usd', metadata = {} } = body;

    if (!amount || amount < 50) { // Minimum 50 cents
      throw createError({
        statusCode: 400,
        statusMessage: 'Amount must be at least 50 cents'
      });
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Amount in cents
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Failed to create payment intent'
    });
  }
}); 