import type { ITable, ITableCreate } from "~/models/Table";

export const useTournamentTable = () => {
  const { $api } = useNuxtApp();

  const addTable = () => {
    const tourId = ref()
    const body = ref<ITableCreate>()
    const { data, pending, error, refresh, status, execute } = useAsyncData(
      ()=>['addTable',tourId.value].join('-'),
      () => {
        if (!tourId.value) {
          throw new Error('Tournament ID is required')
        }
        return $api(`tournaments/${tourId.value}/tables`, { 
          method: 'post', 
          body: body.value,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }, 
      { immediate: false }
    );
    const fetchREQ = async (tour_id: string, new_table: ITableCreate) => {
      console.log(tour_id, new_table)
      if (!tour_id) {
        throw new Error('Tournament ID is required')
      }
      tourId.value = tour_id
      body.value = new_table
      await execute()
      if (status.value == "success") {
        refreshNuxtData(['getTable',tourId.value].join('-'))
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  const getTable = (tour_id:string) => {
    return useAsyncData<{ data: ITable[], message: string }>(
      ()=>['getTable',tour_id].join('-'),
      () => $api(`/tournaments/${tour_id}/tables`)
    );
  }

  // /tournaments/tID/tables/tableeID

  const deleteTable = () => {
    const tourId = ref()
    const tableId = ref()
    const { data, pending, error, refresh, status, execute } = useAsyncData(
      'deleteTable',
      () => $api(`/tournaments/${tourId.value}/tables/${tableId.value}`, { method: 'delete' }), { immediate: false }
    );
    const fetchREQ = async (tour_id: string, table_id: string) => {
      tourId.value = tour_id
      tableId.value = table_id
      await execute()
      if (status.value == "success") {
        refreshNuxtData(['getTable',tourId.value].join('-'))
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  const updateTable = () => {
    const body = ref<ITableCreate>()
    const tourId = ref()
    const tableId = ref()
    const { data, pending, error, refresh, status, execute } = useAsyncData(
      'updateTable',
      () => {
        if (!tourId.value || !tableId.value) {
          throw new Error('Tournament ID and Table ID are required')
        }
        return $api(`/tournaments/${tourId.value}/tables/${tableId.value}`, { 
          method: 'put', 
          body: body.value,
          headers: {
            'Content-Type': 'application/json'
          }
        })
      }, 
      { immediate: false }
    );
    const fetchREQ = async (tour_id: string, table_id: string, new_table: ITableCreate) => {
      if (!tour_id || !table_id) {
        throw new Error('Tournament ID and Table ID are required')
      }
      tourId.value = tour_id
      tableId.value = table_id
      body.value = new_table
      await execute()
      if (status.value == "success") {
        refreshNuxtData(['getTable',tourId.value].join('-'))
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }


  return { addTable, getTable, deleteTable, updateTable }
}
