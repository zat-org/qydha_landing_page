<template>
  <div
    class="group overflow-hidden rounded-xl border border-gray-200/90 bg-white transition-colors hover:border-primary/30 hover:bg-primary/[0.02] dark:border-gray-700 dark:bg-gray-900/50 dark:hover:border-primary/40 dark:hover:bg-primary/5"
  >
    <div class="flex items-start gap-3 p-3">
      <div class="relative shrink-0">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="player.name"
          class="size-11 rounded-full object-cover ring-2 ring-white dark:ring-gray-800"
        >
        <div
          v-else
          class="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary ring-2 ring-white dark:bg-primary/15 dark:ring-gray-800"
        >
          {{ initials }}
        </div>
        <span
          v-if="qydhaUserId"
          class="absolute -bottom-0.5 -end-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-white ring-2 ring-white dark:ring-gray-900"
          title="حساب قيدها"
        >
          <UIcon name="i-mdi-check-bold" class="size-2.5" />
        </span>
      </div>

      <div class="min-w-0 flex-1">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <p class="truncate text-sm font-bold text-gray-900 dark:text-white">
              {{ player.name }}
            </p>
            <p
              v-if="username"
              class="mt-0.5 truncate text-xs font-semibold text-primary"
              dir="ltr"
            >
              @{{ username }}
            </p>
            <p
              v-else
              class="mt-0.5 text-[11px] text-gray-400"
            >
              بدون حساب قيدها
            </p>
          </div>
          <div v-if="$slots.actions" class="flex shrink-0 items-center gap-0.5">
            <slot name="actions" />
          </div>
        </div>

        <div
          v-if="phone || email"
          class="mt-2 space-y-1 border-t border-gray-100 pt-2 dark:border-gray-800"
        >
          <div
            v-if="phone"
            class="flex min-w-0 items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300"
          >
            <UIcon name="i-heroicons-phone" class="size-3.5 shrink-0 text-gray-400" />
            <span class="truncate tabular-nums" dir="ltr">{{ phone }}</span>
          </div>
          <div
            v-if="email"
            class="flex min-w-0 items-center gap-1.5 text-xs text-gray-600 dark:text-gray-300"
          >
            <UIcon name="i-heroicons-envelope" class="size-3.5 shrink-0 text-gray-400" />
            <span class="truncate" dir="ltr">{{ email }}</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="flex items-center gap-1 border-t border-gray-100 bg-gray-50/80 px-2 py-1.5 dark:border-gray-800 dark:bg-gray-950/40"
    >
      <UTooltip text="نسخ الاسم ورقم الجوال واليوزر">
        <UButton
          icon="i-heroicons-clipboard-document"
          label="نسخ"
          color="neutral"
          variant="ghost"
          size="xs"
          class="flex-1 justify-center"
          aria-label="نسخ البيانات"
          @click.stop="copyPlayerData"
        />
      </UTooltip>
      <UTooltip :text="phone ? 'اتصال' : 'لا يوجد رقم'">
        <UButton
          icon="i-heroicons-phone"
          label="اتصال"
          color="success"
          variant="ghost"
          size="xs"
          class="flex-1 justify-center"
          :disabled="!phone"
          aria-label="اتصال"
          @click.stop="callPhone"
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

const avatarUrl = computed(() => {
  const url = props.player.qydhaUserData?.avatarUrl;
  return typeof url === "string" && url.trim() ? url.trim() : null;
});

const initials = computed(() => {
  const source = props.player.name?.trim() || username.value || "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
});

function normalizePhoneForTel(value: string) {
  return value.replace(/[^\d+]/g, "");
}

function callPhone() {
  if (!phone.value) return;

  const normalized = normalizePhoneForTel(phone.value);
  if (!normalized) {
    toast.add({
      title: "رقم الجوال غير صالح",
      color: "warning",
    });
    return;
  }

  const telUrl = `tel:${normalized}`;

  // Prefer a real <a tel:> click — works better than NuxtLink inside many WebViews.
  try {
    const anchor = document.createElement("a");
    anchor.href = telUrl;
    anchor.rel = "noopener noreferrer";
    anchor.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;";
    document.body.appendChild(anchor);
    anchor.click();
    window.setTimeout(() => {
      anchor.remove();
    }, 0);
    return;
  } catch {
    // fall through
  }

  try {
    window.location.assign(telUrl);
  } catch {
    toast.add({
      title: "تعذّر فتح الاتصال",
      description: "جرّب نسخ الرقم والاتصال يدوياً",
      color: "error",
    });
  }
}

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
