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
      data ,
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
 
  

  

    const fetchREQ = async (_tour_id: string, _group_id: number) => {
      group_id.value = _group_id;
      tour_id.value = _tour_id;
      await execute();
    };
    return {
      data,
      pending,
      error,
      refresh,
      status,
      fetchREQ,
    };
  };

  return { getGroups, getGroupMatches };
};
