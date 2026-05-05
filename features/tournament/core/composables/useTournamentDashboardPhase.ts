import { TournamentDetailedState } from "~/features/tournament/models/tournament";

export const PHASE_LABELS_AR: Record<TournamentDetailedState, string> = {
  [TournamentDetailedState.Created]: "إنشاء البطولة",
  [TournamentDetailedState.ReceivingJoinRequests]: "استقبال طلبات الانضمام",
  [TournamentDetailedState.ManagingJoinRequests]: "إدارة طلبات الانضمام",
  [TournamentDetailedState.ManagingTeams]: "إعداد الفرق",
  [TournamentDetailedState.LinkingFinalGroupTeams]: "ربط الفرق بالمجموعة النهائية",
  [TournamentDetailedState.ManagingFinalGroupBracket]: "إدارة المجموعة والمباريات",
  [TournamentDetailedState.FinalGroupRunning]: "البطولة جارية",
  [TournamentDetailedState.Finished]: "انتهت البطولة",
};

const JOIN_RELATED: TournamentDetailedState[] = [
  TournamentDetailedState.ReceivingJoinRequests,
  TournamentDetailedState.ManagingJoinRequests,
];

const DEFAULT_PHASE_ORDER: TournamentDetailedState[] = [
  TournamentDetailedState.Created,
  ...JOIN_RELATED,
  TournamentDetailedState.ManagingTeams,
  TournamentDetailedState.LinkingFinalGroupTeams,
  TournamentDetailedState.ManagingFinalGroupBracket,
  TournamentDetailedState.FinalGroupRunning,
  TournamentDetailedState.Finished,
];

const PHASE_ORDER_WITHOUT_JOIN: TournamentDetailedState[] =
  DEFAULT_PHASE_ORDER.filter((p) => !JOIN_RELATED.includes(p));

export function getVisiblePhaseOrder(addPlayersByQydha: boolean) {
  return addPlayersByQydha ? DEFAULT_PHASE_ORDER : PHASE_ORDER_WITHOUT_JOIN;
}

export function getPhaseIndex(
  detailedState: TournamentDetailedState | undefined,
  order: TournamentDetailedState[],
) {
  if (!detailedState) return 0;
  const i = order.indexOf(detailedState);
  return i >= 0 ? i : 0;
}

export type PhaseStepStatus = "done" | "current" | "upcoming";

export function getPhaseStepStatus(
  stepIndex: number,
  currentIndex: number,
): PhaseStepStatus {
  if (stepIndex < currentIndex) return "done";
  if (stepIndex === currentIndex) return "current";
  return "upcoming";
}

