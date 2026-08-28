import type { IUserData } from "~/models/user";
import { useMyAuthStore } from "~/store/Auth";

export const useAuth = () => {
  const userStore = useMyAuthStore();
  const { user } = storeToRefs(userStore);
  const { $api } = useNuxtApp();

  const login = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const data = ref<{ data: IUserData; messgae: string } | null>(null);

    const fetchREQ = async (_data: { username: string; password: string }) => {
      await execute(async () => {
        const result = await $api<{ data: IUserData; messgae: string }>(
          "/auth/qydha-plus-login",
          {
            body: {
              username: _data.username,
              password: _data.password,
            },
            method: "POST",
          },
        );
        data.value = result;
        user.value = result.data;
        navigateTo(userStore.defaultHomePath);
      });
      if (status.value === "error") console.log(error.value);
    };

    return { data, pending, error, status, fetchREQ };
  };

  const loginWithQydha = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const data = ref<{ data: { requestId: string }; message: string } | null>(
      null,
    );

    const fetchREQ = async (_username: string) => {
      await execute(async () => {
        data.value = await $api("/auth/login-with-qydha", {
          method: "POST",
          body: { username: _username },
        });
      });
    };

    return { data, pending, error, fetchREQ, status };
  };

  const confirmLoginWithQydha = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const data = ref<{ data: IUserData; message: string } | null>(null);

    const fetchREQ = async (_request_id: string, _code: string) => {
      await execute(async () => {
        const result = await $api<{ data: IUserData; message: string }>(
          `/auth/login-with-qydha/${_request_id}/confirm`,
          {
            method: "POST",
            body: { code: _code },
          },
        );
        data.value = result;
        userStore.user = result.data;
        return navigateTo("/tournament");
      });
    };

    return { data, pending, error, status, fetchREQ };
  };

  const logout = () => {
    const { pending, status, error } = useMutationRequest();
    const data = ref(null);

    const fetchREQ = async () => {
      user.value = null;
      return navigateTo("/");
    };

    return { data, pending, error, status, fetchREQ };
  };

  const registerConfirm = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const data = ref(null);

    const fetchREQ = async (_id: string, _code: string) => {
      await execute(async () => {
        data.value = await $api(`/auth/register/${_id}/confirm`, {
          body: { code: _code },
          method: "POST",
        });
      });
    };

    return { data, pending, error, status, fetchREQ };
  };

  const register = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const data = ref<{ data: { requestId: string } } | null>(null);

    const fetchREQ = async (_data: {
      username: string;
      password: string;
      phone: string;
    }) => {
      await execute(async () => {
        data.value = await $api("/auth/register", {
          body: {
            username: _data.username,
            password: _data.password,
            phone: _data.phone,
            fcmToken: null,
          },
          method: "POST",
        });
      });
      if (status.value === "error") console.log(error.value);
    };

    return { data, pending, error, status, fetchREQ };
  };

  return {
    login,
    logout,
    loginWithQydha,
    confirmLoginWithQydha,
    register,
    registerConfirm,
  };
};
