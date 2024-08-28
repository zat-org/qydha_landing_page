import type { IMathStat } from "~/models/MatchStat";

export const useMatch = () => {
  const { $qaydhaapi } = useNuxtApp();
  const getMatchData = async () => {
    const game_id = ref("");
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData(
        "getMatchData",
        () => $qaydhaapi(`baloot-games/${game_id.value}`),
        {
          immediate: false,
        }
      );
    const fetchREQ = async (_game_id: string) => {
      game_id.value = _game_id;
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };


  const getMatchStatstics = async () => {
    const game_id = ref("");
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{message:string ,data:IMathStat}>(
        "getMatchStatstics",
        () => $qaydhaapi(`baloot-games/${game_id.value}/statistics`),
        {
          immediate: false,
        }
      );
    const fetchREQ = async (_game_id: string) => {
      game_id.value = _game_id;
      await execute();
    };
    return { data, pending, error, refresh, status, fetchREQ };
  };


  return { getMatchData, getMatchStatstics };
};
