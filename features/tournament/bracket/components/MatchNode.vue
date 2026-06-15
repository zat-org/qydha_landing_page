<template>
  <div>
    <Handle type="target" :position="Position.Left" style="opacity: 0" />
    <div dir="rtl"
      class=" flex w-[450px] flex-col gap-2 p-2 overflow-hidden rounded-2xl  text-sm font-semibold shadow-sm ring-1 ring-black/5 backdrop-blur-[1px] transition-all duration-300 hover:shadow-xl dark:ring-white/10 dark:bg-gray-800"
      :class="[cardToneClass, roundOpacityClass]">


      <div class="grid grid-cols-[minmax(0,0.9fr)_auto_minmax(0,0.9fr)] items-stretch gap-1.5">
        <div :class="firstTeamSurfaceClass"
          class="group min-w-0 rounded-xl px-1.5 py-1.5 ring-1 ring-black/5 transition-all duration-200 dark:ring-white/10">
          <div class="flex h-full items-center justify-center gap-1 min-h-[30px]">
            <div class="flex flex-col h-full items-center justify-center grow ">
              <span class="truncate text-center  text-[11px] font-bold leading-tight" :class="firstTeamNameClasses">{{
                usTeamPrimary }}</span>
              <p class="truncate text-center text-[11px] font-bold leading-tight">
                {{ usTeamSecondary }}
              </p>
            </div>
            <UIcon name="i-mdi-cards-spade" class="size-3.5 shrink-0 text-indigo-700 dark:text-indigo-300" />
          </div>
        </div>
        <div
          class="inline-flex items-center justify-center self-center rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black text-slate-700 ring-1 ring-black/10 dark:bg-black/35 dark:text-slate-100 dark:ring-white/10">
          VS
        </div>

        <div :class="secondTeamSurfaceClass"
          class="group min-w-0 rounded-xl px-1.5 py-1.5 ring-1 ring-black/5 transition-all duration-200 dark:ring-white/10">
          <div class="flex items-center justify-center gap-1 min-h-[30px]">
            <UIcon name="i-mdi-cards-club" class="size-3.5 shrink-0 text-fuchsia-700 dark:text-fuchsia-300" />
            <div class="flex flex-col h-full items-center justify-center grow">
              <span class="truncate text-center  text-[11px] font-bold leading-tight" :class="secondTeamNameClasses">{{
                themTeamPrimary }}</span>
              <p class="truncate text-center text-[11px] font-bold leading-tight">
                {{ themTeamSecondary }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center  gap-1.5 *:grow">
        <span
          class="inline-flex min-w-0 items-center justify-center gap-1 rounded-lg bg-white/75 px-2 py-1 text-[10px] font-semibold text-slate-800 ring-1 ring-black/5 dark:bg-black/25 dark:text-slate-100 dark:ring-white/10">
          <IconTable class="shrink-0 text-[12px] text-slate-700 dark:text-slate-200" />
          <span class="truncate">{{ tableText }}</span>
        </span>
        <span
          class="inline-flex min-w-0 items-center justify-center gap-1 rounded-lg bg-white/75 px-2 py-1 text-[10px] font-semibold text-slate-800 ring-1 ring-black/5 dark:bg-black/25 dark:text-slate-100 dark:ring-white/10">
          <UIcon name="i-mdi-view-grid-outline" class="shrink-0 text-[12px] text-slate-600 dark:text-slate-200" />
          <span class="truncate">{{ roundText }}</span>
        </span>
        <span
          class="inline-flex min-w-0 items-center justify-center gap-1 rounded-lg bg-white/75 px-2 py-1 text-[10px] font-semibold text-slate-800 ring-1 ring-black/5 dark:bg-black/25 dark:text-slate-100 dark:ring-white/10">
          <UIcon name="i-heroicons-clock" class="shrink-0 text-[12px] text-slate-600 dark:text-slate-200" />
          <span class="truncate">{{ timeText }}</span>
        </span>
        <UTooltip v-if="showRefereeIcon" :text="`الحكم: ${data.match.referee?.username}`">
          <button
            class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-blue-400/80 text-blue-700 transition hover:bg-blue-100/80 dark:border-blue-500/70 dark:text-blue-300 dark:hover:bg-blue-900/30">
            <IconRefree class="text-[11px]" />
          </button>
        </UTooltip>
        <UTooltip v-if="showInfoButton" text="فتح حالة المباراة">
          <button
            class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-emerald-500/90 text-emerald-800 transition hover:bg-emerald-100/70 dark:border-emerald-400/80 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
            @click="onclick">
            <IconInfo class="text-[11px]" />

          </button>
        </UTooltip>
        <UTooltip :text="matchStatusText" :disabled="!matchStatusText">
          <div class=" flex h-6 w-6 items-center justify-center rounded-full ring-1 ring-black/5 dark:ring-white/10"
            :class="statusBadgeClass">
            <IconSleepGame v-if="isMatchCreatedOrPaused" class="text-[11px]" />
            <IconRunningGame v-if="isMatchRunning" class="text-[11px]" />
            <IconEndedGame v-if="isMatchEnded" class="text-[11px]" />
          </div>
        </UTooltip>

        <span
          class="inline-flex min-w-0 items-center justify-center gap-1 rounded-lg bg-white/75 px-2 py-1 text-[10px] font-semibold text-slate-800 ring-1 ring-black/5 dark:bg-black/25 dark:text-slate-100 dark:ring-white/10">
          <UIcon name="i-mdi-cards-playing-outline" class="shrink-0 text-[12px] text-slate-600 dark:text-slate-200" />
          <span class="truncate">{{ sakkaText }}</span>
        </span>

        <UDropdownMenu  v-if="userStore.user && (userStore.isStaffAdmin || userStore.isSuperAdmin)"
          :items="adminActionItems" :popper="{ placement: 'bottom-end' }">
          <UTooltip text="إجراءات المباراة">
            <button type="button"
              class="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-400/70 bg-white/90 text-slate-700 shadow-sm ring-1 ring-black/5 transition hover:bg-slate-100 dark:border-slate-500/60 dark:bg-gray-900/90 dark:text-slate-200 dark:ring-white/10 dark:hover:bg-gray-800"
              aria-haspopup="menu">
              <UIcon name="i-heroicons-ellipsis-vertical" class="size-4" />
            </button>
          </UTooltip>
        </UDropdownMenu>
      </div>





    </div>

    <Handle type="source" :position="Position.Right" style="opacity: 0" />

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
import { Position, Handle } from "@vue-flow/core";
import { GroupState, type Match } from "@/features/tournament/models/group";
import { useMyAuthStore } from "@/store/Auth";
import StatusModal from "./StatusModal.vue";
import EditModal from "./EditModal.vue";
import MatchAdminActionConfirmModal from "./MatchAdminActionConfirmModal.vue";
import { useMyTournamentStore } from "~/features/tournament/core/stores/tournament";
import { useMatchNodeUi } from "~/features/tournament/bracket/composables/useMatchNodeUi";

const userStore = useMyAuthStore();
const props = defineProps<{ data: { match: Match; showLogo?: boolean } }>();

const tourStore = useMyTournamentStore();
const { selectedRound } = storeToRefs(tourStore);
const useStore = useMyAuthStore();
const { privilege } = storeToRefs(useStore);
const overlay = useOverlay();
const toast = useToast();

const match = computed(() => props.data.match);
const selectedRoundName = computed(() => selectedRound.value?.name);

const {
  hasStaffOrAdminPrivileges,
  isMatchCreatedOrPaused,
  isMatchRunning,
  isMatchEnded,
  isMatchPaused,
  isMatchCreated,
  showInfoButton,
  cardToneClass,
  roundOpacityClass,
  firstTeamClasses,
  secondTeamClasses,
  firstTeamNameClasses,
  secondTeamNameClasses,
  matchStatusText,
} = useMatchNodeUi(match, selectedRoundName, privilege);

const showRefereeIcon = computed(() => hasStaffOrAdminPrivileges.value && props.data.match.referee);
const tableText = computed(() => props.data.match.tableName || "بدون طاولة");
const roundText = computed(() => props.data.match.roundName || "بدون جولة");
const timeText = computed(() => (props.data.match.startAt ? formatDateTime(props.data.match.startAt) : "بدون وقت"));
const sakkaText = computed(() => {
  const count = props.data.match.maxSakkasCountFromGame;
  if (count == null || count <= 0) return "—";
  if (count === 1) return "صكة واحدة";
  if (count === 3) return "3 صكات";
  if (count === 5) return "5 صكات";
  return `${count} صكات`;
});
const statusBadgeClass = computed(() => {
  if (isMatchRunning.value) return "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300";
  if (isMatchEnded.value) return "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300";
  return "bg-slate-100 text-slate-600 dark:bg-slate-900/60 dark:text-slate-300";
});

const buildTeamDisplay = (teamName?: string | null, hasTeamId?: string | null) => {
  const normalizedName = (teamName || "").trim();

  if (normalizedName) {
    const [primary, secondary] = normalizedName.split("|").map((part) => part.trim()).filter(Boolean);
    return {
      primary: primary || normalizedName,
      secondary: secondary || " ",
    };
  }

  if (!hasTeamId && props.data.match.state !== "Ended") {
    return { primary: "لم يحدد بعد", secondary: " " };
  }

  return { primary: "انسحب كلا الفريقين", secondary: "" };
};
const usTeamDisplay = computed(() => buildTeamDisplay(props.data.match.usTeamName, props.data.match.usTeamId));
const themTeamDisplay = computed(() => buildTeamDisplay(props.data.match.themTeamName, props.data.match.themTeamId));
const usTeamPrimary = computed(() => usTeamDisplay.value.primary);
const usTeamSecondary = computed(() => usTeamDisplay.value.secondary);
const themTeamPrimary = computed(() => themTeamDisplay.value.primary);
const themTeamSecondary = computed(() => themTeamDisplay.value.secondary);

const onclick = () => {
  overlay.create(StatusModal, { props: { m: props.data.match } }).open();
};

const { MatchReset, MatchBack } = useMatch();
const MatchResetREQ = await MatchReset();
const MatchBackREQ = await MatchBack();

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
    toast.add({ title: "Copied!", description: "Match details copied to clipboard", duration: 2000 });
  } catch (error) {
    console.error("Failed to copy text to clipboard:", error);
    toast.add({ title: "Error", description: "Failed to copy to clipboard", color: "error" });
  }
};

const onEdit = () => {
  overlay.create(EditModal, { props: { match: props.data.match } }).open();
};

const isGroupRunning = computed(() =>{
  return   tourStore.selectedGroup?.data.state == GroupState.MatchesRunning});
const adminActionItems = computed(() => {
  const items: { label: string; icon: string; onSelect: () => void }[] = [];
  if ((isMatchCreated.value || isMatchPaused.value ) && isGroupRunning.value) {
    items.push({ label: "تعديل المباراة", icon: "i-heroicons-cog-6-tooth", onSelect: onEdit });
  }
    if ((isMatchEnded.value || isMatchPaused.value) && isGroupRunning.value) {
    items.push({ label: "اعادة الضبط", icon: "i-heroicons-arrow-path", onSelect: openResetConfirm });
  }
  if (isMatchEnded.value && isGroupRunning.value &&  (match.value.level ==1 || match.value.parentMatch?.state == "Created" )) {

    items.push(
      { label: "مسح اخر  مشتري", icon: "i-heroicons-arrow-left", onSelect: openBackConfirm },
    );
  }


  items.push({ label: "نسخ معلومات المباراة", icon: "i-heroicons-clipboard-document", onSelect: copyClibboard });
  return [items];
});


// Final (level 1): winner gets gold gradient, runner-up gets silver.
const isTournamentFinalPlacement = computed(
  () =>
    match.value.level === 1 &&
    match.value.state === "Ended" &&
    (match.value.winner?.toLowerCase() === "us" || match.value.winner?.toLowerCase() === "them"),
);

const firstClass = computed(
  () =>
    "bg-gradient-to-br from-amber-200/95 via-yellow-300/95 to-amber-600/95 text-amber-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] ring-1 ring-amber-400/55 dark:from-amber-500/45 dark:via-yellow-500/40 dark:to-amber-800/55 dark:text-amber-50 dark:ring-amber-400/30",
);

const secondClass = computed(
  () =>
    "bg-gradient-to-br from-slate-200/95 via-zinc-100/95 to-slate-500/95 text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] ring-1 ring-slate-400/50 dark:from-slate-600/45 dark:via-zinc-600/40 dark:to-slate-800/50 dark:text-slate-100 dark:ring-slate-500/30",
);

const firstTeamSurfaceClass = computed(() => {
  if (!isTournamentFinalPlacement.value) return firstTeamClasses.value;
  return match.value.winner?.toLowerCase() === "us" ? firstClass.value : secondClass.value;
});

const secondTeamSurfaceClass = computed(() => {
  if (!isTournamentFinalPlacement.value) return secondTeamClasses.value;
  return match.value.winner?.toLowerCase() === "them" ? firstClass.value : secondClass.value;
});



</script>

<style>
.dark {
  color-scheme: dark;
}
</style>
