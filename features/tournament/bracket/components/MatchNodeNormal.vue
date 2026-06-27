<template>
  <div
    dir="rtl"
    class="flex w-[450px] flex-col gap-2 overflow-hidden rounded-2xl p-2 text-sm font-semibold shadow-sm ring-1 ring-black/5 backdrop-blur-[1px] transition-all duration-300 hover:shadow-xl dark:bg-gray-800 dark:ring-white/10"
    :class="[vm.cardToneClass, roundOpacityClass]"
  >
    <div class="grid grid-cols-[minmax(0,0.9fr)_auto_minmax(0,0.9fr)] items-stretch gap-1.5">
      <div
        :class="[
          firstTeamSurfaceClass,
          'group min-w-0 rounded-xl px-1.5 py-1.5 ring-1 ring-black/5 transition-all duration-200 dark:ring-white/10',
        ]"
      >
        <div class="flex min-h-[30px] h-full items-center justify-center gap-1">
          <div class="flex h-full grow flex-col items-center justify-center">
            <span
              class="truncate text-center text-[11px] font-bold leading-tight"
              :class="vm.firstTeamNameClasses"
            >
              {{ usTeamPrimary }}
            </span>
            <p class="truncate text-center text-[11px] font-bold leading-tight">
              {{ usTeamSecondary }}
            </p>
          </div>
          <UIcon
            name="i-mdi-cards-spade"
            class="size-3.5 shrink-0 text-indigo-700 dark:text-indigo-300"
          />
        </div>
      </div>

      <div
        class="inline-flex items-center justify-center self-center rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black text-slate-700 ring-1 ring-black/10 dark:bg-black/35 dark:text-slate-100 dark:ring-white/10"
      >
        VS
      </div>

      <div
        :class="[
          secondTeamSurfaceClass,
          'group min-w-0 rounded-xl px-1.5 py-1.5 ring-1 ring-black/5 transition-all duration-200 dark:ring-white/10',
        ]"
      >
        <div class="flex min-h-[30px] items-center justify-center gap-1">
          <UIcon
            name="i-mdi-cards-club"
            class="size-3.5 shrink-0 text-fuchsia-700 dark:text-fuchsia-300"
          />
          <div class="flex h-full grow flex-col items-center justify-center">
            <span
              class="truncate text-center text-[11px] font-bold leading-tight"
              :class="vm.secondTeamNameClasses"
            >
              {{ themTeamPrimary }}
            </span>
            <p class="truncate text-center text-[11px] font-bold leading-tight">
              {{ themTeamSecondary }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="flex items-center gap-1.5 *:grow">
      <span
        class="inline-flex min-w-0 items-center justify-center gap-1 rounded-lg bg-white/75 px-2 py-1 text-[10px] font-semibold text-slate-800 ring-1 ring-black/5 dark:bg-black/25 dark:text-slate-100 dark:ring-white/10"
      >
        <IconTable class="shrink-0 text-[12px] text-slate-700 dark:text-slate-200" />
        <span class="truncate">{{ tableText }}</span>
      </span>
      <span
        class="inline-flex min-w-0 items-center justify-center gap-1 rounded-lg bg-white/75 px-2 py-1 text-[10px] font-semibold text-slate-800 ring-1 ring-black/5 dark:bg-black/25 dark:text-slate-100 dark:ring-white/10"
      >
        <UIcon
          name="i-mdi-view-grid-outline"
          class="shrink-0 text-[12px] text-slate-600 dark:text-slate-200"
        />
        <span class="truncate">{{ roundText }}</span>
      </span>
      <span
        class="inline-flex min-w-0 items-center justify-center gap-1 rounded-lg bg-white/75 px-2 py-1 text-[10px] font-semibold text-slate-800 ring-1 ring-black/5 dark:bg-black/25 dark:text-slate-100 dark:ring-white/10"
      >
        <UIcon name="i-heroicons-clock" class="shrink-0 text-[12px] text-slate-600 dark:text-slate-200" />
        <span class="truncate">{{ timeText }}</span>
      </span>
      <UTooltip v-if="showRefereeIcon" :text="`الحكم: ${data.match.referee?.username}`">
        <button
          class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-blue-400/80 text-blue-700 transition hover:bg-blue-100/80 dark:border-blue-500/70 dark:text-blue-300 dark:hover:bg-blue-900/30"
        >
          <IconRefree class="text-[11px]" />
        </button>
      </UTooltip>
      <UTooltip v-if="vm.showInfoButton" text="فتح حالة المباراة">
        <button
          class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-emerald-500/90 text-emerald-800 transition hover:bg-emerald-100/70 dark:border-emerald-400/80 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
          @click="openStatusModal"
        >
          <IconInfo class="text-[11px]" />
        </button>
      </UTooltip>
      <UTooltip :text="vm.matchStatusText" :disabled="!vm.matchStatusText">
        <div
          class="flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-black/5 dark:ring-white/10"
          :class="vm.nodeStatusBadgeClass"
        >
          <IconSleepGame v-if="vm.statusIcon === 'sleep'" class="text-[11px]" />
          <IconRunningGame v-else-if="vm.statusIcon === 'running'" class="text-[11px]" />
          <IconEndedGame v-else class="text-[11px]" />
        </div>
      </UTooltip>
      <span
        class="inline-flex min-w-0 items-center justify-center gap-1 rounded-lg bg-white/75 px-2 py-1 text-[10px] font-semibold text-slate-800 ring-1 ring-black/5 dark:bg-black/25 dark:text-slate-100 dark:ring-white/10"
      >
        <UIcon
          name="i-mdi-cards-playing-outline"
          class="shrink-0 text-[12px] text-slate-600 dark:text-slate-200"
        />
        <span class="truncate">{{ sakkaText }}</span>
      </span>
      <UDropdownMenu
        v-if="userStore.user && (userStore.isStaffAdmin || userStore.isSuperAdmin)"
        :items="adminActionItems"
        :popper="{ placement: 'bottom-end' }"
      >
        <UTooltip text="إجراءات المباراة">
          <button
            type="button"
            class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-400/70 bg-white/90 text-slate-700 shadow-sm ring-1 ring-black/5 transition hover:bg-slate-100 dark:border-slate-500/60 dark:bg-gray-900/90 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-gray-800"
            aria-haspopup="menu"
          >
            <UIcon name="i-heroicons-ellipsis-vertical" class="size-4" />
          </button>
        </UTooltip>
      </UDropdownMenu>
    </div>

    <MatchAdminActionConfirmModal
      v-model:open="resetConfirmOpen"
      title="تأكيد إعادة الضبط"
      description="سيتم إعادة ضبط المباراة إلى حالتها الأولية. تأكد من تنفيذ الخطوات التالية قبل المتابعة."
      confirm-label="نعم، إعادة الضبط"
      confirm-icon="i-heroicons-arrow-path"
      confirm-color="warning"
      :pending="isResetPending"
      @confirm="confirmReset"
    />
    <MatchAdminActionConfirmModal
      v-model:open="backConfirmOpen"
      title="تأكيد عودة المباراة"
      description="سيتم إرجاع المباراة إلى حالة سابقة. تأكد من تنفيذ الخطوات التالية قبل المتابعة."
      confirm-label="نعم، عودة المباراة"
      confirm-icon="i-heroicons-arrow-left"
      confirm-color="warning"
      :pending="isBackPending"
      @confirm="confirmBack"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Match } from "@/features/tournament/models/group";
import { useMyAuthStore } from "@/store/Auth";
import StatusModal from "./StatusModal.vue";
import EditModal from "./EditModal.vue";
import MatchAdminActionConfirmModal from "./MatchAdminActionConfirmModal.vue";
import { useMatchNodeShared } from "~/features/tournament/bracket/composables/useMatchNodeShared";
import type { MatchActionType } from "~/features/tournament/match/types/matchAction.types";

const userStore = useMyAuthStore();
const props = defineProps<{ data: { match: Match; showLogo?: boolean } }>();

const overlay = useOverlay();
const toast = useToast();

const route = useRoute();
const config = useRuntimeConfig();
const tournamentId = route.params.id?.toString() ?? "";

const match = computed(() => props.data.match);

const {
  vm,
  roundOpacityClass,
  hasStaffOrAdminPrivileges,
  usTeamPrimary,
  usTeamSecondary,
  themTeamPrimary,
  themTeamSecondary,
  firstTeamSurfaceClass,
  secondTeamSurfaceClass,
} = useMatchNodeShared(match);

const showRefereeIcon = computed(
  () => hasStaffOrAdminPrivileges.value && props.data.match.referee,
);
const tableText = computed(() => props.data.match.tableName || "بدون طاولة");
const roundText = computed(() => props.data.match.roundName || "بدون جولة");
const timeText = computed(() =>
  props.data.match.startAt ? formatDateTime(props.data.match.startAt) : "بدون وقت",
);
const sakkaText = computed(() => {
  const count = props.data.match.maxSakkasCountFromGame;
  if (count == null || count <= 0) return "—";
  if (count === 1) return "صكة واحدة";
  if (count === 3) return "3 صكات";
  if (count === 5) return "5 صكات";
  return `${count} صكات`;
});

const openStatusModal = () => {
  overlay.create(StatusModal, { props: { m: props.data.match } }).open();
};

const { MatchReset, MatchBack } = useMatch();
const MatchResetREQ = MatchReset();
const MatchBackREQ = MatchBack();

const resetConfirmOpen = ref(false);
const backConfirmOpen = ref(false);

const isResetPending = computed(() => MatchResetREQ.status.value === "pending");
const isBackPending = computed(() => MatchBackREQ.status.value === "pending");

const openResetConfirm = () => {
  resetConfirmOpen.value = true;
};

const openBackConfirm = () => {
  backConfirmOpen.value = true;
};

const confirmReset = async () => {
  await MatchResetREQ.fetchREQ(props.data.match.qydhaGameId);
  if (MatchResetREQ.status.value === "success") {
    resetConfirmOpen.value = false;
  }
  toast.add({
    title: MatchResetREQ.status.value === "success" ? "تم الضبط بنجاح" : "خطأ في الضبط",
    color: MatchResetREQ.status.value === "success" ? "success" : "error",
  });
};

const confirmBack = async () => {
  await MatchBackREQ.fetchREQ(props.data.match.qydhaGameId);
  if (MatchBackREQ.status.value === "success") {
    backConfirmOpen.value = false;
  }
  toast.add({
    title: MatchBackREQ.status.value === "success" ? "تم العودة بنجاح" : "خطأ في العودة",
    color: MatchBackREQ.status.value === "success" ? "success" : "error",
  });
};

const copyClibboard = async () => {
  try {
    await navigator.clipboard.writeText(`
    id:${props.data.match.id}
    qydhaGameId: ${props.data.match.qydhaGameId}
    refereeId: ${props.data.match.referee?.id}
    `);
    toast.add({
      title: "Copied!",
      description: "Match details copied to clipboard",
      duration: 2000,
    });
  } catch (error) {
    console.error("Failed to copy text to clipboard:", error);
    toast.add({ title: "Error", description: "Failed to copy to clipboard", color: "error" });
  }
};

const onEdit = () => {
  overlay.create(EditModal, { props: { match: props.data.match } }).open();
};

const copyStream = async () => {
  console.log("copyStream");
  try {
    const streamUrl = `${config.public.streamBase}/${tournamentId}/${props.data.match.id}`;
    await navigator.clipboard.writeText(streamUrl);
    toast.add({
      title: "Copied!",
      description: "Stream URL copied to clipboard",
      duration: 2000,
    });
  }
  catch (error) {
    console.error("Failed to copy text to clipboard:", error);
    toast.add({ title: "Error", description: "Failed to copy to clipboard", color: "error" });
  }

};

const runAdminAction = (type: MatchActionType) => {
  switch (type) {
    case "edit":
      onEdit();
      break;
    case "reset":
      openResetConfirm();
      break;
    case "back":
      openBackConfirm();
      break;
    case "copy":
      copyClibboard();
      break;
    case "copyStream":
      copyStream();
      break;
  }
};

const adminActionItems = computed(() => [
  vm.value.adminActions.map((action) => ({
    label: action.label,
    icon: action.icon,
    onSelect: () => runAdminAction(action.type),
  })),
]);
</script>
