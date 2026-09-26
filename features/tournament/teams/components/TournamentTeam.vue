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
      <div class="flex flex-col gap-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-4">
            <UButton
              icon="i-heroicons-arrow-right"
              label="عوده"
              variant="ghost"
              color="neutral"
              @click="navigateTo(`/tournament/${tour_id}`)"
            />
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

        <div class="flex flex-nowrap items-center gap-3">
          <UInput
            v-model="searchInput"
            class="min-w-48 flex-1"
            placeholder="اسم الفريق أو اللاعب"
            :loading="getTeamsREQ.pending.value"
          />
          <USelect
            v-model="stageFilter"
            class="w-40 shrink-0"
            :items="stageFilterOptions"
            value-key="value"
            label-key="label"
          />
          <USelect
            v-model="stateFilter"
            class="w-40 shrink-0"
            :items="stateFilterOptions"
            value-key="value"
            label-key="label"
          />
        </div>
      </div>
    </template>

    <UTable
      v-model:expanded="expandedRows"
      :data="teams"
      :columns="columns"
      :key="tablekey"
      :get-row-can-expand="() => true"
      :ui="{
        tr: 'cursor-pointer',
        td: 'align-middle',
      }"
      @select="onTeamRowSelect"
    >
      <template #expand-cell="{ row }">
        <UButton
          variant="ghost"
          color="neutral"
          size="sm"
          square
          :aria-expanded="row.getIsExpanded()"
          :aria-label="row.getIsExpanded() ? 'طي اللاعبين' : 'عرض اللاعبين'"
          :icon="row.getIsExpanded() ? 'i-mdi-chevron-up' : 'i-mdi-chevron-down'"
          class="rounded-lg"
          @click.stop="toggleTeamExpand(row)"
        />
      </template>

      <template #playersCount-cell="{ row }">
        <UBadge color="primary" variant="soft" size="sm" class="rounded-full font-medium">
          {{ row.original.players?.length ?? 0 }} لاعب
        </UBadge>
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
            @click.stop="deleteTeam(row.original)"
          />
          <UButton
            icon="material-symbols:settings"
            color="warning"
            size="xs"
            @click.stop="openUpdateModal(row.original)"
          />
          <UButton
            v-if="row.original.players.length < 2"
            size="xs"
            @click.stop="openAddPlayerModal(row.original.id)"
          >
            <template #leading>
              <IconAddUser class="text-base" />
            </template>
          </UButton>
        </UFieldGroup>
      </template>

      <template #expanded="{ row }">
        <div
          class="border-t border-gray-200/90 bg-linear-to-b from-gray-50/90 to-white px-3 py-4 dark:border-gray-800 dark:from-gray-950/80 dark:to-gray-900/60 sm:px-5"
        >
          <div class="mb-3 flex flex-wrap items-center gap-2">
            <UIcon name="i-mdi-account-multiple" class="size-5 text-primary" />
            <span class="text-sm font-bold text-gray-800 dark:text-gray-100">لاعبو الفريق</span>
            <UBadge color="neutral" variant="soft" size="xs" class="rounded-full">
              {{ row.original.players?.length ?? 0 }}
            </UBadge>
            <UIcon
              v-if="isTeamUsersLoading(row.original.id)"
              name="i-mdi-loading"
              class="size-4 animate-spin text-primary"
            />
          </div>

          <div
            v-if="!row.original.players?.length"
            class="rounded-xl border border-dashed border-gray-300 px-4 py-6 text-center text-sm text-gray-500 dark:border-gray-700"
          >
            لا يوجد لاعبون في هذا الفريق
          </div>

          <div v-else class="grid gap-3 sm:grid-cols-2">
            <div
              v-for="player in row.original.players"
              :key="player.id"
              class="rounded-xl border border-gray-200/90 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/50"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="min-w-0 space-y-1">
                  <p class="font-semibold text-gray-900 dark:text-white">
                    {{ player.name }}
                  </p>
                  <p v-if="player.phone" class="text-xs text-gray-500" dir="ltr">
                    {{ player.phone }}
                  </p>
                  <p v-if="player.email" class="text-xs text-gray-500" dir="ltr">
                    {{ player.email }}
                  </p>
                </div>
                <div
                  v-if="canManageTeams && isTeamNotJoinRequest(row.original)"
                  class="flex shrink-0 items-center gap-1"
                >
                  <UButton
                    icon="i-lucide-x"
                    color="error"
                    variant="ghost"
                    size="xs"
                    square
                    @click.stop="removePlayer(row.original, player.id)"
                  />
                  <UButton
                    icon="i-material-symbols:settings"
                    color="warning"
                    variant="ghost"
                    size="xs"
                    square
                    @click.stop="openUpdatePlayerModal(row.original, player)"
                  />
                </div>
              </div>

              <div
                v-if="player.qydhaUserData?.id"
                class="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-2.5 dark:bg-primary/10"
              >
                <div class="mb-2 flex items-center gap-2">
                  <UIcon name="i-mdi-account-check" class="size-4 text-primary" />
                  <span class="text-xs font-semibold text-primary">مستخدم قيدها</span>
                </div>

                <div
                  v-if="userCache[player.qydhaUserData.id]?.pending"
                  class="flex items-center gap-2 text-xs text-gray-500"
                >
                  <UIcon name="i-mdi-loading" class="size-3.5 animate-spin" />
                  جاري تحميل بيانات المستخدم…
                </div>

                <div
                  v-else-if="userCache[player.qydhaUserData.id]?.error"
                  class="text-xs text-red-500"
                >
                  تعذر تحميل بيانات المستخدم
                </div>

                <div
                  v-else-if="userCache[player.qydhaUserData.id]?.user"
                  class="space-y-1.5 text-xs text-gray-700 dark:text-gray-300"
                >
                  <div class="flex flex-wrap items-center gap-2">
                    <img
                      v-if="userCache[player.qydhaUserData.id]?.user?.avatarUrl"
                      :src="userCache[player.qydhaUserData.id]!.user!.avatarUrl"
                      alt=""
                      class="size-8 rounded-full object-cover"
                    >
                    <UIcon
                      v-else
                      name="i-heroicons-user-circle"
                      class="size-8 text-primary"
                    />
                    <div>
                      <p class="font-semibold">
                        {{ userCache[player.qydhaUserData.id]?.user?.username }}
                      </p>
                      <p
                        v-if="userCache[player.qydhaUserData.id]?.user?.name"
                        class="text-gray-500"
                      >
                        {{ userCache[player.qydhaUserData.id]?.user?.name }}
                      </p>
                    </div>
                  </div>
                  <p v-if="userCache[player.qydhaUserData.id]?.user?.phone" dir="ltr">
                    {{ userCache[player.qydhaUserData.id]?.user?.phone }}
                  </p>
                  <p v-if="userCache[player.qydhaUserData.id]?.user?.email" dir="ltr">
                    {{ userCache[player.qydhaUserData.id]?.user?.email }}
                  </p>
                  <div
                    v-if="userCache[player.qydhaUserData.id]?.user?.roles?.length"
                    class="flex flex-wrap gap-1 pt-1"
                  >
                    <UBadge
                      v-for="role in userCache[player.qydhaUserData.id]!.user!.roles"
                      :key="role"
                      :color="getUserRoleColor(role)"
                      variant="soft"
                      size="xs"
                    >
                      {{ getUserRoleLabel(role) ?? role }}
                    </UBadge>
                  </div>
                </div>

                <div v-else class="text-xs text-gray-600 dark:text-gray-400">
                  <p class="font-medium">
                    {{ player.qydhaUserData.username }}
                  </p>
                  <p v-if="player.qydhaUserData.phone" dir="ltr">
                    {{ player.qydhaUserData.phone }}
                  </p>
                </div>
              </div>

              <p v-else class="mt-2 text-xs text-gray-400">
                لا يوجد حساب قيدها مرتبط
              </p>
            </div>
          </div>
        </div>
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
import { useDebounceFn } from "@vueuse/core";
import type {
  IPlayer,
  ITeam,
  TournamentTeamStageFilter,
  TournamentTeamStateFilter,
} from "~/features/tournament/models/tournamentTeam";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import TournamentTeamAddForm from "~/features/tournament/teams/components/AddForm.vue";
import TournamentTeamUpdateForm from "~/features/tournament/teams/components/UpdateForm.vue";
import TournamentTeamAddPlayerForm from "~/features/tournament/teams/components/AddPlayerForm.vue";
import TournamentTeamUpdatePlayerForm from "~/features/tournament/teams/components/UpdatePlayerForm.vue";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";
import { useTourrnamentTeam } from "~/features/tournament/teams/composables/tourrnamentTeam";
import { useTournamentPlaces } from "~/features/tournament/composables/useTournamentPlaces";
import { useMyAuthStore } from "~/store/Auth";
import type { ApiResponse } from "~/composables/useAppData";
import type { ISingleUser, User } from "~/models/user";

type CachedUser = {
  pending: boolean;
  error: boolean;
  user: User | null;
};

const props = defineProps<{
  tournamentId?: string;
}>();

const tablekey = ref(Date.now());
const route = useRoute();
const tour_id = props.tournamentId ?? route.params.id.toString();
const authStore = useMyAuthStore();
const { $api } = useNuxtApp();
const usersApi = useUsers();

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
/** `"All"` = no StageFilter (all stages). Empty string is invalid for USelect. */
const stageFilter = ref<"All" | TournamentTeamStageFilter>("All");
const stateFilter = ref<TournamentTeamStateFilter>("All");
const searchInput = ref("");
const searchToken = ref<string | null>(null);

const stageFilterOptions = [
  { label: "الكل", value: "All" },
  { label: "نهائي", value: "Final" },
  { label: "تصفيات", value: "Qualification" },
] as const;

const stateFilterOptions = [
  { label: "الكل", value: "All" },
  { label: "نشط", value: "Active" },
  { label: "منسحب", value: "Withdrawn" },
] as const;

const teamsQueryParams = () => ({
  page: page.value,
  stageFilter:
    stageFilter.value === "All"
      ? null
      : (stageFilter.value as TournamentTeamStageFilter),
  state: stateFilter.value,
  searchToken: searchToken.value,
});

const getTeamsREQ = await useTourrnamentTeam().getAllTourTeams();
await getTeamsREQ.fetchREQ(tour_id, teamsQueryParams());

const total = computed(() => getTeamsREQ.data.value?.totalCount ?? 0);
const isDrawerOpen = ref(false);
const drawerMode = ref<
  "add" | "update" | "addPlayer" | "updatePlayer" | null
>(null);
const selectedTeam = ref<ITeam | null>(null);
const selectedPlayer = ref<IPlayer | null>(null);
const selectedTeamId = ref<number | string | null>(null);
const overlay = useOverlay();

const expandedRows = ref<Record<string, boolean>>({});
const userCache = reactive<Record<string, CachedUser>>({});
const teamUsersLoading = reactive<Record<string, boolean>>({});

const getUserRoleLabel = usersApi.getUserRoleLabel;
const getUserRoleColor = usersApi.getUserRoleColor;

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
  await getTeamsREQ.fetchREQ(tour_id, teamsQueryParams());
};

const teams = computed(() => getTeamsREQ.data.value?.items ?? []);
const teamsNumber = computed(() => getTeamsREQ.data.value?.totalCount ?? 0);

async function refreshTeamsList() {
  expandedRows.value = {};
  await getTeamsREQ.fetchREQ(tour_id, teamsQueryParams());
}

watch(page, async () => {
  await refreshTeamsList();
});

watch([stageFilter, stateFilter], async () => {
  if (page.value !== 1) {
    page.value = 1;
    return;
  }
  await refreshTeamsList();
});

watch(
  searchInput,
  useDebounceFn((value: string) => {
    const next = value.trim() ? value.trim() : null;
    if (searchToken.value === next) return;
    searchToken.value = next;
    if (page.value !== 1) {
      page.value = 1;
      return;
    }
    void refreshTeamsList();
  }, 400),
);

const columns = [
  { id: "expand", header: "" },
  { header: "الاسم", accessorKey: "name" },
  { header: "اللاعبين", accessorKey: "playersCount" },
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
      await getTeamsREQ.fetchREQ(tour_id, teamsQueryParams());
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
      await getTeamsREQ.fetchREQ(tour_id, teamsQueryParams());
    }
  }
};

const isTeamNotJoinRequest = (team: ITeam) => {
  return team.teamJoinRequestId == null;
};

function isTeamUsersLoading(teamId: string | number) {
  return !!teamUsersLoading[String(teamId)];
}

async function fetchQydhaUser(userId: string) {
  if (!userId) return;
  const cached = userCache[userId];
  if (cached?.user || cached?.pending) return;

  userCache[userId] = { pending: true, error: false, user: null };
  try {
    const res = await $api<ApiResponse<ISingleUser> | ISingleUser>(
      `/users/${userId}`,
    );
    const payload =
      res && typeof res === "object" && "data" in res
        ? (res as ApiResponse<ISingleUser>).data
        : (res as ISingleUser);
    userCache[userId] = {
      pending: false,
      error: false,
      user: payload?.user ?? null,
    };
  } catch {
    userCache[userId] = { pending: false, error: true, user: null };
  }
}

async function loadTeamQydhaUsers(team: ITeam) {
  const teamKey = String(team.id);
  const userIds = (team.players ?? [])
    .map((p) => p.qydhaUserData?.id)
    .filter((id): id is string => !!id);

  if (!userIds.length) return;

  teamUsersLoading[teamKey] = true;
  try {
    await Promise.all(userIds.map((id) => fetchQydhaUser(id)));
  } finally {
    teamUsersLoading[teamKey] = false;
  }
}

function toggleTeamExpand(row: { original: ITeam; getIsExpanded: () => boolean; toggleExpanded: () => void }) {
  const willExpand = !row.getIsExpanded();
  row.toggleExpanded();
  if (willExpand) {
    void loadTeamQydhaUsers(row.original);
  }
}

const onTeamRowSelect = (
  eventOrRow: unknown,
  maybeRow?: { original: ITeam; getIsExpanded: () => boolean; toggleExpanded: () => void },
) => {
  const row =
    maybeRow ??
    (eventOrRow as {
      original: ITeam;
      getIsExpanded: () => boolean;
      toggleExpanded: () => void;
    });
  if (!row?.toggleExpanded || !row?.original) return;
  toggleTeamExpand(row);
};
</script>
