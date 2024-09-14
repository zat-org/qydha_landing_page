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

    const matchesTree = computed((): Match[] | null => {
      if (!matches.value || !matches.value.data) return null;
      let heads: Match[] = [];

      matches.value.data.forEach((m) => {
        if (m.level == 1) heads.push(m);
      });

      heads.forEach((h) => {
        populateChildrenMatches(h, matches.value!.data);
      });
      return heads;
    });
    const graphData = computed((): GraphData | undefined => {
      if (!matches.value || !matches.value.data) return undefined;
      let heads: Match[] = [];
      matches.value.data.forEach((m) => {
        if (m.level == 1) heads.push(m);
      });

      const data: GraphData = { nodes: [], edges: [] };

      heads.forEach((h) => {
        addGraphNode(data, h);
        addChildren(data, h, matches.value!.data);
      });
      return data;
    });

    const fetchREQ = async (_group_id: number) => {
      group_id.value = _group_id;
      await execute();
    };
    return {
      matches,
      graphData,
      matchesTree,
      pending,
      error,
      refresh,
      status,
      fetchREQ,
    };
  };

  const addGraphNode = (graphData: GraphData, match: Match) => {
    graphData.nodes.push({
      id: match.id.toString(),
      data: match,
      type: "match",
      draggable: false,
      position: { x: 0, y: 0 },
    });
  };
  const addChildren = (
    graphData: GraphData,
    match: Match,
    matches: Match[]
  ) => {
    if (match.matchQualifyThemTeamId) {
      const beforeThem = matches.find(
        (m) => m.id == match.matchQualifyThemTeamId
      );
      if (beforeThem) {
        addGraphNode(graphData, beforeThem);
        graphData.edges.push({
          id: beforeThem.id.toString() + "=>" + match.id.toString(),
          source: beforeThem.id.toString(),
          target: match.id.toString(),
        });
        if (
          beforeThem?.matchQualifyThemTeamId ||
          beforeThem?.matchQualifyUsTeamId
        ) {
          addChildren(graphData, beforeThem, matches);
        }
      }
    }
    if (match.matchQualifyUsTeamId) {
      const beforeUs = matches.find((m) => m.id == match.matchQualifyUsTeamId);
      if (beforeUs) {
        addGraphNode(graphData, beforeUs);
        graphData.edges.push({
          id: beforeUs.id.toString() + "=>" + match.id.toString(),
          source: beforeUs.id.toString(),
          target: match.id.toString(),
        });
        if (
          beforeUs?.matchQualifyThemTeamId ||
          beforeUs?.matchQualifyUsTeamId
        ) {
          addChildren(graphData, beforeUs, matches);
        }
      }
    }
  };
  const populateChildrenMatches = (
    match: Match | undefined,
    matches: Match[]
  ) => {
    if (!match) return undefined;
    match.matchQualifyUsTeam = matches.find(
      (m) => match.matchQualifyUsTeamId === m.id
    );
    match.matchQualifyThemTeam = matches.find(
      (m) => match.matchQualifyThemTeamId === m.id
    );
    populateChildrenMatches(match.matchQualifyUsTeam, matches);
    populateChildrenMatches(match.matchQualifyThemTeam, matches);
  };

  return { getGroups, getGroupMatches };
};
