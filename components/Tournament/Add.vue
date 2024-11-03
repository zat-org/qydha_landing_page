<template>

  <UForm :state="state" :schema="schema" @submit="onSubmit">
    <UCard>
      <template #header>
        <h1 class="text-2xl">اضافة بطولة جديدة</h1>
      </template>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton type="submit" label="اضافة" />
          <UButton type="button" label="عودة" color="red" @click="navigateTo('/tournament')" />
        </div>

      </template>

      <div class="flex   gap-2">
        <div class="grow flex flex-col gap-2 ">
          <UFormGroup name="name" label="الاسم">
            <UInput v-model="state.name" />
          </UFormGroup>
          <UFormGroup name="description" label="الوصف">
            <UTextarea v-model="state.description" />
          </UFormGroup>
          <!-- dates -->
          <div class="flex gap-2">
            <UFormGroup name="startAt" label="تبداء" class="grow">
              

              <VueDatePicker v-model="state.startAt" :enable-time-picker="false" dir="ltr" position="right" />
            </UFormGroup>


            <UFormGroup name="endAt" label="تنتهي" class="grow">
             
<VueDatePicker v-model="state.endAt" :enable-time-picker="false" dir="ltr" position="right" />
            </UFormGroup>

          </div>
          <div class="flex gap-2">
            <UFormGroup class="grow" name="ownerId" label="المالك">
              <UInputMenu v-model="state.ownerId" :options="users" :search="search" option-attribute="username"
                value-attribute="id" :loading="allUsersREQ.status.value == 'pending'" />
            </UFormGroup>

            <UFormGroup class="grow" name="city" label="المدينة">
              <UButtonGroup size="sm" orientation="horizontal" class="flex">
                <UInput v-model="state.city" class="grow" />

                <UButton label="اختر الموقع"
                  :color="state.location.latitude && state.location.longitude ? 'green' : 'red'" @click="getLocation" />
              </UButtonGroup>

            </UFormGroup>

          </div>

          <!-- prizes -->
          <div class="flex flex-col gap-5 ">
            <div class="flex items-end gap-2 ">
              <UFormGroup name="prizesCurrency" label="عملة المكافئة" class="grow">
                <UButtonGroup size="sm" orientation="horizontal">
                  <UInput v-model="state.prizesCurrency" />
                  <UButton icon="ic:baseline-plus" @click="state.prizes.push('')" label="اضافة مركز" />
                </UButtonGroup>
              </UFormGroup>

            </div>
            <div class="flex justify-start items-start   flex-wrap  flex-grow-0  basis-[100px] overflow-y-auto      ">

              <UFormGroup v-for="(p, index) in state.prizes" :name="'prizes[' + index + ']'"
                :label="'المركز' + (index + 1)">

                <UButtonGroup orientation="horizontal" class="flex w-[150px]">
                  <UBadge :label="index + 1" color="blue" />
                  <UInput v-model="state.prizes[index]" class="grow " />
                  <UButton color="red" icon="material-symbols:close" @click="state.prizes.splice(index, 1)"></UButton>
                </UButtonGroup>

              </UFormGroup>
            </div>
          </div>
        </div>
      </div>
    </UCard>
  </UForm>


</template>

<script lang="ts" setup>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import "leaflet/dist/leaflet.css";
import { object, string, number, array } from 'yup'
import type { ITournamentCreate } from '~/models/tournament';
import { MapInputModal } from "#components"
const modal = useModal()
const state = reactive<ITournamentCreate>({
  name: "",
  description: "",
  city: "",
  location: { longitude: 0, latitude: 0 },
  prizes: ["100000"],
  prizesCurrency: "ريال",
  startAt: new Date(),
  endAt: new Date(),
  ownerId: ""
})
const schema = object({
  name: string().required("برجاء ادخال الاسم"),
  description: string().required("برجاء ادخال الوصف"),
  city: string().required("برجاء ادخال المدينة"),
  location: object({ longitude: number(), latitude: number() }),
  prizes: array().of(string().required("برجاء ادخال قيمة الجائزة")),
  prizesCurrency: string().required("برجاء ادخال عملة الجائزة"),
  startAt: string().required("برجاء ادخال تاريخ البداية").test(
    'is-valid-range',
    'تاريخ البداية يجب أن يكون قبل تاريخ الانتهاء',
    function (value) {
      const { endAt } = this.parent;
      return !endAt || new Date(value) <= new Date(endAt);
    })
  ,
  endAt: string().required("برجاء ادخال تاريخ الانتهاء"),
  ownerId: string().required("برجاء ادخال مالك البطولة")
})

const tournamentApi = useTournament()
const createREQ = await tournamentApi.createTournament()
const userApi = useUsers()
const allUsersREQ = await userApi.getAllUsers()
await allUsersREQ.fetchREQ("")
const users = computed(() => {
  return allUsersREQ.data.value?.data.items
})
const search = async (q: string) => {
  await allUsersREQ.fetchREQ(q)
  return users.value!
}
const onSubmit = async () => {

  // Object.assign(readystate,state)
  await createREQ.fetchREQ(state)
  if (createREQ.status.value == "success") { return navigateTo("/tournament") }
  else if (createREQ.status.value == "error") {
    console.log(createREQ.error.value)
  }
}


const getLocation = () => {
  modal.open(MapInputModal, {
    onSuccess(lat: number, log: number) {
      state.location.latitude = lat
      state.location.longitude = log
      modal.close()
    }
  })
}
</script>

<style scoped></style>