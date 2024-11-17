<template>
  <UModal prevent-close :ui="{width:'sm:max-w-[800px] w-[800px]'}">
    <UCard>
      <template #header>
     اضافة كود
      </template>
      <UForm :state="state" :schema="schema" ref="CodeForm" @submit="onSubmit" class="grid grid-cols-2  gap-2">
       
       <div class="">
         <UFormGroup label="الكود" name="code">
           <UInput v-model="state.code" />
         </UFormGroup>
         <UFormGroup label="الفئة" name="categoryId">
           <USelectMenu  v-model="state.categoryId" :options="categoryies" option-attribute="categoryName" value-attribute="id"   />
         </UFormGroup>
         
         <UFormGroup label="عدد الايام" name="numberOfDays">
           <UInput v-model="state.numberOfDays" type="number" />
         </UFormGroup>

         <UFormGroup label="عدد مرات الاستخدام" name="maxInfluencedUsersCount">
           <UInput v-model="state.maxInfluencedUsersCount" type="number" />
         </UFormGroup>
       </div>
       <UFormGroup label="تاريخ الانتهاء" name="expireAt" class="grid place-content-center">

        <VueDatePicker v-model="state.expireAt" :enable-time-picker="false" dir="ltr" position="right" />
        </UFormGroup>

      </UForm>

      <template #footer>
        <div class="flex justify-between">
          <UButton label="اضافة" color="green" @click="CodeForm?.submit()"></UButton>
          <UButton label=" عودة" color="red" @click="modal.close()" ></UButton>
        </div>
      </template>

    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import {string,object,number,date} from 'yup'
import type { InfluncerCodeCreate } from '~/models/influncerCode';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const modal =useModal()
const toast =useToast()

// refs
const CodeForm =ref<HTMLFormElement>()
const state = reactive<InfluncerCodeCreate>({
  code:"",
  categoryId:0,
  numberOfDays:10,
  expireAt:new Date(),
  maxInfluencedUsersCount:1

})
const   schema =object({
  code:string().required(),
  categoryId:number(),
  numberOfDays:number().required(),
  expireAt:date().required().min(new Date() ,'برجاء ادخال اليوم او تاريخ بعده'),
  maxInfluencedUsersCount:number().required()
})

// submit add new influncer code  
const influncerAPI = useInfluncerCode()
const addREQ = await influncerAPI.addInfCode()
const onSubmit =async()=>{
  await addREQ.fetchREQ(state)
  if (addREQ.status.value == "success" ){
    toast.add({title:'تم اضافة الكود بنجاح'})
    modal.close()
  }

}
// catergory options 
const categoryAPI =useCategory()
const getREQ= await categoryAPI.getAllcategory() 
const categoryies = computed (()=>{
 return getREQ.data.value?.data 
 
})
</script>

<style>

</style>