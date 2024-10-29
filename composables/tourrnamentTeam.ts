import type { ITeamCreate } from "~/models/tournamentTeam";

export const useTourrnamentTeam = () => {
  const { $api } = useNuxtApp();

  const getAllTourTeams = async () => {
    const tourId = ref()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'getAllTourTeams',
      () => $api(`/tournaments/${tourId.value}/teams`), { immediate: false }
    );
    const fetchREQ = async (tour_id: string) => {
      tourId.value = tour_id
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  const addTourTeam = async () => {
    const tourId = ref()
    const body = ref<ITeamCreate[]>([])
    const { data, pending, error, refresh,status,execute } = await useAsyncData(
      'addTourTeam',
      () => $api(`/tournaments/${tourId.value}/teams`, { method: "post", body: body.value }), { immediate: false }
    );
const fetchREQ  =async (tour_id:string , newTeam:ITeamCreate[]) =>{
  tourId.value = tour_id 
  body.value = newTeam

  await execute()
}

return  { data, pending, error, refresh,status,fetchREQ }
  }
  return { getAllTourTeams ,addTourTeam}
}