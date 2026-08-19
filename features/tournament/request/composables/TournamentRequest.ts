import {
  type DetailTournamentRequest,
  type GetTournamentRequestParams,
  type getTournamentRequestResponse,
  type TournamentCreationRequest,
  type UpdateTournamentCreationRequest,
  TournamentRequestState,
} from "~/features/tournament/models/tournamentRequest";
import { TournamentPrizeCurrency } from "~/features/tournament/models/tournamentPrize";
import { TournamentType } from "~/features/tournament/models/tournamenetType";

type TournamentRequestsPage = getTournamentRequestResponse["data"];

const tournamentStateLabels: Record<TournamentRequestState, string> = {
  [TournamentRequestState.Pending]: "جاري المراجعة",
  [TournamentRequestState.Approved]: "تم الموافقة ",
  [TournamentRequestState.Rejected]: "تم الرفض",
  [TournamentRequestState.Canceled]: "تم الالغاء",
};
const tournamentStateColors: Record<
  TournamentRequestState,
  "warning" | "success" | "error" | "neutral"
> = {
  [TournamentRequestState.Pending]: "warning",
  [TournamentRequestState.Approved]: "success",
  [TournamentRequestState.Rejected]: "error",
  [TournamentRequestState.Canceled]: "neutral",
};

const getStateColor = (state: TournamentRequestState) => {
  return tournamentStateColors[state];
};
const tournamentTypeLabels: Record<TournamentType, string> = {
  [TournamentType.public]: "عامة",
  [TournamentType.private]: "خاصة ",
};

const tournamentTypeColors: Record<TournamentType, "info" | "neutral"> = {
  [TournamentType.public]: "info",
  [TournamentType.private]: "neutral",
};
const tournamentprizeCurrencyLable: Record<TournamentPrizeCurrency, string> = {
  [TournamentPrizeCurrency.USD]: "دولار أمريكي ",
  [TournamentPrizeCurrency.EGP]: "جنيه مصري ",
  [TournamentPrizeCurrency.SAR]: "ريال سعودي ",
  [TournamentPrizeCurrency.AED]: "درهم إماراتي ",
  [TournamentPrizeCurrency.EUR]: "يورو ",
  [TournamentPrizeCurrency.JOD]: "دينار أردني ",
  [TournamentPrizeCurrency.KWD]: "دينار كويتي ",
  [TournamentPrizeCurrency.TRY]: "ليرة تركية ",
  [TournamentPrizeCurrency.GBP]: "جنيه إسترليني ",
};

export const useTournamentRequest = () => {
  const { $api } = useNuxtApp();

  const AddTournamentRequest = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_body: TournamentCreationRequest) => {
      await execute(async () => {
        const body = new FormData();
        body.append("title", _body.title);
        body.append("description", _body.description);
        body.append("contactPhone", _body.contactPhone);
        body.append("startAt", _body.startAt);
        body.append("endAt", _body.endAt);
        body.append("type", _body.type);
        body.append("locationDescription", _body.locationDescription);
        body.append("isContactPhoneCall", String(_body.isContactPhoneCall));
        body.append(
          "isContactPhoneWhatsapp",
          String(_body.isContactPhoneWhatsapp),
        );
        body.append("AddPlayersByQydha", String(_body.isAddPlayersByQydha));
        body.append("teamsCount", String(_body.teamsCount));
        body.append("tablesCount", String(_body.tablesCount));
        if (_body.isAddPlayersByQydha) {
          if (_body.joinRequestStartAt) {
            body.append("joinRequestStartAt", _body.joinRequestStartAt);
          }
          if (_body.joinRequestEndAt) {
            body.append("joinRequestEndAt", _body.joinRequestEndAt);
          }
          if (_body.joinRequestMaxCount) {
            body.append(
              "joinRequestMaxCount",
              String(_body.joinRequestMaxCount),
            );
          }
          if (_body.allowedJoinRequestType) {
            body.append(
              "allowedJoinRequestType",
              _body.allowedJoinRequestType,
            );
          }
          body.append(
            "minimumSubscriptionDays",
            String(_body.minimumSubscriptionDays),
          );
        }
        if (_body.tournamentPrivatePassword) {
          body.append(
            "tournamentPrivatePassword",
            _body.tournamentPrivatePassword,
          );
        }

        body.append("location", JSON.stringify(_body.location));
        if (_body.logo) body.append("logo", _body.logo);
        _body.sponsors.forEach((sponsor, index) => {
          console.log(`Sponsor ${index}:`, sponsor.name, sponsor.size, "bytes");
          body.append(`sponsors[${index}]`, sponsor);
        });
        body.append("prizes", JSON.stringify(_body.prizes));
        if (_body.rules.length > 0) {
          body.append(`rules`, JSON.stringify(_body.rules));
        } else {
          body.append("rules", "[]");
        }
        if (_body.qualificationsStageInfo) {
          body.append(
            "qualificationsStageInfo",
            JSON.stringify(_body.qualificationsStageInfo),
          );
        }

        await $api("/tournaments/creation-requests", {
          method: "post",
          body,
        });
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const OrganizerCancelRequest = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_id: string) => {
      await execute(async () => {
        await $api(`/tournaments/creation-requests/${_id}/cancel`, {
          method: "post",
        });
        await refreshAppData(appKeys.adminTourRequests);
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const AdminGetTournamentRequests = (
    params: Ref<GetTournamentRequestParams>,
  ) => {
    const param = ref(params.value);
    watch(
      [
        () => param.value.searchToken,
        () => param.value.state,
        () => param.value.type,
      ],
      () => {
        param.value.pageNumber = 1;
      },
    );

    const { data, status, pending } = useAppApiData<TournamentRequestsPage>(
      appKeys.adminTourRequests,
      () => $api("tournaments/creation-requests", { params: unref(param) }),
      {
        watch: [unref(param)],
        deep: true,
      },
    );
    return { data, status, pending };
  };

  const AdminApproveRequest = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_id: string) => {
      await execute(async () => {
        await $api(`/tournaments/creation-requests/${_id}/approve`, {
          method: "post",
        });
        await refreshAppData(appKeys.adminTourRequests);
        clearNuxtData((key) => key.startsWith("getAllTournament"));
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const AdminRejectRequest = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_id: string) => {
      await execute(async () => {
        await $api(`/tournaments/creation-requests/${_id}/reject`, {
          method: "post",
        });
        await refreshAppData(appKeys.adminTourRequests);
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const AdminGetSingleTournamentRequest = (id: string) => {
    return useAppLazyApiData<DetailTournamentRequest>(
      appKeys.adminSingleTourRequest(id),
      () => $api(`/tournaments/creation-requests/${unref(id)}`),
      { server: false },
    );
  };

  const updateTournamentRequest = (id: string) => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchReq = async (_body: UpdateTournamentCreationRequest) => {
      await execute(async () => {
        const body = new FormData();
        body.append("title", _body.title);
        body.append("description", _body.description);
        body.append("contactPhone", _body.contactPhone);
        body.append("startAt", _body.startAt);
        body.append("endAt", _body.endAt);
        body.append("type", _body.type);
        body.append("locationDescription", _body.locationDescription);
        body.append("isContactPhoneCall", String(_body.isContactPhoneCall));
        body.append(
          "isContactPhoneWhatsapp",
          String(_body.isContactPhoneWhatsapp),
        );
        body.append(
          "isAddPlayersByQydha",
          String(_body.isAddPlayersByQydha),
        );
        body.append("teamsCount", String(_body.teamsCount));
        body.append("tablesCount", String(_body.tablesCount));
        if (_body.isAddPlayersByQydha) {
          if (_body.joinRequestStartAt) {
            body.append("joinRequestStartAt", _body.joinRequestStartAt);
          }
          if (_body.joinRequestEndAt) {
            body.append("joinRequestEndAt", _body.joinRequestEndAt);
          }
          if (_body.joinRequestMaxCount) {
            body.append(
              "joinRequestMaxCount",
              String(_body.joinRequestMaxCount),
            );
          }
          if (_body.allowedJoinRequestType) {
            body.append(
              "allowedJoinRequestType",
              _body.allowedJoinRequestType,
            );
          }
          if (_body.minimumSubscriptionDays) {
            body.append(
              "minimumSubscriptionDays",
              String(_body.minimumSubscriptionDays),
            );
          }
        }
        if (_body.tournamentPrivatePassword) {
          body.append(
            "tournamentPrivatePassword",
            _body.tournamentPrivatePassword,
          );
        }

        body.append("location", JSON.stringify(_body.location));
        if (_body.logo) body.append("logo", _body.logo);

        body.append(
          "remainingSponsorsUrls",
          JSON.stringify(_body.remainingSponsorsUrls),
        );
        _body.sponsors.forEach((sponsor, index) => {
          body.append(`sponsors[${index}]`, sponsor);
        });
        body.append("prizes", JSON.stringify(_body.prizes));
        if (_body.rules.length > 0) {
          body.append(`rules`, JSON.stringify(_body.rules));
        } else {
          body.append("rules", "[]");
        }
        if (_body.qualificationsStageInfo) {
          body.append(
            "qualificationsStageInfo",
            JSON.stringify(_body.qualificationsStageInfo),
          );
        }

        await $api(`/tournaments/creation-requests/${unref(id)}`, {
          method: "put",
          body,
        });
        await refreshAppData(
          appKeys.adminTourRequests,
          appKeys.adminSingleTourRequest(id),
        );
      });
    };
    return { pending, status, error, fetchReq };
  };

  const getTournamnetStateOptions = () => {
    const options = [
      { label: "الكل", value: null, color: null },
      ...Object.values(TournamentRequestState).map((value) => ({
        label: tournamentStateLabels[value],
        color: tournamentStateColors[value],
        value,
      })),
    ];
    return options;
  };
  const getTournamentTypeOptions = () => {
    const options = [
      { label: "الكل", value: null, color: null },
      ...Object.values(TournamentType).map((value) => ({
        label: tournamentTypeLabels[value],
        color: tournamentTypeColors[value],
        value,
      })),
    ];
    return options;
  };
  const getTournamentPrizeCurrency = () => {
    const options = [
      ...Object.values(TournamentPrizeCurrency).map((value) => ({
        label: tournamentprizeCurrencyLable[value],
        value,
      })),
    ];
    return options;
  };

  return {
    AddTournamentRequest,
    OrganizerCancelRequest,
    AdminGetTournamentRequests,
    AdminApproveRequest,
    AdminRejectRequest,
    AdminGetSingleTournamentRequest,
    updateTournamentRequest,

    getTournamnetStateOptions,
    getTournamentTypeOptions,
    getTournamentPrizeCurrency,
    getStateColor,
  };
};
