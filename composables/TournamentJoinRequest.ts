import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import {
  type GetTournamentJoinRequestParams,
  type GetTournamentJoinRequestResponse,
  type TournamentJoinRequest,
  TournamentJoinRequestState,
  TournamentJoinRequestType,
  type AcceptedTeam,
  type SingleJoinRequest,
  type GetTournamentAcceptedTeamsJoinRequestResponse,
} from "~/models/TournamentJoinRequest";

const TournamentJoinRequestTypeLabel: Record<
  TournamentJoinRequestType,
  string
> = {
  [TournamentJoinRequestType.Single]: "طلبات  فردية",
  [TournamentJoinRequestType.Team]: "طلبات الفرق ",
};
const TournamentJoinRequestTypeColors: Record<
  TournamentJoinRequestType,
  string
> = {
  [TournamentJoinRequestType.Single]: "success",
  [TournamentJoinRequestType.Team]: "info",
};
const TournamentJoinRequestStateLabel: Record<
  TournamentJoinRequestState,
  string
> = {
  [TournamentJoinRequestState.Approved]: "تم الموافقة",
  [TournamentJoinRequestState.Pending]: "يتم المراجعة",
  [TournamentJoinRequestState.Rejected]: "تم الرفض",
  [TournamentJoinRequestState.InConsideration]: "في انتظار ضمه لفريق",
  [TournamentJoinRequestState.WaitingApproval]: "في انتظار الموافقة",
  [TournamentJoinRequestState.Withdrawn]: "تم الانسحاب",
};

const TournamentJoinRequestStateColors: Record<
  TournamentJoinRequestState,
  string
> = {
  [TournamentJoinRequestState.Approved]: "success",
  [TournamentJoinRequestState.Pending]: "warning",
  [TournamentJoinRequestState.Rejected]: "error",
  [TournamentJoinRequestState.InConsideration]: "warning",
  [TournamentJoinRequestState.WaitingApproval]: "info",
  [TournamentJoinRequestState.Withdrawn]: "neutral",
};

export const useTournamentJoinRequest = () => {
  const { $api } = useNuxtApp();
  const toast = useToast()
  const getTournamentJoinRequests = (
    tournamentId: string,
    params: Ref<GetTournamentJoinRequestParams>
  ) => {
    const param = ref(params);
    return useAsyncData<{
      data: GetTournamentJoinRequestResponse;
      message: string;
    }>(
      "getTournamentJoinRequests",
      () =>
        $api(`/tournaments/${tournamentId}/join-requests`, {
          params: unref(param),
        }),
      { watch: [unref(param)], deep: true }
    );
  };

  const getTouranmentnumberofUserWantstoIn = (tournamentId: string) => {
    return useAsyncData<number>(
      `getTouranmentnumberofUserWantstoIn-${tournamentId}`,
      async () => {
        const [teamsResponse, singlesResponse] = await Promise.all([
          $api<{ data: GetTournamentJoinRequestResponse; message: string }>(
            `/tournaments/${tournamentId}/join-requests/`,
            {
              params: {
                state: TournamentJoinRequestState.WaitingApproval,
                type: TournamentJoinRequestType.Team,
              },
              method: "get",
            }
          ),
          $api<{ data: GetTournamentJoinRequestResponse; message: string }>(
            `/tournaments/${tournamentId}/join-requests/`,
            {
              params: {
                state: TournamentJoinRequestState.WaitingApproval,
                type: TournamentJoinRequestType.Single,
              },
              method: "get",
            }
          ),
        ]);

        const teamsCount = teamsResponse.data?.totalCount ?? 0;
        const singlesCount = singlesResponse.data?.totalCount ?? 0;
        
        // Teams count is multiplied by 2 (assuming 2 players per team)
        return teamsCount * 2 + singlesCount;
      }
    );
  }


  const getTournamnetAcceptedSingleJoinRequest = async (
    tournamentId: string,
    params: Ref<GetTournamentJoinRequestParams>
  ) => {
      const param = params

      watch([()=>param.value?.state,()=>param.value?.type],(newValue,oldValue)=>{
        if (param.value) {
          param.value.pageNumber = 1
        }
      })
    return await useAsyncData<{ data: GetTournamentJoinRequestResponse; message: string }>(
      "getTournamnetAcceptedSingleJoinRequest",
      () => $api(`/tournaments/${tournamentId}/join-requests` , {params:unref(param)}),
      {watch:[unref(param)],deep:true}
    );
  };

  const getTournamnetAcceptedTeamsJoinRequest = async (
    tournamentId: string,
    params: Ref<{pageNumber: number, pageSize: number}>
  ) => {
    const param = ref(params)
    return await useAsyncData<{ data: GetTournamentAcceptedTeamsJoinRequestResponse; message: string }>(
      "getTournamnetAcceptedTeamsJoinRequest",
      () => $api(`/tournaments/${tournamentId}/join-requests/staged-teams`  , {params:unref(param)}),
      {watch:[unref(param)]}
    
    );
  };

  const AcceptJoinRequest =  () => {
    const joinRequestId = ref()
    const tournamentId = ref()  
    const result =  useAsyncData<{ data: boolean; message: string }>(
      "AcceptJoinRequest",
      () =>
        $api(`/tournaments/${unref(tournamentId)}/join-request/${unref(joinRequestId)}/accept`, {
          method: "patch",
        }),
      { immediate: false }
    );  
    const fetchREQ = async (_joinRequestId: string ,_tournamentId: string) => {
      joinRequestId.value = _joinRequestId
      tournamentId.value = _tournamentId
      await result.execute()
      if (result.status.value == "success") {

        refreshNuxtData("getTournamentJoinRequests")
        refreshNuxtData("getTournamnetAcceptedTeamsJoinRequest")
        refreshNuxtData("getTournamnetAcceptedSingleJoinRequest")
        toast.add({ title: "تم القبول بنجاح", color: "success" })
      }
    }
    return { result, fetchREQ }
  };

  const RejectJoinRequest =  () => {
    const joinRequestId = ref()
    const tournamentId = ref()
    const result =   useAsyncData<{ data: boolean; message: string }>(
      "RejectJoinRequest",
      () =>
        // ${unref(tournamentId)}/
        $api(`/tournaments/join-request/${unref(joinRequestId)}/reject`, {
          method: "patch",
        }),
      { immediate: false }
    );  
    const fetchREQ = async (_joinRequestId: string ,_tournamentId: string) => {
      joinRequestId.value = _joinRequestId
      tournamentId.value = _tournamentId
      await result.execute()
      if (result.status.value == "success") {
        toast.add({ title: "تم الرفض بنجاح", color: "error" })
        refreshNuxtData("getTournamentJoinRequests")
      }
    }
    return { result, fetchREQ }
  };

  const RevertJoinRequest =()=>{
    const joinRequestId = ref()
    const tournamentId = ref()
    const result =  useAsyncData<{ data: boolean; message: string }>(
     ()=> ["revertJoinRequest",unref(joinRequestId),unref(tournamentId)].toString(),
      () =>
        $api(`/tournaments/${unref(tournamentId)}/join-request/${unref(joinRequestId)}/revert`, {
          method: "patch",
        }),
      { immediate: false }
    );
    const fetchREQ = async (_joinRequestId: string ,_tournamentId: string) => {
      joinRequestId.value = _joinRequestId
      tournamentId.value = _tournamentId
      // await nextTick()
      await result.execute()
      if (result.status.value == "success") {
        toast.add({ title: "تم التراجع بنجاح", color: "success" })
        refreshNuxtData("getTournamnetAcceptedTeamsJoinRequest")
        refreshNuxtData("getTournamnetAcceptedSingleJoinRequest")
        refreshNuxtData("getTournamentJoinRequests")
      }
    }
    return { result, fetchREQ }
    }

  const MergeSingles =()=>{
    const tournamentId = ref()
    const result =  useAsyncData<{ data: boolean; message: string }>(
      "MergeSingles",
      () =>
        $api(`/tournaments/${unref(tournamentId)}/join-request/merge`, {
          method: "patch",
        }),
      { immediate: false }
    );
    const fetchReq = async (_tournamentId: string) => {
      tournamentId.value = _tournamentId
      await result.execute()
      if (result.status.value == "success") {
        toast.add({ title: "تم الدمج بنجاح", color: "success" })
        refreshNuxtData("getTournamnetAcceptedTeamsJoinRequest")
        refreshNuxtData("getTournamnetAcceptedSingleJoinRequest")
      }
    }
    return { result, fetchReq }
  }
const AutoCompleteJoinRequest =()=>{
  const tournamentId = ref()
  const result =  useAsyncData<{ data: boolean; message: string }>(
    "AutoCompleteJoinRequest",
    () => $api(`/tournaments/${unref(tournamentId)}/join-request/auto-complete`, {
      method: "patch",
    }),
    { immediate: false }
  );
  const fetchReq = async (_tournamentId: string) => {
    tournamentId.value = _tournamentId
    await result.execute()
    if (result.status.value == "success") {
      toast.add({ title: "تم الاكمال التلقائي بنجاح", color: "success" })
      refreshNuxtData("getTournamentJoinRequests")
      refreshNuxtData("getTournamnetAcceptedTeamsJoinRequest")
      refreshNuxtData("getTournamnetAcceptedSingleJoinRequest")
    }
  }
  return { result, fetchReq }
}

  const getTournamentJoinRequestStateOptions = () => {
    const options = [
      { label: "الكل", value: null, color: null },
      ...Object.values(TournamentJoinRequestState).map((value) => ({
        label: TournamentJoinRequestStateLabel[value],
        color: TournamentJoinRequestStateColors[value],
        value,
      })),
    ];
    return options;
  };
  const getState = (value: string): any => {
    return getTournamentJoinRequestStateOptions().find(op => op.value == value)
  }
  const getTournamentJoinRequestTypeOptions = () => {
    const options = [
      { label: "الكل", value: null, color: null },
      ...Object.values(TournamentJoinRequestType).map((value) => ({
        label: TournamentJoinRequestTypeLabel[value],
        color: TournamentJoinRequestTypeColors[value],
        value,
      })),
    ];
    return options;
  };

  const getType = (value: string): any => {
    return getTournamentJoinRequestTypeOptions().find(op => op.value == value)
  }

  const submitAcceptedTeams = async ( ) => {
    const tournamentId = ref()
    const result = await useAsyncData<{ data: boolean; message: string }>(
      ()=>["submitAcceptedTeams",unref(tournamentId)].toString(),
      () =>
        $api(`/tournaments/${unref(tournamentId)}/join-request/submit`, {
          method: "post",
        }),
      { immediate: false }
    );  

    const fetchREQ = async (_tournamentId: string) => {
      tournamentId.value = _tournamentId
      await result.execute()
      if (result.status.value == "success") {
        toast.add({ title: "تم التسليم بنجاح", color: "success" })
        refreshNuxtData("getTournamnetAcceptedTeamsJoinRequest")
      }
    }
    

    return { result, fetchREQ }
  };

  return {
    getTournamentJoinRequests,
    getTouranmentnumberofUserWantstoIn,
    getTournamnetAcceptedSingleJoinRequest,
    getTournamnetAcceptedTeamsJoinRequest,
    AcceptJoinRequest,
    RejectJoinRequest,
    RevertJoinRequest,
    AutoCompleteJoinRequest,
    getTournamentJoinRequestStateOptions,
    getTournamentJoinRequestTypeOptions,
    submitAcceptedTeams,
    MergeSingles,
    getState,
    getType,
  };
};

