import { TournamentState } from "~/models/tournament";
import {
  TournamentPrizeCurrency,
  TournamentType,
  type DetailTournamentRequest,
  type GetTournamentParams,
  type getTournamentResponse,
  type TournamentCreationRequest,
  type TournamentRequest,
  type UpdateTournamentCreationRequest,
} from "~/models/tournamentRequest";
import { useMyAuthStore } from "~/store/Auth";
const tournamentStateLabels: Record<TournamentState, string> = {
  [TournamentState.Pending]: "جاري المراجعة",
  [TournamentState.Approved]: "تم الموافقة ",
  [TournamentState.Rejected]: "تم الرفض",
  [TournamentState.Canceled]: "تم الالغاء",
};
const tournamentStateColors: Record<TournamentState, string> = {
  [TournamentState.Pending]:
    "dark:text-yellow-100 dark:bg-yellow-800 text-yellow-800 bg-yellow-100", // Tailwind yellow for pending
  [TournamentState.Approved]:
    "dark:text-green-100 dark:bg-green-800 text-green-800 bg-green-100", // Tailwind green for approved
  [TournamentState.Rejected]:
    "dark:text-red-100 dark:bg-red-800 text-red-800 bg-red-100", // Tailwind red for rejected
  [TournamentState.Canceled]:
    "dark:text-gray-100 dark:bg-gray-800 text-gray-800 bg-gray-100", // Tailwind gray for canceled
};
const tournamentTypeLabels: Record<TournamentType, string> = {
  [TournamentType.public]: "عامة",
  [TournamentType.private]: "خاصة ",
};

const tournamentTypeColors: Record<TournamentType, string> = {
  [TournamentType.public]:
    "dark:text-blue-100 dark:bg-blue-800 text-blue-800 bg-blue-100",
  [TournamentType.private]:
    "dark:text-gray-100 dark:bg-gray-800 text-gray-800 bg-gray-100",
};
const tournamentprizeCurrencyLable: Record<TournamentPrizeCurrency, string> = {
  [TournamentPrizeCurrency.USD]: "دولار أمريكي (USD)",
  [TournamentPrizeCurrency.EGP]: "جنيه مصري (EGP)",
  [TournamentPrizeCurrency.SAR]: "ريال سعودي (SAR)",
  [TournamentPrizeCurrency.AED]: "درهم إماراتي (AED)",
  [TournamentPrizeCurrency.EUR]: "يورو (EUR)",
  [TournamentPrizeCurrency.JOD]: "دينار أردني (JOD)",
  [TournamentPrizeCurrency.KWD]: "دينار كويتي (KWD)",
  [TournamentPrizeCurrency.TRY]: "ليرة تركية (TRY)",
  [TournamentPrizeCurrency.GBP]: "جنيه إسترليني (GBP)",
};

export const useTournamentRequest = () => {
  const { $api } = useNuxtApp();
  const user = useMyAuthStore();
  // console.log(user.isStaffAdmin)
  const AddTournamentRequest = () => {
    const body = ref(new FormData());
    const { data, status, execute, pending, error } = useAsyncData(
      "Crearetrequest",
      () =>
        $api("/tournaments/creation-request", {
          method: "post",
          body: body.value,
          //   headers: { "Content-Type": "multipart/form-data" },
        }),
      { immediate: false }
    );
    // Helper function to convert object to FormData

    const fetchREQ = async (_body: TournamentCreationRequest) => {
      body.value = new FormData();
      body.value.append("title", _body.title);
      body.value.append("description", _body.description);
      body.value.append("contactPhone", _body.contactPhone);
      body.value.append("startAt", _body.startAt.split("T")[0]);
      body.value.append("endAt", _body.endAt.split("T")[0]);
      body.value.append("type", _body.type);
      body.value.append("locationDescription", _body.locationDescription);
      body.value.append("isContactPhoneCall", String(_body.isContactPhoneCall));
      body.value.append(
        "isContactPhoneWhatsapp",
        String(_body.isContactPhoneWhatsapp)
      );
      body.value.append(
        "isAddPlayersByQydha",
        String(_body.isAddPlayersByQydha)
      );
      body.value.append("teamsCount", String(_body.teamsCount));
      body.value.append("tablesCount", String(_body.tablesCount));
      if (_body.isAddPlayersByQydha) {
        if (_body.joinRequestStartAt) {
          body.value.append("joinRequestStartAt", _body.joinRequestStartAt.split("T")[0]);
        }
        if (_body.joinRequestEndAt) {
          body.value.append("joinRequestEndAt", _body.joinRequestEndAt.split("T")[0]);
        }
        if (_body.joinRequestMaxCount) {
          body.value.append("joinRequestMaxCount", String(_body.joinRequestMaxCount));
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
      _body.sponsors.forEach((sponsor, index) => {
        console.log(`Sponsor ${index}:`, sponsor.name, sponsor.size, "bytes");
        body.value.append(`sponsors[${index}]`, sponsor);
      });
      body.value.append("prizes", JSON.stringify(_body.prizes));
      _body.rules.forEach((rule, index) => {
        console.log(`Rule ${index}:`, rule);
        body.value.append(`rules[${index}]`, rule);
      });

      await execute();
    };
    return { data, status, fetchREQ, pending, error };
  };
  //Organizer
  const OrganizerGetTournamentRequests = (params: Ref<GetTournamentParams>) => {
    const param = ref(params.value);

    const { data, status, pending } = useAsyncData<getTournamentResponse>(
      "OrganizerTourReqests",
      () => $api("tournaments/creation-request/me", { params: unref(param) }),
      {
        watch: [param],
      }
    );
    return { data, status, pending };
  };

  const OrganizerGetSingleTournamentRequest = (id: string) => {
    return useLazyAsyncData<{ data: DetailTournamentRequest }>(
      `OrganizerGetSingleTournamentRequest-${id}`,
      () => $api(`/tournaments/creation-request/me/${unref(id)}`),
      { server: false }
    );
  };
  const OrganizerCancelRequest = () => {
    const id = ref();
    const { data, status, execute, pending } = useAsyncData(
      "OrganizerCancelRequest",
      () =>
        $api(`/tournaments/creation-request/${unref(id)}/cancel`, {
          method: "patch",
        }),
      { immediate: false }
    );
    const fetchREQ = async (_id: string) => {
      id.value = _id;
      await execute();
      if (unref(status) == "success") {
        refreshNuxtData("AdminTourReqests");
        refreshNuxtData("OrganizerTourReqests");

      }
    };
    return { data, status, pending, fetchREQ };
  };
  // admin
  const AdminGetTournamentRequests = (params: Ref<GetTournamentParams>) => {
    const param = ref(params.value);

    const { data, status, pending } = useAsyncData<getTournamentResponse>(
      "AdminTourReqests",
      () => $api("tournaments/creation-request", { params: unref(param) }),
      {
        watch: [unref(param)],
        deep: true,
      }
    );
    return { data, status, pending };
  };
  const AdminApproveRequest = () => {
    const id = ref();
    const { data, status, execute, pending } = useAsyncData(
      "AdminApproveRequest",
      () =>
        $api(`/tournaments/creation-request/${unref(id)}/approve`, {
          method: "patch",
        }),
      { immediate: false }
    );
    const fetchREQ = async (_id: string) => {
      id.value = _id;
      await execute();
      if (unref(status) == "success") {
        refreshNuxtData("AdminTourReqests");
      }
    };
    return { data, status, pending, fetchREQ };
  };
  const AdminRejectRequest = () => {
    const id = ref();
    const { data, status, execute, pending } = useAsyncData(
      "AdminRejectRequest",
      () =>
        $api(`/tournaments/creation-request/${unref(id)}/reject`, {
          method: "patch",
        }),
      { immediate: false }
    );
    const fetchREQ = async (_id: string) => {
      id.value = _id;
      await execute();
      if (unref(status) == "success") {
        refreshNuxtData("AdminTourReqests");
      }
    };
    return { data, status, pending, fetchREQ };
  };
  const AdminGetSingleTournamentRequest = (id: string) => {
    return useLazyAsyncData<{ data: DetailTournamentRequest }>(
      `AdminGetSingleTournamentRequest-${id}`,
      () => $api(`/tournaments/creation-request/${unref(id)}`),
      { server: false }
    );
  };

  const updateTournamentRequest = (id: string) => {
    const body = ref<FormData>();
    const { data, execute, status, error } = useLazyAsyncData<{
      data: DetailTournamentRequest;
    }>(
      `updateTournamentRequest-${id}`,
      () =>
        $api(`/tournaments/creation-request/${unref(id)}`, {
          method: "put",
          body: unref(body),
        }),
      { server: false, immediate: false }
    );
    const fetchReq = async (_body: UpdateTournamentCreationRequest) => {
      body.value = new FormData();
      body.value.append("title", _body.title);
      body.value.append("description", _body.description);
      body.value.append("contactPhone", _body.contactPhone);
      body.value.append("startAt", _body.startAt.split('T')[0]);
      body.value.append("endAt", _body.endAt.split('T')[0]);
      body.value.append("type", _body.type);
      body.value.append("locationDescription", _body.locationDescription);
      body.value.append("isContactPhoneCall", String(_body.isContactPhoneCall));
      body.value.append(
        "isContactPhoneWhatsapp",
        String(_body.isContactPhoneWhatsapp)
      );
      body.value.append(
        "isAddPlayersByQydha",
        String(_body.isAddPlayersByQydha)
      );
      body.value.append("teamsCount", String(_body.teamsCount));
      body.value.append("tablesCount", String(_body.tablesCount));
      if (_body.isAddPlayersByQydha) {
        if (_body.joinRequestStartAt) {
          console.log()
          body.value.append("joinRequestStartAt", _body.joinRequestStartAt.split('T')[0]);
        }
        if (_body.joinRequestEndAt) {
          body.value.append("joinRequestEndAt", _body.joinRequestEndAt.split('T')[0]);
        }
        if (_body.joinRequestMaxCount) {
          body.value.append("joinRequestMaxCount", String(_body.joinRequestMaxCount));
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

      body.value.append('remainingSponsorsUrls',JSON.stringify(_body.remainingSponsorsUrls))
      _body.sponsors.forEach((sponsor, index) => {
        body.value!.append(`sponsors[${index}]`, sponsor);
      });
      body.value.append("prizes", JSON.stringify(_body.prizes));

      _body.rules.forEach((rule, index) => {
        body.value!.append(`rules[${index}]`, rule);

        
      });


      await execute();
      if(status.value=='success'){
        refreshNuxtData("OrganizerTourReqests")
        refreshNuxtData("AdminTourReqests")

      }

    };
    return { data, fetchReq, status, error };
  };

  const getTournamnetStateOptions = () => {
    const options = [
      { label: "الكل", value: null, color: null },
      ...Object.values(TournamentState).map((value) => ({
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
    OrganizerGetTournamentRequests,
    OrganizerGetSingleTournamentRequest,
    OrganizerCancelRequest,
    AdminGetTournamentRequests,
    AdminApproveRequest,
    AdminRejectRequest,
    AdminGetSingleTournamentRequest,
    updateTournamentRequest,

    getTournamnetStateOptions,
    getTournamentTypeOptions,
    getTournamentPrizeCurrency,
  };
};
