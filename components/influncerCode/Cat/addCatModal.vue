<template>
  <UModal title="اضافة فئة" description="اضافة فئة" prevent-close>
    <template #body>      
      <UForm :state="state" :schema="schema"  ref="CatForm" @submit="onsubmit">
        <UFormField label="اسم الفئة" name="categoryName">
          <UInput v-model="state.categoryName" />
        </UFormField>
        <UFormField label=" عدد مرات الاستخدام" name="maxCodesPerUserInGroup">
          <UInput v-model="state.maxCodesPerUserInGroup" />
        </UFormField>
      </UForm>
    </template>
      
      <template #footer>
        <div class="flex justify-between">
          <UButton label="اضافة" color="primary" @click="CatForm.submit()"></UButton>
          <UButton label=" عودة" color="error" @click="emit('close')" type="button"></UButton>
        </div>
      </template>

  </UModal>
</template>

<script lang="ts" setup>
import {string,object,number,date} from 'yup'
import type { CategoryCreate,  } from '~/models/influncerCode';
const emit = defineEmits(['close'])

const CatForm =ref()
const state = reactive<CategoryCreate>({
  categoryName: "",
  maxCodesPerUserInGroup: 1
})
const schema =object({
  categoryName: string().required ("برجاء ادخال اسم الفئة"),
  maxCodesPerUserInGroup: number().required("عدد المرات المتاحة للاستخدام").min(1,"اصغر رقم متاح هو 1")
})
const addCatreq =await useCategory().AddCategry() 
const onsubmit =async()=>{
  await addCatreq.fetchREQ(state)
  if (addCatreq.status.value == "success"){
    emit('close')
    refreshNuxtData("getAllcategory")
  }
}
</script>

<style>

</style> 