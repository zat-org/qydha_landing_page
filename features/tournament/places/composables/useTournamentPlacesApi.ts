import type {
  CreateTournamentPlaceDto,
  GetTournamentPlace,
} from "~/features/tournament/models/place";

async function refreshPlaceRelated(tour_id: string) {
  await refreshAppData(appKeys.tournamentPlaces(tour_id));
  await refreshAppData(appKeys.tournament(tour_id));
}

export const useTournamentPlacesApi = () => {
  const { $api } = useNuxtApp();

  const getPlaces = (tour_id: string) => {
    return useAppApiData<GetTournamentPlace[]>(
      appKeys.tournamentPlaces(tour_id),
      () => $api(`/tournaments/${tour_id}/places`),
    );
  };

  const addPlace = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      body: CreateTournamentPlaceDto,
    ) => {
      if (!tour_id) {
        throw new Error("Tournament ID is required");
      }
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/places`, {
          method: "post",
          body,
          headers: {
            "Content-Type": "application/json",
          },
        });
        await refreshPlaceRelated(tour_id);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updatePlace = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      place_id: string,
      body: CreateTournamentPlaceDto,
    ) => {
      if (!tour_id || !place_id) {
        throw new Error("Tournament ID and Place ID are required");
      }
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/places/${place_id}`, {
          method: "put",
          body,
          headers: {
            "Content-Type": "application/json",
          },
        });
        await refreshPlaceRelated(tour_id);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const deletePlace = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, place_id: string) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/places/${place_id}`, {
          method: "delete",
        });
        await refreshPlaceRelated(tour_id);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return { getPlaces, addPlace, updatePlace, deletePlace };
};
