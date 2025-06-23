import type { IUserData } from "~/models/user";
import { useMyAuthStore } from "~/store/Auth";
import type { RegisterError } from "~/models/registerError";

export const useAuth = () => {
  const userStore = useMyAuthStore();
  const { user } = storeToRefs(userStore);
  const { $api } = useNuxtApp();
  const login = async () => {
    const body = reactive({ username: "", password: "" });
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{ data: IUserData; messgae: string }, { code: string }>(
        "login",
        () => $api("/auth/qydha-plus-login", { body: body, method: "POST" }),
        { immediate: false }
      );
    const fetchREQ = async (_data: { username: string; password: string }) => {
      body.password = _data.password;
      body.username = _data.username;
      await execute();
      if (status.value == "success" && data.value?.data) {
        console.log(
          "done"
        )
        user.value = data.value?.data;
        if (user.value.user.roles.includes("Streamer")) {
          navigateTo("/stream");
        } else {
          navigateTo("/deleteuser")
        }

      }
      if (status.value == "error") console.log(error.value);
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const loginWithQydha = async () => {
    const body = reactive<{ username: string }>({ username: "" });
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{ data: { requestId: string }; message: string }>(
        "loginWithQydha",
        () => $api("/auth/login-with-qydha", { method: "POST", body: body }),
        { immediate: false }
      );
    const fetchREQ = async (_username: string) => {
      body.username = _username;

      await execute();
    };
    return { data, pending, error, refresh, fetchREQ, status };
  };

  const confirmLoginWithQydha = async () => {
    const requst_id = ref();
    const body = reactive<{ code: string }>({ code: "" });
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<
        { data: IUserData; message: string },
        { code: string }
      >(
        "confirmLoginWithQydha ",
        () =>
          $api(`/auth/login-with-qydha/${requst_id.value}/confirm`, {
            method: "POST",
            body: body,
          }),
        { immediate: false }
      );
    const fetchREQ = async (_request_id: string, _code: string) => {
      requst_id.value = _request_id;
      body.code = _code;
      await execute();
      if (status.value == "success" && data.value) {
        userStore.user = data.value.data;
        return navigateTo("/tournament");
      }
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };
  const logout = async () => {
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{}, { code: string }>(
        "logout",
        () => $api("/auth/logout", { method: "POST" }),
        { immediate: false }
      );
    const fetchREQ = async () => {
      // await execute();
      // if (status.value == "success") {
      user.value = null;
      return navigateTo("/");

      // }
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const registerConfirm =  () => {
    const body = reactive<{ code: string }>({ code: "" });
    const id = ref();
    const { data, pending, error, refresh, status, execute } =
       useAsyncData(
        "registerConfirm",
        () => $api(`/auth/register/${id.value}/confirm`, { body: body, method: "POST" }),
        { immediate: false }
      );
    const fetchREQ = async (_id: string, _code: string) => {
      id.value = _id;
      body.code = _code;
      await execute();
      if (status.value == "success") {
        return navigateTo("/login");
      }
    };
    return { data, pending, error, refresh, status, fetchREQ };

  }


  const register = async () => {
    const body = reactive({
      username: "",
      password: "",
      phone: "",
      fcmToken: null // always empty
    });
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{
        data: {
          requestId: "string"
        },
      }, RegisterError>(
        "register",
        () => $api("/auth/register", { body: body, method: "POST" }),
        { immediate: false }
      );
    const fetchREQ = async (_data: { username: string; password: string; phone: string }) => {
      body.username = _data.username;
      body.password = _data.password;
      body.phone = _data.phone;
      // body.fcmToken = "";
      await execute();

      if (status.value == "error") console.log(error.value);
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  return { login, logout, loginWithQydha, confirmLoginWithQydha, register, registerConfirm };
};
