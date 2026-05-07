import type { Match } from "~/features/tournament/models/group";
import type { IMatchUpdate, IUpdateChoicesForMatch } from "~/features/tournament/models/match";
import type { IMatchData, IMathStat } from "~/features/tournament/models/MatchStat";

export const useMatch = () => {
  const { $qaydhaapi, $api } = useNuxtApp();

  const getMatchData = async () => {
    const game_id = ref("");
    const { data, pending, error, refresh, status, execute } =
      await useAsyncData<{ data: {state:IMatchData,statistics:IMathStat}, message: string }>(
        "getMatchData",
        () => $qaydhaapi(`baloot-games/${game_id.value}/data`),
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


  const getUpdateChoicesForMatch = (tour_id: string, match_id: string) => {
    const result = useAsyncData<{ message: string, data: IUpdateChoicesForMatch }>(
      `getUpdateChoicesForMatch-${tour_id}-${match_id}`,
      () => $api(`/tournaments/${tour_id}/matches/${match_id}/update-choices`)
    );
    return result;
  }

  const updateMatch = async () => {
    const tour_id = ref()
    const match_id = ref()
    const body = ref<IMatchUpdate>()
    const { data, pending, error, refresh, execute, status } = await useAsyncData<{message:string,data:Match}>(
      ()=> `updateMatch`,  
      () => $api(`tournaments/${tour_id.value}/matches/${match_id.value}`, { body: body.value, method: "PUT" }), { immediate: false }
    );
    const fetchREQ = async (_tour_id: string, _match_id: string, _data: IMatchUpdate) => {
      tour_id.value = _tour_id;
      match_id.value = _match_id;
      body.value = _data
      await execute()
      if (status.value == "success" && data.value?.data) {
        refreshNuxtData(["getRoundsGroupDetails", tour_id.value, data.value?.data.groupId].join("-"))
      // refreshNuxtData()
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
      ()=> `updateMatchState-${qydha_id.value}`,
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
      console.log(`updateMatchState-${qydha_id.value}`)
      console.log(_withdraw_side)
      qydha_id.value = _qydha_id;
      body[0].WithdrawSide =_withdraw_side
      body[0].eventName="WithdrawGameEvent"
      await execute();
      if(status.value=="success"){
   
      }
    }
    return { data, pending, error, refresh, status, fetchRestREQ, fetchWithdrawREQ }

  }

const MatchWithdraw = async () => {
  const GameId = ref()
  const withdrawSide = ref<"Us" | "Them" | "All">()
  const { data, pending, error, refresh, status, execute } = await useAsyncData(
    ()=> `MatchWithdraw-${GameId.value}-${withdrawSide.value}`,
    () => $api(`/baloot-games/${GameId.value}/withdraw`, { method: "POST", body: { withdrawSide: withdrawSide.value } }), { immediate: false }
  );
  const fetchREQ = async (_GameId: string, _withdrawSide: "Us" | "Them" | "All") => {
    GameId.value = _GameId
    withdrawSide.value = _withdrawSide
    await execute()
    if(status.value=="success"){
      // refreshNuxtData("getMatchData")
    }
  }
  return { data, pending, error, refresh, status, execute, fetchREQ }
}
const MatchReset = async () => {
  const GameId = ref()
  const { data, pending, error, refresh, status, execute } = await useAsyncData(
    ()=> `MatchReset-${GameId.value}`,
    () => $api(`/baloot-games/${GameId.value}/reset`, { method: "POST" }), { immediate: false }
  );
  const fetchREQ = async (_GameId: string) => {
    GameId.value = _GameId
    await execute()
    if(status.value=="success"){
      // refreshNuxtData("getMatchData")
    }
  }
  return { data, pending, error, refresh, status, execute, fetchREQ }
}
const MatchBack = async () => {
  const GameId = ref()
  const { data, pending, error, refresh, status, execute } = await useAsyncData(
    ()=> `MatchBack-${GameId.value}`,
    () => $api(`/baloot-games/${GameId.value}/back`, { method: "POST" }), { immediate: false }
  );
  const fetchREQ = async (_GameId: string) => {
    GameId.value = _GameId
    await execute()
    if(status.value=="success"){
      // refreshNuxtData("getMatchData")
    }
  }
  return { data, pending, error, refresh, status, execute, fetchREQ }
}





  return { getMatchData, getMatchStatstics, updateMatch, updateMatchState,getUpdateChoicesForMatch  , MatchWithdraw, MatchReset, MatchBack };
};
