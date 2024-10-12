import type { IRefre } from "~/models/Refre";

export const useRefre = () => {
  const { $api } = useNuxtApp();

  const getRefres =async()=>{
    const tour_id=ref()
    const { data, pending, error, refresh,status,execute } = await useAsyncData
    <{data:IRefre[] ,message:string}>(
        'getRefres',
        () => $api(`/tournaments/${tour_id.value}/referees`),{immediate:false}
    );

    const fetchREQ=async(_tour_id:string)=>{
      tour_id.value = _tour_id
      await execute()
    }
    return { data, pending, error, refresh,fetchREQ,status }
  }
  return {getRefres}
}
