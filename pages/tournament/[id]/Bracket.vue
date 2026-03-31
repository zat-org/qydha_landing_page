<template>
  <div>
    <div class="w-full h-screen">
      <div class="flex flex-col   fixed top-0 left-0 right-0 z-50">

      <UButtonGroup orientation="horizontal" v-if="tourStore.tournament.length > 0" class="flex flex-wrap" >
        <UButton class="basis-[20px] grow" v-for="item in tourStore.tournament" :label="`${item.data.name}`"
          :color="tourStore.selectedGroup?.data.id == item.data.id ? 'success' : 'neutral'" block
          @click="handleGroupSelection(item.data.id.toString())" />
      </UButtonGroup>
      <UButtonGroup orientation="horizontal" v-if="tourStore.rounds.length > 0  && isAdmin" class="flex flex-wrap" >
        <UButton class="basis-[20px] grow" v-for="item in tourStore.rounds" :label="`${item.name}`"
          :color="tourStore.selectedRound?.id == item.id ? 'success' : 'neutral'" block
          @click="tourStore.handleRoundSelection(item.id.toString())" />
      </UButtonGroup>
    </div>
      


      <loading v-if=" tourStore.groupsREQ?.status && tourStore.groupsREQ?.status== 'pending'" />
      <ClientOnly>
        <Bracket v-if="tourStore.selectedGroup" :group="tourStore.selectedGroup.data" />
      </ClientOnly>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { GroupState } from '~/models/group';
import { useMyTournamentStore } from '~/store/tournament';
import { useMyAuthStore } from '~/store/Auth';
const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);
const isAdmin = computed(() => {
  return user.value?.user.roles.includes("SuperAdmin") ||
    user.value?.user.roles.includes("StaffAdmin")
});

definePageMeta({
  layout: "custom",

});
useHead({
  title:'خريطة البطولة',
  meta:[
    {name:'description',content:'خريطة البطولة'}
  ]
})

const route = useRoute();
const tourid = route.params.id.toString()

const tourStore = useMyTournamentStore();
onMounted(async () => {
  await tourStore.initStore()
})
const IsMatchesGenerated = computed(() => {

     const group  = tourStore.tournament.find(item => item.data.id === tourStore.selectedGroup?.data.id)
    if (group) {
      return group.matches.length > 0
    }
    return false

})


const handleGroupSelection = (group_id: string) => {
  useRouter().push({ path: useRoute().path, query: { group: group_id } });
};
</script>

<style></style>