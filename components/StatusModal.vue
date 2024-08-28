<template>
  <UModal>
    <UTabs :items="items" class="w-full">
      <template #status="{ item }"> label: 'الاحصائيات' </template>

      <template #news="{ item }"> label: 'النشرة' </template>
    </UTabs>
  </UModal>
</template>

<script lang="ts" setup>
const props = defineProps<{ id: string }>();
const emit = defineEmits(["success"]);
const matchaapi = useMatch();
const DataREQ = await matchaapi.getMatchData();
await DataREQ.fetchREQ(props.id);

const statusREQ = await matchaapi.getMatchStatstics();
await statusREQ.fetchREQ(props.id);
function onSuccess() {
  emit("success");
}

const items = [
  {
    slot: "status",
    label: "الاحصائيات",
  },
  {
    slot: "news",
    label: "النشرة",
  },
];
</script>

<style></style>
