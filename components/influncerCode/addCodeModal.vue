<template>
  <UModal title="اضافة كود" description="اضافة كود" prevent-close class="max-w-2xl h-[80vh]" >
      <template #body>
        <UForm :state="state" :schema="schema" ref="CodeForm" @submit="onSubmit" class="grid grid-cols-2  h-full  gap-4" >
          
         <div class="flex flex-col gap-4 justify-around ">
           <UFormField label="الكود" name="code">
             <UInput v-model="state.code" />
           </UFormField>
           <UFormField label="الفئة" name="categoryId" class="w-full">
             <USelectMenu  v-model="state.categoryId" :items="categoryies"  value-key="id"  class="w-[80%]"   />
           </UFormField>
           
           <UFormField label="عدد الايام" name="numberOfDays">
             <UInput v-model="state.numberOfDays" type="number" />
           </UFormField>
  
           <UFormField label="عدد مرات الاستخدام" name="maxInfluencedUsersCount">
             <UInput v-model="state.maxInfluencedUsersCount" type="number" />
           </UFormField>
         </div>
         <UFormField label="تاريخ الانتهاء" name="expireAt" class="">
          <VueDatePicker v-model="state.expireAt" :enable-time-picker="false" dir="ltr" position="right"/>
          </UFormField>
  
        </UForm>
      </template>

      <template #footer>
        <div class="flex justify-between">
          <UButton label="اضافة" color="primary" @click="CodeForm?.submit()"></UButton>
          <UButton label=" عودة" color="error" @click="emit('close')" ></UButton>
        </div>
      </template>

  </UModal>
</template>

<script lang="ts" setup>
import {string,object,number,date} from 'yup'
import type { InfluncerCodeCreate } from '~/models/influncerCode';

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const emit = defineEmits(['close'])
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
    emit('close')
  }

}
// catergory options 
const categoryAPI =useCategory()
const getREQ= await categoryAPI.getAllcategory() 
const categoryies = computed (()=>{
 return getREQ.data.value?.data.map((cat)=>({
  label:cat.categoryName,
  id:cat.id
 }))
 
})


</script>

<style>

</style>