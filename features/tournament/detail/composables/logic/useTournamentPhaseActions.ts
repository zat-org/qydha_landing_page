import { ConfirmationModal } from "#components";
import SetupTournamentModal from "~/features/tournament/detail/components/SetupTournamentModal.vue";
import type {
  PhaseAction,
  PhaseActionId,
  PhaseApi,
} from "~/features/tournament/detail/types/phase.types";
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
  const qualGenerateOpen = ref(false);

  const setupModal = overlay.create(SetupTournamentModal, {
    props: { tournamentId },
  });
  const confirmationModal = overlay.create(ConfirmationModal);

  const pendingByAction = computed<Record<PhaseActionId, boolean>>(() => ({
    organize: pending.value && runningId.value === "organize",
    generateQualificationBrackets:
      pending.value && runningId.value === "generateQualificationBrackets",
    revertQualificationTeamLinking:
      pending.value && runningId.value === "revertQualificationTeamLinking",
    revertQualificationGeneratedBrackets:
      pending.value && runningId.value === "revertQualificationGeneratedBrackets",
    confirmQualificationBrackets:
      pending.value && runningId.value === "confirmQualificationBrackets",
    confirmQualificationResults:
      pending.value && runningId.value === "confirmQualificationResults",
    confirmFinalStageTeams:
      pending.value && runningId.value === "confirmFinalStageTeams",
    revertFinalGroupTeamsLinks:
      pending.value && runningId.value === "revertFinalGroupTeamsLinks",
    approvePlan: pending.value && runningId.value === "approvePlan",
    start: pending.value && runningId.value === "start",
    finish: pending.value && runningId.value === "finish",
    resume: pending.value && runningId.value === "resume",
  }));

  const successTitle: Record<PhaseActionId, string> = {
    organize: "تم بدء تنظيم البطولة",
    generateQualificationBrackets: "تم توليد مباريات التصفيات",
    revertQualificationTeamLinking: "تم التراجع عن تنظيم التصفيات",
    revertQualificationGeneratedBrackets: "تم التراجع عن إنشاء مباريات التصفيات",
    confirmQualificationBrackets: "تم اعتماد جدول مباريات التصفيات",
    confirmQualificationResults: "تم اعتماد نتائج التصفيات وتأهيل الفرق للنهائي",
    confirmFinalStageTeams: "تم اعتماد فرق المرحلة النهائية",
    revertFinalGroupTeamsLinks: "تم التراجع عن ربط الفرق",
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
        title: successTitle[action.id] ?? "تمت العملية بنجاح",
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

    const err = error.value as { message?: string; data?: { message?: string } } | null;
    toast.add({
      title: "تعذّر تنفيذ العملية",
      description: err?.data?.message ?? err?.message,
      color: "error",
    });
  }

  async function handleOrganizeTournament() {
    const instance = setupModal.open();
    const confirmed = await instance.result;
    if (!confirmed) return;
    await mutateAction(organizeAction);
  }

  function findAction(id: PhaseActionId): PhaseAction | undefined {
    return phaseStore.phaseConfig.actions.find((item) => item.id === id);
  }

  async function runAction(action: PhaseAction) {
    if (action.confirm === "setup") {
      await handleOrganizeTournament();
      return;
    }
    if (action.confirm === "generateQualificationBrackets") {
      qualGenerateOpen.value = true;
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
    if (action.id === "revertQualificationTeamLinking") {
      const instance = confirmationModal.open({
        message:
          "هل أنت متأكد من التراجع عن تنظيم التصفيات وحذف مجموعات التصفيات المولدة؟",
      });
      if (await instance.result) {
        await mutateAction(action);
      }
      return;
    }
    if (action.id === "revertQualificationGeneratedBrackets") {
      const instance = confirmationModal.open({
        message:
          "هل أنت متأكد من التراجع عن إنشاء مباريات التصفيات والعودة لربط الفرق؟",
      });
      if (await instance.result) {
        await mutateAction(action);
      }
      return;
    }
    if (action.id === "confirmQualificationBrackets") {
      const instance = confirmationModal.open({
        message:
          "هل أنت متأكد من اعتماد جدول مباريات التصفيات؟ سيتم إرسال إشعارات المواعيد للاعبين المشاركين.",
      });
      if (await instance.result) {
        await mutateAction(action);
      }
      return;
    }
    if (action.id === "confirmQualificationResults") {
      const instance = confirmationModal.open({
        message:
          "هل أنت متأكد من اعتماد نتائج التصفيات وتأهيل الفرق الفائزة للمرحلة النهائية؟",
      });
      if (await instance.result) {
        await mutateAction(action);
      }
      return;
    }
    if (action.id === "confirmFinalStageTeams") {
      const instance = confirmationModal.open({
        message:
          "هل أنت متأكد من اعتماد فرق المرحلة النهائية وربطها بالمجموعة النهائية؟",
      });
      if (await instance.result) {
        await mutateAction(action);
      }
      return;
    }
    if (action.id === "revertFinalGroupTeamsLinks") {
      const instance = confirmationModal.open({
        message:
          "هل أنت متأكد من التراجع عن ربط الفرق بالمجموعة النهائية والعودة لإدارة الفرق؟",
      });
      if (await instance.result) {
        await mutateAction(action);
      }
      return;
    }

    await mutateAction(action);
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
    qualGenerateOpen,
    approvePending: computed(() => pendingByAction.value.approvePlan),
    startPending: computed(() => pendingByAction.value.start),
    pendingByAction,
    runAction,
    confirmApprovePlan,
    confirmStart,
    mutateAction,
  };
}
