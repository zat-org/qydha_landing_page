import { defineStore } from 'pinia'
import * as signalR from "@microsoft/signalr";
import type { Group, Match } from '~/models/group';

export const useMyTournamentStore = defineStore('myTournamentStore', () => {
 
  const route = useRoute()
  const tour_id = route.params.id
// brackeect =>array og groups  ggrroups ==>array of match 
  const tournamentString = ref("")
  const tournament =ref<{groups:{id:number,matches:Match[]}[]}>({groups:[]}) 
  const matches = computed(()=>{
    (group_id:number= + useRoute().params.group_id)=>{return tournament.value.groups.find((g)=>{return g.id == group_id})}
  })
  const games = ref<[match_id:string ,game:any ,statistic:any  ]>()
  const groupApi = useGroup();


  const connection = new signalR.HubConnectionBuilder()
    .withUrl("https://sam-baloot-admin.online/dev/tournaments-hub", {
      withCredentials: true,
    }) 
    .build();



  const IntializeConnection = async (selected_group: Ref <Group|null>) => {


  
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
      console.log( JSON.parse(groupMatches))
      // return plain matches 
    })




  }
return  {IntializeConnection,matches,tournament}
})
