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
        () => $api(`/players/id/${id.value}`),
        { immediate: false }
      );
    const fetchREQ = async (_id: string) => {
      id.value = _id;
      await execute();
    };
    return { data, pending, error, refresh, fetchREQ, status };
  };
  return { checkExistByPhone, checkExistByEmail, checkExistByID };
};
