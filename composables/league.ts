import type { State, TeamData } from "~/features/tournament/models/Player";

export const useLeague = () => {
  const { $api } = useNuxtApp();

  const checkExistByPhone = async () => {
    const phoneNumber = ref();
    const { data, pending, error, refresh, execute, status } =
      await useAppApiData<State>(
        "checkExist",
        () => $api(`/players/phone/${phoneNumber.value}`),
        { immediate: false },
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
      await useAppApiData<State>(
        "checkExist",
        () => $api(`/players/email/${email.value}`),
        { immediate: false },
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
      await useAppApiData<State>(
        "checkExist",
        () => $api(`/players/${id.value}`),
        { immediate: false },
      );

    const fetchREQ = async (_id: string) => {
      id.value = _id;
      await execute();
    };

    return { data, pending, error, refresh, fetchREQ, status };
  };

  const sendOtp = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const data = ref<{ requestId: string } | null>(null);

    const fetchREQ = async (
      _firstPlayerid: string,
      _secoundPlayerid: string,
    ) => {
      data.value = null;
      await execute(async () => {
        const res = await $api<{ data: { requestId: string }; message: string }>(
          "/send-team-confirmation-otp",
          {
            method: "post",
            body: {
              firstPlayerId: _firstPlayerid,
              secondPlayerId: _secoundPlayerid,
            },
          },
        );
        data.value = res.data;
      });
    };

    return { data, pending, status, error, fetchREQ };
  };

  const confirmOtp = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const data = ref<TeamData | null>(null);

    const fetchREQ = async (
      firstotp: string,
      secoundotp: string,
      reqID: string,
    ) => {
      data.value = null;
      await execute(async () => {
        const res = await $api<{ data: TeamData; message: string }>(
          "/confirm-team-otp",
          {
            method: "post",
            body: {
              firstPlayerOtp: firstotp,
              SecondPlayerOtp: secoundotp,
              requestId: reqID,
            },
          },
        );
        data.value = res.data;
      });
    };

    return { data, pending, status, error, fetchREQ };
  };

  return {
    checkExistByPhone,
    checkExistByEmail,
    checkExistByID,
    sendOtp,
    confirmOtp,
  };
};
