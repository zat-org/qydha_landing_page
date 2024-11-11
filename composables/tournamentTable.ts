import type { ITable, ITableCreate } from "~/models/Table";

export const useTournamentTable = () => {
  const { $api } = useNuxtApp();

  const addTable = async () => {
    const tourId = ref()
    const body = ref<ITableCreate>()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'addTable',
      () => $api(`tournaments/${tourId.value}/tables`, { method: 'post', body: body.value }), { immediate: false }
    );
    const fetchREQ = async (tour_id: string, new_table: ITableCreate) => {
      tourId.value = tour_id
      body.value = new_table
      await execute()
      if (status.value == "success") {
        refreshNuxtData('getTable')
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  const getTable = async () => {
    const tourId = ref()
    const { data, pending, error, refresh, status, execute } = await useAsyncData<{ data: ITable[], message: string }>(
      'getTable',
      () => $api(`/tournaments/${tourId.value}/tables`), { immediate: false }
    );
    const fetchREQ = async (tour_id: string) => {
      tourId.value = tour_id
      await execute()
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  // /tournaments/tID/tables/tableeID

  const deleteTable = async () => {
    const tourId = ref()
    const tableId = ref()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'deleteTable',
      () => $api(`/tournaments/${tourId.value}/tables/${tableId.value}`, { method: 'delete' }), { immediate: false }
    );
    const fetchREQ = async (tour_id: string, table_id: string) => {
      tourId.value = tour_id
      tableId.value = table_id
      await execute()
      if (status.value == "success") {
        refreshNuxtData('getTable')
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }

  const updateTable = async () => {
    const body = ref<ITableCreate>()
    const tourId = ref()
    const tableId = ref()
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'updateTable',
      () => $api(`/tournaments/${tourId.value}/tables/${tableId.value}`, { method: 'put', body: body.value }), { immediate: false }
    );
    const fetchREQ = async (tour_id: string, table_id: string, new_table: ITableCreate) => {
      tourId.value = tour_id
      tableId.value = table_id
      body.value = new_table
      await execute()
      if (status.value == "success") {
        refreshNuxtData('getTable')
      }
    }
    return { data, pending, error, refresh, status, fetchREQ }
  }


  return { addTable, getTable, deleteTable, updateTable }
}
