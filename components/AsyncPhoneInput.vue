<template>
  <ClientOnly>
    <vue-tel-input
      v-bind="$attrs"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';

const VueTelInput = defineAsyncComponent(() => 
  import('vue-tel-input').then(m => {
    // Import CSS only when component is loaded
    import('vue-tel-input/vue-tel-input.css');
    return m.VueTelInput;
  })
);

defineProps<{
  modelValue: string
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();
</script> 