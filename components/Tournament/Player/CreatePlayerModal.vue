<template>
  <UModal preventClose>
    <UCard>
      <template #header>

      </template>
      <UForm :state="state" :schema="schema" ref="PlayerForm" @submit="onSubmit">
        <UFormGroup label="اسم الاعب" name="name">
          <UInput v-model="state.name"></UInput>
        </UFormGroup>
        <UFormGroup label="الايميل" name=" email'">
          <UInput v-model="state.email"></UInput>
        </UFormGroup>
        <UFormGroup label="رقم الهاتف" name="phone">
          <vue-tel-input mode="auto" :autoFormat="false" dir="ltr" :validCharactersOnly="true"
            :autoDefaultCountry="true" :inputOptions="{ showDialCode: true, showFlags: true }"
            invalidMsg="this phone is invalid "
            :dropdownOptions="{ showDialCodeInSelection: true, showFlags: true, showSearchBox: true }"
            v-model="state.phone"></vue-tel-input>
        </UFormGroup>
        <UFormGroup label="اسم المستخدم علي قيدها" name="qydhaUsername">
          <UInput v-model="state.qydhaUsername"></UInput>
        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton label="Add" @click="PlayerForm?.submit()" />
          <UButton label="close" @click="modal.close()" color="red" />
        </div>

      </template>

    </UCard>
  </UModal> 
</template>

<script lang="ts" setup>
import { array, object, string } from 'yup';
import type { IPlayerCreate } from '~/models/tournamentTeam';
import { type Form } from "#ui/types"
// const props = defineProps<{ teamId: number }>()
import "vue-tel-input/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";
const PlayerForm = ref<Form<IPlayerCreate>>()
const modal =useModal()
const state = reactive<IPlayerCreate>({ name: '', phone: '', email: '', qydhaUsername: '' }
)
const schema = object({
  name: string().required("برجاء ادخال اسم اللاعب").min(4, 'اقل عدد للحروف 4'),
  phone: string().required("برجاء ادخال رقم الهاتف").min(11, 'يجب ان يكون رقم الهاتف صحيح'),
  email: string().email(" برجاء ادخال البريد الالكتروني بشكل صحيح ").required(" برجاء ادخال البريد الالكتروني   "),
  qydhaUsername: string()
})
const route = useRoute()
const tour_id = route.params.id.toString()
const addPlayerREQ = await useTournamentPlayer().addPlayer()
const onSubmit = async () => {
  await addPlayerREQ.fetchREQ(tour_id, state)
  if (addPlayerREQ.status.value =="success"){
    modal.close()
  }

  if (addPlayerREQ.status.value == "error" && addPlayerREQ.error.value) {
    if (addPlayerREQ.error.value.statusCode == 400) {
      Object.entries(addPlayerREQ.error.value.data?.errors!).forEach(e => {
        PlayerForm.value?.setErrors([{ path: e[0].toLowerCase(), message: e[1][0] }])
      })
    }
    if (addPlayerREQ.error.value.statusCode == 404 && addPlayerREQ.error.value.data?.code=='EntityNotFound' ) {
      PlayerForm.value?.setErrors([{path:'qydhaUsername',message:'هذا المستخدم غير موجود'}])
    }

  }
}

</script>

<style></style>