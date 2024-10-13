import { defineStore } from 'pinia'
import * as signalR from "@microsoft/signalr";
export const useMyTournamentStore = defineStore('myTournamentStore', () => {
  const route = useRoute()
  const tour_id = route.params.id
// brackeect =>array og groups  ggrroups ==>array of match 
  const tournamentString = ref("")
  const tournament = ref()
  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://sam-baloot-admin.online/dev/tournaments-hub", {
      withCredentials: true,
    })
    .build();



  const IntializeConnection = async () => {
// get data from get req 
// await until data update 
// save data
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
    })

  }
return  {IntializeConnection}
})
