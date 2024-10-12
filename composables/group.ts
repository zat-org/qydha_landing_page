import type { Group, Match, Team } from "~/models/group";
import type { Node, Edge } from "@vue-flow/core";
import { useMyAuthStore } from "~/store/Auth";
import type { Privilege } from "~/models/user";

interface GraphData {
  nodes: Node<any, any, string>[];
  edges: Edge<any, any, string>[];
}

export const useGroup = () => {
const userStore = useMyAuthStore()
  const { $api } = useNuxtApp();
  const getGroups = async () => {
    const tourid = ref<string>()
    const { data, pending, error, refresh, status, execute } = await 
    useAsyncData<{
       message: string,
        data: { 
          groups: Group[],
           requesterPrivilege: {
            permissions:string[]|null,
            privilege:Privilege
           } } }>(
      "getGroups",
      () => $api(`/tournaments/${tourid.value}/groups`), { immediate: false }
    );
    const fetchREQ = async (_tour_id: string) => {
      tourid.value = _tour_id
      await execute()
      if (status.value=="success" && data.value && data.value.data){
        userStore.permissions  =data.value?.data.requesterPrivilege.permissions  ?? []
        userStore.privilege  =data.value?.data.requesterPrivilege.privilege
      }
    }
    return { data, pending, error, refresh, status, fetchREQ };
  };
  const getGroupMatches = async () => {
    const tour_id = ref()
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

      () => $api(`tournaments/${tour_id.value}/groups/${group_id.value}/matches`),
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
          (m) => +m.id == match.matchQualifyThemTeamId
        );
      if (match.matchQualifyUsTeamId)
        match.matchQualifyUsTeam = matches.find(
          (m) => +m.id == match.matchQualifyUsTeamId
        );
      populateChildren(match.matchQualifyThemTeam, matches);
      populateChildren(match.matchQualifyUsTeam, matches);
    };

    const fetchREQ = async (_tour_id: string, _group_id: number) => {
      group_id.value = _group_id;
      tour_id.value = _tour_id;
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
