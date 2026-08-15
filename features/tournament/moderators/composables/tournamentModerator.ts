import type {
  IModerator,
  IModeratorCreate,
  IModeratorUpdate,
} from "~/features/tournament/models/tournamentModeratorr";

export const useTournamentModerator = () => {
  const { $api } = useNuxtApp();

  const getAllmoderators = async () => {
    const tourId = ref();
    const { data, pending, error, refresh, status, execute } =
      await useAppApiData<IModerator[]>(
        appKeys.tournamentModerators,
        () => $api(`/tournaments/${tourId.value}/moderators`),
        { immediate: false },
      );
    const fetchREQ = async (tour_id: string) => {
      tourId.value = tour_id;
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const addModerator = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, new_body: IModeratorCreate) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/moderators`, {
          method: "post",
          body: new_body,
        });
        await refreshAppData(appKeys.tournamentModerators);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const deleteModerator = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, moderator_id: string) => {
      await execute(async () => {
        await $api(`tournaments/${tour_id}/moderators/${moderator_id}`, {
          method: "delete",
        });
        await refreshAppData(appKeys.tournamentModerators);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updateModerator = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      moderator_id: string,
      new_moderator: IModeratorUpdate,
    ) => {
      await execute(async () => {
        await $api(`tournaments/${tour_id}/moderators/${moderator_id}`, {
          method: "put",
          body: new_moderator,
        });
        await refreshAppData(appKeys.tournamentModerators);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const getModeratorpermissions = async () => {
    const { data, pending, error, refresh } = await useAppApiData<{
      permissions: string[];
    }>("getModeratorpermissions", () =>
      $api("/tournaments/moderator-permissions"),
    );
    return { data, pending, error, refresh };
  };

  return {
    addModerator,
    deleteModerator,
    updateModerator,
    getModeratorpermissions,
    getAllmoderators,
  };
};
