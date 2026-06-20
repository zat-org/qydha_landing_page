import { GroupState } from '~/features/tournament/models/group';
import {
  TournamentDetailedState,
  TournamentState,
} from '~/features/tournament/models/tournament';
import type { TournamentPhaseContext } from '~/features/tournament/detail/types/phase.types';

type GuardArgs = { context: TournamentPhaseContext };

export const tournamentGuards = {
  canOrganize: ({ context }: GuardArgs) =>
    context.detailedState === TournamentDetailedState.ManagingTeams
    && context.finalGroupState === GroupState.Created
    && context.hasQualificationsStage == null
    && context.tournamentState === TournamentState.Upcoming,

  canApprovePlan: ({ context }: GuardArgs) =>
    context.isAdmin
    && context.tournamentState === TournamentState.Upcoming
    && context.finalGroupState === GroupState.MatchesGenerated,

  canStart: ({ context }: GuardArgs) =>
    context.detailedState === TournamentDetailedState.WaitingFinalGroupStarting,

  canFinish: ({ context }: GuardArgs) =>
    context.detailedState === TournamentDetailedState.FinalGroupRunning
    && context.isAdmin,

  canResume: ({ context }: GuardArgs) =>
    context.detailedState === TournamentDetailedState.Finished
    && context.isAdmin,

  showRegenerateFinalMatches: ({ context }: GuardArgs) =>
    context.detailedState === TournamentDetailedState.ManagingFinalGroupBracket,

  showStartTournamentCta: ({ context }: GuardArgs) =>
    context.tournamentState === TournamentState.Upcoming
    && context.finalGroupState === GroupState.WaitingMatchesStarting,

  showFinishTournamentCta: ({ context }: GuardArgs) =>
    context.tournamentState === TournamentState.Running
    && context.finalGroupState === GroupState.MatchesRunning,

  showResumeAfterFinishCta: ({ context }: GuardArgs) =>
    context.tournamentState === TournamentState.Finished
    && context.finalGroupState === GroupState.MatchesFinished,
};
