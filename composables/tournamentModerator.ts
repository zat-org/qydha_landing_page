import type { IModerator, IModeratorCreate, IModeratorUpdate } from "~/models/tournamentModeratorr";

export const useTournamentModerator = () => {
  const { $api } = useNuxtApp();

  const getAllmoderators = async () => {
    const tourId = ref()
    const { data, pending, error, refresh, status, execute } = await useAsyncData<{ data: IModerator[], messge: string }>(
      'getAllmoderators',
      () => $api(`/tournaments/${tourId.value}/moderators`), { immediate: false }
    );
    const fetchREQ = async (tour_id: string) => {
      tourId.value = tour_id
      await execute();
    }
    return { data, pending, error, refresh, status, fetchREQ }

  }
  const addModerator = async () => {
    const tourID = ref()
    const body = ref<IModeratorCreate>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'addModerator',
      () => $api(`/tournaments/${tourID.value}/moderators`, { method: "post", body: body.value }), { immediate: false }
    );
    const fetchREQ = async (tour_id: string, new_body: IModeratorCreate) => {
      tourID.value = tour_id
      body.value = new_body
      await execute()
      if (status.value == "success") {
        refreshNuxtData('getAllmoderators')
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  const deleteModerator = async () => {
    const tourId = ref()
    const moderatorId = ref()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'deleteModerator',
      () => $api(`tournaments/${tourId.value}/moderators/${moderatorId.value}`, { method: 'delete' }), { immediate: false }
    );
    const fetchREQ = async (tour_id: string, moderator_id: string) => {
      tourId.value = tour_id
      moderatorId.value = moderator_id
      await execute()
      if (status.value == "success") {
        refreshNuxtData('getAllmoderators')
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  const updateModerator = async () => {
    const tourId = ref()
    const moderatorId = ref()
    const body = ref<IModeratorUpdate>()

    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'updateModerator',
      () => $api(`tournaments/${tourId.value}/moderators/${moderatorId.value}`, { method: 'put', body: body.value }), { immediate: false }
    );
    const fetchREQ = async (tour_id: string, moderator_id: string, new_moderator: IModeratorUpdate) => {
      tourId.value = tour_id
      moderatorId.value = moderator_id
      body.value = new_moderator
      await execute()
      if (status.value == "success") {
        refreshNuxtData('getAllmoderators')
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
  const getModeratorpermissions = async () => {
    const { data, pending, error, refresh } = await useAsyncData<{ data: { permissions: string[] }, message: string }>(
      'getModeratorpermissions',
      () => $api('/tournaments/moderator-permissions')
    );
    return { data, pending, error, refresh }
  }


  return { addModerator, deleteModerator, updateModerator, getModeratorpermissions, getAllmoderators }

}
