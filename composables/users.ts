import type { User } from "~/models/user";

export const useUsers = () => {
  const { $api } = useNuxtApp();
  const getAllUsers = async () => {
    const searchtoken = ref()
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{
        data: { currentPage: number, hasNext: boolean, hasPrevious: boolean, items: User[], pageSize: number, totalCount: number, totalPages: number }, message: string
      }>(
        'getAllUsers',
        () => $api('/users', { params: { SearchToken: searchtoken.value } }), { immediate: false }
      );

    const fetchREQ = async (search_token: string) => {
      searchtoken.value = search_token
      await execute()

    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
  return { getAllUsers }
}
