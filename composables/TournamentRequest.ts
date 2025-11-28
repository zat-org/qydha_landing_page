import {

  type DetailTournamentRequest,
  type GetTournamentRequestParams,
  type getTournamentRequestResponse,
  type TournamentCreationRequest,
  type TournamentRequest,
  type UpdateTournamentCreationRequest,
  TournamentRequestState
} from "~/models/tournamentRequest";
import {
  TournamentPrizeCurrency,
} from "~/models/tournamentPrize";
import {
  TournamentType,
} from "~/models/tournamenetType";

import { useMyAuthStore } from "~/store/Auth";
const tournamentStateLabels: Record<TournamentRequestState, string> = {
  [TournamentRequestState.Pending]: "جاري المراجعة",
  [TournamentRequestState.Approved]: "تم الموافقة ",
  [TournamentRequestState.Rejected]: "تم الرفض",
  [TournamentRequestState.Canceled]: "تم الالغاء",
};
const tournamentStateColors: Record<TournamentRequestState,'warning'|'success'|'error'|'neutral'> = {
  [TournamentRequestState.Pending]:"warning", // Tailwind yellow for pending
  [TournamentRequestState.Approved]:"success", // Tailwind green for approved
  [TournamentRequestState.Rejected]:"error", // Tailwind red for rejected
  [TournamentRequestState.Canceled]:"neutral", // Tailwind gray for canceled
};

const getStateColor = (state: TournamentRequestState) => {
  return tournamentStateColors[state]
}
const tournamentTypeLabels: Record<TournamentType, string> = {
  [TournamentType.public]: "عامة",
  [TournamentType.private]: "خاصة ",
};


const tournamentTypeColors: Record<TournamentType, 'info'|'neutral'> = {
  [TournamentType.public]:"info",
  [TournamentType.private]:"neutral",
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
        }),
      { immediate: false }
    );
    // Helper function to convert object to FormData

    const fetchREQ = async (_body: TournamentCreationRequest) => {
      body.value = new FormData();
      body.value.append("title", _body.title);
      body.value.append("description", _body.description);
      body.value.append("contactPhone", _body.contactPhone);
      body.value.append("startAt", _body.startAt);
      body.value.append("endAt", _body.endAt);
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
          body.value.append("joinRequestStartAt", _body.joinRequestStartAt);
        }
        if (_body.joinRequestEndAt) {
          body.value.append("joinRequestEndAt", _body.joinRequestEndAt);
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
      if (_body.rules.length > 0) {
        body.value!.append(`rules`, JSON.stringify(_body.rules));
      }else{
        body.value!.append("rules", "[]");
      }


      await execute();
    };
    return { data, status, fetchREQ, pending, error };
  };
  //Organizer
  const OrganizerGetTournamentRequests = (params: Ref<GetTournamentRequestParams>) => {
    const param = ref(params.value);
    watch([()=>param.value.searchToken,()=>param.value.state,()=>param.value.type],(newValue,oldValue)=>{
      param.value.pageNumber=1
    })

    const { data, status, pending } = useAsyncData<getTournamentRequestResponse>(
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
        $api(`/tournaments/creation-request/me/${unref(id)}/cancel`, {
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
  const AdminGetTournamentRequests = (params: Ref<GetTournamentRequestParams>) => {
    const param = ref(params.value);
    watch([()=>param.value.searchToken,()=>param.value.state,()=>param.value.type],(newValue,oldValue)=>{
      param.value.pageNumber=1
    })

    const { data, status, pending } = useAsyncData<getTournamentRequestResponse>(
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
      ()=>['AdminApproveRequest',id.value].join('-'),
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
      ()=>['AdminRejectRequest',id.value].join('-'),
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
      body.value.append("startAt", _body.startAt);
      body.value.append("endAt", _body.endAt);
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
          body.value.append("joinRequestStartAt", _body.joinRequestStartAt);
        }
        if (_body.joinRequestEndAt) {
          body.value.append("joinRequestEndAt", _body.joinRequestEndAt);
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
      if (_body.rules.length > 0) {
          body.value!.append(`rules`, JSON.stringify(_body.rules));
      }else{
        body.value!.append("rules", "[]");
      }


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
    getStateColor
  };
};
