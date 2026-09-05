import { defineStore } from 'pinia';
import type { HubConnection } from '@microsoft/signalr';
import {
  type Group,
  type Match,
  type RoundGroupDetails,
  parseGroupMatchesPayload,
} from '~/features/tournament/models/group';
import type { IMatchData, IMathStat } from '~/features/tournament/models/MatchStat';
import { useGroup } from '~/features/tournament/group/composables/group';
import { useMatch } from '~/features/tournament/shared/composables/match';
import { useMyAuthStore } from '~/store/Auth';
import {
  bracketGroupsProbeOrder,
  defaultBracketGroup,
  hasRequesterMatches,
  lastRequesterMatchId,
} from '~/features/tournament/bracket/utils/defaultBracketGroup';

export const useTournamentBracketStore = defineStore('tournamentBracket', () => {
  const route = useRoute();
  const router = useRouter();
  const authStore = useMyAuthStore();
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
    const previousById = new Map(
      tournament.value.map((entry) => [entry.data.id, entry]),
    );

    tournament.value = groups.map((g) => {
      const previous = previousById.get(g.id);
      return {
        data: {
          ...g,
          requesterMatchIds:
            g.requesterMatchIds?.length
              ? g.requesterMatchIds
              : previous?.data.requesterMatchIds,
        },
        matches: previous?.matches ?? [],
      };
    });
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

  const applyMatchesToGroup = (
    groupId: string,
    matches: Match[],
    requesterMatchIds?: string[],
  ) => {
    const entry = tournament.value.find((e) => e.data.id === groupId);
    if (!entry) return;
    entry.matches = matches;
    if (requesterMatchIds !== undefined) {
      entry.data.requesterMatchIds = requesterMatchIds;
    }
    linkMatchTree(entry.matches);
  };

  const selectedGroup = computed(() => {
    if (tournament.value.length === 0) return null;
    const fallbackId = defaultBracketGroup(
      tournament.value.map((entry) => entry.data),
    )?.id;
    const fallback =
      tournament.value.find((entry) => entry.data.id === fallbackId) ??
      tournament.value[0];
    const groupIdStr = route.query.group as string | undefined;
    if (!groupIdStr) return fallback;
    return (
      tournament.value.find((g) => g.data.id === groupIdStr) ?? fallback
    );
  });

  const isRequesterMatch = (matchId: string) => {
    const ids = selectedGroup.value?.data.requesterMatchIds ?? [];
    return ids.some((id) => String(id) === String(matchId));
  };

  const requesterGroup = computed(() => {
    const groups = tournament.value.map((entry) => entry.data);
    const target = defaultBracketGroup(groups);
    return target && hasRequesterMatches(target) ? target : undefined;
  });

  const myMatchId = computed(() =>
    lastRequesterMatchId(requesterGroup.value?.requesterMatchIds),
  );

  const myMatchFocusNonce = ref(0);

  const goToMyMatch = async () => {
    const group = requesterGroup.value;
    const matchId = myMatchId.value;
    if (!group || !matchId) return;
    await syncGroupQuery(group.id);
    myMatchFocusNonce.value += 1;
  };

  const loadMatchesForGroup = async (
    tournamentId: string,
    groupId: string,
    forceMatches = false,
  ) => {
    const entry = tournament.value.find((e) => e.data.id === groupId);
    if (entry && entry.matches.length > 0 && !forceMatches) {
      return;
    }

    await matchesREQ.fetchREQ(tournamentId, groupId);
    if (matchesREQ.status.value === 'success' && matchesREQ.data?.value) {
      const payload = parseGroupMatchesPayload(matchesREQ.data.value);
      applyMatchesToGroup(groupId, payload.matches, payload.requesterMatchIds);
    }
  };

  const fetchGroupData = async (groupId: string, forceMatches = false) => {
    const tournamentId =
      selectedTournamentId.value || route.params.id?.toString() || '';
    if (!tournamentId || !groupId) return;

    // 1. Fetch rounds only for admin, staff, or organizer
    const canLoadRounds = !!authStore.isAdmin || !!authStore.isOrganizer;
    if (canLoadRounds) {
      await roundsREQ.fetchREQ(tournamentId, groupId);
      if (roundsREQ.status.value === 'success' && roundsREQ.data?.value) {
        rounds.value = roundsREQ.data.value.rounds ?? [];
      }
    } else {
      rounds.value = [];
      selectedRound.value = undefined;
    }

    await loadMatchesForGroup(tournamentId, groupId, forceMatches);
  };

  const syncGroupQuery = async (groupId: string) => {
    if (route.query.group === groupId) return;
    await router.replace({
      path: route.path,
      query: { ...route.query, group: groupId },
    });
  };

  const resolveInitialGroupId = async (tournamentId: string) => {
    const groups = () => tournament.value.map((entry) => entry.data);

    let target = defaultBracketGroup(groups());
    if (authStore.user) {
      if (target && hasRequesterMatches(target)) {
        return target.id;
      }

      for (const group of bracketGroupsProbeOrder(groups())) {
        await loadMatchesForGroup(tournamentId, group.id, true);
        target = defaultBracketGroup(groups());
        if (target && hasRequesterMatches(target)) {
          return target.id;
        }
      }
    }

    const queryGroup = route.query.group as string | undefined;
    if (queryGroup && tournament.value.some((entry) => entry.data.id === queryGroup)) {
      return queryGroup;
    }

    return target?.id;
  };

  const skipSelectedGroupWatch = ref(false);

  watch(
    () => selectedGroup.value?.data.id,
    async (newGroupId) => {
      if (skipSelectedGroupWatch.value || !newGroupId) return;
      await fetchGroupData(newGroupId);
    },
  );

  watch(
    () => ({
      hasGroups: tournament.value.length > 0,
      queryGroup: route.query.group,
    }),
    ({ hasGroups, queryGroup }) => {
      if (!hasGroups || queryGroup) return;
      const target = defaultBracketGroup(
        tournament.value.map((entry) => entry.data),
      );
      if (!target) return;
      router.replace({
        path: route.path,
        query: { ...route.query, group: target.id },
      });
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

    skipSelectedGroupWatch.value = true;
    try {
      tournament.value = [];
      await groupsREQ.refresh();
      if (groupsREQ.status?.value === 'error') return;

      const groups = groupsREQ.data.value?.groups ?? [];
      syncTournamentFromGroups(groups);

      const groupId = await resolveInitialGroupId(tournamentId);
      if (groupId) {
        await syncGroupQuery(groupId);
        await fetchGroupData(groupId, false);
      }
      if (myMatchId.value) {
        myMatchFocusNonce.value += 1;
      }
    } finally {
      skipSelectedGroupWatch.value = false;
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
  const handleBracketChanged = (
    groupId: string,
    groupMatchesJson: string,
    requesterMatchIds?: string[],
  ) => {
    applyMatchesToGroup(
      groupId,
      JSON.parse(groupMatchesJson) as Match[],
      requesterMatchIds ?? [],
    );
  };
  const handleBracketUpdated = (
    groupId: string,
    groupMatches: string,
    requesterMatchIds?: string[],
  ) => {
    applyMatchesToGroup(
      groupId,
      JSON.parse(groupMatches) as Match[],
      requesterMatchIds ?? [],
    );
  };
  const joinTournamentGroup = async (
    conn: HubConnection,
    tournamentId: string,
  ) => {
    await conn.invoke('AddToTournamentGroup', tournamentId);
  };
  const initWebsocket = async (tournamentId: string) => {
    const signalR = await import('@microsoft/signalr');
    const config = useRuntimeConfig();
    const conn = new signalR.HubConnectionBuilder()
      .withUrl(`${config.public.qydhaapiBase}/tournaments-hub`, {
        accessTokenFactory: () => authStore.user?.jwtToken ?? '',
      })
      .withAutomaticReconnect()
      .build();

    conn.on('MatchStateChanged', handleMatchStateChanged);
    conn.on('TournamentBracketChanged', handleBracketChanged);
    conn.on('braket updated', handleBracketUpdated);
    conn.onreconnected(async () => {
      await joinTournamentGroup(conn, tournamentId);
    });

    try {
      await conn.start();
      await joinTournamentGroup(conn, tournamentId);
    } catch (error) {
      console.log('errror', error);
    }
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
    isRequesterMatch,
    myMatchId,
    myMatchFocusNonce,
    goToMyMatch,
    games,
    fetchGame,
    closeConnection,
    groupsREQ,
    rounds,
    selectedRound,
    handleRoundSelection,
  };
});
