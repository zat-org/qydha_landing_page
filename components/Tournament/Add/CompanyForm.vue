<template>
        <UFormGroup
          :ui="{ error: 'text-xs' }"
          label="اسم الشركة المؤسسة "
          name="CompanyName"
        >
          <UInput :ui="{ base: 'form-input' }" v-model="modelValue.CompanyName" />
        </UFormGroup>
        <UFormGroup
          :ui="{ error: 'text-xs' }"
          label="رقم السجل التجاري "
          name="RegisterNumber"
        >
          <UInput
            :ui="{ base: 'form-input' }"
            v-model.number="modelValue.RegisterNumber"
          />
        </UFormGroup>
        <UFormGroup
          :ui="{ error: 'text-xs' }"
          label="رقم التواصل مع المؤسسة"
          name="CompanyPhoneNumber"
        >
        <vue-tel-input
      mode="auto"
      :autoFormat="true"
      dir="ltr"
      :validCharactersOnly="true"
      :autoDefaultCountry="true"
      :inputOptions="{ showDialCode: true, showFlags: true }"
      invalidMsg="this phone is invalid "
      :dropdownOptions="{
        showDialCodeInSelection: true,
        showFlags: true,
        showSearchBox: true,  
      }"      
      v-model="modelValue.CompanyPhoneNumber"
    ></vue-tel-input>
          <!-- <UInput
            :ui="{ base: 'form-input' }"
            v-model.number="modelValue.CompanyPhoneNumber"
          /> -->
        </UFormGroup>
       
</template>

<script lang="ts" setup>
import "vue-tel-input/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";
import {
  object,
  string,
  number,
  ValidationError,
  date,
  boolean,
  array,
} from "yup";


const props = defineProps<{
  modelValue: {
    CompanyName: string
    RegisterNumber: string
    CompanyPhoneNumber: string
  }
}>()

const emit = defineEmits(['update:modelValue'])

</script>

<style>

</style>