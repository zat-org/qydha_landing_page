<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-document-text" class="text-xl text-primary-500" />
        <h2 class="text-xl font-semibold">الوثائق القانونية</h2>
      </div>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="document in documents" 
        :key="document.id"
        class="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-center justify-between mb-3">
          <UIcon name="i-heroicons-document" class="text-lg text-gray-500" />
          <UBadge 
            :color="document.verified ? 'success' : 'warning'"
            :label="document.verified ? 'مُعتمد' : 'في الانتظار'"
            variant="soft"
          />
        </div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-2">
          {{ document.name }}
        </h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {{ document.description }}
        </p>
        <UButton 
          color="primary" 
          variant="outline" 
          size="sm"
          icon="i-heroicons-eye"
          class="w-full"
          @click="$emit('viewDocument', document)"
        >
          عرض الوثيقة
        </UButton>
      </div>
    </div>

    <div v-if="documents.length === 0" class="text-center py-8">
      <UIcon name="i-heroicons-document-plus" class="text-4xl text-gray-400 mb-4" />
      <p class="text-gray-500 dark:text-gray-400">لا توجد وثائق قانونية مرفوعة</p>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
interface LegalDocument {
  id: string
  name: string
  description: string
  verified: boolean
  uploadDate: string
}

// Props
const props = defineProps<{
  documents: LegalDocument[]
}>()

// Emits
const emits = defineEmits<{
  viewDocument: [document: LegalDocument]
}>()
</script> 