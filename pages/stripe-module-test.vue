<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold dark:text-white">Stripe Module Test</h1>
          <div class="flex items-center gap-4">
            <UButton to="/payment-demo" variant="outline" size="sm">
              🚀 Payment Demo
            </UButton>
            <ColorModeToggle />
          </div>
        </div>

        <!-- Module Status -->
        <div class="grid lg:grid-cols-2 gap-8 mb-8">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">Module Status</h2>
            <ClientOnly>
              <StripeDebug />
            </ClientOnly>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
            <h2 class="text-xl font-semibold mb-4 dark:text-white">Migration Summary</h2>
            <div class="space-y-2 text-sm">
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                <span class="dark:text-gray-300">Migrated to @unlok-co/nuxt-stripe</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                <span class="dark:text-gray-300">Removed custom plugin</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                <span class="dark:text-gray-300">Updated composable</span>
              </div>
              <div class="flex items-center gap-2">
                <Icon name="i-heroicons-check-circle" class="w-4 h-4 text-green-500" />
                <span class="dark:text-gray-300">All features preserved</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Payment Test -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
          <h2 class="text-xl font-semibold mb-6 dark:text-white">Payment Features Test</h2>
          
          <!-- Test the new clean component -->
          <ClientOnly>
            <StripeTestSimple />
          </ClientOnly>
        </div>

        <!-- Features Overview -->
        <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
          <h2 class="text-xl font-semibold mb-4 dark:text-white">Available Payment Methods</h2>
          
          <div class="grid md:grid-cols-3 gap-6">
            <!-- Card Payments -->
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <Icon name="i-heroicons-credit-card" class="w-12 h-12 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
              <h3 class="font-semibold dark:text-white">Card Payments</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Visa, Mastercard, Amex</p>
              <UBadge color="green" variant="soft" size="xs" class="mt-2">Always Available</UBadge>
            </div>

            <!-- Apple Pay -->
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-4xl mb-3">🍎</div>
              <h3 class="font-semibold dark:text-white">Apple Pay</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Safari + Apple devices</p>
              <UBadge color="blue" variant="soft" size="xs" class="mt-2">Auto-detect</UBadge>
            </div>

            <!-- Google Pay -->
            <div class="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div class="text-4xl mb-3">🅶</div>
              <h3 class="font-semibold dark:text-white">Google Pay</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">Chrome + configured</p>
              <UBadge color="blue" variant="soft" size="xs" class="mt-2">Auto-detect</UBadge>
            </div>
          </div>

          <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div class="flex items-start gap-2">
              <Icon name="i-heroicons-information-circle" class="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 class="font-medium text-blue-800 dark:text-blue-200">Digital Wallets</h4>
                <p class="text-sm text-blue-600 dark:text-blue-300 mt-1">
                  Apple Pay and Google Pay will automatically appear when available based on:
                  browser type, device capabilities, and user configuration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Page meta
definePageMeta({
  title: 'Stripe Module Test'
});
</script> 