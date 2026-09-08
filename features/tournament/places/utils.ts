import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import type { TournamentStageType } from "~/features/tournament/models/place";

export const PLACE_MUTABLE_STATES: TournamentDetailedState[] = [
  TournamentDetailedState.Created,
  TournamentDetailedState.ReceivingJoinRequests,
  TournamentDetailedState.ManagingJoinRequests,
  TournamentDetailedState.ManagingTeams,
];

export function canMutateTournamentPlaces(
  state?: TournamentDetailedState | null,
) {
  return !!state && PLACE_MUTABLE_STATES.includes(state);
}

export function canAddTournamentTable(
  state?: TournamentDetailedState | null,
  stageType?: TournamentStageType | null,
) {
  if (!state || state === TournamentDetailedState.Finished) return false;
  if (stageType === "Final") return true;
  return canMutateTournamentPlaces(state);
}
