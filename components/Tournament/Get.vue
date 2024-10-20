<template>
  <UCard :ui="{ base: 'flex flex-col h-full grow mx-[20px]', body: { base: 'flex-1' } }">
    <div class="flex flex-col ">
      <div class="flex justify-between  items-center px-5">
        <img
          :src="tour.logoUrl ? tour.logoUrl : 'https://th.bing.com/th/id/OIP.PAlqgKSssv6ig-bjh9KEtwHaO8?rs=1&pid=ImgDetMain'"
          class="w-[100px] ">
        <div class="flex flex-col justify-center ml-auto mr-[10px]">
          <p> الاسم :{{ tour.name }}</p>
          <p> الوصف : {{ tour.description }}</p>
          <p>المدينة : {{ tour.city }}</p>
          <p> التاريخ : {{ new Date(tour.startAt).toLocaleDateString() }} - {{ new Date(tour.endAt).toLocaleDateString()
            }}</p>
          <!-- <p> {{ tour.ownerId }}</p>       -->
        </div>
        <Map v-model:lat="tour.location.latitude" v-model:log="tour.location.longitude"></Map>
      </div>
      <div>
        <UTabs :items="items" class="w-full">
          <template #prizes>
            <div class="p-5 grid  place-content-center">
              <p v-for="(prize, index) in tour.prizes"> المركز{{ index + 1 }} : {{ prize }} {{ tour.prizesCurrency }}</p>
              <div v-if="tour.prizes.length == 0"> لا توجد جوائز</div>
            </div>
          </template>
          <template #refer>
            <div class="p-5 grid  place-content-center">
              <p v-for="(refre, index) in tour.referees"> {{ refre }} </p>
              <div v-if="tour.referees.length == 0"> لا يوجد حكام</div>
            </div>
          </template>
          <template #mod>
            <div class="p-5 grid  place-content-center">
              <p v-for="(mod, index) in tour.moderators">  {{ mod }} </p>
              <div v-if="tour.moderators.length == 0"> لا يوجد مسؤوليين</div>
            </div>
          </template>


        </UTabs>

      </div>
    </div>
    <template #footer>
      <div class="flex justify-between">
        <UButton label="عودة" color="red" @click="navigateTo('/tournament')" />
        <UButton label="خريطة البطولة" :to="'/tournament/' + id + '/bracket'" class="mr-auto ml-[10px]" icon="mdi:bracket" target="_blank" />
        <!-- <UButton color="yellow" label="تعديل" icon="weui:setting-filled"
           @click="openEdit" v-if="privilege?.toLowerCase() =='admin' || privilege?.toLowerCase() =='owner' || permissions.includes('')" /> -->

           <UButton color="yellow" label="تعديل" icon="weui:setting-filled"
          :to="'/tournament/'+id+'/edit'" v-if="privilege?.toLowerCase() =='admin' || privilege?.toLowerCase() =='owner' || permissions.includes('ModifyTournamentData')" />


      </div>
    </template>

  </UCard>


</template>

<script lang="ts" setup>
import TournamentEditModal  from './EditModal.vue';
import { useMyAuthStore } from '~/store/Auth';

const userStore = useMyAuthStore()
const { permissions, privilege } = storeToRefs(userStore)

const props = defineProps<{ id: number }>()
const modal =useModal()
const tourApi = useTournament()
const qydhaToggle = await tourApi.updatTourQydhaAndOwner()
const getREQ = await tourApi.getTourById()
await getREQ.fetchREQ(props.id)
if (getREQ.status.value =="error")navigateTo("/tournament")
const tour = computed(() => {
  return getREQ.data.value?.data!
})

const items = [
  { slot: 'prizes', label: 'الجوائز' },
  { slot: 'refer', label: 'الحكام' },
  { slot: 'mod', label: 'المسؤوليين' },
]
const updateQydha = async () => {
  await qydhaToggle.fetchREQ(!tour.value.showInQydha, tour.value.owner.id, tour.value.id)
  if (qydhaToggle.status.value == "success") {
    await getREQ.fetchREQ(props.id)
  }
}
const openEdit =()=>{
  modal.open(TournamentEditModal,{tour:tour.value})
}
</script>

<style></style>