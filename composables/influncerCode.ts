import type { InfluncerCode, InfluncerCodeCreate } from "~/models/influncerCode";

export const useInfluncerCode = () => {
  const { $api } = useNuxtApp();

  const addInfCode = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (new_code: InfluncerCodeCreate) => {
      await execute(async () => {
        await $api("/influencer-codes", { method: "post", body: new_code });
        await refreshAppData(appKeys.influencerCodes);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const getinfluncerCodes = async () => {
    const page = ref(1);
    const { data, pending, error, refresh, execute, status } =
      await useAppApiData<{
        items: InfluncerCode[];
        currentPage: number;
        totalCount: number;
      }>(
        appKeys.influencerCodes,
        () =>
          $api("/influencer-codes", { query: { pageNumber: page.value } }),
        { immediate: false },
      );

    const fetchREQ = async (_page: number = 1) => {
      page.value = _page;
      await execute();
    };

    return { data, pending, error, refresh, fetchREQ, status };
  };

  return { addInfCode, getinfluncerCodes };
};
