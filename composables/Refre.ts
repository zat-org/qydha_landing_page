import type { IRefre } from "~/features/tournament/models/Refre";

export const useRefre = () => {
  const { $api } = useNuxtApp();

  const getRefres = (tour_id: string, place_id: MaybeRefOrGetter<string>) => {
    return useAppApiData<IRefre[]>(
      () => appKeys.tournamentReferees(tour_id, toValue(place_id) || "none"),
      () => {
        const pid = toValue(place_id);
        if (!pid) {
          return Promise.resolve({ data: [] as IRefre[] });
        }
        return $api(`/tournaments/${tour_id}/places/${pid}/referees`);
      },
      {
        watch: [() => toValue(place_id)],
      },
    );
  };

  return { getRefres };
};
