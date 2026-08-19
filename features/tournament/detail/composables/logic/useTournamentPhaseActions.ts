import SetupTournamentModal from "~/features/tournament/detail/components/SetupTournamentModal.vue";
import SetupQualificationsModal from "~/features/tournament/detail/components/SetupQualificationsModal.vue";
import type {
  PhaseAction,
  PhaseActionId,
  PhaseApi,
} from "~/features/tournament/detail/types/phase.types";
import type { SetupTournamentPayload } from "~/features/tournament/detail/composables/api/useSetupTournament";
import { organizeAction } from "~/features/tournament/phase/phaseActions";
import { useTournamentPhaseStore } from "~/store/tournamentPhase";

export function useTournamentPhaseActions(
  tournamentId: string,
  onRefreshed: () => void,
) {
  const toast = useToast();
  const overlay = useOverlay();
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();
  const phaseStore = useTournamentPhaseStore();

  const runningId = ref<PhaseActionId | null>(null);
  const approveConfirmOpen = ref(false);
  const startConfirmOpen = ref(false);

  const setupModal = overlay.create(SetupTournamentModal, {
    props: { tournamentId },
  });
  const qualsModal = overlay.create(SetupQualificationsModal, {
    props: { tournamentId },
  });

  const pendingByAction = computed<Record<PhaseActionId, boolean>>(() => ({
    organize: pending.value && runningId.value === "organize",
    approvePlan: pending.value && runningId.value === "approvePlan",
    start: pending.value && runningId.value === "start",
    finish: pending.value && runningId.value === "finish",
    resume: pending.value && runningId.value === "resume",
  }));

  const successTitle: Record<PhaseActionId, string> = {
    organize: "تم بدء تنظيم البطولة",
    approvePlan: "تمت الموافقة على مخطط البطولة",
    start: "تم بدء المباريات في المجموعة النهائية",
    finish: "تم انهاء البطولة",
    resume: "تم استكمال البطولة",
  };

  async function mutateAction(action: PhaseAction, extra?: unknown) {
    const ctx = phaseStore.context;
    if (!action.canExecute(ctx)) return;

    runningId.value = action.id;
    await execute(async () => {
      await action.service(ctx, $api as PhaseApi, extra);
    });
    runningId.value = null;

    if (status.value === "success") {
      toast.add({
        title: successTitle[action.id],
        color: "success",
      });
      approveConfirmOpen.value = false;
      startConfirmOpen.value = false;
      onRefreshed();
      return;
    }

    if (
      action.id === "finish" &&
      error.value?.data?.code === "InvalidTournamentOperation"
    ) {
      toast.add({
        title: "تعذّر انهاء البطولة",
        description: "لا يمكن انهاء البطولة الا بعد انهاء كل المباريات",
        color: "error",
      });
      return;
    }

    toast.add({
      title: "تعذّر تنفيذ العملية",
      description: error.value?.message,
      color: "error",
    });
  }

  async function handleOrganizeTournament() {
    const instance = setupModal.open();
    const confirmed = await instance.result;
    if (!confirmed) return;

    if (confirmed === "direct") {
      await mutateAction(organizeAction, { type: "direct" });
      return;
    }

    if (confirmed === "qualifications") {
      const qualsInstance = qualsModal.open();
      const groups = await qualsInstance.result;
      if (!groups) return;
      const payload: SetupTournamentPayload = {
        type: "qualifications",
        groups,
      };
      await mutateAction(organizeAction, payload);
    }
  }

  function findAction(id: PhaseActionId): PhaseAction | undefined {
    return phaseStore.phaseConfig.actions.find((item) => item.id === id);
  }

  function runAction(action: PhaseAction) {
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
    void mutateAction(action);
  }

  async function confirmApprovePlan() {
    const action = findAction("approvePlan");
    if (action) await mutateAction(action);
  }

  async function confirmStart() {
    const action = findAction("start");
    if (action) await mutateAction(action);
  }

  return {
    approveConfirmOpen,
    startConfirmOpen,
    approvePending: computed(() => pendingByAction.value.approvePlan),
    startPending: computed(() => pendingByAction.value.start),
    pendingByAction,
    runAction,
    confirmApprovePlan,
    confirmStart,
    mutateAction,
  };
}
