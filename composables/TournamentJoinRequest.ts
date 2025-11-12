import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import  {
 type GetTournamentJoinRequestParams,
 type GetTournamentJoinRequestResponse,
 type TournamentJoinRequest,
  TournamentJoinRequestState,
  TournamentJoinRequestType,
  type AcceptedTeam,
} from "~/models/TournamentJoinRequest";

const TournamentJoinRequestTypeLabel :Record<TournamentJoinRequestType,string>={
    [TournamentJoinRequestType.Single]:'طلبات  فردية',
    [TournamentJoinRequestType.Team]:'طلبات الفرق '
}
const TournamentJoinRequestTypeColors :Record<TournamentJoinRequestType,string>={
    [TournamentJoinRequestType.Single]:'success',
    [TournamentJoinRequestType.Team]:'info'
}
const TournamentJoinRequestStateLabel:Record<TournamentJoinRequestState,string>={
    [TournamentJoinRequestState.Approved]:'تم الموافقة',
    [TournamentJoinRequestState.Pending]:'يتم المراجعة',
    [TournamentJoinRequestState.Rejected]:'تم الرفض',
    [TournamentJoinRequestState.WaitingApproval]:'في انتظار الموافقة',
    [TournamentJoinRequestState.Withdrawn]:'تم الانسحاب',
}

const TournamentJoinRequestStateColors:Record<TournamentJoinRequestState,string>={
    [TournamentJoinRequestState.Approved]: 'success',
    [TournamentJoinRequestState.Pending]: 'warning',
    [TournamentJoinRequestState.Rejected]: 'error',
    [TournamentJoinRequestState.WaitingApproval]: 'info',
    [TournamentJoinRequestState.Withdrawn]: 'neutral',
}



export const useTournamentJoinRequest = () => {
  const { $api } = useNuxtApp();
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
  const ApproveJoinRequest = async (joinRequestId: string) => {
    return await useAsyncData<{ data: boolean; message: string }>(
      "ApproveJoinRequest",
      () =>
        $api(`/tournaments/join-request/${joinRequestId}/approve`, {
          method: "patch",
          onResponse: (response: any) => {
            console.log(response.isOk)
            if (response.isOk) {
              refreshNuxtData("getTournamentJoinRequests");
            }
          },
        }),
      { immediate: false }
    );
  };

  const RejectJoinRequest = async (joinRequestId: string) => {
    return await useAsyncData<{ data: boolean; message: string }>(
      "RejectJoinRequest",
      () =>
        $api(`/tournaments/join-request/${joinRequestId}/reject`, {
          method: "patch",
          onResponse: (response: any) => {
            if (response.isOk) {
              refreshNuxtData("getTournamentJoinRequests");
            }
          },
        }),
      { immediate: false }
    );
  };


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

  const submitAcceptedTeams = async (tournamentId: string, acceptedTeams: AcceptedTeam[]) => {
    return await useAsyncData<{ data: boolean; message: string }>(
      "submitAcceptedTeams",
      () =>
        $api(`/tournaments/${tournamentId}/join-requests/submit`, {
          method: "post",
          body: acceptedTeams,
          onResponse: (response: any) => {
            if (response.isOk) {
              refreshNuxtData("getTournamentJoinRequests");
            }
          },
        }),
      { immediate: false }
    );
  };

  return { 
    getTournamentJoinRequests, 
    ApproveJoinRequest, 
    RejectJoinRequest, 
    getTournamentJoinRequestStateOptions, 
    getTournamentJoinRequestTypeOptions,
    submitAcceptedTeams,
  };
};
