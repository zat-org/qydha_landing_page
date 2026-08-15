import type { ITable, ITableCreate } from "~/features/tournament/models/Table";

export const useTournamentTable = () => {
  const { $api } = useNuxtApp();

  const addTable = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, new_table: ITableCreate) => {
      if (!tour_id) {
        throw new Error("Tournament ID is required");
      }
      await execute(async () => {
        await $api(`tournaments/${tour_id}/tables`, {
          method: "post",
          body: new_table,
          headers: {
            "Content-Type": "application/json",
          },
        });
        await refreshAppData(appKeys.tournamentTables(tour_id));
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const getTable = (tour_id: string) => {
    return useAppApiData<ITable[]>(appKeys.tournamentTables(tour_id), () =>
      $api(`/tournaments/${tour_id}/tables`),
    );
  };

  const deleteTable = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, table_id: string) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/tables/${table_id}`, {
          method: "delete",
        });
        await refreshAppData(appKeys.tournamentTables(tour_id));
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updateTable = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      table_id: string,
      new_table: ITableCreate,
    ) => {
      if (!tour_id || !table_id) {
        throw new Error("Tournament ID and Table ID are required");
      }
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/tables/${table_id}`, {
          method: "put",
          body: new_table,
          headers: {
            "Content-Type": "application/json",
          },
        });
        await refreshAppData(appKeys.tournamentTables(tour_id));
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return { addTable, getTable, deleteTable, updateTable };
};
