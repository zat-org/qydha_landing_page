import { TournamentDetailedState } from "~/features/tournament/models/tournament";

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
