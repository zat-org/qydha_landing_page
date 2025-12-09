<template>
  <UCard v-if="tour" :ui="{ root: 'flex flex-col h-full ' }">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <UButton icon="i-heroicons-arrow-right" label="عوده" variant="ghost" color="neutral"
            @click="router.back()" />
          <h1 class="text-2xl font-bold">     
          <span>الحكام</span>
          ({{ refreesNumber }})
        </h1>
        </div>

      <UButton label="اضافة حكم " @click="openAddModal" icon ="material-symbols:add"/>

      </div>
    </template>

    <UTable :data="refrees" :columns="cols" >
      <template #actions-cell="{row}">
        <UButton icon="material-symbols:delete" color="error" @click="deleteref(row.original)"/>
      </template>
    </UTable>
    
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
const router = useRouter()
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

const refreesNumber = computed(() => {
  return refrees.value?.length || 0
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