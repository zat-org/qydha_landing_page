import type { ISingleUser, User } from "~/models/user";

export const useUsers = () => {
  const { $api } = useNuxtApp();
  const getAllUsers = async () => {
    const searchtoken = ref()
    const pageNumber = ref()
    const exactSearch = ref(false)
    const roleFilter = ref()

    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{
        data: { currentPage: number, hasNext: boolean, hasPrevious: boolean, items: User[], pageSize: number, totalCount: number, totalPages: number }, message: string
      }>(
        'getAllUsers',
        () => $api('/users', {
          params: {
            SearchToken: searchtoken.value,
            pageNumber: pageNumber.value,
            Matching: exactSearch.value ? 'Exact' : 'Like',
            Role:roleFilter.value
          }
        }), { immediate: false }
      );

    const fetchREQ = async (search_token: string, _pageNumber?: number, _exactSearch: boolean = false, _roleFilter:string='User') => {
      searchtoken.value = search_token
      if (_pageNumber) {
        pageNumber.value = _pageNumber
      }
      exactSearch.value = _exactSearch
      roleFilter.value=_roleFilter
      await execute()

    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
  const updateUser = async () => {
    const body = ref<{ roles: string[] }>({ roles: [] })
    const user_id = ref()
    const { data, pending, error, refresh, execute, status } = await useAsyncData(
      'updateUser',
      () => $api(`/users/${user_id.value}/roles`, { method: "patch", body: body.value }), { immediate: false }
    );
    const fetchREQ = async (_user_id: string, roles: string[]) => {
      user_id.value = _user_id
      body.value.roles = roles
      await execute()
    }
    return { data, pending, error, refresh, fetchREQ, status }
  }
  const getSingleUser = async () => {
    const user_id = ref()
    const { data, pending, error, refresh, status, execute } = await useAsyncData<{ data: ISingleUser, message: string }>(
      'getSingleUser',
      () => $api(`/users/${user_id.value}`), { immediate: false }
    );
    const fetchREQ = async (id: string) => {
      user_id.value = id
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
  return { getAllUsers, updateUser, getSingleUser }
}
