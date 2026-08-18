import type { ITable } from "~/features/tournament/models/Table";

export const useTable = () => {
  const { $api } = useNuxtApp();

  const getTables = async () => {
    const tour_id = ref("");
    const place_id = ref("");
    const { data, pending, error, refresh, status, execute } =
      await useAppApiData<ITable[]>(
        appKeys.tables,
        () =>
          $api(
            `/tournaments/${tour_id.value}/places/${place_id.value}/tables`,
          ),
        { immediate: false },
      );

    const fetchREQ = async (_tour_id: string, _place_id: string) => {
      tour_id.value = _tour_id;
      place_id.value = _place_id;
      await execute();
    };

    return { data, pending, error, refresh, fetchREQ, status };
  };

  return { getTables };
};
