<template>
  <UModal>
    <UCard>
      <template #header>
     اضافة كود
      </template>
      <UForm :state="state" :schema="schema">
        <UFormGroup label="الكود" name="code">
          <UInput v-model="state.code" />
        </UFormGroup>
      </UForm>

      <template #footer>
        <div class="flex justify-between">
          <UButton label="اضافة" color="green"></UButton>
          <UButton label=" عودة" color="red"></UButton>
        </div>
      </template>

    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import {string,object,number,date} from 'yup'
import type { InfluncerCodeCreate } from '~/models/influncerCode';
const state = reactive<InfluncerCodeCreate>({
  code:"",
  categoryId:0,
  numberOfDays:10,
  expireAt:new Date(),
  maxInfluencedUsersCount:1

})
const   schema =object({
  code:string().required(),
  categoryId:number().required(),
  numberOfDays:number().required(),
  expireAt:date().required().min(new Date() ,'برجاء ادخال اليوم او تاريخ بعده'),
  maxInfluencedUsersCount:number().required()
})
</script>

<style>

</style>