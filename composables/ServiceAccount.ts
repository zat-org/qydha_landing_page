
import type { IServiceAccount, IServiceAccountCreate } from "~/models/serviceAccount";

export const useServiceAccount = () => {
  const { $api } = useNuxtApp();
  const addServiceAccount = async () => {
    const body = ref<IServiceAccountCreate>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'addServiceAccount',
      () => $api('/service-account', { method: 'post', body: body.value }), { immediate: false }
    );

    const fetchREQ = async (newServiceAccount: IServiceAccountCreate) => {
      body.value = newServiceAccount
      await execute()
    }

    return { data, pending, error, refresh, status, fetchREQ }
  }
  const getServiceAccounts = async () => {
    const pageNumber = ref<number>(1)
    const pageSize = ref<number>(10)

    const { data, pending, error, refresh, status, execute } = await useAsyncData<{
      data: {
        accounts: {
          items: IServiceAccount[]
          currentPage: number,
          totalPages: number,
          pageSize: number,
          totalCount: number,
          haPrevious: boolean,
          hasNext: boolean
        }
      },
      message: string
    }>(
      'getServiceAccounts',
      () => $api('/service-account', { params: { PageNumber: pageNumber.value, PageSize: pageSize.value } }), { immediate: false }
    );
    const fetchREQ = async (newPageNumber: number = 1, newPageSize: number = 10) => {
      pageNumber.value = newPageNumber
      pageSize.value = newPageSize

      await execute()
    }

    return { data, pending, error, refresh, status, fetchREQ }

  }

  const deleteServiceAccount = async () => {
    const serviceAccountId = ref<string>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'deleteServiceAccount',
      () => $api(`/service-account/${serviceAccountId.value}`, { method: 'delete' }), { immediate: false }
    );
    const fetchREQ = async (_id: string) => {
      serviceAccountId.value = _id
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }


  const updateServiceAccount = async () => {
    const serviceAccountId = ref<string>()
    const serviceAccount = ref<IServiceAccountCreate>()

    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'deleteServiceAccount',
      () => $api(`/service-account/${serviceAccountId.value}`, { method: 'put', body: serviceAccount.value }), { immediate: false }
    );
    const fetchREQ = async (_id: string, newServiceAccount: IServiceAccountCreate) => {

      serviceAccountId.value = _id
      serviceAccount.value = newServiceAccount
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
  const getAccountToken = async () => {
    const serviceAccountId = ref<string>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData
    <{data:{token:string },message:string}>(
      'getAccountToken',
      () => $api(`/service-account/${serviceAccountId.value}/token`), { immediate: false }
    );
    const fetchREQ = async (_id: string) => {
      serviceAccountId.value = _id
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  const getPermissions = async () => {
    const { data, pending, error, refresh } = await useAsyncData<{ data: { permissions: string[] }, message: string }>(
      'getPermissions',
      () => $api('/service-account/permissions/')
    );
    return { data, pending, error, refresh }
  }

  return { addServiceAccount, getServiceAccounts, deleteServiceAccount, updateServiceAccount, getAccountToken,getPermissions }

}
