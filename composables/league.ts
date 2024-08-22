import type { State } from "~/models/Player";

export const useLeague = () => {
  const { $api } = useNuxtApp();
  const checkExistByPhone = async () => {
    const phoneNumber = ref();
    const { data, pending, error, refresh, execute, status } =
      await useAsyncData<{ message: string; data: State }>(
        "checkExist",
        () => $api(`/players/phone/${phoneNumber.value}`),
        { immediate: false }
      );
    const fetchREQ = async (_phone_numebr: string) => {
      phoneNumber.value = _phone_numebr;
      await execute();
    };
    return { data, pending, error, refresh, fetchREQ, status };
  };
  const checkExistByEmail = async () => {
    const email = ref();
    const { data, pending, error, refresh, execute, status } =
      await useAsyncData<{ message: string; data: State }>(
        "checkExist",
        () => $api(`/players/email/${email.value}`),
        { immediate: false }
      );
    const fetchREQ = async (_email: string) => {
      email.value = _email;
      await execute();
    };
    return { data, pending, error, refresh, fetchREQ, status };
  };
  const checkExistByID = async () => {
    const id = ref();
    const { data, pending, error, refresh, execute, status } =
      await useAsyncData<{ message: string; data: State }>(
        "checkExist",
        () => $api(`/players/${id.value}`),
        { immediate: false }
      );
    const fetchREQ = async (_id: string) => {
      id.value = _id;
      await execute();
    };
    return { data, pending, error, refresh, fetchREQ, status };
  };

  const sendOtp = async () => {
    const body = reactive({ firstPlayerId: "", secondPlayerId: "" });
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        "send-team-confirmation-otp",
        () =>
          $api("/send-team-confirmation-otp", { method: "post", body: body }),
        { immediate: false }
      );
    const fetchREQ = async (
      _firstPlayerid: string,
      _secoundPlayerid: string
    ) => {
      body.firstPlayerId = _firstPlayerid;
      body.secondPlayerId = _secoundPlayerid;
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const confirmOtp = async () => {
    const body = reactive({
      firstPlayerOtp: "",
      SecondPlayerOtp: "",
      requestId: "",
    });
    const { data, pending, error, refresh, execute, status } =
      await useAsyncData(
        "confirm-team-otp",
        () => $api("/confirm-team-otp", { method: "post",body:body }),
        { immediate: false }
      );
    const fetchREQ = async (firstotp:string, secoundotp:string, reqID:string) => {
      body.firstPlayerOtp=firstotp
      body.SecondPlayerOtp=secoundotp
      body.requestId =reqID
      await execute();
    };
    return { data, pending, error, refresh, fetchREQ, status };
  };

  return {
    checkExistByPhone,
    checkExistByEmail,
    checkExistByID,
    sendOtp,
    confirmOtp,
  };
};
