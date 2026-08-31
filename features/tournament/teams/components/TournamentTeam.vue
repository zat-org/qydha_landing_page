<template>
  <div v-if="!tour">
    <div class="flex items-center justify-center h-full">
      <UProgress indeterminate />
    </div>
  </div>
  <UCard
    v-else
    :ui="{
      root: 'flex flex-col h-full',
      body: 'grow flex flex-col justify-between',
    }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h1 class="text-2xl font-bold">
            {{ tour.title }}
            /
            <span class="text-gray-500">الفرق</span>
            ({{ teamsNumber }})
          </h1>
        </div>

        <div class="flex items-center justify-start gap-2">
          <UButton
            v-if="canManageTeams"
            label="إضافة فريق"
            icon="i-heroicons-plus"
            color="primary"
            @click="openDrawer('add')"
          />
        </div>
      </div>
    </template>

    <UTable :data="teams" :columns="columns" :key="tablekey">
      <template #players-cell="{ row }">
        <div class="flex flex-wrap justify-start items-start gap-2">
          <div
            v-for="player of row.original.players"
            :key="player.id"
            class="flex items-center justify-between gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md text-sm"
          >
            <p>{{ player.qydhaUserData?.username ?? player.name }}</p>
            <div
              v-if="
                canManageTeams && isTeamNotJoinRequest(row.original)
              "
              class="flex items-center gap-1"
            >
              <UIcon
                name="i-lucide-x"
                class="text-base text-red-500 cursor-pointer"
                @click="removePlayer(row.original, player.id)"
              />
              <UIcon
                name="i-material-symbols:settings"
                class="text-base text-warning-500 cursor-pointer"
                @click="openUpdatePlayerModal(row.original, player)"
              />
            </div>
          </div>
        </div>
      </template>

      <template #stageEntries-cell="{ row }">
        <div class="flex flex-wrap gap-1">
          <template
            v-if="
              row.original.stageEntries && row.original.stageEntries.length > 0
            "
          >
            <UBadge
              v-for="(entry, idx) in row.original.stageEntries"
              :key="idx"
              :color="entry.stageType === 'Final' ? 'primary' : 'neutral'"
              variant="subtle"
              size="xs"
            >
              {{ entry.stageType === "Final" ? "نهائي" : "تصفيات" }}
              <span v-if="entry.entryType === 'Qualified'" class="text-[10px] text-primary-600 font-bold me-1">
                (متأهل)
              </span>
              <span v-else class="text-[10px] text-gray-500 me-1">
                (مباشر)
              </span>
              <span v-if="entry.placeId" class="text-[10px] text-gray-400">
                · {{ placeLabel(entry.placeId) }}
              </span>
            </UBadge>
          </template>
          <span v-else class="text-xs text-gray-400">-</span>
        </div>
      </template>

      <template #actions-cell="{ row }">
        <UFieldGroup
          v-if="canManageTeams && isTeamNotJoinRequest(row.original)"
        >
          <UButton
            v-if="canDeleteTeam(row.original)"
            icon="material-symbols:delete"
            color="error"
            size="xs"
            @click="deleteTeam(row.original)"
          />
          <UButton
            icon="material-symbols:settings"
            color="warning"
            size="xs"
            @click="openUpdateModal(row.original)"
          />
          <UButton
            v-if="row.original.players.length < 2"
            size="xs"
            @click="openAddPlayerModal(row.original.id)"
          >
            <template #leading>
              <IconAddUser class="text-base" />
            </template>
          </UButton>
        </UFieldGroup>
      </template>
    </UTable>
    <UPagination
      v-model:page="page"
      :page-count="10"
      :total="total"
      class="mx-auto mt-4"
    />
  </UCard>

  <UDrawer
    v-model:open="isDrawerOpen"
    direction="left"
    :handle="false"
    :title="drawerConfig.title"
    :description="drawerConfig.description"
    class="drawer-responsive"
  >
    <template #content>
      <div class="flex-1 p-3 sm:p-4 md:p-6 min-h-0 min-w-96">
        <TournamentTeamAddForm
          v-if="drawerMode === 'add'"
          @close="closeDrawer"
        />
        <TournamentTeamUpdateForm
          v-else-if="drawerMode === 'update'"
          :team="selectedTeam!"
          @close="closeDrawer"
        />
        <TournamentTeamAddPlayerForm
          v-else-if="drawerMode === 'addPlayer'"
          :teamId="selectedTeamId!.toString()"
          ref="addPlayerForm"
          @close="closeDrawer"
        />
        <TournamentTeamUpdatePlayerForm
          v-else-if="drawerMode === 'updatePlayer'"
          :player="selectedPlayer!"
          @close="closeDrawer"
        />
      </div>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import { ConfirmationModal } from "#components";
import type { IPlayer, ITeam } from "~/features/tournament/models/tournamentTeam";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import TournamentTeamAddForm from "~/features/tournament/teams/components/AddForm.vue";
import TournamentTeamUpdateForm from "~/features/tournament/teams/components/UpdateForm.vue";
import TournamentTeamAddPlayerForm from "~/features/tournament/teams/components/AddPlayerForm.vue";
import TournamentTeamUpdatePlayerForm from "~/features/tournament/teams/components/UpdatePlayerForm.vue";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";
import { useTourrnamentTeam } from "~/features/tournament/teams/composables/tourrnamentTeam";
import { useTournamentPlaces } from "~/features/tournament/composables/useTournamentPlaces";
import { useMyAuthStore } from "~/store/Auth";

const props = defineProps<{
  tournamentId?: string;
}>();

const tablekey = ref(Date.now());
const route = useRoute();
const tour_id = props.tournamentId ?? route.params.id.toString();
const toast = useToast();
const authStore = useMyAuthStore();

const getTourREQ = await useSingleTournament().getSingelTournament(tour_id, {
  immediate: false,
});

if (!getTourREQ.data.value?.tournament) {
  await getTourREQ.refresh();
}

const tour = computed(() => getTourREQ.data.value?.tournament);
const { placeLabel } = useTournamentPlaces(() => getTourREQ.data.value);

const canManageTeams = computed(() => {
  const state = tour.value?.detailedState;
  const inValidState =
    state === TournamentDetailedState.ManagingTeams ||
    state === TournamentDetailedState.ManagingFinalStageQualifiedTeams;
  if (!inValidState) return false;

  const privilege = getTourREQ.data.value?.requesterPrivilege;
  const isOwnerOrAdmin =
    privilege?.privilege?.toLowerCase() === "owner" ||
    privilege?.privilege?.toLowerCase() === "admin" ||
    authStore.isAdmin;
  const hasPerm = privilege?.permissions?.includes("TeamsCRUDs") ?? false;
  return isOwnerOrAdmin || hasPerm;
});

const page = ref(1);
const getTeamsREQ = await useTourrnamentTeam().getAllTourTeams();
await getTeamsREQ.fetchREQ(tour_id, page.value);

const total = computed(() => getTeamsREQ.data.value?.totalCount ?? 0);
const isDrawerOpen = ref(false);
const drawerMode = ref<
  "add" | "update" | "addPlayer" | "updatePlayer" | null
>(null);
const selectedTeam = ref<ITeam | null>(null);
const selectedPlayer = ref<IPlayer | null>(null);
const selectedTeamId = ref<number | string | null>(null);
const overlay = useOverlay();

const drawerConfig = computed(() => {
  switch (drawerMode.value) {
    case "add":
      return { title: "إضافة فريق جديد", description: "إضافة فريق جديد" };
    case "update":
      return { title: "تعديل الفريق", description: "تعديل بيانات الفريق" };
    case "addPlayer":
      return {
        title: "إضافة لاعب للفريق",
        description: "إضافة لاعب جديد للفريق",
      };
    case "updatePlayer":
      return {
        title: "تعديل اللاعب",
        description: "تعديل بيانات اللاعب",
      };
    default:
      return { title: "", description: "" };
  }
});

const openDrawer = (
  mode: "add" | "update" | "addPlayer" | "updatePlayer",
  data?: any,
) => {
  drawerMode.value = mode;
  if (mode === "update" && data) selectedTeam.value = data;
  else if (mode === "addPlayer" && data) selectedTeamId.value = data;
  else if (mode === "updatePlayer" && data) selectedPlayer.value = data.player;
  isDrawerOpen.value = true;
};

const closeDrawer = async () => {
  isDrawerOpen.value = false;
  drawerMode.value = null;
  selectedTeam.value = null;
  selectedTeamId.value = null;
  tablekey.value = Date.now();
  await getTeamsREQ.fetchREQ(tour_id, page.value);
};

const teams = computed(() => getTeamsREQ.data.value?.items ?? []);
const teamsNumber = computed(() => getTeamsREQ.data.value?.totalCount ?? 0);

watch(page, async () => {
  await getTeamsREQ.fetchREQ(tour_id, page.value);
});

const columns = [
  { header: "الاسم", accessorKey: "name" },
  { header: "اللاعبين", accessorKey: "players" },
  { header: "المرحلة والمكان", accessorKey: "stageEntries" },
  { header: "الإجراءات", id: "actions" },
];

const ConfiemationModal = overlay.create(ConfirmationModal);
const delteTeamREQ = await useTourrnamentTeam().deleteTourTeam();

const canDeleteTeam = (team: ITeam) => {
  if (team.teamJoinRequestId != null) return false;
  if (team.hasGroupLink || (team.groupLinks && team.groupLinks.length > 0)) {
    return false;
  }
  return true;
};

const deleteTeam = async (row: ITeam) => {
  const selectedteam = teams.value?.find((t) => t.id === row.id);
  if (selectedteam) {
    const instance = ConfiemationModal.open({
      message: `هل أنت متأكد من حذف الفريق "${selectedteam.name}"؟`,
    });
    if (await instance.result) {
      await delteTeamREQ.fetchREQ(tour_id, selectedteam.id.toString());
      await getTeamsREQ.fetchREQ(tour_id, page.value);
    }
  }
};

const openUpdateModal = (row: ITeam) => openDrawer("update", row);
const openAddPlayerModal = (team_id: number | string) =>
  openDrawer("addPlayer", team_id);
const openUpdatePlayerModal = (row: ITeam, player: IPlayer) =>
  openDrawer("updatePlayer", { team: row, player: player });

const deleteREQ = await useTourrnamentTeam().removePlayerFromTeam();
const removePlayer = async (row: ITeam, player_id: string) => {
  const selectedplayer = row.players.find((p) => p.id === player_id);
  if (selectedplayer) {
    const instance = ConfiemationModal.open({
      message: `هل أنت متأكد من جعل اللاعب "${selectedplayer.name}" لاعب حر بدلا من لاعب في الفريق "${row.name}"؟`,
    });
    if (await instance.result) {
      await deleteREQ.fetchREQ(tour_id, row.id.toString(), player_id);
      await getTeamsREQ.fetchREQ(tour_id, page.value);
    }
  }
};

const isTeamNotJoinRequest = (team: ITeam) => {
  return team.teamJoinRequestId == null;
};
</script>
