import type { IRefre } from "~/features/tournament/models/Refre";

export const useTournamentRefree = () => {
  const { $api } = useNuxtApp();

  const getTournamentRefree = (
    tour_id: string,
    place_id: MaybeRefOrGetter<string>,
  ) => {
    return useAppApiData<IRefre[]>(
      () =>
        appKeys.tournamentReferees(tour_id, toValue(place_id) || "none"),
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

  const addTourRefree = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      _tour_id: string,
      _place_id: string,
      refree: { username: string },
    ) => {
      await execute(async () => {
        await $api(`/tournaments/${_tour_id}/places/${_place_id}/referees`, {
          method: "post",
          body: refree,
        });
        await refreshAppData(
          appKeys.tournamentReferees(_tour_id, _place_id),
        );
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const deleteTourRefree = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      _tour_id: string,
      _place_id: string,
      _refree_id: string,
    ) => {
      await execute(async () => {
        await $api(
          `/tournaments/${_tour_id}/places/${_place_id}/referees/${_refree_id}`,
          {
            method: "delete",
          },
        );
        await refreshAppData(
          appKeys.tournamentReferees(_tour_id, _place_id),
        );
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return { getTournamentRefree, addTourRefree, deleteTourRefree };
};
