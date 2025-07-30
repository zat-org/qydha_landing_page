<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-phone" class="text-xl text-primary-500" />
        <h2 class="text-lg font-semibold">معلومات التواصل</h2>
      </div>
    </template>

    <div class="space-y-4">
      <div class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          الهاتف الرئيسي
        </label>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-phone" class="text-green-500" />
          <span class="font-medium">{{ contactPhone }}</span>
        </div>
      </div>

      <div class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          البريد الإلكتروني
        </label>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-envelope" class="text-blue-500" />
          <span class="font-medium">{{ email || 'غير محدد' }}</span>
        </div>
      </div>

      <div class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
        <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
          آخر نشاط
        </label>
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-clock" class="text-gray-500" />
          <span class="font-medium">{{ formatDate(lastLogin) }}</span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
// Props
const props = defineProps<{
  contactPhone: string
  email?: string
  lastLogin?: string
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