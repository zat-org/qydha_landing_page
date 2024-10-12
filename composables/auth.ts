import type { IUserData } from "~/models/user";
import { useMyAuthStore } from "~/store/Auth";

export const useAuth = () => {
  const userStore = useMyAuthStore();
  const { user } = storeToRefs(userStore)
  const { $api } = useNuxtApp();
  const login = async () => {
    const body = reactive({ username: "", password: "" });
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{ data: IUserData; messgae: string }>(
        "login",
        () => $api("/auth/login", { body: body, method: "POST" }),
        { immediate: false }
      );
    const fetchREQ = async (_data: { username: string; password: string }) => {
      body.password = _data.password;
      body.username = _data.username;
      await execute();
      if (status.value == "success" && data.value?.data) {
        user.value = data.value?.data;
        navigateTo("/tournament");
      }
      if (status.value == "error") console.log(error.value);
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };
  const logout = async () => {
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        "logout",
        () => $api("/auth/logout", { method: "POST" }),
        { immediate: false }
      );
    const fetchREQ = async () => {
      await execute();
      if (status.value == "success") {
        user.value = null;

      }
    };
    return{ data, pending, error, refresh, status, fetchREQ }
  };

  return { login,logout };
};
