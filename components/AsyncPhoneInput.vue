<template>
  <ClientOnly>
    <VueTelInput v-bind="$attrs" :validCharactersOnly="true" :autoFormat="true" mode="international" :dropdownOptions="{
      showDialCodeInSelection: true,
      showFlags: true,
      showDialCodeInList: true,
      showSearchBox: true,
      styleClasses: 'w-full rounded-lg border border-[var(--color-border)] px-4 py-2 bg-white dark:bg-gray-800'
    }" :inputOptions="{
        showDialCode: true,
        placeholder: 'ادخل رقم الجوال',
        type: 'tel',
        styleClasses: 'w-full rounded-lg border border-[var(--color-border)] px-4 py-2 '
      }" v-model="inputValue" @on-input="handlePhoneInput" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from 'vue';

const VueTelInput = defineAsyncComponent(() =>
  import('vue-tel-input').then(m => {
    import('vue-tel-input/vue-tel-input.css');
    return m.VueTelInput;
  })
);

/** Bound to parent v-model: formatted number (spaces stripped) */
const model = defineModel<string>({ default: '' });

/** Internal value for vue-tel-input (display / parsing) */
const inputValue = ref(model.value || '');

watch(
  model,
  (val) => {
    const next = val || '';
    if (next !== inputValue.value) inputValue.value = next;
  },
  { immediate: true }
);

const handlePhoneInput = (value: string, phoneObject: { formatted?: string } | undefined) => {
  const formatted =
    phoneObject?.formatted?.replace(/\s+/g, '') ?? String(value ?? '').replace(/\s+/g, '');
  model.value = formatted;
};
</script>
