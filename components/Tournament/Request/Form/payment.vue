<template>
  <div class="space-y-6">
    <!-- Header Section -->
    <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl">
      <h2 class="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
        الدفع عبر Apple Pay
      </h2>
      <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">
        قم بإتمام عملية الدفع بشكل آمن باستخدام Apple Pay
      </p>
    </div>

    <!-- Payment Details -->
    <div class="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <div class="space-y-4">
        <!-- Amount Section -->
        <div class="flex justify-between items-center">
          <span class="text-gray-700 dark:text-gray-300">المبلغ المطلوب:</span>
          <span class="font-semibold text-lg">{{ totalAmount }} ريال</span>
        </div>

        <!-- Apple Pay Button -->
        <button 
          @click="initiateApplePay"
          :disabled="!isApplePayAvailable"
          class="w-full bg-black text-white py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <img src="~assets/images/applepay.svg" alt="Apple Pay" class="h-6 w-auto" />
          <span>الدفع باستخدام Apple Pay</span>
        </button>

        <p v-if="!isApplePayAvailable" class="text-sm text-red-500 text-center">
          Apple Pay غير متاح على هذا الجهاز
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <UModal v-model="isProcessing">
      <div class="p-4 text-center">
        <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 mx-auto text-primary-600" />
        <p class="mt-2">جاري معالجة الدفع...</p>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface Props {
  amount: number
  merchantId?: string
  label?: string
}

const props = withDefaults(defineProps<Props>(), {
  merchantId: 'merchant.qydha.app',
  label: 'رسوم البطولة'
})

const emit = defineEmits<{
  paymentSuccess: [payment: any]
  paymentError: [error: any]
  paymentCancel: []
}>()

const isApplePayAvailable = ref(false)
const isProcessing = ref(false)
const totalAmount = computed(() => props.amount)

onMounted(() => {
  // Check if Apple Pay is available
  if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
    isApplePayAvailable.value = true
  }
})

const initiateApplePay = async () => {
  if (!isApplePayAvailable.value) return

  try {
    isProcessing.value = true

    const paymentRequest = {
      countryCode: 'SA',
      currencyCode: 'SAR',
      supportedNetworks: ['visa', 'masterCard'],
      merchantCapabilities: ['supports3DS'],
      total: {
        label: props.label,
        amount: totalAmount.value.toString()
      }
    }

    const session = new window.ApplePaySession!(3, paymentRequest)

    session.onvalidatemerchant = async (event: any) => {
      try {
        // Validate merchant with your backend
        const merchantSession = await validateMerchant(event.validationURL)
        session.completeMerchantValidation(merchantSession)
      } catch (err) {
        console.error('Merchant validation failed:', err)
        session.abort()
      }
    }

    session.onpaymentauthorized = async (event: any) => {
      try {
        // Process payment with your backend
        const result = await processPayment(event.payment)
        session.completePayment(window.ApplePaySession!.STATUS_SUCCESS)
        emit('paymentSuccess', result)
      } catch (err) {
        console.error('Payment failed:', err)
        session.completePayment(window.ApplePaySession!.STATUS_FAILURE)
        emit('paymentError', err)
      }
    }

    session.oncancel = () => {
      emit('paymentCancel')
    }

    session.begin()
  } catch (error) {
    console.error('Apple Pay error:', error)
    emit('paymentError', error)
  } finally {
    isProcessing.value = false
  }
}

const validateMerchant = async (validationURL: string) => {
  // Implement merchant validation with your backend
  const response = await fetch('/api/validate-merchant', {
    method: 'POST',
    body: JSON.stringify({ validationURL })
  })
  return await response.json()
}

const processPayment = async (payment: any) => {
  // Implement payment processing with your backend
  const response = await fetch('/api/process-payment', {
    method: 'POST',
    body: JSON.stringify(payment)
  })
  return await response.json()
}
</script>
