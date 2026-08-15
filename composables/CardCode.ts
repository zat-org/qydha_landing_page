import type { CardGroupI } from "~/models/CardCode";

type CardGroupsPage = {
  currentPage: number;
  hasNext: boolean;
  hasPrevious: boolean;
  items: CardGroupI[];
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export const useCardCode = () => {
  const { $api } = useNuxtApp();

  const getCardCodeGroups = async () => {
    const currentPage = ref(1);

    const { data, pending, error, refresh } = await useAppApiData<CardGroupsPage>(
      appKeys.groupCodes,
      () =>
        $api("/card-codes/groups", {
          query: {
            pageNumber: currentPage.value,
            pageSize: 9,
          },
        }),
      { watch: [currentPage] },
    );

    return { data, pending, error, refresh, currentPage };
  };

  const deleteCardCodeGroup = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (groupId: string) => {
      await execute(async () => {
        await $api(`/card-codes/groups/${groupId}`, { method: "DELETE" });
        await refreshAppData(appKeys.groupCodes);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updateCardCode = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      code: string,
      updateData: { numberOfDays: number; expireAt: string },
    ) => {
      await execute(async () => {
        await $api(`/card-codes/groups/${code}`, {
          method: "PUT",
          body: updateData,
        });
        await refreshAppData(appKeys.groupCodes);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const createCardCodeGroup = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (formData: {
      groupCode: string;
      numberOfDays: number;
      expireAt: string;
      codesCount: number;
    }) => {
      await execute(async () => {
        await $api("/card-codes", {
          method: "POST",
          body: formData,
        });
        await refreshAppData(appKeys.groupCodes);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return {
    getCardCodeGroups,
    deleteCardCodeGroup,
    updateCardCode,
    createCardCodeGroup,
  };
};
