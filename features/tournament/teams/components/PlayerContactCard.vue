<template>
  <div
    class="rounded-xl border border-gray-200/90 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-900/50"
  >
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0 space-y-1">
        <p class="font-semibold text-gray-900 dark:text-white">
          {{ player.name }}
        </p>
        <p
          v-if="username"
          class="text-sm font-medium text-primary"
          dir="ltr"
        >
          @{{ username }}
        </p>
        <p v-if="phone" class="text-xs text-gray-500" dir="ltr">
          {{ phone }}
        </p>
        <p v-if="email" class="text-xs text-gray-500" dir="ltr">
          {{ email }}
        </p>
      </div>
      <div v-if="$slots.actions" class="flex shrink-0 items-center gap-1">
        <slot name="actions" />
      </div>
    </div>

    <div class="mt-2.5 flex flex-wrap items-center gap-1.5">
      <UTooltip text="نسخ البيانات">
        <UButton
          icon="i-heroicons-clipboard"
          color="neutral"
          variant="soft"
          size="xs"
          square
          aria-label="نسخ البيانات"
          @click.stop="copyPlayerData"
        />
      </UTooltip>
      <UTooltip :text="phone ? 'اتصال' : 'لا يوجد رقم'">
        <UButton
          icon="i-heroicons-phone"
          color="success"
          variant="soft"
          size="xs"
          square
          :disabled="!phone"
          :to="phone ? `tel:${phone}` : undefined"
          :external="!!phone"
          aria-label="اتصال"
          @click.stop
        />
      </UTooltip>
      <UTooltip :text="qydhaUserId ? 'فتح في قيدها' : 'لا يوجد حساب قيدها'">
        <UButton
          icon="i-heroicons-user-circle"
          color="primary"
          variant="soft"
          size="xs"
          square
          :disabled="!qydhaUserId"
          :to="qydhaUserId ? `/user/${qydhaUserId}` : undefined"
          aria-label="فتح في قيدها"
          @click.stop
        />
      </UTooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { IPlayer } from "~/features/tournament/models/tournamentTeam";

const props = defineProps<{
  player: IPlayer;
}>();

const toast = useToast();

const username = computed(() => {
  const value = props.player.qydhaUserData?.username?.trim();
  return value || null;
});

const phone = computed(() => {
  const value =
    props.player.phone?.trim() ||
    props.player.qydhaUserData?.phone?.trim() ||
    "";
  return value || null;
});

const email = computed(() => {
  const value = props.player.email?.trim();
  return value || null;
});

const qydhaUserId = computed(() => props.player.qydhaUserData?.id || null);

async function copyPlayerData() {
  const lines = [
    props.player.name,
    username.value ? `@${username.value}` : null,
    phone.value,
    email.value,
  ].filter(Boolean);

  const text = lines.join("\n");
  if (!text) {
    toast.add({
      title: "لا توجد بيانات للنسخ",
      color: "warning",
    });
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    toast.add({
      title: "تم نسخ البيانات",
      color: "success",
    });
  } catch {
    toast.add({
      title: "تعذّر النسخ",
      color: "error",
    });
  }
}
</script>
