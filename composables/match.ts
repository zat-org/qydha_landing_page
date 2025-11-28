import type { IMatchUpdate } from "~/models/match";
import type { IMatchData, IMathStat } from "~/models/MatchStat";

export const useMatch = () => {
  const { $qaydhaapi, $api } = useNuxtApp();

  const getMatchData = async () => {
    const game_id = ref("");
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{ data: {state:IMatchData,statistics:IMathStat}, message: string }>(
        "getMatchData",
        () => $api(`baloot-games/${game_id.value}/data`),
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
      await useAsyncData<{ message: string, data: IMathStat }>(
        "getMatchStatstics",
        () => $api(`baloot-games/${game_id.value}/statistics`),
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

  const updateMatch = async () => {
    const tour_id = ref()
    const match_id = ref()
    const body = ref<IMatchUpdate>()
    const { data, pending, error, refresh, execute, status } = await useAsyncData(
      'updateMatch',  
      () => $api(`tournaments/${tour_id.value}/matches/${match_id.value}`, { body: body.value, method: "PUT" }), { immediate: false }
    );
    const fetchREQ = async (_tour_id: string, _match_id: string, _data: IMatchUpdate) => {
      tour_id.value = _tour_id;
      match_id.value = _match_id;
      body.value = _data
      await execute()
      if (status.value == "success") {
      
      }
    }
    return { data, pending, error, refresh, fetchREQ, status }
  }
  const updateMatchState = async () => {
    const qydha_id = ref()
    const body = reactive<
      {
        id: number,
        eventName: string,
        triggeredAt: Date | string,
        WithdrawSide?: string
      }[]>([{
        id: 1,
        eventName: "",
        triggeredAt: new Date().toISOString()
      }])
    const { data, pending, error, refresh, status, execute } = await useAsyncData(
      'updateMatchState',
      () => $api(`/baloot-games/${qydha_id.value}/events`,{method:"POST",body:body}), { immediate: false }
    );
    const fetchRestREQ = async (_qydha_id: string) => {
      qydha_id.value = _qydha_id;
      body[0].eventName="ResetGameEvent"
      await execute();
      if(status.value=="success"){
     
      }

    }
    const fetchWithdrawREQ = async (_qydha_id: string,_withdraw_side:string) => {
      qydha_id.value = _qydha_id;
      body[0].WithdrawSide =_withdraw_side
      body[0].eventName="WithdrawGameEvent"
      await execute();
      if(status.value=="success"){
   
      }
    }
    return { data, pending, error, refresh, status, fetchRestREQ, fetchWithdrawREQ }

  }
  return { getMatchData, getMatchStatstics, updateMatch, updateMatchState };
};
