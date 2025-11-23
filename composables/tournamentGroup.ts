import type { TournamentGroup } from "~/models/tournamentGroup";

export const useTournamentGroup = () => {
  const { $api } = useNuxtApp();
const addTeamsToFinalGroup=()=>{
 const tournamentId = ref()
  const result =useAsyncData(
    ()=>['addTeamsToFinalGroup',tournamentId.value].join('-'),
    ()=>$api(`/tournaments/${tournamentId.value}/groups/final`,{method:'post'}))
    const fetchREQ = async (tournament_id: string) => {
      tournamentId.value = tournament_id
      await result.execute()
    }
    return { result, fetchREQ }
}

const getTournamnetGroups=( tournament_id: string )=>{
  return useAsyncData<{data:{groups:TournamentGroup[]},message:string}>(
    ()=>['getTournamentGroups',tournament_id].join('-'),
    ()=>$api(`/tournaments/${tournament_id}/groups`))
}
// const getTournamentGroupMatches=( tournament_id: string, group_id: string )=>{
  return { addTeamsToFinalGroup, getTournamnetGroups }
}