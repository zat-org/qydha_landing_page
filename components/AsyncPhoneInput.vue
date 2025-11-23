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
import { defineAsyncComponent, ref } from 'vue';

const VueTelInput = defineAsyncComponent(() =>
  import('vue-tel-input').then(m => {
    import('vue-tel-input/vue-tel-input.css');
    // Import CSS only when component is loaded
    return m.VueTelInput;
  })
);

// Use defineModel for proper v-model handling
const modelValue = defineModel<string>({ default: '' });

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

// Extract phone number without dial code
function extractPhoneNumber(phoneValue: string): string {
  if (!phoneValue || !phoneValue.startsWith('+')) {
    return phoneValue;
  }
  
  // Find the first space or extract everything after +
  // vue-tel-input typically formats as +123 4567890
  const spaceIndex = phoneValue.indexOf(' ');
  if (spaceIndex > 0) {
    return phoneValue.substring(spaceIndex + 1);
  }
  
  // If no space, try to extract by finding where dial code ends
  // This is a fallback - we'll use the current selectedCountry to determine
  return phoneValue;
}

const selectedCountry = ref()
function onInput(val: string) {
  // console.log("on input",val)
  // Convert Arabic numerals to Latin numerals first
  const convertedVal = convertArabicToLatinNumerals(val);

  if (!convertedVal.startsWith('+') && selectedCountry.value) {
    // console.log("not start with +");
    // console.log(`+${selectedCountry.value.dialCode}${convertedVal}`)
    modelValue.value = `+${selectedCountry.value.dialCode}${convertedVal}`;
  } else {
    // console.log("start with +");
    // console.log(selectedCountry.value.dialCode)
    modelValue.value = `${convertedVal}`;

    // emit('update:modelValue', convertedVal);
  }
}

function onCountryChanged(country: any) {
  // console.log("country changed",country)  
  const previousCountry = selectedCountry.value;
  selectedCountry.value = country;
  if (selectedCountry.value) {
    if (!previousCountry) {

      // console.log(modelValue)
    //  modelValue.value = `+${modelValue.value}`
      return 
    }

    const newDialCode = `+${selectedCountry.value.dialCode}`; 
    if (!modelValue.value || modelValue.value.length === 0) {
      // If no value, set to new country code
      modelValue.value = newDialCode;
    } else if (modelValue.value.startsWith('+')) {
      // If there's an existing value with a dial code, replace the dial code
      // Extract the phone number part (everything after the dial code)
      let phoneNumber = modelValue.value;
      
      // Remove old dial code if we had a previous country
      if (previousCountry) {
        const oldDialCode = `+${previousCountry.dialCode}`;
        if (phoneNumber.startsWith(oldDialCode)) {
          phoneNumber = phoneNumber.substring(oldDialCode.length).trim();
        }
      } else {
        // Try to extract by finding the first space or by removing common dial codes
        const spaceIndex = phoneNumber.indexOf(' ');
        if (spaceIndex > 0) {
          phoneNumber = phoneNumber.substring(spaceIndex + 1);
        } else {
          // If no space, try to remove any leading + and digits that might be a dial code
          // This is a fallback - remove everything up to first non-digit after +
          const match = phoneNumber.match(/^\+\d{1,4}(.*)$/);
          if (match && match[1]) {
            phoneNumber = match[1];
          } else {
            // If we can't extract, just use the new dial code
            phoneNumber = '';
          }
        }
      }
      
      // Combine new dial code with phone number
      modelValue.value = phoneNumber ? `${newDialCode}${phoneNumber}` : newDialCode;
    } else {
      // If value doesn't start with +, prepend new dial code
      modelValue.value = `${newDialCode}${modelValue.value}`;
    }
  }
}

</script>
