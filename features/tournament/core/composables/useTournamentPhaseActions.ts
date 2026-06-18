import SetupTournamentModal from "~/features/tournament/core/components/SetupTournamentModal.vue";
import type {
  PhaseActionId,
  ResolvedPhaseAction,
} from "~/features/tournament/core/types";

export function useTournamentPhaseActions(
  tournamentId: string,
  onRefreshed: () => void,
) {
  const toast = useToast();
  const overlay = useOverlay();
  const setupModal = overlay.create(SetupTournamentModal);

  const approveConfirmOpen = ref(false);
  const startConfirmOpen = ref(false);

  const {
    setupTournament,
    approveTournamentPlan,
    startFinalGroupTournament,
    finishTournament,
    resumeFinalGroupAfterFinish,
  } = useTournament();

  const setupReq = setupTournament(tournamentId);
  const approveReq = approveTournamentPlan();
  const startReq = startFinalGroupTournament(tournamentId);
  const finishReq = finishTournament();
  const resumeReq = resumeFinalGroupAfterFinish();

  const setupPending = computed(
    () => setupReq.result.status.value === "pending",
  );
  const approvePending = computed(() => approveReq.status.value === "pending");
  const startPending = computed(
    () => startReq.result.status.value === "pending",
  );
  const finishPending = computed(() => finishReq.status.value === "pending");
  const resumePending = computed(() => resumeReq.status.value === "pending");

  const pendingByAction = computed<Record<PhaseActionId, boolean>>(() => ({
    organize: setupPending.value,
    approvePlan: approvePending.value,
    start: startPending.value,
    finish: finishPending.value,
    resume: resumePending.value,
  }));

  async function handleOrganizeTournament() {
    const instance = setupModal.open();
    const confirmed = await instance.result;
    if (!confirmed) return;

    await setupReq.fetchREQ(confirmed);
    if (setupReq.result.status.value === "success") {
      onRefreshed();
    } else {
      toast.add({
        title: "تعذّر تنظيم البطولة",
        color: "error",
      });
    }
  }

  async function confirmApprovePlan() {
    await approveReq.fetchREQ(tournamentId);
    if (approveReq.status.value === "success") {
      toast.add({
        title: "تمت الموافقة على مخطط البطولة",
        color: "success",
      });
      approveConfirmOpen.value = false;
      onRefreshed();
    } else {
      toast.add({
        title: "تعذّرت الموافقة على المخطط",
        color: "error",
      });
    }
  }

  async function confirmStart() {
    await startReq.fetchREQ();
    if (startReq.result.status.value === "success") {
      toast.add({
        title: "تم بدء المباريات في المجموعة النهائية",
        description: "تم بدء المباريات في المجموعة النهائية بنجاح",
        color: "success",
      });
      startConfirmOpen.value = false;
      onRefreshed();
    } else {
      const err = startReq.result.error.value as
        | { message?: string }
        | null
        | undefined;
      toast.add({
        title: "تعذّر بدء البطولة",
        description: err?.message ?? "تحقق من الاتصال وحاول مرة أخرى.",
        color: "error",
      });
    }
  }

  async function handleFinish() {
    await finishReq.fetchREQ(tournamentId);
    if (finishReq.status.value === "success") {
      toast.add({
        title: "تم انهاء البطولة",
        description: "تم انهاء البطولة بنجاح",
        color: "success",
      });
      onRefreshed();
    } else if (
      finishReq.error.value?.data?.code === "InvalidTournamentOperation"
    ) {
      toast.add({
        title: "تعذّر انهاء البطولة",
        description: "لا يمكن انهاء البطولة الا بعد انهاء كل المباريات",
        color: "error",
      });
    }
  }

  async function handleResume() {
    await resumeReq.fetchREQ(tournamentId);
    if (resumeReq.status.value === "success") {
      toast.add({
        title: "تم استكمال البطولة",
        color: "success",
      });
      onRefreshed();
    } else {
      const err = resumeReq.error.value as
        | { message?: string }
        | null
        | undefined;
      toast.add({
        title: "تعذّر استكمال البطولة",
        description: err?.message ?? "تحقق من الاتصال وحاول مرة أخرى.",
        color: "error",
      });
    }
  }

  function runAction(action: ResolvedPhaseAction) {
    if (action.confirm === "setup") {
      void handleOrganizeTournament();
      return;
    }
    if (action.confirm === "approvePlan") {
      approveConfirmOpen.value = true;
      return;
    }
    if (action.confirm === "start") {
      startConfirmOpen.value = true;
      return;
    }
    if (action.id === "finish") {
      void handleFinish();
      return;
    }
    if (action.id === "resume") {
      void handleResume();
    }
  }

  return {
    approveConfirmOpen,
    startConfirmOpen,
    approvePending,
    startPending,
    pendingByAction,
    runAction,
    confirmApprovePlan,
    confirmStart,
  };
}
