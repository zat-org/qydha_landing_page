import type { DetailGroup } from "~/features/tournament/models/group";

export interface GroupTeamRow {
  id: string;
  teamName: string;
  original: DetailGroup["teams"][0];
}

export interface GroupDetailsActions {
  createMatches: () => void;
  linkTeam: () => void;
  refresh: () => Promise<void>;
}
