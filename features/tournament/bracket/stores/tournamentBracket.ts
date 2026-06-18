import { defineStore } from 'pinia';
import * as signalR from '@microsoft/signalr';
import type { Group, Match, RoundGroupDetails } from '~/features/tournament/models/group';
import type { IMatchData, IMathStat } from '~/features/tournament/models/MatchStat';

export const useTournamentBracketStore = defineStore('tournamentBracket', () => {
  const route = useRoute();
  const groupApi = useGroup();
  const games = ref<{ id: string; game: IMatchData; statistics: IMathStat }[]>(
    [],
  );
  const selectedTournamentId = ref<string>('');
  const tournament = ref<{ data: Group; matches: Match[] }[]>([]);
  const connection = ref<signalR.HubConnection>();
  const rounds = ref<RoundGroupDetails['rounds']>([]);
  const selectedRound = ref<RoundGroupDetails['rounds'][0]>();
  const handleRoundSelection = (roundId: string) => {
    if (selectedRound.value?.id == roundId) {
      selectedRound.value = undefined;
      return;
    }
    selectedRound.value = rounds.value.find((r) => r.id == roundId);
  };

  const matchesTree = computed((): Match[] | undefined => {
    if (!selectedGroup.value) return undefined;
    return selectedGroup.value.matches.filter(
      (m) =>
        m.level == 1 &&
        (!m.matchQualifyUsTeamFrom || m.matchQualifyUsTeamFrom === 'Winner') &&
        (!m.matchQualifyThemTeamFrom || m.matchQualifyThemTeamFrom === 'Winner'),
    );
  });
  const loserMatches = computed((): Match[] | undefined => {
    if (!selectedGroup.value) return undefined;
    return selectedGroup.value.matches.filter((m) => {
      if (
        m.matchQualifyUsTeamFrom === 'Loser' &&
        m.matchQualifyUsTeamId &&
        m.matchQualifyThemTeamFrom === 'Loser' &&
        m.matchQualifyThemTeamId
      ) {
        return m;
      }
    });
  });
  const populateChildren = (match: Match | undefined, matches: Match[]) => {
    if (!match) return;
    if (match.matchQualifyThemTeamId)
      match.matchQualifyThemTeam = matches.find(
        (m) => m.id == match.matchQualifyThemTeamId,
      );
    if (match.matchQualifyUsTeamId)
      match.matchQualifyUsTeam = matches.find(
        (m) => m.id == match.matchQualifyUsTeamId,
      );
    populateChildren(match.matchQualifyThemTeam, matches);
    populateChildren(match.matchQualifyUsTeam, matches);
  };

  const linkParentMatches = (matches: Match[]) => {
    for (const m of matches) {
      if (m.matchQualifyUsTeamId) {
        const child = matches.find((c) => c.id === m.matchQualifyUsTeamId);
        if (child) child.parentMatch = m;
      }
      if (m.matchQualifyThemTeamId) {
        const child = matches.find((c) => c.id === m.matchQualifyThemTeamId);
        if (child) child.parentMatch = m;
      }
    }
  };

  const linkMatchTree = (matches: Match[]) => {
    for (const m of matches) {
      m.matchQualifyUsTeam = undefined;
      m.matchQualifyThemTeam = undefined;
      m.parentMatch = null;
    }

    const heads = matches.filter(
      (m) =>
        m.level == 1 &&
        (!m.matchQualifyUsTeamFrom || m.matchQualifyUsTeamFrom === 'Winner') &&
        (!m.matchQualifyThemTeamFrom || m.matchQualifyThemTeamFrom === 'Winner'),
    );

    for (const head of heads) {
      populateChildren(head, matches);
    }
    linkParentMatches(matches);
  };

  const syncTournamentFromGroups = (groups: Group[]) => {
    const matchesByGroupId = new Map(
      tournament.value.map((entry) => [entry.data.id, entry.matches]),
    );
    tournament.value = groups.map((g) => ({
      data: g,
      matches: matchesByGroupId.get(g.id) ?? [],
    }));
  };

  const applyMatchesToGroup = (groupId: string, matches: Match[]) => {
    const entry = tournament.value.find((e) => e.data.id === groupId);
    if (!entry) return;
    entry.matches = matches;
    linkMatchTree(entry.matches);
  };

  const selectedGroup = computed(() => {
    if (tournament.value.length == 0) return null;
    const groupIdStr = route.query.group as string;
    const groupId = groupIdStr;
    if (!groupId)
      return (
        tournament.value.find((d) => d.data.type == 'final') ??
        tournament.value[tournament.value.length - 1]
      );
    return (
      tournament.value.find((g) => g.data.id == groupId) ??
      tournament.value.find((d) => d.data.type == 'final') ??
      tournament.value[tournament.value.length - 1]
    );
  });

  const closeConnection = () => {
    if (!connection.value) return;
    connection.value.stop();
  };
  const groupsREQ = groupApi.getGroups(route.params.id?.toString() || '');
  const bracketRefreshPending = ref(false);

  const refreshBracket = async (tournamentId: string) => {
    const sel = selectedGroup.value;
    if (!sel) return;

    const groupId = sel.data.id;
    bracketRefreshPending.value = true;
    try {
      await groupsREQ.refresh();

      const groups = groupsREQ.data.value?.data.groups;
      if (groups) syncTournamentFromGroups(groups);

      const matchesREQ = await groupApi.getGroupMatches();
      await matchesREQ.fetchREQ(tournamentId, groupId);
      if (matchesREQ.status.value !== 'error' && matchesREQ.data?.value?.data) {
        applyMatchesToGroup(groupId, matchesREQ.data.value.data);
      }
    } finally {
      bracketRefreshPending.value = false;
    }
  };

  const initStore = async () => {
    const tournamentId = route.params.id?.toString() || '';
    selectedTournamentId.value = tournamentId;

    tournament.value = [];
    await groupsREQ.execute();
    if (groupsREQ.status?.value === 'error') return;

    const groups = groupsREQ.data.value?.data.groups ?? [];
    syncTournamentFromGroups(groups);

    const groupId = selectedGroup.value?.data.id;
    if (!groupId) return;

    const matchesREQ = await groupApi.getGroupMatches();
    await matchesREQ.fetchREQ(tournamentId, groupId);
    if (
      matchesREQ.status.value === 'error' ||
      !matchesREQ.data?.value?.data
    ) {
      return;
    }

    applyMatchesToGroup(groupId, matchesREQ.data.value.data);

    if (!connection.value) {
      connection.value = await initWebsocket(tournamentId);
    }
  };
  const fetchGame = async (id: string) => {
    const gameApi = useMatch();
    const matchData = gameApi.getMatchData();
    await matchData.fetchREQ(id);
    if (matchData.status.value == 'success' && matchData.data.value)
      games.value.push({
        id: matchData.data.value?.data.state.id,
        game: matchData.data.value?.data.state,
        statistics: matchData.data.value?.data.statistics,
      });
  };

  const handleMatchStateChanged = (
    _eventName: string,
    game: string,
    statistics: string,
  ) => {
    const gameObject: IMatchData = JSON.parse(game);
    const statisticsObject: IMathStat = JSON.parse(statistics);

    const selectedGame = games.value.find((g) => g.id == gameObject.id);
    if (selectedGame) {
      selectedGame.game = gameObject;
      selectedGame.statistics = statisticsObject;
    } else {
      games.value.push({
        id: gameObject.id,
        game: gameObject,
        statistics: statisticsObject,
      });
    }
  };
  const handleBracketChanged = (groupId: string, groupMatches: string) => {
    applyMatchesToGroup(groupId, JSON.parse(groupMatches) as Match[]);
  };
  const handleBracketUpdated = (groupId: string, groupMatches: string) => {
    applyMatchesToGroup(groupId, JSON.parse(groupMatches) as Match[]);
  };
  const initWebsocket = async (tournamentId: string) => {
    const config = useRuntimeConfig();
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${config.public.qydhaapiBase}/tournaments-hub`, {
        withCredentials: true,
      })
      .build();

    try {
      await conn.start();
      await conn.invoke('AddToTournamentGroup', tournamentId);
    } catch (error) {
      console.log('errror', error);
    }
    conn.on('MatchStateChanged', handleMatchStateChanged);
    conn.on('TournamentBracketChanged', handleBracketChanged);
    conn.on('braket updated', handleBracketUpdated);
    return conn;
  };
  return {
    initStore,
    refreshBracket,
    bracketRefreshPending,
    tournament,
    matchesTree,
    loserMatches,
    selectedGroup,
    games,
    fetchGame,
    closeConnection,
    groupsREQ,
    rounds,
    selectedRound,
    handleRoundSelection,
  };
});
