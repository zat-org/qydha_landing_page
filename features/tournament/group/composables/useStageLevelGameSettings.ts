import type {
  StageLevelGameSettings,
  UpdateLevelGameSettingsBody,
} from "~/features/tournament/models/tournamentRound";
import { appKeys } from "~/composables/queryKeys";

export function useStageLevelGameSettings() {
  const { $api } = useNuxtApp();

  const getLevelsGameSettings = () => {
    const tournamentId = ref("");
    const stageId = ref("");
    const { data, pending, error, refresh, status, execute } =
      useAppApiData<StageLevelGameSettings[]>(
        appKeys.match("stageLevelsGameSettings"),
        () =>
          $api(
            `/tournaments/${tournamentId.value}/stages/${stageId.value}/levels/game-settings`,
          ),
        { immediate: false },
      );

    const fetchREQ = async (_tournamentId: string, _stageId: string) => {
      tournamentId.value = _tournamentId;
      stageId.value = _stageId;
      await execute();
    };

    return { data, pending, error, refresh, status, fetchREQ };
  };

  const updateLevelGameSettings = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      _tournamentId: string,
      _stageId: string,
      level: number,
      body: UpdateLevelGameSettingsBody,
    ) => {
      await execute(async () => {
        await $api(
          `/tournaments/${_tournamentId}/stages/${_stageId}/levels/${level}/game-settings`,
          { method: "put", body },
        );
        await refreshAppData(appKeys.match("stageLevelsGameSettings"));
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return {
    getLevelsGameSettings,
    updateLevelGameSettings,
  };
}
