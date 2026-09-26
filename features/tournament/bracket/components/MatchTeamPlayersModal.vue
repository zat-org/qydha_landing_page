<template>
  <UModal
    :title="modalTitle"
    description="لاعبو الفريق وحسابات قيدها"
    :ui="{ content: 'max-w-lg', body: 'overflow-y-auto max-h-[70vh]' }"
  >
    <template #body>
      <div v-if="pending" class="flex flex-col items-center justify-center gap-2 py-10">
        <UIcon
          name="i-heroicons-arrow-path"
          class="size-8 animate-spin text-primary"
        />
        <p class="text-sm text-gray-500">جاري تحميل بيانات الفريق…</p>
      </div>

      <UAlert
        v-else-if="errorMessage"
        color="error"
        variant="soft"
        icon="i-heroicons-exclamation-triangle"
        title="تعذّر تحميل الفريق"
        :description="errorMessage"
        class="my-2"
      />

      <div
        v-else-if="!players.length"
        class="rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 dark:border-gray-700"
      >
        لا يوجد لاعبون في هذا الفريق
      </div>

      <div v-else class="flex flex-col gap-3 py-1">
        <div
          v-for="player in players"
          :key="player.id"
          class="rounded-xl border border-gray-200/90 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/50"
        >
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
              v-else-if="resolvedUser(player.qydhaUserData.id)"
              class="flex flex-wrap items-center gap-2 text-xs text-gray-700 dark:text-gray-300"
            >
              <img
                v-if="resolvedAvatar(player)"
                :src="resolvedAvatar(player)!"
                alt=""
                class="size-8 rounded-full object-cover"
              >
              <UIcon
                v-else
                name="i-heroicons-user-circle"
                class="size-8 text-primary"
              />
              <div class="min-w-0">
                <p class="font-semibold">
                  {{ resolvedUsername(player) }}
                </p>
                <p
                  v-if="resolvedName(player)"
                  class="text-gray-500"
                >
                  {{ resolvedName(player) }}
                </p>
                <p
                  v-if="resolvedPhone(player)"
                  class="text-gray-500"
                  dir="ltr"
                >
                  {{ resolvedPhone(player) }}
                </p>
              </div>
            </div>

            <div v-else class="space-y-1 text-xs text-gray-600 dark:text-gray-400">
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
    </template>

    <template #footer>
      <div class="flex w-full justify-end">
        <UButton
          label="إغلاق"
          color="neutral"
          variant="soft"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import type { IPlayer, ITeam } from "~/features/tournament/models/tournamentTeam";
import { useTourrnamentTeam } from "~/features/tournament/teams/composables/tourrnamentTeam";
import type { ApiResponse } from "~/composables/useAppData";
import type { ISingleUser, User } from "~/models/user";

type CachedUser = {
  pending: boolean;
  error: boolean;
  user: User | null;
};

const props = defineProps<{
  tournamentId: string;
  teamId: string;
  teamName?: string | null;
}>();

const emit = defineEmits<{ close: [] }>();

const { $api } = useNuxtApp();
const getTourTeam = useTourrnamentTeam().getTourTeam();

const pending = ref(true);
const errorMessage = ref<string | null>(null);
const team = ref<ITeam | null>(null);
const userCache = reactive<Record<string, CachedUser>>({});

const players = computed(() => team.value?.players ?? []);

const modalTitle = computed(
  () => team.value?.name || props.teamName?.split("|")[0]?.trim() || "لاعبو الفريق",
);

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

function resolvedUser(userId: string) {
  return userCache[userId]?.user ?? null;
}

function resolvedAvatar(player: IPlayer) {
  const id = player.qydhaUserData?.id;
  return (
    (id && userCache[id]?.user?.avatarUrl) ||
    player.qydhaUserData?.avatarUrl ||
    null
  );
}

function resolvedUsername(player: IPlayer) {
  const id = player.qydhaUserData?.id;
  return (
    (id && userCache[id]?.user?.username) ||
    player.qydhaUserData?.username ||
    ""
  );
}

function resolvedName(player: IPlayer) {
  const id = player.qydhaUserData?.id;
  return (
    (id && userCache[id]?.user?.name) ||
    player.qydhaUserData?.name ||
    null
  );
}

function resolvedPhone(player: IPlayer) {
  const id = player.qydhaUserData?.id;
  return (
    (id && userCache[id]?.user?.phone) ||
    player.qydhaUserData?.phone ||
    null
  );
}

async function loadTeam() {
  pending.value = true;
  errorMessage.value = null;
  try {
    const result = await getTourTeam.fetchREQ(
      props.tournamentId,
      props.teamId,
    );
    if (!result) {
      errorMessage.value = "لم يتم العثور على الفريق";
      team.value = null;
      return;
    }
    team.value = result;
    const userIds = (result.players ?? [])
      .map((p) => p.qydhaUserData?.id)
      .filter((id): id is string => !!id);
    await Promise.all(userIds.map((id) => fetchQydhaUser(id)));
  } catch (e: unknown) {
    const err = e as { data?: { detail?: string }; message?: string };
    errorMessage.value =
      err?.data?.detail || err?.message || "حدث خطأ أثناء تحميل بيانات الفريق";
    team.value = null;
  } finally {
    pending.value = false;
  }
}

await loadTeam();
</script>
