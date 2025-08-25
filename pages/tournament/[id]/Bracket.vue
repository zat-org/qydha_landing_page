<template>
  <div>
    <div class="w-full h-screen">
      <UButtonGroup orientation="horizontal" v-if="tourStore.tournament.length > 0" class="flex flex-wrap">
        <UButton class="basis-[20px] grow" v-for="item in tourStore.tournament" :label="`${item.data.name}`"
          :color="tourStore.selectedGroup?.data.id == item.data.id ? 'success' : 'neutral'" block
          @click="handleGroupSelection(item.data.id)" />
      </UButtonGroup>
      <ClientOnly>
        <Bracket v-if="tourStore.selectedGroup" :group="tourStore.selectedGroup.data" />
      </ClientOnly>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMyTournamentStore } from '~/store/tournament';


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

  await tourStore.initStore(tourid)
})


const handleGroupSelection = (group_id: number) => {
  useRouter().push({ path: useRoute().path, query: { group: group_id } });


};
</script>

<style></style>