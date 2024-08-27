import { defineStore } from 'pinia'
import type { Team } from '~/models/group'

export const useMyTeamsStore = defineStore('myTeamsStore',()=>{
  const teams = ref<Team[]>()
  const setTeams =(_teams:Team[])=>{
    console.log("teams Updated")
    teams.value = _teams
  }
  const getTeam =(team_id:number)=>{
    return teams.value?.find(t=>{
      return t.id == team_id
    })
  }
  return {teams , setTeams,getTeam}
})
