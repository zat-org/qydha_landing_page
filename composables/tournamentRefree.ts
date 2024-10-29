import type { MinUser } from "~/models/user";

export const useTournamentRefree = () => {
  const { $api } = useNuxtApp();
  const getTournamentRefree = async () => {
    const tourId = ref()
    const { data, pending, error, refresh, status, execute } = await useAsyncData<{ data: MinUser[], message: string }>(
      'getTournamentRefree',
      () => $api(`/tournaments/${tourId.value}/referees`), { immediate: false }
    );
    const fetchREQ = async (_tour_id: string) => {
      tourId.value = _tour_id
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }

  }
  const addTourRefree = async () => {
    const tourId = ref()
    const body = ref<{ username: string }>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      ' addTourRefree',
      () => $api(`/tournaments/${tourId.value}/referees`, { method: 'post', body: body.value }), { immediate: false }
    );
    const fetchREQ = async (_tour_id: string, refree: { username: string }) => {
      tourId.value = _tour_id
      body.value = refree

      await execute()
      if (status.value=='success'){
        refreshNuxtData("getTournamentRefree")
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  const deleteTourRefree = async () => {
    const tourId = ref()
    const refreeId = ref()

    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'deleteTourRefree',
      () => $api(`/tournaments/${tourId.value}/referees/${refreeId.value}`, { method: 'delete' }), { immediate: false }
    );
    const fetchREQ = async (_tour_id: string, _refree_id: string) => {
      tourId.value = _tour_id
      refreeId.value = _refree_id

      await execute()
      if (status.value=='success'){
        refreshNuxtData("getTournamentRefree")
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
  return { getTournamentRefree, addTourRefree, deleteTourRefree }

}
