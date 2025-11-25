import type { CardGroupI } from "~/models/CardCode";

export const useCardCode = () => {
  const { $api } = useNuxtApp();
  const getCardCodeGroups = async () => {
    const currentPage = ref(1);

    const { data, pending, error, refresh } = await useAsyncData<{
      data: {
        currentPage: number;
        hasNext: boolean;
        hasPrevious: boolean;
        items:CardGroupI [];
        pageSize: number;
        totalCount: number;
        totalPages: number;
      };
      message: string;
    }>(
      "getGroupCodes",
      () =>
        $api("/card-codes/groups", {
          query: {
            pageNumber: currentPage.value,
            pageSize: 9,
          },
        }),
      { watch: [currentPage] }
    );
    return { data, pending, error, refresh ,currentPage};
  };
  const AddCardCode = async () => {
    const { data, pending, error, refresh } = await useAsyncData("", () =>
      $api("/card-code")
    );
    return { data, pending, error, refresh };
  };
  
  const deleteCardCodeGroup = async () => {
    const groupCode = ref<string>();
    const { data, pending, error, refresh, status, execute } = await useAsyncData<{
      message: string;
      data: {
        deletedCount: number;
      };
    }>(
      'deleteCardCodeGroup',
      () => $api(`/card-codes/groups/${groupCode .value}`, { 
        method: 'DELETE' 
      }), 
      { immediate: false }
    );

    const fetchREQ = async (_groupId: string) => {
      groupCode.value = _groupId;
      await execute();
      if (status.value === "success") {
        refreshNuxtData("getGroupCodes");
      }
    };

    return { data, pending, error, refresh, status, fetchREQ };
  };

  const updateCardCode = async () => {
    const groupCode = ref<string>()
    const body = ref<{numberOfDays: number, expireAt: string}>()
    
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'updateCardCode',
      () => $api(`/card-codes/groups/${groupCode.value}`, { 
        method: 'PUT',
        body: body.value 
      }), 
      { immediate: false }
    )
  
    const fetchREQ = async (code: string, updateData: {numberOfDays: number, expireAt: string}) => {
      groupCode.value = code
      body.value = updateData
      await execute()
      if (status.value === "success") {
        refreshNuxtData("getGroupCodes")
      }
    }
  
    return { data, pending, error, refresh, status, fetchREQ }
  }
  
  const createCardCodeGroup = async () => {
    const body = ref<{
      groupCode: string,
      numberOfDays: number,
      expireAt: string,
      codesCount: number
    }>();
  
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'createCardCodeGroup',
      () => $api('/card-codes', { 
        method: 'POST',
        body: body.value 
      }), 
      { immediate: false }
    );
  
    const fetchREQ = async (formData: typeof body.value) => {
      body.value = formData;
      await execute();
      if (status.value === "success") {
        refreshNuxtData("getGroupCodes");
      }
    };
  
    return { data, pending, error, refresh, status, fetchREQ };
  };
  

  return { getCardCodeGroups,deleteCardCodeGroup ,updateCardCode,createCardCodeGroup};
};
