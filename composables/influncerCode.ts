import type { InfluncerCode, InfluncerCodeCreate } from "~/models/influncerCode";

export const useInfluncerCode = () => {
  const { $api } = useNuxtApp();
  const addInfCode = async () => {
    const body = ref<InfluncerCodeCreate>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'addInfCode',
      () => $api('/influencer-codes', { method: 'post', body: body.value }), { immediate: false }
    );
    const fetchREQ = async (new_code: InfluncerCodeCreate) => {
      body.value = new_code
      await execute()
      if (status.value == "success") {
        refreshNuxtData("getinfluncerCodes")
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }
  const getinfluncerCodes = async () => {
    const page = ref()
    const { data, pending, error, refresh, execute } = await useAsyncData<{
      data: {
        items: InfluncerCode[],
        currentPage: number,
        totalCount: number,
      }, message: string
    }>(
      'getinfluncerCodes',
      () => $api('/influencer-codes', { query: { pageNumber: page.value } }), { immediate: false }
    );
    const fetchREQ = async (_page: number = 1) => {
      page.value = _page
      await execute()

    }
    return { data, pending, error, refresh, fetchREQ }
  }
  return { addInfCode, getinfluncerCodes }
}
