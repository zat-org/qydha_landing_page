<template>
  <UModal>
    <UCard>
      <template #header>
     تعديل فئة
      </template>
      <UForm :state="state" :schema="schema"  ref="CatForm" @submit="onsubmit">
        <UFormGroup label="اسم الفئة" name="categoryName">
          <UInput v-model="state.categoryName" />
        </UFormGroup>
        <UFormGroup label=" عدد مرات الاستخدام" name="maxCodesPerUserInGroup">
          <UInput v-model="state.maxCodesPerUserInGroup" />
        </UFormGroup>
      </UForm>

      <template #footer>
        <div class="flex justify-between">
          <UButton label="تعديل" color="green" @click="CatForm.submit()"></UButton>
          <UButton label=" عودة" color="red" @click="modal.close()" type="button"></UButton>
        </div>
      </template>

    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import {string,object,number,date} from 'yup'
import type { CategoryCreate, ICategory,  } from '~/models/influncerCode';
 const props= defineProps<{cat:ICategory}>()
const modal = useModal()
const CatForm =ref()
const state = reactive<CategoryCreate>({
  categoryName: props.cat.categoryName,
  maxCodesPerUserInGroup: props.cat.maxCodesPerUserInGroup
})
const schema =object({
  categoryName: string().required ("برجاء ادخال اسم الفئة"),
  maxCodesPerUserInGroup: number().required("عدد المرات المتاحة للاستخدام").min(1,"اصغر رقم متاح هو 1")
})
const addCatreq =await useCategory().updateCategry() 
const onsubmit =async()=>{
  await addCatreq.fetchREQ(state,props.cat.id)
  if (addCatreq.status.value == "success"){
    modal.close()
    refreshNuxtData("getAllcategory")
  }
}
</script>

<style>

</style> 