import type { Group, Match } from "~/models/group";
import type { Node, Edge } from "@vue-flow/core";

interface GraphData {
  nodes: Node<any, any, string>[];
  edges: Edge<any, any, string>[];
}
export const useGroup = () => {
  const { $api } = useNuxtApp();

  const getGroups = async () => {
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{ message: string; data: Group[] }>(
        "getGroups",
        () => $api("/groups"),
        { immediate: false }
      );
    const fetchREQ = async () => {
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const getGroupMatches = async () => {
    const group_id = ref();
    const {
      data: matches,
      pending,
      error,
      refresh,
      status,
      execute,
    } = await useAsyncData<{ message: string; data: Match[] }>(
      "getGroupMatch",
      () => $api(`/groups/${group_id.value}/matches`),
      { immediate: false }
    );
    const matchesTree = computed((): Match[] | undefined => {
      if (!matches.value || !matches.value.data) return undefined;
      let heads: Match[] = [];
      matches.value.data.forEach((m) => {
        if (
          m.level == 1 &&
          (!m.matchQualifyUsTeamFrom ||
            m.matchQualifyUsTeamFrom === "Winner") &&
          (!m.matchQualifyThemTeamFrom ||
            m.matchQualifyThemTeamFrom === "Winner")
        ) {
          populateChildren(m, matches.value!.data);
          heads.push(m);
        }
      });

      return heads;
    });
    const loserMatches = computed((): Match[] | undefined => {
      if (!matches.value || !matches.value.data) return undefined;
      return matches.value.data.filter((m) => {
        if (
          m.matchQualifyUsTeamFrom === "Loser" &&
          m.matchQualifyUsTeamId &&
          m.matchQualifyThemTeamFrom === "Loser" &&
          m.matchQualifyThemTeamId
        ) {
          return m;
        }
      });
    });

    const populateChildren = (match: Match | undefined, matches: Match[]) => {
      if (!match) return undefined;
      if (match.matchQualifyThemTeamId)
        match.matchQualifyThemTeam = matches.find(
          (m) => m.id == match.matchQualifyThemTeamId
        );
      if (match.matchQualifyUsTeamId)
        match.matchQualifyUsTeam = matches.find(
          (m) => m.id == match.matchQualifyUsTeamId
        );
      populateChildren(match.matchQualifyThemTeam, matches);
      populateChildren(match.matchQualifyUsTeam, matches);
    };

    const fetchREQ = async (_group_id: number) => {
      group_id.value = _group_id;
      await execute();
    };
    return {
      matches,
      matchesTree,
      loserMatches,
      pending,
      error,
      refresh,
      status,
      fetchREQ,
    };
  };

  return { getGroups, getGroupMatches };
};
