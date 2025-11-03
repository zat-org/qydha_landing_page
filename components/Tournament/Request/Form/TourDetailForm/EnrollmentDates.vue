<template>
  <div class="space-y-4">
    <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">تواريخ ألبطولة</h3>
    
 
  </div>
</template>

<script setup lang="ts">
interface Dates {
  startAt: string;
  endAt: string;
}

const model = defineModel<Dates>({required:true})

</script> 