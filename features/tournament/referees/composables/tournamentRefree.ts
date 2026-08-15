import type { IRefre } from "~/features/tournament/models/Refre";

export const useTournamentRefree = () => {
  const { $api } = useNuxtApp();

  const getTournamentRefree = async () => {
    const tourId = ref();
    const { data, pending, error, refresh, status, execute } =
      await useAppApiData<IRefre[]>(
        appKeys.tournamentReferees,
        () => $api(`/tournaments/${tourId.value}/referees`),
        { immediate: false },
      );
    const fetchREQ = async (_tour_id: string) => {
      tourId.value = _tour_id;
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const addTourRefree = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      _tour_id: string,
      refree: { username: string },
    ) => {
      await execute(async () => {
        await $api(`/tournaments/${_tour_id}/referees`, {
          method: "post",
          body: refree,
        });
        await refreshAppData(appKeys.tournamentReferees);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const deleteTourRefree = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_tour_id: string, _refree_id: string) => {
      await execute(async () => {
        await $api(`/tournaments/${_tour_id}/referees/${_refree_id}`, {
          method: "delete",
        });
        await refreshAppData(appKeys.tournamentReferees);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return { getTournamentRefree, addTourRefree, deleteTourRefree };
};
