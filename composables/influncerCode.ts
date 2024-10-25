import type { InfluncerCode, InfluncerCodeCreate } from "~/models/influncerCode";

export const useInfluncerCode = () => {
  const { $api } = useNuxtApp();
  const addInfCode =async()=>{
    const body =ref<InfluncerCodeCreate>()
    const { data, pending, error, refresh,status ,execute } = await useAsyncData(
        'addInfCode',
        () => $api('/influencer-codes',{method:'post',body:body.value}),{immediate:false}
    );
    const fetchREQ =async(new_code:InfluncerCodeCreate)=>{
      body.value =new_code
      await execute()
    }
    return{data, pending, error, refresh,status ,fetchREQ}
  }
  const getinfluncerCodes =async()=>{
    const { data, pending, error, refresh } = await useAsyncData<{data:InfluncerCode[],message:string}>(
        'getinfluncerCodes',
        () => $api('/influencer-codes')
    );
    return {data, pending, error, refresh }
  }
  return {addInfCode,getinfluncerCodes}
}
