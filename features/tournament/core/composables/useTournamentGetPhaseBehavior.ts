import { computed, type MaybeRefOrGetter, toValue } from "vue";
import {
  TournamentDetailedState,
  TournamentState,
} from "~/features/tournament/models/tournament";
import { GroupState } from "~/features/tournament/models/group";

export type TournamentPhasePanel =
  | "created"
  | "receivingJoinRequests"
  | "managingJoinRequests"
  | "managingTeams"
  | "linkingFinalGroupTeams"
  | "managingFinalGroupBracket"
  | "finalGroupRunning"
  | "finished"
  | "unknown";

export interface TournamentPhaseBehavior {
  panel: TournamentPhasePanel;
  showOrganizeTournamentButton: boolean;
  showStartTournamentCta: boolean;
  showResetFinalGroupMatches: boolean;
  showFinishTournament: boolean;
  showResumeFinalGroupAfterFinish: boolean;
  content: TournamentPhaseContent;
}

type ButtonVariant = "solid" | "outline" | "soft";
type ButtonColor = "primary" | "warning" | "neutral";
type AlertColor = "info" | "success" | "warning" | "neutral";
type ActionEvent = "organize-tournament" | "open-start-confirm" | "reset-final-group-matches" | "finish-tournament" | "resume-final-group-after-finish";
type VisibilityFlag =
  | "showOrganizeTournamentButton"
  | "showStartTournamentCta"
  | "showResetFinalGroupMatches"
  | "showFinishTournament"
  | "showResumeFinalGroupAfterFinish";

export interface TournamentPhaseAction {
  label: string;
  icon: string;
  variant?: ButtonVariant;
  color?: ButtonColor;
  to?: string;
  target?: "_blank";
  event?: ActionEvent;
  className?: string;
  visibleWhen?: VisibilityFlag;
}

export interface TournamentPhaseAlert {
  color: AlertColor;
  title: string;
  description?: string;
}

export interface TournamentPhaseContent {
  heading?: string;
  description?: string;
  alert?: TournamentPhaseAlert;
  actions: TournamentPhaseAction[];
}

interface UseTournamentGetPhaseBehaviorOptions {
  detailedState: MaybeRefOrGetter<TournamentDetailedState | undefined>;
  tournamentState: MaybeRefOrGetter<TournamentState | undefined>;
  finalGroupState: MaybeRefOrGetter<GroupState | undefined>;
  hasQualificationsStage: MaybeRefOrGetter<boolean | null | undefined>;
  isAdmin: MaybeRefOrGetter<boolean>;
}

const PANEL_BY_DETAILED_STATE: Record<TournamentDetailedState, TournamentPhasePanel> = {
  [TournamentDetailedState.Created]: "created",
  [TournamentDetailedState.ReceivingJoinRequests]: "receivingJoinRequests",
  [TournamentDetailedState.ManagingJoinRequests]: "managingJoinRequests",
  [TournamentDetailedState.ManagingTeams]: "managingTeams",
  [TournamentDetailedState.LinkingFinalGroupTeams]: "linkingFinalGroupTeams",
  [TournamentDetailedState.ManagingFinalGroupBracket]: "managingFinalGroupBracket",
  [TournamentDetailedState.FinalGroupRunning]: "finalGroupRunning",
  [TournamentDetailedState.Finished]: "finished",
};

function getPhaseContent(panel: TournamentPhasePanel): TournamentPhaseContent {
  switch (panel) {
    case "created":
      return {
        description: "ابدأ بإعداد البطولة والفرق حسب سياسة الانضمام.",
        actions: [
          {
            label: "الفرق واللاعبين",
            icon: "i-mdi-account-group",
            to: "/team",
            variant: "solid",
            color: "primary",
            className: "w-full min-h-12 justify-center sm:w-auto",
          },
        ],
      };
    case "receivingJoinRequests":
      return {
        description: "مرحلة استقبال الطلبات — عرض الطلبات دون اتخاذ إجراء من لوحة التحكم هنا.",
        actions: [
          {
            label: "عرض طلبات الانضمام",
            icon: "i-mdi-account-arrow-right",
            to: "/joinRequest",
            variant: "soft",
            className: "w-full min-h-12 justify-center sm:w-auto",
          },
        ],
      };
    case "managingJoinRequests":
      return {
        description: "يمكنك قبول الطلبات أو رفضها.",
        actions: [
          {
            label: "إدارة طلبات الانضمام",
            icon: "i-mdi-account-arrow-right",
            to: "/joinRequest",
            variant: "solid",
            color: "primary",
            className: "w-full min-h-12 justify-center sm:w-auto",
          },
        ],
      };
    case "managingTeams":
      return {
        heading: "إعداد الفرق",
        description: "أضف الفرق واللاعبين، ثم ابدأ تنظيم البطولة للانتقال لمرحلة ربط الفرق بالمجموعة النهائية.",
        actions: [
          {
            label: "إدارة الفرق واللاعبين",
            icon: "i-mdi-account-group",
            to: "/team",
            variant: "solid",
            color: "primary",
            className: "w-full min-h-12 justify-center sm:min-w-[14rem] sm:flex-1",
          },
          {
            label: "بدء تنظيم البطولة",
            icon: "i-mdi-tournament",
            event: "organize-tournament",
            variant: "outline",
            className: "w-full min-h-12 justify-center sm:w-auto",
            visibleWhen: "showOrganizeTournamentButton",
          },
        ],
      };
    case "linkingFinalGroupTeams":
      return {
        alert: {
          color: "info",
          title: "ربط الفرق بالمجموعة",
          description: "وزع الفرق على المجموعة النهائية ثم كوّن المباريات من صفحة المجموعات.",
        },
        actions: [
          {
            label: "إدارة المجموعات",
            icon: "i-mdi-user-group",
            to: "/group",
            variant: "solid",
            color: "primary",
            className: "w-full min-h-12 justify-center sm:w-auto",
          },
        ],
      };
    case "managingFinalGroupBracket":
      return {
        description: "ولّد المباريات وراجع الخريطة قبل بدء اللعب.",
        actions: [
          {
            label: "المجموعات والمباريات",
            icon: "i-mdi-user-group",
            to: "/group",
            variant: "soft",
            className: "w-full min-h-12 justify-center sm:flex-1",
          },
          {
            label: "خريطة البطولة",
            icon: "i-mdi-tournament",
            to: "/bracket",
            target: "_blank",
            variant: "solid",
            color: "primary",
            className: "w-full min-h-12 justify-center sm:flex-1",
          },
          {
            label: "بدء البطولة",
            icon: "i-mdi-play",
            event: "open-start-confirm",
            variant: "solid",
            color: "primary",
            className: "w-full min-h-12 justify-center sm:w-auto",
            visibleWhen: "showStartTournamentCta",
          },
        ],
      };
    case "finalGroupRunning":
      return {
        alert: {
          color: "success",
          title: "البطولة جارية",
          description: "تابع المباريات من الخريطة أو حدّث النتائج حسب صلاحياتك.",
        },
        actions: [
          {
            label: "المجموعات والمباريات",
            icon: "i-mdi-user-group",
            to: "/group",
            variant: "soft",
            className: "w-full min-h-12 justify-center sm:flex-1",
          },
          {
            label: "خريطة البطولة",
            icon: "i-mdi-tournament",
            to: "/bracket",
            target: "_blank",
            variant: "solid",
            color: "primary",
            className: "w-full min-h-12 justify-center sm:flex-1",
          },
          {
            label: "إحصائيات البطولة",
            icon: "i-mdi-chart-box",
            to: "/statistics",
            target: "_blank",
            variant: "soft",
            className: "w-full min-h-12 justify-center sm:flex-1",
          },
          {
            label: "إعادة ضبط مرحلة الخريطة",
            icon: "i-mdi-backup-restore",
            event: "reset-final-group-matches",
            variant: "soft",
            color: "warning",
            className: "w-full min-h-12 justify-center sm:w-auto",
            visibleWhen: "showResetFinalGroupMatches",
          },
          {
            label: "انهاء  البطولة ",
            icon: "i-mdi-trophy",
            event: "finish-tournament",
            variant: "soft",
            color: "primary",
            className: "w-full min-h-12 justify-center sm:w-auto",
            visibleWhen: "showFinishTournament",
          },
        ],
      };
    case "finished":
      return {
        alert: { color: "neutral", title: "انتهت البطولة" },
        actions: [
          {
            label: "خريطة البطولة",
            icon: "i-mdi-tournament",
            to: "/bracket",
            target: "_blank",
            variant: "soft",
            className: "w-full min-h-12 justify-center sm:flex-1",
          },
          {
            label: "إحصائيات البطولة",
            icon: "i-mdi-chart-box",
            to: "/statistics",
            target: "_blank",
            variant: "soft",
            className: "w-full min-h-12 justify-center sm:flex-1",
          },
          {
            label: "استكمال البطولة",
            icon: "i-mdi-check",
            event: "resume-final-group-after-finish",
            variant: "soft",
            color: "primary",
            className: "w-full min-h-12 justify-center sm:w-auto",
            visibleWhen: "showResumeFinalGroupAfterFinish",
          }
        ],
      };
    default:
      return {
        alert: {
          color: "warning",
          title: "حالة غير معروفة أو محدثة",
          description: "تأكد من تحديث الصفحة. يمكنك متابعة إدارة البطولة من الروابط أدناه.",
        },
        actions: [
          {
            label: "الفرق واللاعبين",
            icon: "i-mdi-account-group",
            to: "/team",
            variant: "soft",
            className: "w-full min-h-12 justify-center sm:flex-1",
          },
          {
            label: "المجموعات",
            icon: "i-mdi-user-group",
            to: "/group",
            variant: "soft",
            className: "w-full min-h-12 justify-center sm:flex-1",
          },
        ],
      };
  }
}

export function useTournamentGetPhaseBehavior(options: UseTournamentGetPhaseBehaviorOptions) {
  return computed<TournamentPhaseBehavior>(() => {
    const detailedState = toValue(options.detailedState);
    const tournamentState = toValue(options.tournamentState);
    const finalGroupState = toValue(options.finalGroupState);
    const hasQualificationsStage = toValue(options.hasQualificationsStage);
    const isAdmin = toValue(options.isAdmin);

    const panel = detailedState ? PANEL_BY_DETAILED_STATE[detailedState] : "unknown";
    const showOrganizeTournamentButton =
      detailedState === TournamentDetailedState.ManagingTeams &&
      finalGroupState === GroupState.Created &&
      hasQualificationsStage == null &&
      tournamentState === TournamentState.Upcoming;

    const showStartTournamentCta =
      tournamentState === TournamentState.Upcoming &&
      finalGroupState === GroupState.MatchesGenerated;

    const showResetFinalGroupMatches =
      isAdmin && detailedState === TournamentDetailedState.FinalGroupRunning;
    const content = getPhaseContent(panel);

    const showFinishTournament =
      isAdmin && detailedState === TournamentDetailedState.FinalGroupRunning;
    
    const showResumeFinalGroupAfterFinish =
      isAdmin && detailedState === TournamentDetailedState.Finished;

      return {
      panel,
      showOrganizeTournamentButton,
      showStartTournamentCta,
      showResetFinalGroupMatches,
      showFinishTournament,
      showResumeFinalGroupAfterFinish,
      content,
    };
  });
}
