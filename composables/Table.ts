import type { ITable } from "~/models/Table";

export const useTable = () => {
  const { $api } = useNuxtApp();

  const getTables =async()=>{
    const tour_id=ref()
    const { data, pending, error, refresh,status,execute } = await useAsyncData
    <{data:ITable[],message:string}>
    (
        'getTables',
        () => $api(`/tournaments/${tour_id.value}/tables`),{immediate:false}
    );

    const fetchREQ=async(_tour_id:string)=>{
      tour_id.value = _tour_id
      await execute()
    }
    return { data, pending, error, refresh,fetchREQ,status }
  }
return {getTables}  
}
