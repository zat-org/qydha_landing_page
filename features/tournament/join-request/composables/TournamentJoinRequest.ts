import {
  type GetTournamentJoinRequestParams,
  type GetTournamentJoinRequestResponse,
  TournamentJoinRequestState,
  TournamentJoinRequestType,
  type GetTournamentAcceptedTeamsJoinRequestResponse,
  type GetTeamJoinRequestsParams,
  type GetTeamJoinRequestsResponse,
  type TeamJoinRequestPatchAction,
} from "~/features/tournament/models/TournamentJoinRequest";

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

function buildTeamJoinRequestsQuery(p: GetTeamJoinRequestsParams): string {
  const qs = new URLSearchParams();
  qs.set("pageNumber", String(p.pageNumber));
  qs.set("pageSize", String(p.pageSize));
  if (p.searchToken) qs.set("searchToken", p.searchToken);
  for (const s of p.GetOnlyStates ?? []) qs.append("GetOnlyStates", s);
  return qs.toString();
}

const refreshJoinRequestLists = () =>
  refreshAppData(
    appKeys.tournamentJoinRequests,
    appKeys.tournamentAcceptedTeams,
    appKeys.tournamentAcceptedSingles,
  );

export const useTournamentJoinRequest = () => {
  const { $api } = useNuxtApp();
  const toast = useToast();

  /** Team join requests (single list endpoint, `GetOnlyStates` filter). */
  const getTeamJoinRequests = (
    tournamentId: string,
    params: Ref<GetTeamJoinRequestsParams>,
    instanceKey: string,
  ) => {
    return useAppApiData<GetTeamJoinRequestsResponse>(
      () =>
        `getTeamJoinRequests-${instanceKey}-${tournamentId}-${JSON.stringify(unref(params))}`,
      () => {
        const p = unref(params);
        const query = buildTeamJoinRequestsQuery(p);
        return $api(
          `/tournaments/${tournamentId}/tournament-team-join-requests?${query}`,
        );
      },
      { watch: [params], deep: true },
    );
  };

  const patchTeamJoinRequests = async (
    tournamentId: string,
    action: TeamJoinRequestPatchAction,
    joinRequestIds?: string[],
  ) => {
    if (!joinRequestIds?.length && action !== "approve") {
      toast.add({ title: "اختر طلباً واحداً على الأقل", color: "warning" });
      return false;
    }
    try {
      await $api(
        `/tournaments/${tournamentId}/tournament-team-join-requests/${action}`,
        {
          method: "patch",
          body: {
            joinRequestIds,
            updateSelectionType: "SelectedIds ",
          },
        },
      );
      toast.add({ title: "تم تنفيذ الإجراء", color: "success" });
      return true;
    } catch {
      toast.add({ title: "تعذر تنفيذ الإجراء", color: "error" });
      return false;
    }
  };

  const IntialApproveTeams = async (
    tournamentId: string,
    numberOfTeams: number,
  ) => {
    try {
      await $api(
        `/tournaments/${tournamentId}/tournament-team-join-requests/consider`,
        {
          method: "patch",
          body: {
            randomRequestsCount: numberOfTeams,
            updateSelectionType: "RandomRequests",
          },
        },
      );
    } catch {
      toast.add({ title: "تعذر تنفيذ الإجراء", color: "error" });
      return false;
    }
    toast.add({ title: "تم الموافقة الأوليه بنجاح", color: "success" });
    return true;
  };

  const getTournamentJoinRequests = (
    tournamentId: string,
    params: Ref<GetTournamentJoinRequestParams>,
  ) => {
    const param = ref(params);
    return useAppApiData<GetTournamentJoinRequestResponse>(
      appKeys.tournamentJoinRequests,
      () =>
        $api(`/tournaments/${tournamentId}/tournament-team-join-requests`, {
          params: unref(param),
        }),
      { watch: [unref(param)], deep: true },
    );
  };

  const getTouranmentnumberofUserWantstoIn = (tournamentId: string) => {
    return useAppData<number>(
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
            },
          ),
          $api<{ data: GetTournamentJoinRequestResponse; message: string }>(
            `/tournaments/${tournamentId}/join-requests/`,
            {
              params: {
                state: TournamentJoinRequestState.WaitingApproval,
                type: TournamentJoinRequestType.Single,
              },
              method: "get",
            },
          ),
        ]);

        const teamsCount = teamsResponse.data?.totalCount ?? 0;
        const singlesCount = singlesResponse.data?.totalCount ?? 0;

        // Teams count is multiplied by 2 (assuming 2 players per team)
        return teamsCount * 2 + singlesCount;
      },
    );
  };

  const getTournamnetAcceptedSingleJoinRequest = async (
    tournamentId: string,
    params: Ref<GetTournamentJoinRequestParams>,
  ) => {
    const param = params;

    watch(
      [() => param.value?.state, () => param.value?.type],
      () => {
        if (param.value) {
          param.value.pageNumber = 1;
        }
      },
    );
    return await useAppApiData<GetTournamentJoinRequestResponse>(
      appKeys.tournamentAcceptedSingles,
      () =>
        $api(`/tournaments/${tournamentId}/join-requests`, {
          params: unref(param),
        }),
      { watch: [unref(param)], deep: true },
    );
  };

  const getTournamnetAcceptedTeamsJoinRequest = async (
    tournamentId: string,
    params: Ref<{ pageNumber: number; pageSize: number }>,
  ) => {
    const param = ref(params);
    return await useAppApiData<GetTournamentAcceptedTeamsJoinRequestResponse>(
      appKeys.tournamentAcceptedTeams,
      () =>
        $api(`/tournaments/${tournamentId}/join-requests/staged-teams`, {
          params: unref(param),
        }),
      { watch: [unref(param)] },
    );
  };

  const AcceptJoinRequest = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_joinRequestId: string, _tournamentId: string) => {
      await execute(async () => {
        await $api(
          `/tournaments/${_tournamentId}/join-request/${_joinRequestId}/accept`,
          { method: "patch" },
        );
        await refreshJoinRequestLists();
        toast.add({ title: "تم القبول بنجاح", color: "success" });
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const RejectJoinRequest = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_joinRequestId: string, _tournamentId: string) => {
      await execute(async () => {
        await $api(`/tournaments/join-request/${_joinRequestId}/reject`, {
          method: "patch",
        });
        await refreshAppData(appKeys.tournamentJoinRequests);
        toast.add({ title: "تم الرفض بنجاح", color: "error" });
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const RevertJoinRequest = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_joinRequestId: string, _tournamentId: string) => {
      await execute(async () => {
        await $api(
          `/tournaments/${_tournamentId}/join-request/${_joinRequestId}/revert`,
          { method: "patch" },
        );
        await refreshJoinRequestLists();
        toast.add({ title: "تم التراجع بنجاح", color: "success" });
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const MergeSingles = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchReq = async (_tournamentId: string) => {
      await execute(async () => {
        await $api(`/tournaments/${_tournamentId}/join-request/merge`, {
          method: "patch",
        });
        await refreshAppData(
          appKeys.tournamentAcceptedTeams,
          appKeys.tournamentAcceptedSingles,
        );
        toast.add({ title: "تم الدمج بنجاح", color: "success" });
      });
    };
    return { pending, status, error, fetchReq };
  };

  const AutoCompleteJoinRequest = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchReq = async (_tournamentId: string) => {
      await execute(async () => {
        await $api(
          `/tournaments/${_tournamentId}/join-request/auto-complete`,
          { method: "patch" },
        );
        await refreshJoinRequestLists();
        toast.add({ title: "تم الاكمال التلقائي بنجاح", color: "success" });
      });
    };
    return { pending, status, error, fetchReq };
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
  const getState = (value: string): any => {
    return getTournamentJoinRequestStateOptions().find(
      (op) => op.value == value,
    );
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

  const getType = (value: string): any => {
    return getTournamentJoinRequestTypeOptions().find(
      (op) => op.value == value,
    );
  };

  const submitAcceptedTeams = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_tournamentId: string) => {
      await execute(async () => {
        await $api(`/tournaments/${_tournamentId}/join-request/submit`, {
          method: "post",
        });
        await refreshAppData(appKeys.tournamentAcceptedTeams);
        toast.add({ title: "تم التسليم بنجاح", color: "success" });
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return {
    getTournamentJoinRequests,
    getTeamJoinRequests,
    patchTeamJoinRequests,
    getTouranmentnumberofUserWantstoIn,
    getTournamnetAcceptedSingleJoinRequest,
    getTournamnetAcceptedTeamsJoinRequest,
    AcceptJoinRequest,
    RejectJoinRequest,
    IntialApproveTeams,
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
