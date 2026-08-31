import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import type { PhaseStateConfig } from "~/features/tournament/detail/types/phase.types";
import TournamentTeam from "~/features/tournament/teams/components/TournamentTeam.vue";
import TournamentJoiningRequest from "~/features/tournament/join-request/components/TournamentJoiningRequest.vue";
import TournamentGroup from "~/features/tournament/group/components/TournamentGroup.vue";
import {
  approvePlanAction,
  confirmFinalStageTeamsAction,
  confirmQualificationBracketsAction,
  confirmQualificationResultsAction,
  finishAction,
  generateQualificationBracketsAction,
  organizeAction,
  resumeAction,
  revertFinalGroupTeamsLinksAction,
  revertQualificationGeneratedBracketsAction,
  revertQualificationTeamLinkingAction,
  startAction,
} from "./phaseActions";

export const UNKNOWN_PHASE_CONFIG: PhaseStateConfig = {
  label: "حالة غير معروفة",
  ui: {
    alert: {
      color: "warning",
      title: "حالة غير معروفة أو محدثة",
      description:
        "تأكد من تحديث الصفحة. يمكنك متابعة إدارة البطولة من التبويبات أدناه.",
    },
  },
  view: null,
  actions: [],
};

export const TOURNAMENT_PHASE_CONFIG: Record<
  TournamentDetailedState,
  PhaseStateConfig
> = {
  [TournamentDetailedState.Created]: {
    label: "إنشاء البطولة",
    ui: {
      description: "ابدأ بإعداد البطولة والفرق حسب سياسة الانضمام.",
    },
    view: TournamentTeam,
    actions: [],
  },
  [TournamentDetailedState.ReceivingJoinRequests]: {
    label: "استقبال طلبات الانضمام",
    ui: {
      description:
        "مرحلة استقبال الطلبات — عرض الطلبات دون اتخاذ إجراء من لوحة التحكم هنا.",
    },
    view: TournamentJoiningRequest,
    actions: [],
  },
  [TournamentDetailedState.ManagingJoinRequests]: {
    label: "إدارة طلبات الانضمام",
    ui: {
      description: "يمكنك قبول الطلبات أو رفضها.",
    },
    view: TournamentJoiningRequest,
    actions: [],
  },
  [TournamentDetailedState.ManagingTeams]: {
    label: "إعداد الفرق",
    ui: {
      heading: "إعداد الفرق",
      description:
        "أضف الفرق واللاعبين، ثم ابدأ تنظيم البطولة للانتقال للمرحلة التالية.",
    },
    view: TournamentTeam,
    actions: [organizeAction],
  },
  [TournamentDetailedState.LinkingQualificationStageTeams]: {
    label: "ربط فرق مرحلة التصفيات",
    ui: {
      alert: {
        color: "info",
        title: "ربط فرق التصفيات",
        description:
          "وزّع الفرق على مجموعات التصفيات أو قم بتوليد المباريات.",
      },
    },
    view: TournamentGroup,
    actions: [
      revertQualificationTeamLinkingAction,
      generateQualificationBracketsAction,
    ],
  },
  [TournamentDetailedState.ManagingQualificationStageBrackets]: {
    label: "إدارة مباريات التصفيات",
    ui: {
      alert: {
        color: "info",
        title: "إدارة مباريات التصفيات",
        description:
          "راجع مباريات مجموعات التصفيات، يمكنك إعادة الإنشاء أو التراجع أو اعتماد الجدول للانتقال للبدء.",
      },
    },
    view: TournamentGroup,
    actions: [
      revertQualificationGeneratedBracketsAction,
      generateQualificationBracketsAction,
      confirmQualificationBracketsAction,
    ],
  },
  [TournamentDetailedState.WaitingQualificationStageStarting]: {
    label: "في انتظار بدء التصفيات",
    ui: {
      alert: {
        color: "info",
        title: "جاهز لبدء مرحلة التصفيات",
        description:
          "تم اعتماد جدول التصفيات. يمكنك بدء تشغيل المجموعات من صفحة المجموعات أدناه.",
      },
    },
    view: TournamentGroup,
    actions: [],
  },
  [TournamentDetailedState.QualificationStageRunning]: {
    label: "مرحلة التصفيات جارية",
    ui: {
      alert: {
        color: "success",
        title: "مرحلة التصفيات جارية",
        description:
          "تابع مباريات التصفيات وتحديث حالة المجموعات من صفحة المجموعات أدناه.",
      },
    },
    view: TournamentGroup,
    actions: [],
  },
  [TournamentDetailedState.QualificationStageFinished]: {
    label: "اكتملت مرحلة التصفيات",
    ui: {
      alert: {
        color: "info",
        title: "اكتملت مرحلة التصفيات",
        description:
          "انتهت جميع مجموعات التصفيات. يمكنك استئناف أي مجموعة أو اعتماد النتائج لتأهيل الفرق للمرحلة النهائية.",
      },
    },
    view: TournamentGroup,
    actions: [confirmQualificationResultsAction],
  },
  [TournamentDetailedState.ManagingFinalStageQualifiedTeams]: {
    label: "إدارة فرق المرحلة النهائية",
    ui: {
      heading: "إدارة فرق المرحلة النهائية",
      description:
        "راجع الفرق المتأهلة ويمكنك إضافة الفرق المباشرة للنهائي ثم اعتمادها.",
    },
    view: TournamentTeam,
    actions: [confirmFinalStageTeamsAction],
  },
  [TournamentDetailedState.LinkingFinalGroupTeams]: {
    label: "ربط الفرق بالمجموعة النهائية",
    ui: {
      alert: {
        color: "info",
        title: "ربط الفرق بالمجموعة",
        description:
          "وزع الفرق على المجموعة النهائية ثم كوّن المباريات من صفحة المجموعات.",
      },
    },
    view: TournamentGroup,
    actions: [revertFinalGroupTeamsLinksAction],
  },
  [TournamentDetailedState.ManagingFinalGroupBracket]: {
    label: "إدارة المجموعة والمباريات",
    ui: {
      description:
        "ولّد المباريات وراجع الخريطة قبل الموافقة على المخطط وبدء اللعب.",
    },
    view: TournamentGroup,
    actions: [approvePlanAction],
  },
  [TournamentDetailedState.WaitingFinalGroupStarting]: {
    label: "في انتظار بدء البطولة",
    ui: {
      alert: {
        color: "info",
        title: "جاهز للبدء",
        description:
          "تمت الموافقة على المخطط — راجع الخريطة ثم ابدأ البطولة عندما تكون جاهزاً.",
      },
    },
    view: null,
    actions: [startAction],
  },
  [TournamentDetailedState.FinalGroupRunning]: {
    label: "البطولة جارية",
    ui: {
      alert: {
        color: "success",
        title: "البطولة جارية",
        description: "تابع المباريات من الخريطة أو حدّث النتائج حسب صلاحياتك.",
      },
    },
    view: TournamentGroup,
    actions: [finishAction],
  },
  [TournamentDetailedState.Finished]: {
    label: "انتهت البطولة",
    ui: {
      alert: {
        color: "neutral",
        title: "انتهت البطولة",
      },
    },
    view: null,
    actions: [resumeAction],
  },
};

export function getPhaseConfig(
  state: TournamentDetailedState | undefined,
): PhaseStateConfig {
  if (!state) return UNKNOWN_PHASE_CONFIG;
  return TOURNAMENT_PHASE_CONFIG[state] ?? UNKNOWN_PHASE_CONFIG;
}

export const PHASE_LABELS_AR = Object.fromEntries(
  Object.entries(TOURNAMENT_PHASE_CONFIG).map(([state, config]) => [
    state,
    config.label,
  ]),
) as Record<TournamentDetailedState, string>;
