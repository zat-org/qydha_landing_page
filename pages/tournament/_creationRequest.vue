<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900  px-2 sm:px-4 py-3 sm:py-6">
    <div class="max-w-2xl mx-auto flex flex-col gap-3 sm:gap-4">
      <!-- Compact Header -->
      <div class="text-center">
        <div class="flex justify-center items-center gap-2 py-1">
            <NuxtLink to="/">
                <img src="@/assets/images/qydha-logo.svg" class="w-14 sm:w-16 h-auto" alt="Qydha Logo" />
            </NuxtLink>
       
          <h1 class="text-lg font-bold text-gray-900 dark:text-white mb-0.5">
            طلب إنشاء بطولة
          </h1>
        </div>
      </div>

      <UCard
        class="shadow-md border border-gray-200 dark:border-gray-700 flex-1"
        :ui="{
          body: 'p-3',
          header: 'px-3 pt-3 pb-0',
          footer: 'px-3 pb-3 pt-0'
        }"
      >
        <UForm
          :schema="schema"
          :state="formData"
          class="flex flex-col space-y-3"
          ref="form"
          @submit="onSubmit"
        >
          <!-- Personal Information Section -->
          <div class="space-y-2">
            <div class="flex items-center gap-1.5 pb-1 border-b border-amber-500/30 dark:border-amber-400/30">
              <UIcon name="i-heroicons-user-circle" class="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">المعلومات الشخصية</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <UFormField label="اسم المنشئ" name="creatorName" required>
                <UInput 
                  v-model="formData.creatorName" 
                  placeholder="اسم المنشئ" 
                  size="sm"
                />
              </UFormField>

              <UFormField label="رقم الهاتف" name="phoneNumber" required>
                <AsyncPhoneInput 
                  v-model="formData.phoneNumber" 
                  dir="ltr" 
                />
              </UFormField>
            </div>
          </div>

          <!-- Tournament Details Section -->
          <div class="space-y-2">
            <div class="flex items-center gap-1.5 pb-1 border-b border-amber-500/30 dark:border-amber-400/30">
              <UIcon name="i-heroicons-trophy" class="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">تفاصيل البطولة</h3>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <UFormField label="الفرق" name="teamsCount" required>
                <UInput 
                  v-model.number="formData.teamsCount" 
                  type="number" 
                  min="2"
                  placeholder="16" 
                  size="sm"
                />
              </UFormField>

              <UFormField label="الطاولات" name="tablesCount" required>
                <UInput 
                  v-model.number="formData.tablesCount" 
                  type="number" 
                  min="1"
                  placeholder="4" 
                  size="sm"
                />
              </UFormField>

              <UFormField label="الحكام" name="refereesCount" required>
                <UInput 
                  v-model.number="formData.refereesCount" 
                  type="number" 
                  min="0"
                  placeholder="2" 
                  size="sm"
                />
              </UFormField>
            </div>

            <UFormField label="تاريخ البطولة" name="tournamentDate" required>
              <AsyncDatePicker 
               :enableTime="false"
                v-model="formData.tournamentDate" 
                :min-date="new Date()"
                class="w-full"
              />
            </UFormField>
          </div>

          <!-- Location Section -->
          <div class="space-y-2">
            <div class="flex items-center gap-1.5 pb-1 border-b border-amber-500/30 dark:border-amber-400/30">
              <UIcon name="i-heroicons-map-pin" class="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <h3 class="text-sm font-semibold text-gray-800 dark:text-gray-200">موقع البطولة</h3>
            </div>

            <UFormField label="مكان البطولة" name="locationDescription" required>
              <UInput 
                v-model="formData.locationDescription" 
                placeholder="عنوان البطولة" 
                size="sm"
              />
            </UFormField>

            <UFormField
              label="الموقع على الخريطة"
              name="location"
              required
              :help="formData.location.latitude != 0 && formData.location.longitude != 0 ? '✓ تم الاختيار' : 'اختر الموقع'"
            >
              <div class="flex flex-col sm:flex-row sm:items-center gap-2">
                <MapInputModal
                  v-model="formData.location"
                  :show-inputs="false"
                  name="location" 
                  label="مكان البطولة" 
                />
                <div v-if="formData.location.latitude != 0 && formData.location.longitude != 0" 
                     class="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs">
                  <UIcon name="i-heroicons-check-circle" class="w-3.5 h-3.5" />
                  <span>تم</span>
                </div>
              </div>
            </UFormField>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center pt-3 border-t border-gray-200 dark:border-gray-700">
            <UButton 
              type="submit" 
              color="primary"
              size="sm"
              :loading="isSubmitting"
              class="min-w-[140px]"
              :disabled="isSubmitting"
            >
              <template v-if="!isSubmitting">
                <UIcon name="i-heroicons-paper-airplane" class="w-3.5 h-3.5 ml-1.5" />
                إرسال الطلب
              </template>
              <template v-else>
                جاري الإرسال...
              </template>
            </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { object, string, number } from "yup";

// Form data structure
const formData = reactive({
  creatorName: "",
  phoneNumber: "",
  teamsCount: 2,
  tablesCount: 1,
  refereesCount: 0,
  tournamentDate: undefined as string | undefined,
  locationDescription: "",
  location: {
    latitude: 0,
    longitude: 0
  }
});

// Validation schema
const schema = object({
  creatorName: string()
    .required("اسم المنشئ مطلوب")
    .min(2, "اسم المنشئ يجب أن يكون على الأقل حرفين"),
  
  phoneNumber: string()
    .required("رقم الهاتف مطلوب")
    .min(10, "رقم الهاتف يجب أن يكون صحيحاً"),
  
  teamsCount: number()
    .required("عدد الفرق مطلوب")
    .typeError("عدد الفرق يجب أن يكون رقماً")
    .min(2, "يجب أن يكون عدد الفرق على الأقل 2")
    .integer("عدد الفرق يجب أن يكون رقماً صحيحاً"),
  
  tablesCount: number()
    .required("عدد الطاولات مطلوب")
    .typeError("عدد الطاولات يجب أن يكون رقماً")
    .min(1, "يجب أن يكون عدد الطاولات على الأقل 1")
    .integer("عدد الطاولات يجب أن يكون رقماً صحيحاً"),
  
  refereesCount: number()
    .required("عدد الحكام مطلوب")
    .typeError("عدد الحكام يجب أن يكون رقماً")
    .min(0, "عدد الحكام لا يمكن أن يكون سالباً")
    .integer("عدد الحكام يجب أن يكون رقماً صحيحاً"),
  
  tournamentDate: string()
    .required("تاريخ البطولة مطلوب")
    .test('date-valid', 'تاريخ البطولة غير صحيح', function (value) {
      if (!value) return false;
      const date = new Date(value);
      return !isNaN(date.getTime());
    })
    .test('date-future', 'تاريخ البطولة يجب أن يكون في المستقبل', function (value) {
      if (!value) return false;
      const date = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    }),
  
  locationDescription: string()
    .required("مكان البطولة مطلوب")
 ,  
  location: object({
    latitude: number(),
    longitude: number(),
  }).test('location-selected', 'يرجى اختيار الموقع على الخريطة', function (value) {
    return !!value && value.latitude !== 0 && value.longitude !== 0;
  })
});

// Form reference
const form = useTemplateRef("form");

// Submit state
const isSubmitting = ref(false);

// Format date to Arabic format
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Submit handler
const onSubmit = async (event: any) => {
  isSubmitting.value = true;
  
  try {
    const data = event.data;
    
    // Format the WhatsApp message
    const formattedDate = formatDate(formData.tournamentDate);
    
    // Create Google Maps link from coordinates
    const googleMapsLink = `https://www.google.com/maps?q=${formData.location.latitude},${formData.location.longitude}`;
    
    const message = `مرحباً 
نحن شركة ${formData.creatorName} نرغب في تنظيم بطولة بلوت في تاريخ: ${formattedDate}
بمدينة: ${formData.locationDescription}
الموقع على الخريطة: ${googleMapsLink}
عدد الفرق: ${formData.teamsCount}
عدد الطاولات: ${formData.tablesCount}
عدد الحكام: ${formData.refereesCount}

نرغب في عرض سعر لخدماتكم في قيدها`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappPhone = '966508253266';
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappPhone}&text=${encodedMessage}&type=phone_number&app_absent=0`;
    
    // Open WhatsApp in a new window
    window.open(whatsappUrl, '_blank');
    
    // Show success message
    useToast().add({
      title: 'تم فتح واتساب',
      description: 'سيتم فتح واتساب لإرسال الطلب',
      color: 'success'
    });
    
    // Reset form after a short delay
    setTimeout(() => {
      formData.creatorName = "";
      formData.phoneNumber = "";
      formData.teamsCount = 2;
      formData.tablesCount = 1;
      formData.refereesCount = 0;
      formData.tournamentDate = undefined;
      formData.locationDescription = "";
      formData.location = {
        latitude: 0,
        longitude: 0
      };
      form.value?.clear();
      isSubmitting.value = false;
    }, 1000);
    
  } catch (error: any) {
    console.error("Error submitting form:", error);
    
    // Show error message
    useToast().add({
      title: 'حدث خطأ',
      description: error.message || 'فشل إرسال الطلب. يرجى المحاولة مرة أخرى',
      color: 'error'
    });
    isSubmitting.value = false;
  }
};

// Set SEO meta tags
useSeoMeta({
  title: 'طلب إنشاء بطولة',
  description: 'طلب إنشاء بطولة بلوت مع قيدها - نظم بطولتك بسهولة',
  ogTitle: 'قيدها | Qydha - طلب إنشاء بطولة',
  ogDescription: 'طلب إنشاء بطولة بلوت مع قيدها - نظم بطولتك بسهولة',
  ogImage: 'https://qydha.com/images/preview.PNG',
  ogUrl: 'https://qydha.com/tournament/creationRequest',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'قيدها | Qydha - طلب إنشاء بطولة',
  twitterDescription: 'طلب إنشاء بطولة بلوت مع قيدها - نظم بطولتك بسهولة',
  twitterImage: 'https://qydha.com/images/preview.PNG'
});

definePageMeta({
  layout: 'custom'
})
</script>

<style scoped></style>
