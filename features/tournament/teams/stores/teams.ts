import { defineStore } from "pinia";
import type { Team } from "~/features/tournament/models/group";

export const useMyTeamsStore = defineStore("myTeamsStore", () => {
  const teams = ref<Team[]>();
  const setTeams = (_teams: Team[]) => {
    console.log("teams Updated");
    teams.value = _teams;
  };
  const getTeam = (team_id: string) => {
    return teams.value?.find((t) => t.id === team_id);
  };
  return { teams, setTeams, getTeam };
});
