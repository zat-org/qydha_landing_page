<template>
  <div>
    <div class="w-full h-screen">
    <UButtonGroup size="2xs" orientation="horizontal" v-if="groupsREQ.data.value" class="flex flex-wrap">
      <UButton class="basis-[20px] grow" v-for="item in groupsREQ.data.value.data.groups" :label="`${item.name}`"
        :color="selectedGroup?.id == item.id ? 'green' : 'white'" block @click="handleGroupSelection(item.id)" />
    </UButtonGroup>
    <ClientOnly>
      <TourBracket v-if="selectedGroup" :group="selectedGroup" />
    </ClientOnly>
  </div>
  </div>
</template>

<script lang="ts" setup>
import { useMyTournamentStore } from '~/store/tournament';


definePageMeta({
  layout: "custom",
});

const route = useRoute();
    const tourid = route.params.id.toString()
    const groupApi = useGroup();
    const groupsREQ = await  groupApi.getGroups();
     groupsREQ.fetchREQ(tourid);
     if (groupsREQ.status.value =="error")  {
      console.log(groupsREQ.error)
      }
      
  
      
const selectedGroup = computed(() => {
        if (!groupsREQ.data.value) return null;
        const groupIdStr = route.query.group as string;
        const groupId = Number(groupIdStr);
        if (!groupId)
        return groupsREQ.data.value.data.groups[groupsREQ.data.value.data.groups.length - 1];
      return groupsREQ.data.value.data.groups.find((g) => g.id == groupId) ??
      groupsREQ.data.value.data.groups[groupsREQ.data.value.data.groups.length - 1];
      });

const tour_store = useMyTournamentStore()
await tour_store.IntializeConnection(selectedGroup)

const handleGroupSelection = (group_id: number) => {
  useRouter().push({ path: useRoute().path, query: { group: group_id } });
};
</script>

<style>

</style>