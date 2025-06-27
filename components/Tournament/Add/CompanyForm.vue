<template>
  <div class="company-form space-y-4 md:space-y-6 p-3 md:p-6">
    <div class="form-header mb-4 md:mb-6">
      <h2 class="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200">معلومات الشركة المؤسسة</h2>
      <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1">يرجى إدخال معلومات الشركة الأساسية</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <UFormField label="اسم الشركة المؤسسة" name="CompanyName" required>
        <UInput  v-model="modelValue.CompanyName" placeholder="أدخل اسم الشركة" required />
      </UFormField>

      <UFormField label="رقم السجل التجاري" name="RegisterNumber" required>
        <UInput  v-model.number="modelValue.RegisterNumber" placeholder="أدخل رقم السجل التجاري" />
      </UFormField>

      <UFormField class="md:col-span-2" required label="رقم التواصل مع المؤسسة" name="CompanyPhoneNumber">
        <AsyncPhoneInput v-model="modelValue.CompanyPhoneNumber" dir="ltr" placeholder="أدخل رقم الهاتف" />
      </UFormField>
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

<style scoped></style>