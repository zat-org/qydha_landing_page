import type { ITeam, ITeamCreate } from "~/models/tournamentTeam";

export const useTourrnamentTeam = () => {
  const { $api } = useNuxtApp();

  const getAllTourTeams = async () => {
    const tourId = ref()
    const { data, pending, error, refresh, status, execute } = await useAsyncData<{ data: ITeam[], message: string }>(
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
    const { data, pending, error, refresh, status, execute } = await useAsyncData<{}, { code: string, message: string, traceId: string }>(
      'addTourTeam',
      () => $api(`/tournaments/${tourId.value}/teams`, { method: "post", body: body.value }), { immediate: false }
    );
    const fetchREQ = async (tour_id: string, newTeam: ITeamCreate) => {
      body.value = []
      tourId.value = tour_id
      body.value.push(newTeam)

      await execute()

    }

    return { data, pending, error, refresh, status, fetchREQ }
  }
  const deleteTourTeam = async () => {
    const tourId = ref()
    const teamId = ref()

    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'deleteTourTeam',
      () => $api(`/tournaments/${tourId.value}/teams/${teamId.value}`, { method: 'delete' }), { immediate: false }
    );

    const fetchREQ = async (tour_id: string, team_id: string) => {
      tourId.value = tour_id
      teamId.value = team_id
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }

  }
  const updateTourTeamName = async () => {
    const tourId = ref()
    const teamId = ref()
    const body = ref<{ name: string }>()
    const { data, pending, error, refresh ,status,execute } = await useAsyncData(
      'updateTourTeamName',
      () => $api(`/tournaments/${tourId.value}/teams/${teamId.value}`, { method: 'put', body: body.value }), { immediate: false }
    );
    const fetchREQ = async (tour_id:string ,team_id:string ,{name}:{name:string}) => {
      tourId.value=tour_id
      teamId.value =team_id
      body.value ={name}
      await execute()
      if (status.value == "success"){
        refreshNuxtData("getAllTourTeams")
      }
    }
    return {data, pending, error, refresh ,status,fetchREQ}
  }


  return { getAllTourTeams, addTourTeam, deleteTourTeam,updateTourTeamName }
}