import {
  TournamentDetailedState,
  TournamentState,
} from "~/features/tournament/models/tournament";
import type {
  PhaseAction,
  TournamentPhaseContext,
} from "~/features/tournament/detail/types/phase.types";
import { appKeys } from "~/composables/queryKeys";

async function refreshTournament(tournamentId: string) {
  await refreshAppData(
    appKeys.tournament(tournamentId),
    appKeys.tournamentGroups(tournamentId),
  );
}

export function canModifyTournament(ctx: TournamentPhaseContext): boolean {
  return (
    ctx.isAdmin || (ctx.permissions?.includes("ModifyTournamentData") ?? false)
  );
}

export const organizeAction: PhaseAction = {
  id: "organize",
  label: "بدء تنظيم البطولة",
  icon: "i-mdi-tournament",
  variant: "outline",
  confirm: "setup",
  canExecute: (ctx) =>
    canModifyTournament(ctx) &&
    ctx.detailedState === TournamentDetailedState.ManagingTeams,
  service: async (ctx, api) => {
    await api(`/tournaments/${ctx.tournamentId}/setup-stages`, {
      method: "POST",
    });
    await refreshTournament(ctx.tournamentId);
  },
};

export const generateQualificationBracketsAction: PhaseAction = {
  id: "generateQualificationBrackets",
  label: "إنشاء مباريات التصفيات",
  icon: "i-mdi-tournament",
  variant: "solid",
  color: "primary",
  confirm: "generateQualificationBrackets",
  canExecute: (ctx) =>
    canModifyTournament(ctx) &&
    (ctx.detailedState ===
      TournamentDetailedState.LinkingQualificationStageTeams ||
      ctx.detailedState ===
        TournamentDetailedState.ManagingQualificationStageBrackets),
  service: async () => {},
};

export const revertQualificationTeamLinkingAction: PhaseAction = {
  id: "revertQualificationTeamLinking",
  label: "تراجع عن تنظيم التصفيات",
  icon: "i-mdi-undo",
  variant: "outline",
  color: "neutral",
  canExecute: (ctx) =>
    canModifyTournament(ctx) &&
    ctx.detailedState ===
      TournamentDetailedState.LinkingQualificationStageTeams,
  service: async (ctx, api) => {
    await api(
      `/tournaments/${ctx.tournamentId}/qualification-stage/revert-team-linking`,
      { method: "POST" },
    );
    await refreshTournament(ctx.tournamentId);
  },
};

export const revertQualificationGeneratedBracketsAction: PhaseAction = {
  id: "revertQualificationGeneratedBrackets",
  label: "تراجع عن إنشاء المباريات",
  icon: "i-mdi-undo",
  variant: "outline",
  color: "neutral",
  canExecute: (ctx) =>
    canModifyTournament(ctx) &&
    ctx.detailedState ===
      TournamentDetailedState.ManagingQualificationStageBrackets,
  service: async (ctx, api) => {
    await api(
      `/tournaments/${ctx.tournamentId}/qualification-stage/revert-generated-brackets`,
      { method: "POST" },
    );
    await refreshTournament(ctx.tournamentId);
  },
};

export const confirmQualificationBracketsAction: PhaseAction = {
  id: "confirmQualificationBrackets",
  label: "اعتماد جدول التصفيات",
  icon: "i-mdi-check-decagram",
  variant: "solid",
  color: "primary",
  canExecute: (ctx) =>
    canModifyTournament(ctx) &&
    ctx.detailedState ===
      TournamentDetailedState.ManagingQualificationStageBrackets,
  service: async (ctx, api) => {
    await api(
      `/tournaments/${ctx.tournamentId}/qualification-stage/confirm-brackets`,
      { method: "POST" },
    );
    await refreshTournament(ctx.tournamentId);
  },
};

export const confirmQualificationResultsAction: PhaseAction = {
  id: "confirmQualificationResults",
  label: "اعتماد نتائج التصفيات",
  icon: "i-mdi-check-decagram",
  variant: "solid",
  color: "primary",
  canExecute: (ctx) =>
    canModifyTournament(ctx) &&
    ctx.detailedState === TournamentDetailedState.QualificationStageFinished,
  service: async (ctx, api) => {
    await api(
      `/tournaments/${ctx.tournamentId}/qualification-stage/confirm-results`,
      { method: "PATCH" },
    );
    await refreshTournament(ctx.tournamentId);
  },
};

export const confirmFinalStageTeamsAction: PhaseAction = {
  id: "confirmFinalStageTeams",
  label: "اعتماد فرق المرحلة النهائية",
  icon: "i-mdi-account-check",
  variant: "solid",
  color: "primary",
  canExecute: (ctx) =>
    canModifyTournament(ctx) &&
    ctx.detailedState ===
      TournamentDetailedState.ManagingFinalStageQualifiedTeams,
  service: async (ctx, api) => {
    await api(`/tournaments/${ctx.tournamentId}/confirm-final-stage-teams`, {
      method: "POST",
    });
    await refreshTournament(ctx.tournamentId);
  },
};

export const revertFinalGroupTeamsLinksAction: PhaseAction = {
  id: "revertFinalGroupTeamsLinks",
  label: "تراجع عن ربط الفرق",
  icon: "i-mdi-undo",
  variant: "outline",
  color: "neutral",
  canExecute: (ctx) =>
    canModifyTournament(ctx) &&
    ctx.detailedState === TournamentDetailedState.LinkingFinalGroupTeams,
  service: async (ctx, api) => {
    await api(
      `/tournaments/${ctx.tournamentId}/revert-final-group-teams-links`,
      { method: "POST" },
    );
    await refreshTournament(ctx.tournamentId);
  },
};

export const approvePlanAction: PhaseAction = {
  id: "approvePlan",
  label: "الموافقة على مخطط البطولة",
  icon: "i-mdi-check-decagram",
  variant: "solid",
  color: "primary",
  confirm: "approvePlan",
  canExecute: (ctx) =>
    canModifyTournament(ctx) &&
    ctx.detailedState === TournamentDetailedState.ManagingFinalGroupBracket,
  service: async (ctx, api) => {
    await api(`/tournaments/${ctx.tournamentId}/confirm-final-group-bracket`, {
      method: "POST",
    });
    await refreshTournament(ctx.tournamentId);
  },
};

export const startAction: PhaseAction = {
  id: "start",
  label: "بدء البطولة",
  icon: "i-mdi-play",
  variant: "solid",
  color: "primary",
  confirm: "start",
  canExecute: (ctx) =>
    canModifyTournament(ctx) &&
    ctx.detailedState === TournamentDetailedState.WaitingFinalGroupStarting,
  service: async (ctx, api) => {
    await api(`/tournaments/${ctx.tournamentId}/start-final-group-matches`, {
      method: "POST",
    });
    await refreshTournament(ctx.tournamentId);
  },
};

export const finishAction: PhaseAction = {
  id: "finish",
  label: "انهاء البطولة",
  icon: "i-mdi-trophy",
  variant: "soft",
  color: "primary",
  canExecute: (ctx) =>
    canModifyTournament(ctx) &&
    ctx.detailedState === TournamentDetailedState.FinalGroupRunning,
  service: async (ctx, api) => {
    await api(`/tournaments/${ctx.tournamentId}/finish`, { method: "POST" });
    await refreshTournament(ctx.tournamentId);
  },
};

export const resumeAction: PhaseAction = {
  id: "resume",
  label: "استكمال البطولة",
  icon: "i-mdi-check",
  variant: "soft",
  color: "primary",
  canExecute: (ctx) =>
    canModifyTournament(ctx) &&
    ctx.detailedState === TournamentDetailedState.Finished,
  service: async (ctx, api) => {
    await api(`/tournaments/${ctx.tournamentId}/resume-final-group-matches`, {
      method: "POST",
    });
    await refreshTournament(ctx.tournamentId);
  },
};

export function canShowRegenerateFinalMatches(
  ctx: TournamentPhaseContext,
): boolean {
  return (
    canModifyTournament(ctx) &&
    ctx.detailedState === TournamentDetailedState.ManagingFinalGroupBracket
  );
}
