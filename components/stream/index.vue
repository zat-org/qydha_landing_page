<template>
  <div class="flex flex-col gap-6">
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-4"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          البث
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          روابط لوحات البلوت والهند، وإدارة صور وأسماء اللاعبين للعرض
        </p>
      </div>
      <UButton
        label="إدارة اللاعبين"
        color="primary"
        variant="soft"
        size="lg"
        icon="i-heroicons-user-group"
        trailing-icon="i-heroicons-arrow-left"
        to="/players"
      />
    </div>

    <UAlert
      v-if="loadError"
      color="error"
      variant="soft"
      title="تعذر تحميل بيانات اللوحات"
      description="أعد تحميل الصفحة أو سجّل الدخول مرة أخرى."
      class="mx-4"
    />

    <UTabs :items="items" dir="rtl">
      <template #baloot>
        <StreamBalootTab
          :board-link="balootLink"
          :pending="pending"
          :load-error="loadError"
        />
      </template>
      <template #hand>
        <StreamHandTab
          :board-link="handLink"
          :pending="pending"
          :load-error="loadError"
        />
      </template>
    </UTabs>
  </div>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/Auth";
import { useUserPlayersApi } from "~/features/user/players/composables/useUserPlayersApi";

const items = [
  {
    label: "بلوت ",
    slot: "baloot" as const,
  },
  {
    label: "هند ",
    slot: "hand" as const,
  },
];

const authStore = useMyAuthStore();
const meReq = useUserPlayersApi().getMe();

const pending = computed(() => meReq.pending.value);
const loadError = computed(() => meReq.status.value === "error");

const balootLink = computed(
  () =>
    authStore.user?.boardsLinks?.baloot ||
    meReq.data.value?.boardsLinks?.baloot ||
    null,
);

const handLink = computed(
  () =>
    authStore.user?.boardsLinks?.hand ||
    meReq.data.value?.boardsLinks?.hand ||
    null,
);

watch(
  () => meReq.data.value,
  (me) => {
    if (!me?.boardsLinks || !authStore.user) return;
    authStore.user.boardsLinks = {
      baloot: me.boardsLinks.baloot ?? authStore.user.boardsLinks?.baloot ?? "",
      hand: me.boardsLinks.hand ?? authStore.user.boardsLinks?.hand ?? "",
    };
  },
  { immediate: true },
);
</script>
