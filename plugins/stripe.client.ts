import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  
  const publishableKey = config.public.stripePublishableKey;
  
  if (!publishableKey) {
    console.warn('Stripe publishable key is not configured');
    return {
      provide: {
        stripe: null
      }
    };
  }

  try {
    const stripe = await loadStripe(publishableKey);
    
    if (!stripe) {
      console.error('Failed to load Stripe');
      return {
        provide: {
          stripe: null
        }
      };
    }

    return {
      provide: {
        stripe
      }
    };
  } catch (error) {
    console.error('Error loading Stripe:', error);
    return {
      provide: {
        stripe: null
      }
    };
  }
});

// Type declaration for the plugin
declare module '#app' {
  interface NuxtApp {
    $stripe: Stripe | null;
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $stripe: Stripe | null;
  }
} 