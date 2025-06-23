<template>
  <ClientOnly>
    <vue-tel-input v-bind="$attrs" :validCharactersOnly="true" :autoFormat="false" mode="international"
      :dropdownOptions="{
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
      }" :model-value="modelValue" @update:model-value="onInput" @country-changed="onCountryChanged" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineAsyncComponent } from 'vue';

const VueTelInput = defineAsyncComponent(() =>
  import('vue-tel-input').then(m => {
    import('vue-tel-input/vue-tel-input.css');
    // Import CSS only when component is loaded
    return m.VueTelInput;
  })
);

defineProps<{
  modelValue: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

// Track the selected country
const selectedCountry = ref<{ dialCode: string } | null>(null);

function onInput(val: string) {

  if (!val.startsWith('+') && selectedCountry.value) {
    console.log("not start with +");

    console.log(`+${selectedCountry.value.dialCode}${val}`)
    emit('update:modelValue', `+${selectedCountry.value.dialCode}${val}`);
  } else {
    console.log("start with +");
    emit('update:modelValue', val);
  }
}

function onCountryChanged(country: any) {
  selectedCountry.value = country;
  // When country changes, update the phone number with new dial code
  if (selectedCountry.value) {
    // Clear the input and set only the new country code
    emit('update:modelValue', `+${selectedCountry.value.dialCode}`);
  }
}

</script>
