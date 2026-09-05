import type {
  PlaceModerator,
  PlaceModeratorCreate,
} from "~/features/tournament/models/placeModerator";

export const usePlaceModeratorsApi = () => {
  const { $api } = useNuxtApp();

  const getPlaceModerators = (
    tour_id: string,
    place_id: MaybeRefOrGetter<string>,
  ) => {
    return useAppApiData<PlaceModerator[]>(
      () =>
        appKeys.placeModerators(tour_id, toValue(place_id) || "none"),
      () => {
        const pid = toValue(place_id);
        if (!pid) {
          return Promise.resolve({ data: [] as PlaceModerator[] });
        }
        return $api(`/tournaments/${tour_id}/places/${pid}/moderators`);
      },
      {
        watch: [() => toValue(place_id)],
      },
    );
  };

  const addPlaceModerator = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      _tour_id: string,
      _place_id: string,
      body: PlaceModeratorCreate,
    ) => {
      await execute(async () => {
        await $api(`/tournaments/${_tour_id}/places/${_place_id}/moderators`, {
          method: "post",
          body,
        });
        await refreshAppData(appKeys.placeModerators(_tour_id, _place_id));
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const deletePlaceModerator = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      _tour_id: string,
      _place_id: string,
      moderator_id: string,
    ) => {
      await execute(async () => {
        await $api(
          `/tournaments/${_tour_id}/places/${_place_id}/moderators/${moderator_id}`,
          {
            method: "delete",
          },
        );
        await refreshAppData(appKeys.placeModerators(_tour_id, _place_id));
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return { getPlaceModerators, addPlaceModerator, deletePlaceModerator };
};
