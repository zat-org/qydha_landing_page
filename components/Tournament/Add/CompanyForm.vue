<template>
  <div class="company-form space-y-4 md:space-y-6 p-3 md:p-6">
    <div class="form-header mb-4 md:mb-6">
      <h2 class="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">معلومات الشركة المؤسسة</h2>
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">يرجى إدخال معلومات الشركة الأساسية</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <UFormGroup 
        :ui="{ 
          error: 'text-xs mt-1 text-red-500 dark:text-red-400',
        }" 
        label="اسم الشركة المؤسسة" 
        name="CompanyName"
      >
        <UInput 
          :ui="{ 
            base: 'form-input w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200',
          }" 
          v-model="modelValue.CompanyName"
          placeholder="أدخل اسم الشركة"
        />
      </UFormGroup>

      <UFormGroup 
        :ui="{ 
          error: 'text-xs mt-1 text-red-500 dark:text-red-400',
        }" 
        label="رقم السجل التجاري" 
        name="RegisterNumber"
      >
        <UInput 
          :ui="{ 
            base: 'form-input w-full px-3 md:px-4 py-2 md:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200',
          }" 
          v-model.number="modelValue.RegisterNumber"
          placeholder="أدخل رقم السجل التجاري"
        />
      </UFormGroup>

      <UFormGroup 
        class="md:col-span-2"
        :ui="{ 
          error: 'text-xs mt-1 text-red-500 dark:text-red-400',
        }" 
        label="رقم التواصل مع المؤسسة" 
        name="CompanyPhoneNumber"
      >
        <AsyncPhoneInput 
          v-model="modelValue.CompanyPhoneNumber"
          dir="ltr"
          placeholder="أدخل رقم الهاتف"
        />
      </UFormGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>


const props = defineProps<{
  modelValue: {
    CompanyName: string
    RegisterNumber: string
    CompanyPhoneNumber: string
  }
}>()

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.company-form {
  @apply bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700;
}

.form-input:focus {
  @apply outline-none;
}

@media (max-width: 768px) {
  .company-form {
    @apply rounded-lg;
  }
}
</style>