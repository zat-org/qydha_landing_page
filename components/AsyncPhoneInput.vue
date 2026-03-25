<template>
  <ClientOnly>
    <VueTelInput v-bind="$attrs" :validCharactersOnly="true" :autoFormat="false" mode="international" :dropdownOptions="{
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
      }" v-model="modelValue" @on-input="handlePhoneInput" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue';

const VueTelInput = defineAsyncComponent(() =>
  import('vue-tel-input').then(m => {
    import('vue-tel-input/vue-tel-input.css');
    return m.VueTelInput;
  })
);
const formatedvalue = defineModel<string>({ default: '' });
// Use defineModel for proper v-model handling
const modelValue = ref('');

const handlePhoneInput = (value: any, phoneObject: any) => {
  formatedvalue.value = phoneObject.formatted.replace(/\s+/g, '');
}
</script>
