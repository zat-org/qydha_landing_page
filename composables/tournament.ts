import { extendNuxtSchema } from "nuxt/kit";
import type { ITournament, ITournamentCreate, ITournamentDetailed } from "~/models/tournament";
import { useMyAuthStore } from "~/store/Auth";

export const useTournament = () => {
  const userStore = useMyAuthStore()
  const { $api } = useNuxtApp();
  const getAllTournament = async () => {
    const padg = ref<number>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData<
      {
        mnessage: string,
        data: {
          items: ITournament[],
          currentPage: number,
          hasNext: boolean,
          hasPrevious: boolean,
          pageSize: number,
          totalCount: number,
          totalPages: number,
        }
      }>(
        'getAllTournament',
        () => $api('/tournaments/dashboard', { query: { PageNumber: padg.value, PageSize: '10' } }), { immediate: false }
      );
    const fetchREQ = async (padge: number = 1) => {
      padg.value = padge
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
  const createTournament = async () => {
    let body = reactive<ITournamentCreate>({
      name: "",
      description: "",
      city: "",
      location: { longitude: 0, latitude: 0 },
      prizes: [],
      prizesCurrency: "",
      startAt: new Date(),
      endAt: new Date(),
      ownerId: ""
    })
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'createTournament ',
      () => $api('/tournaments', { method: "post", body: body }), { immediate: false }
    );
    const fetchREQ = async (_data: ITournamentCreate) => {
      // body = _data
      Object.assign(body, _data)
      // console.log('before',body)
      body.endAt = new Date(_data.endAt).toISOString().split('T')[0] as string
      body.startAt = new Date(_data.startAt).toISOString().split('T')[0] as string
      // console.log('after',body)
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
  const getTourById = async () => {

    const ID = ref<number>()
    const { data, pending, error, refresh, execute, status
    } = await useAsyncData<{ data: ITournamentDetailed, message: string }>(
      'getTourById',
      () => $api(`/tournaments/${ID.value}/dashboard`), { immediate: false }
    );
    const fetchREQ = async (_id: number) => {
      ID.value = _id
      await execute()
      if (status.value == "success" && data.value && data.value.data) {
        userStore.privilege = data.value.data.requesterPrivilege.privilege
        userStore.permissions = data.value.data.requesterPrivilege.permissions ?? []
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
  const updateTour = async () => {
    const tour_id = ref()
    const newTour = ref<ITournamentCreate>()

    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'updateTour',
      () => $api(`/tournaments/${tour_id.value}`, {
        method: "PUT", body: newTour.value
      }),{immediate:false}
    );

    const fetchREQ = async (_tour_id: string,_new_tour:ITournamentCreate) => {
      tour_id.value = _tour_id
      newTour.value=_new_tour
      newTour.value.endAt = new Date(_new_tour.endAt).toISOString().split('T')[0] as string
      newTour.value.startAt = new Date(_new_tour.startAt).toISOString().split('T')[0] as string
      console.log(newTour.value.endAt,newTour.value.startAt )
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
  const updatTourQydhaAndOwner = async () => {

    const ID = ref<number>()
    const BODY = reactive<{ showInQydha: boolean, ownerId: string }>({ showInQydha: false, ownerId: "" })
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'updatTourQydhaAndOwner ',
      () => $api(`tournaments/${ID.value}/admin`, { method: "PUT", body: BODY }), { immediate: false }
    );
    const fetchREQ = async (_showQydha: boolean, _ownerId: string, _id: number) => {
      ID.value = _id
      BODY.showInQydha = _showQydha;
      BODY.ownerId = _ownerId
      await execute()

    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
  const updateTourLogo = async () => {
    const tour_id = ref()
    const body = ref<FormData>(new FormData())
    const { data, pending, error, refresh, execute, status } = await useAsyncData(
      'updateTourLogo',
      () => $api(`tournaments/${tour_id}/logo`, { body: body.value, method: "PATCH" }), { immediate: false }
    );
    const fetchREQ = async (_tour_id: string, _logo: File) => {
      tour_id.value = _tour_id
      body.value.append("image", _logo)
      await execute();
      refreshNuxtData("getTourById")
    }
    return { data, pending, error, refresh, fetchREQ, status }
  }
  return { getAllTournament, createTournament, getTourById, updatTourQydhaAndOwner, updateTourLogo,updateTour  }
}
