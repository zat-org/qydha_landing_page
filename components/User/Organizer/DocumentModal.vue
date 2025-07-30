<template>
  <UModal v-model:open="isOpen" prevent-close title="الوثيقة"  description="الوثيقة">
  
      <template #body>
      <div class="p-4">
        <div v-if="selectedDocument" class="space-y-4">
          <div class="text-center">
            <UIcon name="i-heroicons-document" class="text-6xl text-gray-400 mb-4" />
            <p class="text-gray-600 dark:text-gray-400">{{ selectedDocument.description }}</p>
          </div>
          <div class="flex justify-center">
            <UButton color="primary" icon="i-heroicons-arrow-down-tray" @click="downloadDocument">
              تحميل الوثيقة
            </UButton>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
interface LegalDocument {
  id: string
  name: string
  description: string
  verified: boolean
  uploadDate: string
}
const isOpen = defineModel<boolean>('isOpen', { required: true })

// Props
const props = defineProps<{
  selectedDocument: LegalDocument | null
}>()




// Methods
const close = () => {
  isOpen.value = false
}

const downloadDocument = () => {
  // In real app, this would download the actual document
  console.log('Downloading document:', props.selectedDocument?.name)
}
</script> 