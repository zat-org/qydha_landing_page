<template>
  <ClientOnly>
    <VueDatePicker
      v-bind="$attrs"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const VueDatePicker = defineAsyncComponent(() => 
  import('@vuepic/vue-datepicker').then(m => {
    // Import CSS only when component is loaded
    import('@vuepic/vue-datepicker/dist/main.css');
    return m.default;
  })
);

defineProps<{
  modelValue: any
}>();

defineEmits<{
  (e: 'update:modelValue', value: any): void
}>();
</script> 