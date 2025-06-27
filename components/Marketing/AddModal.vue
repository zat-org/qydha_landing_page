<template>
  <UModal prevent-close>
    <UCard :ui="{ base: 'px-5 py-2' }">
      <UForm :state="state" :schema="schema" ref="AddForm" @submit="onSubmit" class=" flex flex-col gap-5 ">
        <UFormField label="النموذج" name="templateName">
          <USelectMenu
            v-model="state.templateName"
            :options="templates"
          ></USelectMenu>
        </UFormField>
<div class="flex gap-2 justify-between items-center" >
  
  <UFormField label="رقم الهاتف" name="phonesNumbers">
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
      @country-changed="phoneChanged"
      @keydown.enter.prevent="AddphoneNumber"
      v-model="phoneinput"
    ></vue-tel-input>
  </UFormField>
  <UButton type="button" label="add phone" @click="AddphoneNumber" class="h-full" />
</div>

        <div dir="ltr"
          class="h-40 w-full overflow-y-auto p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="(ph, index) in state.phonesNumbers"
              :key="index"
              :label="ph"
              class="flex items-center gap-2 px-3 py-1.5"
            >
              {{ ph }}

              <button
                type="button"
                @click="() => state.phonesNumbers.splice(index, 1)"
                class="ml-2 hover:text-red-500 duration-300 transition-all"
              >
                <IconDelete class="text-xl"></IconDelete>
              </button>
            </UBadge>
          </div>
        </div>
        <UFormField label="الرقم المرسل " name="senderPhone">
          <USelect
            :options="phoneOptions"
            v-model="state.senderPhone"
          ></USelect>
        </UFormField>
      </UForm>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton label="اضافة" @click="AddForm?.submit()" />
          <UButton label="اغلاق" color="red" @click="emit('close')" />
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { array, object, string } from "yup";
import { senderPhone, type WhatsappMessageCreateI } from "~/models/marketing";

import "vue-tel-input/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";
const AddForm = ref<any>();
const phoneOptions = senderPhone;
const emit = defineEmits(['close'])
const toast =useToast()
const phoneinput = ref();
const lastCode = ref();
const getTemplateREQ = await useMarketing().getTemplates();
await getTemplateREQ.fetchREQ();
const templates = computed(() => {
  // return ["temp1", "temp2", "temp3"];
  return getTemplateREQ.data.value?.data;
});
const state = reactive<WhatsappMessageCreateI>({
  templateName: "",
  phonesNumbers: [],
  senderPhone: "Qydha",
});
const schema = object({
  templateName: string().required("برجاء اختيار اسم التيمبلت"),
  phonesNumbers: array()
    .of(string().required())
    .min(1, "برجاء ادخال رقم هاتف واحد علي الاقل"),
  senderPhone: string().required(),
});
const AddphoneNumber = () => {
  if (phoneinput.value.length < 7) {
    AddForm.value?.setErrors([
      { message: "phone error ", path: "phonesNumbers" },
    ]);
  } else {
    const phoneSelected = state.phonesNumbers.find(
      (t) => t == phoneinput.value
    );
    if (!phoneSelected) {
      state.phonesNumbers.push(phoneinput.value);
    }

    phoneinput.value = `+${lastCode.value}`;
  }
};
const phoneChanged = (event: { dialCode: string }) => {
  console.log(event.dialCode);
  lastCode.value = event.dialCode;
};
const AddREQ= await useMarketing().addWhatsAppMessage()
 
const onSubmit=async ()=>{
 await AddREQ.fetchREQ(state)
 if (AddREQ.status.value=="success" ){
   toast.add({title:"message send successfuly "})
   emit('close')
 }
 if (AddREQ.status.value=="error" ){
   toast.add({title:"message send successfuly "})
   console.log(AddREQ.error.value)
 }
}
</script>

<style></style>
