import type { Group, Match, Team } from "~/models/group";
import { useMyTeamsStore } from "~/store/teams";

export const useGroup = () => {
  const { $api } = useNuxtApp();
  const teamStore = useMyTeamsStore()
  const getGroups = async () => {
    const { data, pending, error, refresh,status,execute} = await useAsyncData<{message:string,data:Group[]}>(
      "getGroups",
      () => $api("/groups"),{immediate:false}
    );
    const fetchREQ =async()=>{
      await execute()
    }
    return { data, pending, error, refresh ,status,fetchREQ};
  };
  const getGroupMatches = async () => {
    const group_id = ref();
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{messgae:string ,data:Match[] }>(
        "getGroupMatch",
        () => $api(`/groups/${group_id.value}/matches`),
        { immediate: false }
      );
    const fetchREQ = async (_group_id: number) => {
      group_id.value = _group_id;
      await execute();
      if (status.value =="success" && data.value ){
        // teamStore.setTeams(data.value.data.teams!)
      }
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  return { getGroups, getGroupMatches };
};
