import type { Match } from "~/features/tournament/models/group";
import type {
  IMatchUpdate,
  IUpdateChoicesForMatch,
} from "~/features/tournament/models/match";
import type { IMatchData, IMathStat } from "~/features/tournament/models/MatchStat";

export const useMatch = () => {
  const { $qaydhaapi, $api } = useNuxtApp();

  const getMatchData = () => {
    const game_id = ref("");
    const { data, pending, error, refresh, status, execute } = useAppApiData<{
      state: IMatchData;
      statistics: IMathStat;
    }>(
      appKeys.match("getMatchData"),
      () => $qaydhaapi(`baloot-games/${game_id.value}/data`),
      { immediate: false },
    );
    const fetchREQ = async (_game_id: string) => {
      game_id.value = _game_id;
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const getMatchStatstics = () => {
    const game_id = ref("");
    const { data, pending, error, refresh, status, execute } =
      useAppApiData<IMathStat>(
        appKeys.match("getMatchStatstics"),
        () => $qaydhaapi(`baloot-games/${game_id.value}/statistics`),
        { immediate: false },
      );
    const fetchREQ = async (_game_id: string) => {
      game_id.value = _game_id;
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };

  const getUpdateChoicesForMatch = (tour_id: string, match_id: string) => {
    return useAppApiData<IUpdateChoicesForMatch>(
      appKeys.match("getUpdateChoicesForMatch", tour_id, match_id),
      () => $api(`/tournaments/${tour_id}/matches/${match_id}/update-choices`),
    );
  };

  const updateMatch = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      _tour_id: string,
      _match_id: string,
      _data: IMatchUpdate,
    ) => {
      await execute(async () => {
        const res = await $api<{ message: string; data: Match }>(
          `tournaments/${_tour_id}/matches/${_match_id}`,
          {
            body: _data,
            method: "PUT",
          },
        );
        if (res?.data?.groupId) {
          await refreshAppData(
            appKeys.match(
              "getRoundsGroupDetails",
              _tour_id,
              res.data.groupId,
            ),
          );
        }
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const updateMatchState = () => {
    const { pending, status, error, execute } = useMutationRequest();
    const body = reactive<
      {
        id: number;
        eventName: string;
        triggeredAt: Date | string;
        WithdrawSide?: string;
      }[]
    >([
      {
        id: 1,
        eventName: "",
        triggeredAt: new Date().toISOString(),
      },
    ]);

    const fetchRestREQ = async (_qydha_id: string) => {
      await execute(async () => {
        body[0]!.eventName = "ResetGameEvent";
        await $api(`/baloot-games/${_qydha_id}/events`, {
          method: "POST",
          body,
        });
      });
    };

    const fetchWithdrawREQ = async (
      _qydha_id: string,
      _withdraw_side: string,
    ) => {
      await execute(async () => {
        body[0]!.WithdrawSide = _withdraw_side;
        body[0]!.eventName = "WithdrawGameEvent";
        await $api(`/baloot-games/${_qydha_id}/events`, {
          method: "POST",
          body,
        });
      });
    };
    return { pending, status, error, fetchRestREQ, fetchWithdrawREQ };
  };

  const MatchWithdraw = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      _GameId: string,
      _withdrawSide: "Us" | "Them" | "All",
    ) => {
      await execute(async () => {
        await $api(`/baloot-games/${_GameId}/withdraw`, {
          method: "POST",
          body: { withdrawSide: _withdrawSide },
        });
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const MatchReset = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_GameId: string) => {
      await execute(async () => {
        await $api(`/baloot-games/${_GameId}/reset`, { method: "POST" });
      });
    };
    return { pending, status, error, fetchREQ };
  };

  const MatchBack = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (_GameId: string) => {
      await execute(async () => {
        await $api(`/baloot-games/${_GameId}/back`, { method: "POST" });
      });
    };
    return { pending, status, error, fetchREQ };
  };

  return {
    getMatchData,
    getMatchStatstics,
    updateMatch,
    updateMatchState,
    getUpdateChoicesForMatch,
    MatchWithdraw,
    MatchReset,
    MatchBack,
  };
};
