import type { IPlayer, IPlayerCreate } from "~/models/tournamentTeam";

export const useTournamentPlayer = () => {
  const { $api } = useNuxtApp();
 
  const addPlayer = async () => {
    const tourId = ref()
    const body = ref<IPlayerCreate>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData
      <{},
        { code: string, errors: { [key: string]: string[] }, message: string }>(
          'addPlayer',
          () => $api(`/tournaments/${tourId.value}/players`, { method: "post", body: body.value }), { immediate: false }
        );
    const fetchREQ = async (tour_id: string, new_player: IPlayerCreate) => {
      tourId.value = tour_id
      body.value = new_player
      await execute()
      if (status.value == 'success'){
        refreshNuxtData('getPlayer')
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
 
  const getPlayer = async () => {

    const tourId = ref()
    const hasTeam = ref<boolean|null>()
    const page = ref<number|null>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData
      <{data:{items:IPlayer[],totalCount:number,currentPage:number },message:string},
        { code: string, errors: { [key: string]: string[] }, message: string }>(
          'getPlayer',
          () => $api(`/tournaments/${tourId.value}/players`, { query: { HasTeam: hasTeam.value,page:page.value } }), { immediate: false }
        );
    const fetchREQ = async (tour_id: string, has_team: boolean|null =null, _page: number | null = null ) => {
      tourId.value = tour_id
      hasTeam.value = has_team
      page.value  =_page
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
 
  const deletePlayer = async () => {
    const tourId = ref()
    const playerId = ref()
    const { data, pending, error, refresh, status, execute } = await useAsyncData
      <{},
        { code: string, errors: { [key: string]: string[] }, message: string }>(
          'deletePlayer',
          () => $api(`/tournaments/${tourId.value}/players/${playerId.value}`, { method: "delete" }), { immediate: false }
        );
    const fetchREQ = async (tour_id: string, player_id: string) => {
      tourId.value = tour_id
      playerId.value = player_id
      await execute()
      if (status.value == 'success'){
        refreshNuxtData('getPlayer')
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
 
  const updatePlayer = async () => {
    const tourId = ref()
    const playerId = ref()
    const newPlayer = ref<IPlayerCreate>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData
      <{},
        { code: string, errors: { [key: string]: string[] }, message: string }>(
          'updatePlayer',
          () => $api(`/tournaments/${tourId.value}/players/${playerId.value}`, { method: "put", body: newPlayer.value }), { immediate: false }
        );
    const fetchREQ = async (tour_id: string, player_id: string, new_player: IPlayerCreate) => {
      tourId.value = tour_id
      playerId.value = player_id
      newPlayer.value = new_player
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  return { addPlayer, getPlayer, deletePlayer,updatePlayer }
}
