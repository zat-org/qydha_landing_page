import type { ISingleUser, User } from "~/models/user";

const UserRoleLable: Record<string, string> = {
  User: "مستخدم",
  Streamer: "استريمر",
  StaffAdmin: "استف",
  Organizer: "منظم بطوله",
  SuperAdmin: "ادمن",
};
const UserRoleColor: Record<string, string> = {
  User: "neutral",
  Streamer: "error",
  StaffAdmin: "success",
  Organizer: "warning",
  SuperAdmin: "primary",
};

type UsersPage = {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  items: User[];
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export const useUsers = () => {
  const { $api } = useNuxtApp();

  const getAllUsers = async () => {
    const searchtoken = ref();
    const pageNumber = ref();
    const exactSearch = ref(false);
    const roleFilter = ref();

    const { data, pending, error, refresh, status, execute } =
      await useAppLazyApiData<UsersPage>(
        appKeys.getAllUsers,
        () =>
          $api("/users", {
            params: {
              SearchToken: searchtoken.value,
              pageNumber: pageNumber.value,
              Matching: exactSearch.value ? "Exact" : "Like",
              Role: roleFilter.value,
            },
          }),
        { immediate: false },
      );

    const fetchREQ = async (
      search_token: string,
      _pageNumber?: number,
      _exactSearch: boolean = false,
      _roleFilter: string = "User",
    ) => {
      searchtoken.value = search_token;
      if (_pageNumber) {
        pageNumber.value = _pageNumber;
      }
      exactSearch.value = _exactSearch;
      roleFilter.value = _roleFilter;
      await execute();
    };

    return { data, pending, error, refresh, status, fetchREQ };
  };

  const updateUser = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_user_id: string, roles: string[]) => {
      await execute(async () => {
        await $api(`/users/${_user_id}/roles`, {
          method: "patch",
          body: { roles },
        });
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const getSingleUser = async () => {
    const user_id = ref();
    const { data, pending, error, refresh, status, execute } =
      await useAppApiData<ISingleUser>(
        appKeys.getSingleUser,
        () => $api(`/users/${user_id.value}`),
        { immediate: false },
      );

    const fetchREQ = async (id: string) => {
      user_id.value = id;
      await execute();
    };

    return { data, pending, error, refresh, status, fetchREQ };
  };

  const getUsersRoles = async () => {
    const { data, pending, error, refresh, status } = await useAppApiData(
      appKeys.getUserRoles,
      () => $api(`/users/roles/`),
    );
    return { data, pending, error, refresh, status };
  };

  const getUserRoleLabel = (role: string) => {
    return UserRoleLable[role];
  };
  const getUserRoleColor = (role: string) => {
    return UserRoleColor[role];
  };

  return {
    getAllUsers,
    updateUser,
    getSingleUser,
    getUsersRoles,
    getUserRoleLabel,
    getUserRoleColor,
  };
};
