<template>
  <UCard>
    <template #header>
      <h2 class="text-lg font-semibold">الإجراءات</h2>
    </template>

    <div class="space-y-3">
      <UButton 
        color="primary" 
        icon="i-heroicons-envelope"
        class="w-full justify-center"
        @click="$emit('contactOrganizer')"
      >
        التواصل مع المنظم
      </UButton>

      <UButton 
        color="neutral" 
        variant="outline"
        icon="i-heroicons-document-text"
        class="w-full justify-center"
        @click="$emit('generateReport')"
      >
        تقرير تفصيلي
      </UButton>

      <UButton 
        v-if="canEdit"
        color="warning" 
        variant="outline"
        icon="i-heroicons-pencil"
        class="w-full justify-center"
        @click="$emit('editOrganizer')"
      >
        تعديل البيانات
      </UButton>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
// Props
const props = defineProps<{
  canEdit: boolean
}>()

// Emits
const emits = defineEmits<{
  contactOrganizer: []
  generateReport: []
  editOrganizer: []
}>()
</script> 