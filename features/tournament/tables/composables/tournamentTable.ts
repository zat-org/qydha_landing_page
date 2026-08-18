import type { ITable, ITableCreate } from "~/features/tournament/models/Table";

export const useTournamentTable = () => {
  const { $api } = useNuxtApp();

  const addTable = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      place_id: string,
      new_table: ITableCreate,
    ) => {
      if (!tour_id || !place_id) {
        throw new Error("Tournament ID and Place ID are required");
      }
      await execute(async () => {
        await $api(`tournaments/${tour_id}/places/${place_id}/tables`, {
          method: "post",
          body: new_table,
          headers: {
            "Content-Type": "application/json",
          },
        });
        await refreshAppData(appKeys.tournamentTables(tour_id, place_id));
        await refreshAppData(appKeys.tournamentPlaces(tour_id));
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const getTable = (tour_id: string, place_id: MaybeRefOrGetter<string>) => {
    return useAppApiData<ITable[]>(
      () => appKeys.tournamentTables(tour_id, toValue(place_id) || "none"),
      () => {
        const pid = toValue(place_id);
        if (!pid) {
          return Promise.resolve({ data: [] as ITable[] });
        }
        return $api(`/tournaments/${tour_id}/places/${pid}/tables`);
      },
      {
        watch: [() => toValue(place_id)],
      },
    );
  };

  const deleteTable = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      place_id: string,
      table_id: string,
    ) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tour_id}/places/${place_id}/tables/${table_id}`,
          {
            method: "delete",
          },
        );
        await refreshAppData(appKeys.tournamentTables(tour_id, place_id));
        await refreshAppData(appKeys.tournamentPlaces(tour_id));
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updateTable = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      place_id: string,
      table_id: string,
      new_table: ITableCreate,
    ) => {
      if (!tour_id || !place_id || !table_id) {
        throw new Error("Tournament ID, Place ID and Table ID are required");
      }
      await execute(async () => {
        await $api(
          `/tournaments/${tour_id}/places/${place_id}/tables/${table_id}`,
          {
            method: "put",
            body: new_table,
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        await refreshAppData(appKeys.tournamentTables(tour_id, place_id));
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return { addTable, getTable, deleteTable, updateTable };
};
