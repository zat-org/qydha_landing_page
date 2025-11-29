import {
  type GetTournamentParams,
  type Tournament,
  OrderByStartAtDirection,
  type ITournamentUpdate,
  type getTournamentResponse,
  TournamentState,
  type DetailTournament,
  type TournamentUpdate,
} from "~/models/tournament";
import { useMyAuthStore } from "~/store/Auth";
import { useMyTournamentStore } from "~/store/tournament";

export const useTournament = () => {
  const userStore = useMyAuthStore();
  const { $api } = useNuxtApp();
  const tournamentStateLabel: Record<TournamentState, string> = {
    [TournamentState.Upcoming]: "القادمة",
    [TournamentState.Running]: "الجارية",
    [TournamentState.Finished]: "المنتهية",
  };
  const tournamentStateColor: Record<
    TournamentState,
    "warning" | "success" | "neutral"
  > = {
    [TournamentState.Upcoming]: "warning",
    [TournamentState.Running]: "success",
    [TournamentState.Finished]: "neutral",
  };
  const TournamentOrderStartAt: Record<OrderByStartAtDirection, string> = {
    [OrderByStartAtDirection.ASC]: "من الاقدم الي الاحدث",
    [OrderByStartAtDirection.DESC]: "من الاحدث الي الاقدم ",
  };

  const getTournamnetStateOptions = () => {
    const options = [
      // { label: "الكل", value: null, color: null },
      ...Object.values(TournamentState).map((value) => ({
        label: tournamentStateLabel[value],
        color: tournamentStateColor[value],
        value,
      })),
    ];
    return options;
  };
  const getTournamnetOrderStartAtOptions = () => {
    const options = [
      ...Object.values(OrderByStartAtDirection).map((value) => ({
        label: TournamentOrderStartAt[value],
        value,
      })),
    ];
    return options;
  };

  const getAllTournament = async (params: Ref<GetTournamentParams>) => {
    const param = ref(unref(params));
    watch(
      [() => param.value.States, () => param.value.OrderByStartAtDirection],
      (newValue, oldValue) => {
        param.value.PageNumber = 1;
      }
    );

    const { data, pending, error, refresh, status } =
      await useLazyAsyncData<getTournamentResponse>(
        "getAllTournament",
        () => $api("/tournaments/dashboard", { query: unref(param) }),
        { watch: [unref(param)], server: false }
      );
      watch(status,()=>{
        if (status.value == 'success') {
          const tournaments = data.value?.data.items as Tournament[]
          // useMyTournamentStore().setSelectedTournament(tournaments)
        }
      },{immediate:true})
    

    return { data, pending, error, refresh, status };
  };
  const getSingelTournament = async (tournamentId: string) => {
    return await useLazyAsyncData<{ data: DetailTournament }>(
      `getSingelTournament-${tournamentId}`,
      () => {
        return $api(`/tournaments/${tournamentId}/dashboard`);
      },
      
    );
  };
  const setupTournament =  (tournamentId: string) => {
    const body= ref()
    const result=useAsyncData(
        `setupTournament-${tournamentId}`,
        () => $api(`/tournaments/${tournamentId}/stages/setup`, { method: "POST", body: unref(body) }),
        { immediate: false }
      );
      const fetchREQ = async ( type:string) => {
        console.log(type)
        if (type == "direct"){
          body.value= {hasQualificationsStage:false , qualificationsStageData:null }
        }
        await result.execute()
      }
    return {result,fetchREQ}    
  };
  const updateTournament = async (tournamentId: string) => {
    const body = ref<FormData>();

    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        `updateTournament-${tournamentId}`,
        () =>
          $api(`/tournaments/${tournamentId}/admin`, {
            method: "PUT",
            body: unref(body),
          }),
        { immediate: false }
      );

    const fetchREQ = async (_body: TournamentUpdate) => {
      body.value = new FormData();
      body.value.append("title", _body.title);
      body.value.append("description", _body.description);
      body.value.append("contactPhone", _body.contactPhone);
      body.value.append("startAt", _body.startAt);
      body.value.append("endAt", _body.endAt);
      body.value.append("type", _body.tournamentType);
      body.value.append("locationDescription", _body.locationDescription);
      body.value.append("isContactPhoneCall", String(_body.isContactPhoneCall));
      body.value.append(
        "isContactPhoneWhatsapp",
        String(_body.isContactPhoneWhatsapp)
      );
      body.value.append("showInQydha", String(_body.showInQydha));
      body.value.append("addPlayersByQydha", String(_body.addPlayersByQydha));
      body.value.append("teamsCount", String(_body.teamsCount));
      body.value.append("tablesCount", String(_body.tablesCount));
      if (_body.addPlayersByQydha) {
        if (_body.joinRequestStartAt) {
          console.log();
          body.value.append(
            "joinRequestStartAt",
            _body.joinRequestStartAt
          );
        }
        if (_body.joinRequestEndAt) {
          body.value.append(
            "joinRequestEndAt",
            _body.joinRequestEndAt
          );
        }
        if (_body.joinRequestMaxCount) {
          body.value.append(
            "joinRequestMaxCount",
            String(_body.joinRequestMaxCount)
          );
        }
      }
      if (_body.tournamentPrivatePassword) {
        body.value.append(
          "tournamentPrivatePassword",
          _body.tournamentPrivatePassword
        );
      }

      body.value.append("location", JSON.stringify(_body.location));
      if (_body.logo) body.value.append("logo", _body.logo);

      body.value.append(
        "remainingSponsorsUrls",
        JSON.stringify(_body.remainingSponsorsUrls)
      );
      _body.sponsors.forEach((sponsor, index) => {
        body.value!.append(`sponsors[${index}]`, sponsor);
      });
      body.value.append("prizes", JSON.stringify(_body.prizes));
      if(_body.rules.length > 0){
        body.value!.append("rules", JSON.stringify(_body.rules));

      }else{
        body.value!.append("rules", "[]");
      }

      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };
  // const updatTourQydhaAndOwner = async () => {

  //   const ID = ref<number>()
  //   const BODY = reactive<{ showInQydha: boolean, ownerId: string }>({ showInQydha: false, ownerId: "" })
  //   const { data, pending, error, refresh, status, execute } = await useAsyncData(
  //     'updatTourQydhaAndOwner ',
  //     () => $api(`tournaments/${ID.value}/admin`, { method: "PUT", body: BODY }), { immediate: false }
  //   );
  //   const fetchREQ = async (_showQydha: boolean, _ownerId: string, _id: number) => {
  //     ID.value = _id
  //     BODY.showInQydha = _showQydha;
  //     BODY.ownerId = _ownerId
  //     await execute()

  //   }
  //   return { data, pending, error, refresh, status, fetchREQ }
  // }
  // const updateTourLogo = async () => {
  //   const tour_id = ref()
  //   const body = ref<FormData>(new FormData())
  //   const { data, pending, error, refresh, execute, status } = await useAsyncData(
  //     'updateTourLogo',
  //     () => $api(`tournaments/${tour_id.value}/logo`, { body: body.value, method: "PATCH" }), { immediate: false }
  //   );
  //   const fetchREQ = async (_tour_id: string, _logo: File) => {
  //     tour_id.value = _tour_id
  //     body.value.append("image", _logo)
  //     await execute();
  //     refreshNuxtData("getTourById")
  //   }
  //   return { data, pending, error, refresh, fetchREQ, status }
  // }
  return {
    getAllTournament,
    getSingelTournament,
    updateTournament,
    getTournamnetStateOptions,
    getTournamnetOrderStartAtOptions,
    setupTournament
  };
};
