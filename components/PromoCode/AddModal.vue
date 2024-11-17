<template>
  <UModal class="w-[400px]" prevent-close>
    <UCard >
      <template #header>
        اضافة كود جديد
      </template>
      <UForm :state="state" :schema="schema" ref="Form" class="flex gap-2"  @submit="onsubmit">
        <div class="flex flex-col gap-5   ">

          <UFormGroup label="الكود" name="code" >
            <UInput v-model="state.code" />
          </UFormGroup>
          <UFormGroup label="المستخدم" name="userId" >
            <USelectMenu v-model="state.userId"  :options="users"  :searchable="search" option-attribute="username"
            :search-attributes="['username']"
              value-attribute="id" :loading="getUsersREQ.status.value == 'pending'" />
          </UFormGroup>
          <UFormGroup label="عدد الايام" name="numberOfDays">
            <UInput v-model="state.numberOfDays" />
          </UFormGroup>
        </div>
        <UFormGroup label="تاريخ الانتهاء" name="expireAt">
          <VueDatePicker v-model="state.expireAt" :enable-time-picker="false" dir="ltr" position="right" />


          
        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="flex justify-between">

          <UButton label="اضافة"@click="Form?.submit" />
          <UButton label=" خروج" @click="modal.close()" color="red"/>
        </div>

      </template>
    </UCard>
  </UModal>
</template>


<script lang="ts" setup>

import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import { object, string, number ,date} from 'yup'
import type { IPromoCodeCreate } from '~/models/PromoCode';
const Form =ref<HTMLFormElement>()
const modal =useModal()
const toast =useToast()
const getUsersREQ = await useUsers().getAllUsers()
await getUsersREQ.fetchREQ('')

const addREQ =await usePromoCode().addPromoCodes()

const users = computed(() => {
  return getUsersREQ.data.value?.data.items
})
const search = async (q: string) => {
  await getUsersREQ.fetchREQ(q)
  console.log(users.value)
  return users.value!
}

const state = reactive<IPromoCodeCreate>({
  code: "",
  userId: "",
  numberOfDays: 10,
  expireAt: new Date( new Date().getTime() + (24*60*60*1000))
})

// Create a new date for tomorrow by adding one day (24 hours in milliseconds)
const schema = object({
  code: string().required(),
  userId: string().required(),
  numberOfDays: number().required(),
  expireAt: date().required().min(new Date( new Date().getTime() + (24*60*60*1000)) ,'برجاء ادخال اليوم او تاريخ بعده')
})

const onsubmit=async ()=>{
    await addREQ.fetchREQ(state)
    if(addREQ.status.value=="success"){
      toast.add({title:'تم اضافة كود بنجاح'})
      modal.close()
    }
}

</script>

<style></style>