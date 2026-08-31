import { defineStore } from 'pinia';
import type { HubConnection } from '@microsoft/signalr';
import {
  GroupType,
  type Group,
  type Match,
  type RoundGroupDetails,
} from '~/features/tournament/models/group';
import type { IMatchData, IMathStat } from '~/features/tournament/models/MatchStat';
import { useGroup } from '~/features/tournament/group/composables/group';
import { useMatch } from '~/features/tournament/shared/composables/match';

export const useTournamentBracketStore = defineStore('tournamentBracket', () => {
  const route = useRoute();
  const groupApi = useGroup();
  const games = ref<{ id: string; game: IMatchData; statistics: IMathStat }[]>(
    [],
  );
  const selectedTournamentId = ref<string>(route.params.id?.toString() || '');
  const tournament = ref<{ data: Group; matches: Match[] }[]>([]);
  const connection = ref<HubConnection>();
  const rounds = ref<RoundGroupDetails['rounds']>([]);
  const selectedRound = ref<RoundGroupDetails['rounds'][0]>();
  const handleRoundSelection = (roundId: string) => {
    if (selectedRound.value?.id == roundId) {
      selectedRound.value = undefined;
      return;
    }
    selectedRound.value = rounds.value.find((r) => r.id == roundId);
  };

  const groupsREQ = groupApi.getGroups(route.params.id?.toString() || '');
  const matchesREQ = groupApi.getGroupMatches(
    route.params.id?.toString() || '',
    '',
    { immediate: false },
  );
  const roundsREQ = groupApi.getRoundsGroupDetails(
    route.params.id?.toString() || '',
    '',
    { immediate: false },
  );
  const bracketRefreshPending = ref(false);

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

    const sortedGroups = [...groups].sort((a, b) => {
      const aIsFinal =
        a.type === GroupType.Final ||
        a.stageType === 'Final' ||
        a.type?.toLowerCase() === 'final';
      const bIsFinal =
        b.type === GroupType.Final ||
        b.stageType === 'Final' ||
        b.type?.toLowerCase() === 'final';

      if (aIsFinal && !bIsFinal) return 1;
      if (!aIsFinal && bIsFinal) return -1;
      return (a.name || '').localeCompare(b.name || '', 'ar', {
        numeric: true,
      });
    });

    tournament.value = sortedGroups.map((g) => ({
      data: g,
      matches: matchesByGroupId.get(g.id) ?? [],
    }));
  };

  watch(
    () => groupsREQ.data.value?.groups,
    (newGroups) => {
      if (newGroups && newGroups.length > 0) {
        syncTournamentFromGroups(newGroups);
      }
    },
    { immediate: true },
  );

  const applyMatchesToGroup = (groupId: string, matches: Match[]) => {
    const entry = tournament.value.find((e) => e.data.id === groupId);
    if (!entry) return;
    entry.matches = matches;
    linkMatchTree(entry.matches);
  };

  const selectedGroup = computed(() => {
    if (tournament.value.length === 0) return null;
    const groupIdStr = route.query.group as string | undefined;
    const finalGroup = tournament.value.find(
      (d) =>
        d.data.type === GroupType.Final ||
        d.data.type?.toLowerCase() === 'final',
    );
    if (!groupIdStr) {
      return finalGroup ?? tournament.value[tournament.value.length - 1];
    }
    return (
      tournament.value.find((g) => g.data.id === groupIdStr) ??
      finalGroup ??
      tournament.value[tournament.value.length - 1]
    );
  });

  const fetchGroupData = async (groupId: string, forceMatches = false) => {
    const tournamentId =
      selectedTournamentId.value || route.params.id?.toString() || '';
    if (!tournamentId || !groupId) return;

    // 1. Fetch rounds for this group
    await roundsREQ.fetchREQ(tournamentId, groupId);
    if (roundsREQ.status.value === 'success' && roundsREQ.data?.value) {
      rounds.value = roundsREQ.data.value.rounds ?? [];
    }

    // 2. Fetch matches if not cached or forced
    const entry = tournament.value.find((e) => e.data.id === groupId);
    if (entry && entry.matches.length > 0 && !forceMatches) {
      return;
    }

    await matchesREQ.fetchREQ(tournamentId, groupId);
    if (matchesREQ.status.value === 'success' && matchesREQ.data?.value) {
      applyMatchesToGroup(groupId, matchesREQ.data.value);
    }
  };

  watch(
    () => selectedGroup.value?.data.id,
    async (newGroupId) => {
      if (newGroupId) {
        await fetchGroupData(newGroupId);
      }
    },
  );

  const closeConnection = () => {
    if (!connection.value) return;
    connection.value.stop();
  };

  const refreshBracket = async (_tournamentId: string) => {
    const sel = selectedGroup.value;
    if (!sel) return;

    const groupId = sel.data.id;
    bracketRefreshPending.value = true;
    try {
      await groupsREQ.refresh();

      const groups = groupsREQ.data.value?.groups;
      if (groups) syncTournamentFromGroups(groups);

      await fetchGroupData(groupId, true);
    } finally {
      bracketRefreshPending.value = false;
    }
  };

  const initStore = async () => {
    const tournamentId = route.params.id?.toString() || '';
    selectedTournamentId.value = tournamentId;

    tournament.value = [];
    await groupsREQ.refresh();
    if (groupsREQ.status?.value === 'error') return;

    const groups = groupsREQ.data.value?.groups ?? [];
    syncTournamentFromGroups(groups);

    const groupId = selectedGroup.value?.data.id;
    if (groupId) {
      await fetchGroupData(groupId, true);
    }

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
        id: matchData.data.value.state.id,
        game: matchData.data.value.state,
        statistics: matchData.data.value.statistics,
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
    const signalR = await import('@microsoft/signalr');
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
