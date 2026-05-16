import type { MaybeRefOrGetter } from "vue";
import { computed, ref, toValue } from "vue";
import type { DetailGroup } from "~/features/tournament/models/group";
import type { GroupTeamRow } from "../types";

function normalizeForSearch(s: string) {
  return s.trim().toLowerCase();
}

export function useGroupTeamsTable(
  groupDetails: MaybeRefOrGetter<DetailGroup | null>,
) {
  const teamsViewMode = ref<"table" | "grid">("table");
  const teamNameFilter = ref("");

  const tableData = computed<GroupTeamRow[]>(() => {
    const details = toValue(groupDetails);
    if (!details?.teams) return [];
    return details.teams.map((team) => {
      const teamName =
        team.players && team.players.length > 0
          ? team.players.map((player) => player.name).join(" · ")
          : team.name || "فريق بدون لاعبين";

      return {
        id: team.id,
        teamName,
        original: team,
      };
    });
  });

  const filteredTableData = computed<GroupTeamRow[]>(() => {
    const q = teamNameFilter.value.trim();
    if (!q) return tableData.value;

    const n = normalizeForSearch(q);
    return tableData.value.filter((row) => {
      const parts = [
        row.teamName,
        row.original.name,
        ...(row.original.players?.map((p) => p.name) ?? []),
      ];
      const hay = normalizeForSearch(parts.join(" "));
      return hay.includes(n);
    });
  });

  return {
    teamsViewMode,
    teamNameFilter,
    tableData,
    filteredTableData,
  };
}
