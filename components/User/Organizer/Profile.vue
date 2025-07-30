<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-building-office" class="text-xl text-primary-500" />
        <h2 class="text-xl font-semibold">معلومات المنظمة</h2>
      </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            اسم المنظمة
          </label>
          <UInput 
            v-model="organizationData.organizationName"
            placeholder="اسم المنظمة"
            readonly
            class="bg-gray-50 dark:bg-gray-800"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            رقم السجل التجاري
          </label>
          <UInput 
            v-model="organizationData.commercialRegistration"
            placeholder="رقم السجل التجاري"
            readonly
            class="bg-gray-50 dark:bg-gray-800"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            الموقع
          </label>
          <UTextarea 
            v-model="organizationData.location"
            placeholder="العنوان التفصيلي للمنظمة"
            readonly
            :rows="3"
            class="bg-gray-50 dark:bg-gray-800"
          />
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            رقم التواصل مع قيدها
          </label>
          <UInput 
            v-model="organizationData.qydhaContactPhone"
            placeholder="رقم الهاتف"
            readonly
            class="bg-gray-50 dark:bg-gray-800"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            عدد البطولات المنظمة
          </label>
          <div class="flex items-center gap-2">
            <UBadge 
              :label="organizationData.tournamentsCount.toString()" 
              color="primary" 
              variant="soft"
              size="lg"
            />
            <span class="text-sm text-gray-600 dark:text-gray-400">بطولة</span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            تاريخ التسجيل كمنظم
          </label>
          <UInput 
            :value="formatDate(organizationData.registrationDate)"
            readonly
            class="bg-gray-50 dark:bg-gray-800"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
interface OrganizationData {
  organizationName: string
  commercialRegistration: string
  location: string
  qydhaContactPhone: string
  tournamentsCount: number
  registrationDate: string
}

// Props
const props = defineProps<{
  organizationData: OrganizationData
}>()

// Methods
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'غير محدد'
  return new Date(dateString).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 