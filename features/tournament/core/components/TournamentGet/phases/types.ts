import type { GroupState } from "~/features/tournament/models/group";
import type {
  TournamentDetailedState,
  TournamentState,
} from "~/features/tournament/models/tournament";

export interface TournamentPhaseContext {
  tournamentId: string;
  isAdmin: boolean;
  detailedState?: TournamentDetailedState;
  tournamentState?: TournamentState;
  finalGroupState?: GroupState;
  hasQualificationsStage?: boolean | null;
}

export type TournamentPhaseRefresh = () => void | Promise<void>;
