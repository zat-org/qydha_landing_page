import {
  type GetTournamentParams,
  OrderByStartAtDirection,
  type getTournamentResponse,
  TournamentState,
  type DetailTournament,
  type TournamentUpdate,
  type TournamentStatistics,
  type UpdateJoinRequestSeetingsBody,
} from "~/features/tournament/models/tournament";
import { TournamentPlayerJoinRequestType } from "../..";

export const useTournament = () => {
  const toast = useToast();
  const { $api, $qaydhaapi } = useNuxtApp();
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
      () => {
        param.value.PageNumber = 1;
      },
    );

    const { data, pending, error, refresh, status } =
      await useAppLazyData<getTournamentResponse>(
        () => buildAppDataKey("getAllTournament", unref(param)),
        () => $api("/tournaments/dashboard", { query: unref(param) }),
        { watch: [param], server: false },
      );

    return { data, pending, error, refresh, status };
  };
  const getSingelTournament = (
    tournamentId: string,
    options?: { immediate?: boolean },
  ) => {
    return useAppLazyData<{ data: DetailTournament }>(
      `getSingelTournament-${tournamentId}`,
      () => $api(`/tournaments/${tournamentId}/dashboard`),
      { immediate: options?.immediate ?? true },
    );
  };

  const setupTournament = (tournamentId: string) => {
    const body = ref();
    const result = useAsyncData(
      `setupTournament-${tournamentId}`,
      () =>
        $api(`/tournaments/${tournamentId}/setup-stages`, {
          method: "POST",
          body: unref(body),
        }),
      { immediate: false },
    );
    const fetchREQ = async (type: string) => {
      console.log(type);
      if (type == "direct") {
        body.value = {
          hasQualificationsStage: false,
          qualificationsStageData: null,
        };
      }
      await result.execute();
      if (result.status.value == "success") {
        toast.add({
          title: "تم بدء تنظيم البطولة",
          description: "تم بدء تنظيم البطولة بنجاح",
          color: "success",
        });
        refreshNuxtData(`getSingelTournament-${tournamentId}`);
      }
    };
    return { result, fetchREQ };
  };
  const updateTournament = async (tournamentId: string) => {
    const body = ref<FormData>();

    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        `updateTournament-${tournamentId}`,
        () =>
          $api(`/tournaments/${tournamentId}`, {
            method: "PUT",
            body: unref(body),
          }),
        { immediate: false },
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
        String(_body.isContactPhoneWhatsapp),
      );
      body.value.append("teamsCount", String(_body.teamsCount));
      body.value.append("tablesCount", String(_body.tablesCount));

      if (_body.tournamentPrivatePassword) {
        body.value.append(
          "tournamentPrivatePassword",
          _body.tournamentPrivatePassword,
        );
      }

      body.value.append("location", JSON.stringify(_body.location));
      if (_body.logo) body.value.append("logo", _body.logo);

      body.value.append(
        "remainingSponsorsUrls",
        JSON.stringify(_body.remainingSponsorsUrls),
      );
      _body.sponsors.forEach((sponsor, index) => {
        body.value!.append(`sponsors[${index}]`, sponsor);
      });
      body.value.append("prizes", JSON.stringify(_body.prizes));
      body.value.append("ownerId", _body.ownerId);
      if (_body.rules.length > 0) {
        body.value!.append("rules", JSON.stringify(_body.rules));
      } else {
        body.value!.append("rules", "[]");
      }

      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };
  const UpdateShowInQydha = () => {
    const body = ref<{ showInQydha: boolean }>({ showInQydha: false });
    const tournamentId = ref();
    const result = useAsyncData(
      `UpdateShowInQydha-${tournamentId.value}`,
      () =>
        $api(`/tournaments/${tournamentId.value}/show-in-qydha`, {
          method: "PUT",
          body: unref(body),
        }),
      { immediate: false },
    );
    const fetchREQ = async (_tournamentId: string, _showInQydha: boolean) => {
      tournamentId.value = _tournamentId;
      body.value.showInQydha = _showInQydha;
      await result.execute();
      if (result.status.value == "success") {
        refreshNuxtData(`getSingelTournament-${tournamentId.value}`);
      }
    };

    return { ...result, fetchREQ };
  };

  const UpdateJoinRequestSettings = () => {
    const tournamentId = ref();
    const body = ref<UpdateJoinRequestSeetingsBody>({
      addPlayersByQydha: false,
      joinRequestStartAt: "",
      joinRequestEndAt: "",
      joinRequestMaxCount: 0,
      allowedJoinRequestType: TournamentPlayerJoinRequestType.Team,
      minimumSubscriptionDays: 0,
    });
    const result = useAsyncData(
      `UpdateJoinRequestSeetings-${tournamentId.value}`,
      () =>
        $api(`/tournaments/${tournamentId.value}/add-players-by-qydha`, {
          method: "PUT",
          body: unref(body),
        }),
      { immediate: false },
    );
    const fetchREQ = async (
      _tournamentId: string,
      _body: UpdateJoinRequestSeetingsBody,
    ) => {
      tournamentId.value = _tournamentId;
      body.value = _body;
      await result.execute();
      if (result.status.value == "success") {
        refreshNuxtData(`getSingelTournament-${tournamentId.value}`);
      }
    };
    return { ...result, fetchREQ };
  };
  const startTournament = (tournamentId: string) => {
    const result = useAsyncData(
      `startTournament-${tournamentId}`,
      () => $api(`/tournaments/${tournamentId}/start`, { method: "POST" }),
      { immediate: false },
    );

    const fetchREQ = async () => {
      await result.execute();
    };

    return { result, fetchREQ };
  };

  const startFinalGroupTournament = (tournamentId: string) => {
    const result = useLazyAsyncData(
      `startFinalGroupTournament-${tournamentId}`,
      () =>
        $api(`/tournaments/${tournamentId}/start-final-group-matches`, {
          method: "POST",
        }),
      { immediate: false },
    );

    const fetchREQ = async () => {
      await result.execute();
      if (result.status.value == "success") {
        refreshNuxtData(`getSingelTournament-${tournamentId}`);
      }
    };

    return { result, fetchREQ };
  };

  /** POST — يعيد البطولة لمرحلة إدارة خريطة المجموعة النهائية (`ManagingFinalGroupBracket`). */
  const resetFinalGroupMatches = (tournamentId: string) => {
    const result = useAsyncData<
      { data: null },
      { message?: string; code: string }
    >(
      `resetFinalGroupMatches-${tournamentId}`,
      () =>
        $api(`/tournaments/${tournamentId}/reset-final-group-matches`, {
          method: "POST",
        }),
      { immediate: false },
    );

    const fetchREQ = async () => {
      await result.execute();
      if (result.status.value === "success") {
        refreshNuxtData(`getSingelTournament-${tournamentId}`);
      }
    };

    return { result, fetchREQ };
  };
  const finishTournament = () => {
    const tour_id = ref("");
    const result = useAsyncData<
      { data: null },
      { message?: string; code: string }
    >(
      `finishTournament-${tour_id.value}`,
      () => $api(`/tournaments/${tour_id.value}/finish`, { method: "POST" }),
      { immediate: false },
    );
    const fetchREQ = async (_tour_id: string) => {
      tour_id.value = _tour_id;
      console.log(tour_id.value);
      await result.execute();
      if (result.status.value === "success") {
        refreshNuxtData(`getSingelTournament-${tour_id.value}`);
      }
    };
    return { ...result, fetchREQ };
  };

  const getTournamentStatistics = (tournamentId: string) => {
    return useAsyncData<{ data: TournamentStatistics }>(
      `getTournamentStatistics-${tournamentId}`,
      () => $qaydhaapi(`/tournaments/${tournamentId}/statistics`),
    );
  };

  const resumeFinalGroupAfterFinish = () => {
    const tour_id = ref();
    const result = useAsyncData<
      { data: null },
      { message?: string; code: string }
    >(
      `resumeTournamentAfterFinish-${tour_id.value}`,
      () =>
        $api(`/tournaments/${tour_id.value}/resume-final-group-matches`, {
          method: "POST",
        }),
      { immediate: false },
    );
    const fetchREQ = async (_tour_id: string) => {
      tour_id.value = _tour_id;
      await result.execute();
      if (result.status.value === "success") {
        refreshNuxtData(`getSingelTournament-${tour_id.value}`);
      }
    };
    return { ...result, fetchREQ };
  };

  const deleteTournament = () => {
    const tournamentId = ref<string>();
    const result = useAsyncData<
      { data: null },
      { message?: string; code: string }
    >(
      () => `deleteTournament-${tournamentId.value}`,
      () => $api(`/tournaments/${tournamentId.value}`, { method: "DELETE" }),
      { immediate: false },
    );

    const fetchREQ = async (_tournamentId: string) => {
      tournamentId.value = _tournamentId;
      await result.execute();
    };

    return { ...result, fetchREQ };
  };

  const approveTournamentPlan = () => {
    const tour_id = ref();
    const result = useAsyncData<
      { data: null },
      { message?: string; code: string }
    >(
      `approveTournamentPlan-${tour_id.value}`,
      () =>
        $api(`/tournaments/${tour_id.value}/confirm-final-group-bracket`, {
          method: "POST",
        }),
      { immediate: false },
    );
    const fetchREQ = async (_tour_id: string) => {
      tour_id.value = _tour_id;
      await result.execute();
      if (result.status.value === "success") {
        refreshNuxtData(`getSingelTournament-${tour_id.value}`);
      }
    };
    return { ...result, fetchREQ };
  };

  return {
    getAllTournament,
    getSingelTournament,
    updateTournament,
    UpdateShowInQydha,
    UpdateJoinRequestSettings,
    getTournamnetStateOptions,
    getTournamnetOrderStartAtOptions,
    setupTournament,
    startTournament,
    startFinalGroupTournament,
    resetFinalGroupMatches,
    getTournamentStatistics,
    finishTournament,
    resumeFinalGroupAfterFinish,
    approveTournamentPlan,
    deleteTournament,
  };
};
