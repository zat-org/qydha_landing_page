<template>

  <UForm :state="state" :schema="schema" @submit="onSubmit">
    <UCard>
      <template #header>
        <h1 class="text-2xl">اضافة بطولة جديدة</h1>
      </template>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton type="submit" label="اضافة" />
          <UButton type="button" label="عودة"  color="red" @click="navigateTo('/tournament')"/>
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
            <VDatePicker v-model="state.startAt" >
            </VDatePicker>
          </UFormGroup>
            

          <UFormGroup name="endAt" label="تنتهي" class="grow">
            <VDatePicker v-model="state.endAt">
             </VDatePicker>
            </UFormGroup>

          </div>
          <div class="flex gap-2">
         
            <UFormGroup class="grow" name="ownerId" label="المالك">
              <UInputMenu v-model="state.ownerId" :options="users" :search="search" option-attribute="username"
                value-attribute="id" :loading="allUsersREQ.status.value == 'pending'"
               />
            </UFormGroup>

            <UFormGroup class="grow" name="city" label="المدينة">
              <UButtonGroup size="sm" orientation="horizontal" class="flex">
                <UInput v-model="state.city"  class="grow"/>

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

              <UFormGroup v-for="(p, index) in state.prizes" :name="'prizes['+ index +']'" 
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
import "leaflet/dist/leaflet.css";
import { object, string, number, array } from 'yup'
import type { ITournament, ITournamentCreate } from '~/models/tournament';
import { MapInputModal } from "#components"
const props = defineProps<{tournament :ITournament}>()
const modal = useModal()

console.log( new Date (props.tournament.startAt)  )
console.log(new Date (props.tournament.endAt)  )


const state = reactive<ITournamentCreate>({
  name: props.tournament.name,
  description: props.tournament.description,
  city: props.tournament.city,
  location: { longitude: 0, latitude: 0 },
  prizes: props.tournament.prizes,
  prizesCurrency: props.tournament.prizesCurrency,
  startAt: new Date( ),
  endAt: new Date(props.tournament.endAt ),
  ownerId: props.tournament.owner.id
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



const tournamentApi =useTournament()
const updateREQ = await tournamentApi.updateTour()
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
const onSubmit = async() => {
  

  await updateREQ.fetchREQ(props.tournament.id.toString() ,state)
  if (updateREQ.status.value=="success"){return navigateTo("/tournament")} 
  else if (updateREQ.status.value=="error"){
    console.log(updateREQ.error.value)
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