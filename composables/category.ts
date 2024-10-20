import type { CategoryCreate } from "~/models/influncerCode";

export const useCategory = () => {
  const { $api } = useNuxtApp();
  const getAllcategory = async () => {
    const { data, pending, error, refresh ,status} = 
    await useAsyncData <{ data: {
          categoryName: string,
          maxCodesPerUserInGroup: number
        }[
        ],
        message: string
      }>(
        'getAllcategory',
        () => $api('/influencer-codes-categories/')
      );
      return { data, pending, error, refresh ,status}
  }
  const AddCategry =async()=>{
    const body=ref<CategoryCreate>()
    const { data, pending, error, refresh,status,execute } = await useAsyncData(
        'AddCategry',
        () => $api('/influencer-codes-categories/',{method:'POST',body:body.value}),{immediate:false}
    );
    const fetchREQ =async(new_cat:CategoryCreate)=>{
      body.value = new_cat
      await execute()
    }
    return {data, pending, error, refresh,status,fetchREQ}
  }
  const deleteCategry =async()=>{
    const cat_id =ref<string>()
    const { data, pending, error, refresh,status,execute } = await useAsyncData(
        'deleteCategry',
        () => $api(`/influencer-codes-categories/${cat_id.value}`,{method:'delete'}),{immediate:false}
    );
    const fetchREQ =async(_cat_id:string)=>{
      cat_id.value = _cat_id
      await execute()
    }
    return {data, pending, error, refresh,status,fetchREQ}
  }

  const updateCategry =async()=>{
    const cat_id =ref<string>()

    const body=ref<CategoryCreate>()
    const { data, pending, error, refresh,status,execute } = await useAsyncData(
        'updateCategry',
        () => $api(`/influencer-codes-categories/${cat_id.value}`,{method:'put',body:body.value}),{immediate:false}
    );
    const fetchREQ =async(new_cat:CategoryCreate,_cat_id:string)=>{
      cat_id.value = _cat_id  
      body.value = new_cat
      await execute()
    }
    return {data, pending, error, refresh,status,fetchREQ}
  }
  return {getAllcategory,AddCategry,deleteCategry,updateCategry}
}
