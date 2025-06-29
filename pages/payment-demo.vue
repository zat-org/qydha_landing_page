<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header with Theme Toggle -->
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold dark:text-white">تجربة الدفع المطور</h1>
          <div class="flex items-center gap-4">
            <UButton to="/stripe-test" variant="outline" size="sm">
              🧪 Test Suite
            </UButton>
            <ColorModeToggle />
            <UBadge color="success" variant="subtle">
              <Icon name="i-heroicons-shield-check" class="w-4 h-4 ml-1" />
              آمن مع Stripe
            </UBadge>
          </div>
        </div>
        
        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Plan Selection -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
            <div class="flex items-center gap-2 mb-6">
              <Icon name="i-heroicons-squares-2x2" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h2 class="text-xl font-semibold dark:text-white">اختر الباقة</h2>
            </div>
            
            <div class="space-y-4">
              <div 
                v-for="plan in plans" 
                :key="plan.id"
                @click="selectedPlan = plan"
                class="border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
                :class="selectedPlan?.id === plan.id 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
                  : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <div class="flex items-center gap-2">
                      <Icon :name="plan.icon" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h3 class="font-semibold dark:text-white">{{ plan.name }}</h3>
                    </div>
                    <p class="text-gray-600 dark:text-gray-300 text-sm mt-1">{{ plan.description }}</p>
                    <div class="flex items-center gap-2 mt-2">
                      <span class="text-lg font-bold dark:text-white">${{ (plan.price / 100).toFixed(2) }}</span>
                      <UBadge v-if="plan.popular" color="primary" variant="soft" size="xs">الأكثر شعبية</UBadge>
                    </div>
                  </div>
                  <div v-if="selectedPlan?.id === plan.id" class="text-blue-600 dark:text-blue-400">
                    <Icon name="i-heroicons-check-circle" class="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Features Display -->
            <div v-if="selectedPlan" class="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 class="font-medium dark:text-white mb-2">مميزات هذه الباقة:</h4>
              <ul class="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <li v-for="feature in selectedPlan.features" :key="feature" class="flex items-center gap-2">
                  <Icon name="i-heroicons-check" class="w-4 h-4 text-green-500" />
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Payment Section -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
            <!-- Debug Info -->
            <ClientOnly>
              <StripeDebug />
              <ExpressCheckoutDebug />
            </ClientOnly>
            
            <div v-if="selectedPlan">
              <ClientOnly>
                <StripePayment
                  :amount="selectedPlan.price"
                  :metadata="{ 
                    plan_id: selectedPlan.id, 
                    plan_name: selectedPlan.name,
                    user_id: 'demo_user_123'
                  }"
                  :enable-apple-pay="true"
                  country="US"
                  @success="handlePaymentSuccess"
                  @error="handlePaymentError"
                />
              </ClientOnly>
            </div>

            <div v-else class="text-center text-gray-500 dark:text-gray-400 py-12">
              <Icon name="i-heroicons-cursor-arrow-rays" class="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p class="text-lg font-medium">يرجى اختيار باقة للمتابعة</p>
              <p class="text-sm mt-1">اختر من الباقات المتاحة على اليسار</p>
            </div>
          </div>
        </div>

        <!-- Payment Methods Info -->
        <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">
          <h3 class="text-lg font-semibold dark:text-white mb-4 flex items-center gap-2">
            <Icon name="i-heroicons-credit-card" class="w-5 h-5" />
            طرق الدفع المدعومة
          </h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium dark:text-white mb-2">البطاقات المقبولة</h4>
              <div class="flex gap-2">
                <div class="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                <div class="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                <div class="w-12 h-8 bg-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">AMEX</div>
              </div>
            </div>
            <div>
              <h4 class="font-medium dark:text-white mb-2">المحافظ الرقمية</h4>
              <div class="flex gap-2">
                <div class="px-3 py-1 bg-black dark:bg-gray-700 text-white rounded text-xs font-medium">Apple Pay</div>
                <div class="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium">Google Pay</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Success Modal -->
        <UModal v-model="showSuccessModal">
            <template #content>
          <div class="p-6">
            <div class="text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <Icon name="i-heroicons-check-circle" class="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 class="text-xl font-medium dark:text-white mb-2">تم الدفع بنجاح! 🎉</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
                تم تأكيد دفعتك للباقة "<span class="font-semibold">{{ selectedPlan?.name }}</span>"
              </p>
              <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                <div class="text-sm text-gray-600 dark:text-gray-300">
                  <p>المبلغ المدفوع: <span class="font-bold">${{ selectedPlan ? (selectedPlan.price / 100).toFixed(2) : '0.00' }}</span></p>
                  <p>تاريخ الدفع: <span class="font-bold">{{ new Date().toLocaleDateString('ar-SA') }}</span></p>
                </div>
              </div>
              <UButton @click="showSuccessModal = false" color="primary" size="lg">
                ممتاز، شكراً لك!
              </UButton>
            </div>
          </div>
          </template>
        </UModal>

        <!-- Error Toast -->
        <div v-if="errorMessage" class="fixed top-4 right-4 z-50">
          <div class="bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg max-w-sm">
            {{ errorMessage }}
            <button @click="errorMessage = ''" class="ml-2 text-white hover:text-gray-200">
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Plan {
  id: string;
  name: string;
  description: string;
  price: number; // in cents
  icon: string;
  popular?: boolean;
  features: string[];
}

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'الباقة الأساسية',
    description: 'مميزات أساسية للاعبين المبتدئين',
    price: 999, // $9.99
    icon: 'i-heroicons-play',
    features: [
      'تسجيل المباريات الأساسية',
      'إحصائيات شخصية',
      'دعم فني محدود'
    ]
  },
  {
    id: 'premium',
    name: 'الباقة المميزة',
    description: 'مميزات متقدمة وأدوات إضافية',
    price: 1999, // $19.99
    icon: 'i-heroicons-star',
    popular: true,
    features: [
      'جميع مميزات الباقة الأساسية',
      'إحصائيات متقدمة',
      'تسجيل فيديو للمباريات',
      'دعم فني سريع',
      'تصدير البيانات'
    ]
  },
  {
    id: 'pro',
    name: 'الباقة الاحترافية',
    description: 'جميع المميزات + دعم مخصص',
    price: 2999, // $29.99
    icon: 'i-heroicons-trophy',
    features: [
      'جميع مميزات الباقة المميزة',
      'دعم فني مخصص 24/7',
      'إدارة البطولات',
      'تحليلات متقدمة',
      'واجهة برمجة التطبيقات (API)',
      'تدريب شخصي'
    ]
  }
];

const selectedPlan = ref<Plan | null>(null);
const showSuccessModal = ref(false);
const errorMessage = ref('');

const handlePaymentSuccess = (paymentIntent: any) => {
  console.log('Payment successful:', paymentIntent);
  showSuccessModal.value = true;
};

const handlePaymentError = (error: string) => {
  console.error('Payment error:', error);
  errorMessage.value = error;
  
  // Auto-hide error after 5 seconds
  setTimeout(() => {
    errorMessage.value = '';
  }, 5000);
};

// Auto-select first plan for demo
onMounted(() => {
  selectedPlan.value = plans[0];
});
</script> 