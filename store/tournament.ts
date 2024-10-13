import { defineStore } from 'pinia'
import * as signalR from "@microsoft/signalr";
import type { Group, Match } from '~/models/group';

export const useMyTournamentStore = defineStore('myTournamentStore',async () => {

  const route = useRoute()
  const tour_id = route.params.id.toString();
  const groupApi = useGroup();
  const matcheesREQ =await groupApi.getGroupMatches()
  // brackeect =>array og groups  ggrroups ==>array of match 
  const tournamentString = ref("")
  const tournament = ref<{ groups: { id: number, matches: Match[] }[] }>({ groups: [] })
  const matchesbyGroup = computed(() => {
    async(group_id: number) => {
      const group  =  tournament.value.groups.find((g) => { return g.id == group_id })
      if(group){
        return group.matches 
      }
      else{
        await matcheesREQ.fetchREQ(tour_id,group_id)
      }
    }
  })
  const games = ref<[match_id: string, game: any, statistic: any]>()
 


  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://sam-baloot-admin.online/dev/tournaments-hub", {
      withCredentials: true,
    })
    .build();



  const IntializeConnection = async (group_id:number ) => {
    await matcheesREQ.fetchREQ(tour_id,group_id)
    if (matcheesREQ.status.value=="success" && matcheesREQ.data && matcheesREQ.data.value){
      tournament.value.groups.push({id:group_id ,matches: matcheesREQ.data.value.data} )
    }

    try {
      await connection.start();
      tournamentString.value = await connection.invoke("AddToTournamentGroup", +tour_id);
    } catch (error) {
      console.log(error)
    }
    connection.on("MatchStateChanged", (eventName: string, game: string, statistics: string) => {
      console.log("MatchStateChanged")
    })
    connection.on("TournamentBracketChanged", (GroupId: number, groupMatches: string) => {

      console.log("TournamentBracketChanged")
      console.log(JSON.parse(groupMatches))
      // return plain matches 
    })




  }
  return { IntializeConnection, tournament }
})
