<template>
  <UModal class="w-[400px]" prevent-close>
    <UCard >
      <template #header>
        اضافة كود جديد
      </template>
      <UForm :state="state" :schema="schema" ref="Form" class="flex gap-2"  @submit="onsubmit">
        <div class="flex flex-col gap-5 items-center justify-center  ">

          <UFormGroup label="الكود" name="code" >
            <UInput v-model="state.code" />
          </UFormGroup>
          <UFormGroup label="المستخدم" name="userId">
            <UInputMenu v-model="state.userId" :options="users" :search="search" option-attribute="username"
              value-attribute="id" :loading="getUsersREQ.status.value == 'pending'" />
          </UFormGroup>
          <UFormGroup label="عدد الايام" name="numberOfDays">
            <UInput v-model="state.numberOfDays" />
          </UFormGroup>
        </div>
        <UFormGroup label="تاريخ الانتهاء" name="expireAt">
          <VDatePicker  dir="ltr" title-position="left" v-model="state.expireAt" mode="date" :popover="{ visibility: 'click' }">
          </VDatePicker>
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
import { object, string, number ,date} from 'yup'
import type { IPromoCodeCreate } from '~/models/PromoCode';
const Form =ref<HTMLFormElement>()
const modal =useModal()
const getUsersREQ = await useUsers().getAllUsers()
await getUsersREQ.fetchREQ('')

const addREQ =await usePromoCode().addPromoCodes()

const users = computed(() => {
  return getUsersREQ.data.value?.data.items
})
const search = async (q: string) => {
  await getUsersREQ.fetchREQ(q)
  return users.value!
}

const state = reactive<IPromoCodeCreate>({
  code: "",
  userId: "",
  numberOfDays: 10,
  expireAt: new Date()
})
const schema = object({
  code: string().required(),
  userId: string().required(),
  numberOfDays: number().required(),
  expireAt: date().required().min(new Date() ,'برجاء ادخال اليوم او تاريخ بعده')
})

const onsubmit=async ()=>{
    await addREQ.fetchREQ(state)
  
}

</script>

<style></style>