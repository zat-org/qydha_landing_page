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

// const
defineProps<{
  modelValue: string
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>();

// Track the selected country
const selectedCountry = ref<{ dialCode: string } | null>(null);

// Convert Arabic-Indic and Persian numerals to Latin numerals
function convertArabicToLatinNumerals(input: string): string {
  const arabicToLatin: { [key: string]: string } = {
    // Arabic-Indic numerals
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9',
    // Persian numerals
    '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
    '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9'
  };
  
  const converted = input.replace(/[٠-٩۰-۹]/g, (char) => arabicToLatin[char] || char);
  
  // Log when conversion happens for debugging
  if (converted !== input) {
    console.log('AsyncPhoneInput: Converted Arabic/Persian numerals to Latin:', input, '->', converted);
  }
  
  return converted;
}

function onInput(val: string) {
  // Convert Arabic numerals to Latin numerals first
  const convertedVal = convertArabicToLatinNumerals(val);

  if (!convertedVal.startsWith('+') && selectedCountry.value) {
    console.log("not start with +");
    console.log(`+${selectedCountry.value.dialCode}${convertedVal}`)
    emit('update:modelValue', `+${selectedCountry.value.dialCode}${convertedVal}`);
  } else {
    console.log("start with +");
    emit('update:modelValue', convertedVal);
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
