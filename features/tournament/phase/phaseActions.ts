import { GroupState } from "~/features/tournament/models/group";
import {
  TournamentDetailedState,
  TournamentState,
} from "~/features/tournament/models/tournament";
import type { SetupTournamentPayload } from "~/features/tournament/detail/composables/api/useSetupTournament";
import type {
  PhaseAction,
  TournamentPhaseContext,
} from "~/features/tournament/detail/types/phase.types";
import { appKeys } from "~/composables/queryKeys";

async function refreshTournament(tournamentId: string) {
  await refreshAppData(appKeys.tournament(tournamentId));
}

export const organizeAction: PhaseAction = {
  id: "organize",
  label: "بدء تنظيم البطولة",
  icon: "i-mdi-tournament",
  variant: "outline",
  confirm: "setup",
  canExecute: (ctx) =>
    ctx.detailedState === TournamentDetailedState.ManagingTeams &&
    ctx.finalGroupState === GroupState.Created &&
    ctx.hasQualificationsStage == null &&
    ctx.tournamentState === TournamentState.Upcoming,
  service: async (ctx, api, extra) => {
    const payload = extra as SetupTournamentPayload | undefined;
    if (!payload) return;
    const body =
      payload.type === "direct"
        ? {
            hasQualificationsStage: false,
            qualificationsStageData: null,
          }
        : {
            hasQualificationsStage: true,
            qualificationsStageData: {
              groups: payload.groups,
            },
          };
    await api(`/tournaments/${ctx.tournamentId}/setup-stages`, {
      method: "POST",
      body,
    });
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
    ctx.isAdmin &&
    ctx.tournamentState === TournamentState.Upcoming &&
    ctx.finalGroupState === GroupState.MatchesGenerated,
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
    ctx.detailedState === TournamentDetailedState.FinalGroupRunning &&
    ctx.isAdmin,
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
    ctx.detailedState === TournamentDetailedState.Finished && ctx.isAdmin,
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
    ctx.detailedState === TournamentDetailedState.ManagingFinalGroupBracket
  );
}
