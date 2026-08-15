import type {
  IServiceAccount,
  IServiceAccountCreate,
} from "~/models/serviceAccount";

type ServiceAccountsPayload = {
  accounts: {
    items: IServiceAccount[];
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalCount: number;
    haPrevious: boolean;
    hasNext: boolean;
  };
};

export const useServiceAccount = () => {
  const { $api } = useNuxtApp();

  const addServiceAccount = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (newServiceAccount: IServiceAccountCreate) => {
      await execute(async () => {
        await $api("/service-account", {
          method: "post",
          body: newServiceAccount,
        });
        await refreshAppData(appKeys.serviceAccounts);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const getServiceAccounts = async () => {
    const pageNumber = ref<number>(1);
    const pageSize = ref<number>(10);

    const { data, pending, error, refresh, status, execute } =
      await useAppApiData<ServiceAccountsPayload>(
        appKeys.serviceAccounts,
        () =>
          $api("/service-account", {
            params: {
              PageNumber: pageNumber.value,
              PageSize: pageSize.value,
            },
          }),
        { immediate: false },
      );

    const fetchREQ = async (
      newPageNumber: number = 1,
      newPageSize: number = 10,
    ) => {
      pageNumber.value = newPageNumber;
      pageSize.value = newPageSize;
      await execute();
    };

    return { data, pending, error, refresh, status, fetchREQ };
  };

  const deleteServiceAccount = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_id: string) => {
      await execute(async () => {
        await $api(`/service-account/${_id}`, { method: "delete" });
        await refreshAppData(appKeys.serviceAccounts);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updateServiceAccount = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      _id: string,
      newServiceAccount: IServiceAccountCreate,
    ) => {
      await execute(async () => {
        await $api(`/service-account/${_id}`, {
          method: "put",
          body: newServiceAccount,
        });
        await refreshAppData(appKeys.serviceAccounts);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const getAccountToken = async () => {
    const serviceAccountId = ref<string>();
    const { data, pending, error, refresh, status, execute } =
      await useAppApiData<{ token: string }>(
        appKeys.getAccountToken,
        () => $api(`/service-account/${serviceAccountId.value}/token`),
        { immediate: false },
      );

    const fetchREQ = async (_id: string) => {
      serviceAccountId.value = _id;
      await execute();
    };

    return { data, pending, error, refresh, status, fetchREQ };
  };

  const getPermissions = async () => {
    const { data, pending, error, refresh } = await useAppApiData<{
      permissions: string[];
    }>(appKeys.getPermissions, () => $api("/service-account/permissions/"));

    return { data, pending, error, refresh };
  };

  return {
    addServiceAccount,
    getServiceAccounts,
    deleteServiceAccount,
    updateServiceAccount,
    getAccountToken,
    getPermissions,
  };
};
