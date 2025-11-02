<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">تواريخ ألبطولة</h3>
    
    <UFormField label="بداية  البطولة" name="startAt">
      <AsyncDatePicker  v-model="model.startAt" :min-date="new Date()" />
      <!-- <UInput 
        v-model="model.startAt" 
        placeholder="بداية البطولة"
        type="date" 
      /> -->
    </UFormField>

    <UFormField label="نهاية البطولة" name="endAt">
      <AsyncDatePicker  v-model="model.endAt"  :min-date="model.startAt" />

      <!-- <UInput 
        v-model="model.endAt" 
        placeholder="نهاية البطولة"
        type="date" 
      /> -->
    </UFormField>
  </div>
</template>

<script setup lang="ts">
interface Dates {
  startAt: string;
  endAt: string;
}

const model = defineModel<Dates>({required:true})

</script> 