import { defineStore } from 'pinia'
import * as signalR from "@microsoft/signalr";
import type { Group, Match } from '~/models/group';
import type { IMatchData, IMathStat } from '~/models/MatchStat';
import type { DetailTournament, Tournament } from '~/models/tournament';

export const useMyTournamentStore = defineStore('myTournamentStore', () => {
	const selectedTournament = ref<Tournament[]>()
	const setSelectedTournament = (tournaments: Tournament[]) => {
		selectedTournament.value = tournaments
	}
	const getTournamentById = (id: string) => {
		return selectedTournament.value?.find(t=>t.id == id)
	}	
return {
	selectedTournament,
	setSelectedTournament,
	getTournamentById,
}

})
