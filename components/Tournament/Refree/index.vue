<template>
  <UCard v-if="tour" :ui="{ root: 'flex flex-col h-full ' }">
    <template #header>
      <p>
        <span class="text-2xl ">
          {{ tour.title }}
        </span>
        /
        <span class="text-2xl text-gray-500">
          الحكام
        </span>
      </p>
    </template>

    <UTable :data="refrees" :columns="cols" >
      <template #actions-cell="{row}">
        <UButton icon="material-symbols:delete" color="error" @click="deleteref(row.original)"/>
      </template>
    </UTable>
    <template #footer>
      <div class="flex justify-between items-center">

        <UButton label="اضافة حكم " @click="openAddModal" icon ="material-symbols:add"/>
        <UButton label="عودة " color="error" @click="navigateTo('/tournament/'+tour_id)" />
      </div>
    </template>
  </UCard>
  <UDrawer v-model:open="isDrawerOpen" title="اضافة حكم" description="اضافة حكم جديد" direction="left"> 
    <template #content>
      <div class="min-w-[600px]">
        <TournamentRefreeAddForm @close="isDrawerOpen = false" />
      </div>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import type { MinUser } from '~/models/user';

const route = useRoute()
const tour_id = route.params.id.toString()
const toast = useToast()
const tourREQ= await useTournament().getSingelTournament(tour_id)
if (tourREQ.status.value =="error"){
navigateTo('/tournament')
}
const isDrawerOpen = ref(false)

const tour = computed(() => {
 if (tourREQ.data.value)
    return tourREQ.data.value.data.tournament
})

const refreeGetREQ = await useTournamentRefree().getTournamentRefree()
await refreeGetREQ.fetchREQ(tour_id)


const refrees = computed(() => {
  if (refreeGetREQ.data.value)
    return refreeGetREQ.data.value.data
})


const cols= [
   {accessorKey:"username",header:"الاسم"},
  {accessorKey:"phone",header:"الهاتف"},
  {accessorKey:"actions",header:"#"},
]

const openAddModal = () => {
  isDrawerOpen.value = true
  // overlay.create(AddModal).open()
}
const refreDeleteREQ = await useTournamentRefree().deleteTourRefree()
const deleteref=async (row:MinUser)=>{
  await refreDeleteREQ.fetchREQ(tour_id , row.id)
  if (refreDeleteREQ.status.value=="success"){
    // refreeGetREQ.fetchREQ(tour_id)
    toast.add({
      title: "تم حذف الحكم بنجاح",
      color: "success",
      icon: "material-symbols:check",
    })
  }
  // if (refreDeleteREQ.status.value=="success"){
  // }
}
</script>

<style></style>