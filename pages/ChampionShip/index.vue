<template>
  <div class="w-full h-screen">
    <UButtonGroup size="2xs" orientation="horizontal" v-if="groupsREQ.data.value" class="flex flex-wrap">
      <UButton class="basis-[20px] grow" v-for="item in groupsREQ.data.value.data" :label="`${item.name}`"
        :color="selectedGroup?.id == item.id ? 'green' : 'white'" block @click="handleGroupSelection(item.id)" />
    </UButtonGroup>
    <ClientOnly>
      <ChampionshipFlow v-if="selectedGroup" :group="selectedGroup" />
    </ClientOnly>
  </div>

</template>


<script lang="ts" setup>
definePageMeta({
  layout: "custom",
});

const route = useRoute();
const selectedGroup = computed(() => {
  if (!groupsREQ.data.value) return null;
  const groupIdStr = route.query.group as string;
  const groupId = Number(groupIdStr);
  if (!groupId)
    return groupsREQ.data.value.data[groupsREQ.data.value.data.length - 1];
  return groupsREQ.data.value.data.find((g) => g.id == groupId) ??
    groupsREQ.data.value.data[groupsREQ.data.value.data.length - 1];
});



const groupApi = useGroup();
const groupsREQ = await groupApi.getGroups();
await groupsREQ.fetchREQ();

const handleGroupSelection = (group_id: number) => {
  useRouter().push({ path: useRoute().path, query: { group: group_id } });
};

</script>

<style></style>
