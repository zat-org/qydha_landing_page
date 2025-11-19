<template>
  <ClientOnly>
    <VueTelInput v-bind="$attrs" :validCharactersOnly="true" :autoFormat="false" mode="international"
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
import { defineAsyncComponent } from 'vue';

const VueTelInput = defineAsyncComponent(() =>
  import('vue-tel-input').then(m => {
    import('vue-tel-input/vue-tel-input.css');
    // Import CSS only when component is loaded
    return m.VueTelInput;
  })
);

// Use defineModel for proper v-model handling
const modelValue = defineModel<string>({ default: '' });

// const output = 

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
    // console.log('AsyncPhoneInput: Converted Arabic/Persian numerals to Latin:', input, '->', converted);
  }

  return converted;
}

const selectedCountry=ref()
function onInput(val: string) {
  // Convert Arabic numerals to Latin numerals first
  const convertedVal = convertArabicToLatinNumerals(val);

  if (!convertedVal.startsWith('+') && selectedCountry.value) {
    // console.log("not start with +");
    // console.log(`+${selectedCountry.value.dialCode}${convertedVal}`)
    modelValue.value =`+${selectedCountry.value.dialCode}${convertedVal}`;
  } else {
    // console.log("start with +");
    // console.log(selectedCountry.value.dialCode)
    modelValue.value =`${convertedVal}`;

    // emit('update:modelValue', convertedVal);
  }
}


function onCountryChanged(country: any) {
  selectedCountry.value = country;
  
  // DON'T reset the value here if it already exists and starts with +
  // Only set country code if the current value is empty or doesn't have a country code
  if (selectedCountry.value) {
    if (!modelValue.value || (!modelValue.value.startsWith('+') && modelValue.value.length === 0)) {
      // Only set to country code if there's no existing value
      modelValue.value = `+${selectedCountry.value.dialCode}`;
    }
    // Otherwise, keep the existing value - vue-tel-input already has the correct country selected
  }
}

</script>
