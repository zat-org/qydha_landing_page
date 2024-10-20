import type { IPromoCode, IPromoCodeCreate } from "~/models/PromoCode";

export const usePromoCode = () => {
  const { $api } = useNuxtApp();

  const getPromoCodes = async () => {
    const { data, pending, error, refresh } = await useAsyncData < {
      data:  IPromoCode[]
     , message: string
    } > (
        'getPromoCodes',
        () => $api('/promo-codes')
      );
    return { data, pending, error, refresh }
  }

  const addPromoCodes = async () => {
    const body = ref<IPromoCodeCreate>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'addPromoCodes',
      () => $api('/promo-codes', { method: "POST", body: body.value }), { immediate: false }
    );
    const fetchREQ = async (new_code: IPromoCodeCreate) => {
      body.value = new_code
      await execute()
      if (status.value == "success") {
        refreshNuxtData('getPromoCodes')
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  return { getPromoCodes, addPromoCodes }
}

