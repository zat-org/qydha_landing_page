<template>
  <UCard class="flex flex-col h-full">
    <template #header> players </template>
    <UTable
      :data="players"
      class="[&_td]:p-1 [&_th]:p-1"
    >
      <template #action-data="{ row }">
        <UButtonGroup>
          <UButton color="warning" @click="openUpdateModal(row.original)">
            <IconSetting class="text-lg" />
          </UButton>
          <UButton color="error" @click="onDeletePlayer(row.original)">
            <IconDelete class="text-lg" />
          </UButton>
        </UButtonGroup>
      </template>
      <template #qydha-data="{ row }">
        <p v-if="row.original.qydhaUserData">{{ row.original.qydhaUserData.username }}</p>
      </template>
      <template #team-data="{ row }">
        <p v-if="row.original.teamName">{{ row.original.teamName }}</p>
        <p v-else>no team</p>
      </template>
    </UTable>

    <UPagination
      v-model="page"
      :total="total"
      :page-count="10"
      class="mx-auto"
    />
    <template #footer>
      <div class="flex justify-between items-center">
        <UButton label="add" @click="openCreateModal" />
        <UButton
          label="back "
          color="error"
          @click="navigateTo('/tournament/' + tour_id)"
        />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import type { IPlayer } from "~/features/tournament/models/tournamentTeam";
import CreatePlayerModal from "./CreatePlayerModal.vue";
import UpdatePlayerModal from "./updatePlayerModal.vue";

const route = useRoute();
const overlay = useOverlay();
const toast = useToast();
const tour_id = route.params.id.toString();
const getplayerREQ = await useTournamentPlayer().getPlayer();

const page = ref();
const total = ref();
await getplayerREQ.fetchREQ(tour_id, null);
if (getplayerREQ.status.value == "success") {
  page.value = getplayerREQ.data.value?.data.currentPage;
  total.value = getplayerREQ.data.value?.data.totalCount;
}
watch(page, async (newValue, oldValue) => {
  await getplayerREQ.fetchREQ(tour_id, null, page.value);
  total.value = getplayerREQ.data.value?.data.totalCount!;
});

const cols = [
  { key: "name", label: "الاسم" },
  { key: "phone", label: "الهاتف" },
  { key: "email", label: "الميل" },
  { key: "qydha", label: "قيدها" },
  { key: "team", label: "الفريق" },

  { key: "action", label: "#" },
];

const players = computed(() => {
  console.log("hello ");
  return getplayerREQ.data.value?.data.items;
});
const openCreateModal = () => {
  overlay.create(CreatePlayerModal).open();
};
const deleteREQ = await useTournamentPlayer().deletePlayer();
const onDeletePlayer = async (row: IPlayer) => {
  const selectedPlayer = players.value?.find((p) => p.id == row.id);
  if (selectedPlayer) {
    await deleteREQ.fetchREQ(selectedPlayer.tournamentId, selectedPlayer.id);
    if (deleteREQ.status.value == "success") {
      toast.add({ title: "delete done successfuly" });
    }
  }
};
const openUpdateModal = (row: IPlayer) => {
  overlay.create(UpdatePlayerModal, { props: { player: row } }).open();
};
</script>

<style></style>
