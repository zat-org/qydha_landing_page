import type { IPromoCode, IPromoCodeCreate } from "~/models/PromoCode";

type PromoCodesPage = {
  currentPage: number;
  items: IPromoCode[];
  hasNext: boolean;
  hasPrevious: boolean;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};

export const usePromoCode = () => {
  const { $api } = useNuxtApp();

  const getPromoCodes = async () => {
    const page = ref("1");
    const { data, pending, error, refresh, execute, status } =
      await useAppApiData<PromoCodesPage>(
        appKeys.promoCodes,
        () => $api("/promo-codes", { query: { PageNumber: page.value } }),
        { immediate: false },
      );

    const fetchREQ = async (page_number: string = "1") => {
      page.value = page_number;
      await execute();
    };

    return { data, pending, error, refresh, status, fetchREQ };
  };

  const addPromoCodes = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (new_code: IPromoCodeCreate) => {
      await execute(async () => {
        await $api("/promo-codes", { method: "POST", body: new_code });
        await refreshAppData(appKeys.promoCodes);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return { getPromoCodes, addPromoCodes };
};
