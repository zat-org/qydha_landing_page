import type { IPromoCode, IPromoCodeCreate } from "~/models/PromoCode";

export const usePromoCode = () => {
  const { $api } = useNuxtApp();

  const getPromoCodes = async () => {
    const page = ref()
    const { data, pending, error, refresh , execute , status } = await useAsyncData < {
      data:{
        currentPage:number ,
        items: IPromoCode[] ,
        hasNext:boolean ,
        hasPrevious:boolean,
        pageSize:number, 
        totalCount:number ,
        totalPages:number
         }
     , message: string
    } > (
        'getPromoCodes',
        () => $api('/promo-codes',{query:{PageNumber:page.value} }),{immediate:false}
      );
      const fetchREQ = async(page_number:string="1")=>{
        page.value = page_number
        await execute () ; 

      }
    return { data, pending, error, refresh,status,fetchREQ }
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

