import { defineStore } from 'pinia'
import * as signalR from "@microsoft/signalr";
import type { Group, Match } from '~/models/group';
import type { IMatchData, IMathStat } from '~/models/MatchStat';

export const useMyTournamentStore = defineStore('myTournamentStore',  () => {

	const route = useRoute();
	const groupApi = useGroup();
	const games = ref<{ id: string, game: IMatchData, statistics: IMathStat }[]>([])
	const selectedTournamentId = ref<string>("");
	const tournament = ref<{ data: Group, matches: Match[] }[]>([])
	const connection  =ref<signalR.HubConnection>()

	const matchesTree = computed((): Match[] | undefined => {
		if (!selectedGroup.value) return undefined;
		let heads: Match[] = [];
		selectedGroup.value.matches.forEach((m) => {
			if (
				m.level == 1 &&
				(!m.matchQualifyUsTeamFrom ||
					m.matchQualifyUsTeamFrom === "Winner") &&
				(!m.matchQualifyThemTeamFrom ||
					m.matchQualifyThemTeamFrom === "Winner")
			) {
				populateChildren(m, selectedGroup.value!.matches);
				heads.push(m);
			}
		});

		return heads;
	});
	const loserMatches = computed((): Match[] | undefined => {
		if (!selectedGroup.value) return undefined;
		return selectedGroup.value.matches.filter((m) => {
			if (
				m.matchQualifyUsTeamFrom === "Loser" &&
				m.matchQualifyUsTeamId &&
				m.matchQualifyThemTeamFrom === "Loser" &&
				m.matchQualifyThemTeamId
			) {
				return m;
			}
		});
	});
	const populateChildren = (match: Match | undefined, matches: Match[]) => {
		if (!match) return undefined;
		if (match.matchQualifyThemTeamId)
			match.matchQualifyThemTeam = matches.find(
				(m) => m.id == match.matchQualifyThemTeamId
			);
		if (match.matchQualifyUsTeamId)
			match.matchQualifyUsTeam = matches.find(
				(m) => m.id == match.matchQualifyUsTeamId
			);
		populateChildren(match.matchQualifyThemTeam, matches);
		populateChildren(match.matchQualifyUsTeam, matches);
	};


	// const games = ref<[match_id: string, game: any, statistic: any]>()


	const selectedGroup = computed(() => {
		if (tournament.value.length == 0) return null;
		const groupIdStr = route.query.group as string;
		const groupId =groupIdStr;
		if (!groupId)
			return tournament.value.find(d => d.data.type == "final") ??
				tournament.value[tournament.value.length - 1];
		return tournament.value.find((g) => g.data.id == groupId) ??
			tournament.value.find(d => d.data.type == "final") ?? tournament.value[tournament.value.length - 1];
	});
  
	const closeConnection  = ()=>{
		if(	!connection.value) return ;
			connection.value.stop()
	}
	const groupsREQ =    groupApi.getGroups(route.params.id.toString())
	const initStore = async () => {
		const tournamentId = route.params.id.toString()
		selectedTournamentId.value = tournamentId;
		// groupsREQ.value = undefined;
		// const { data, pending, error, refresh, status } = await groupsREQ
		// await groupsREQ.value?.refresh();
		await groupsREQ.execute()
		if (groupsREQ.status && groupsREQ.status.value == "error") {
			return;
		}
		groupsREQ.data.value?.data.groups.forEach(g => {
			tournament.value.push({ data: g, matches: [] });
		})
		if (selectedGroup.value === null) return;

		const matchesREQ = await groupApi.getGroupMatches()
		await matchesREQ.fetchREQ(tournamentId, selectedGroup.value.data.id)
		if (matchesREQ.status.value == "error" || !matchesREQ.data || !matchesREQ.data.value) return;

		let g = tournament.value.find(g => g.data.id == selectedGroup.value?.data.id);
		if (g == null) return;
		// console.log(matchesREQ.data.value.data)
		g.matches = matchesREQ.data.value.data;

		connection.value  = await initWebsocket(tournamentId);
	}
	const fetchGame = async (id: string) => {
		const gameApi = useMatch()
		const matchData = await gameApi.getMatchData()
		await matchData.fetchREQ(id)
		if (matchData.status.value == "success" && matchData.data.value)
			games.value.push({ id: matchData.data.value?.data.state.id, game: matchData.data.value?.data.state, statistics: matchData.data.value?.data.statistics })
		console.log(games.value)
	}

	const handleMatchStateChanged = (eventName: string, game: string, statistics: string) => {
		const gameObject: IMatchData = JSON.parse(game)
		const statisticsObject: IMathStat = JSON.parse(statistics)

		const selectedGame = games.value.find(g => g.id == gameObject.id)
		if (selectedGame) {
			selectedGame.game = gameObject
			selectedGame.statistics = statisticsObject
		} else {
			games.value.push({ id: gameObject.id, game: gameObject, statistics: statisticsObject })
		}
		console.log("MatchStateChanged")
	}
	const handleBracketChanged = (GroupId: string, groupMatches: string) => {
		let g = tournament.value.find(g => g.data.id == GroupId);
		if (g == null) return;
		g.matches = JSON.parse(groupMatches);
		console.log("TournamentBracketChanged")
	}
	const handleBracketUpdated = (groupId: string, groupMatches: string) => {
		let g = tournament.value.find(g => g.data.id == groupId);
		if (g == null) return;
		g.matches = JSON.parse(groupMatches);
		console.log("BracketUpdated")
	}
	const initWebsocket = async (tournamentId: string) => {
		const config = useRuntimeConfig();
		const connection = new signalR.HubConnectionBuilder()
			.withUrl(`${config.public.qydhaapiBase}/tournaments-hub`, {
				withCredentials: true,
			})
			.build();

		try {
			await connection.start();
			await connection.invoke("AddToTournamentGroup", tournamentId);
		} catch (error) {
			console.log("errror",error)
		}
		connection.on("MatchStateChanged", handleMatchStateChanged)
		connection.on("TournamentBracketChanged", handleBracketChanged)
		connection.on("braket updated", handleBracketUpdated)
		return connection
	}
	return { initStore, tournament, matchesTree, loserMatches, selectedGroup, games, fetchGame,closeConnection ,groupsREQ}
})
