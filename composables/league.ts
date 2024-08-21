import type { State } from "~/models/Player";

export const useLeague = () => {
  const {$api} = useNuxtApp()
  const checkExist =async()=>{
    const phoneNumber = ref()
    const { data, pending, error, refresh, execute,status } = await 
    useAsyncData<{message:string  ,data:State}>(
        'checkExist',
        () => $api(`/players/${phoneNumber.value}`),{immediate:false}
    );
    const fetchREQ = async(_phone_numebr:string)=>{
      phoneNumber.value=_phone_numebr 
      await execute()

    }
    return {data, pending, error, refresh, fetchREQ,status}
  }
  return  {checkExist}
}
