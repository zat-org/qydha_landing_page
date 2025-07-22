interface TournamentData {
  TeamsCount: number;
  TablesCount: number;
  TournamentDates: { date: string; startTime: string; endTime: string }[];
}

interface TournamentCalculations {
  bestNumberOfTables: ComputedRef<number>;
  bestTime: ComputedRef<number>;
  availableTime: ComputedRef<number>;
  sakkaOptions: ComputedRef<{ group: string; sakka: string }[]>;
  isTimeValid: ComputedRef<boolean>;
}

export const useTournamentCalculations = (
  tournamentData: Ref<TournamentData>
): TournamentCalculations => {
  const timeOfMatch = 30; // minutes

  // Calculate optimal number of tables
  const bestNumberOfTables = computed(() => {
    const teamsCount = tournamentData.value.TeamsCount;
    if (teamsCount <= 1) return 0;

    const nextPowerOf2 = Math.pow(2, Math.floor(Math.log2(teamsCount)));
    let maxMatches = 0;
    let remainingTeams = teamsCount;

    // Play-in round if needed
    if (teamsCount > nextPowerOf2) {
      maxMatches = Math.max(maxMatches, teamsCount - nextPowerOf2);
      remainingTeams = nextPowerOf2;
    }

    // Regular rounds
    while (remainingTeams > 1) {
      maxMatches = Math.max(maxMatches, remainingTeams / 2);
      remainingTeams = remainingTeams / 2;
    }

    return maxMatches;
  });

  // Calculate time needed for tournament
  const bestTime = computed(() => {
    const teamsCount = tournamentData.value.TeamsCount;
    const tablesCount = tournamentData.value.TablesCount;

    if (teamsCount <= 1 || tablesCount <= 0) return 0;

    const nextPowerOf2 = Math.pow(2, Math.floor(Math.log2(teamsCount)));
    let remainingTeams = teamsCount;
    let totalTimeSlots = 0;

    // Play-in games if needed
    if (teamsCount > nextPowerOf2) {
      const playInMatches = teamsCount - nextPowerOf2;
      const playInTimeSlots = Math.ceil(playInMatches / tablesCount);
      totalTimeSlots += playInTimeSlots;
      remainingTeams = nextPowerOf2;
    }

    // Regular knockout rounds
    while (remainingTeams > 1) {
      const matchesThisRound = remainingTeams / 2;
      const timeSlotsThisRound = Math.ceil(matchesThisRound / tablesCount);
      totalTimeSlots += timeSlotsThisRound;
      remainingTeams = remainingTeams / 2;
    }

    return totalTimeSlots * timeOfMatch;
  });

  // Calculate available time
  const availableTime = computed(() => {
    let totalMinutes = 0;

    tournamentData.value.TournamentDates.forEach(date => {
      if (date.startTime && date.endTime) {
        const startTime = new Date(`1970-01-01T${date.startTime}`);
        const endTime = new Date(`1970-01-01T${date.endTime}`);
        const diffMs = Math.abs(endTime.getTime() - startTime.getTime());
        const diffMinutes = diffMs / (1000 * 60);
        totalMinutes += diffMinutes;
      }
    });

    return totalMinutes;
  });

  // Calculate sakka options
  const sakkaOptions = computed(() => {
    const teamsCount = tournamentData.value.TeamsCount;
    if (teamsCount <= 1) return [];

    const nextPowerOf2 = Math.pow(2, Math.floor(Math.log2(teamsCount)));
    const options: { group: string; sakka: string }[] = [];
    let remainingTeams = teamsCount;

    // Play-in round if needed
    if (teamsCount > nextPowerOf2) {
      options.push({ group: "دور التأهل", sakka: "1" });
      remainingTeams = nextPowerOf2;
    }

    // Regular knockout rounds
    while (remainingTeams > 1) {
      let roundName = "";
      if (remainingTeams === 2) roundName = "النهائي";
      else if (remainingTeams === 4) roundName = "نصف النهائي";
      else if (remainingTeams === 8) roundName = "ربع النهائي";
      else if (remainingTeams === 16) roundName = "دور الـ16";
      else if (remainingTeams === 32) roundName = "دور الـ32";
      else if (remainingTeams === 64) roundName = "دور الـ64";
      else if (remainingTeams === 128) roundName = "دور الـ128";
      else roundName = `دور الـ${remainingTeams}`;

      options.push({ group: roundName, sakka: "1" });
      remainingTeams = remainingTeams / 2;
    }

    return options;
  });

  // Check if time is valid
  const isTimeValid = computed(() => {
    return bestTime.value <= availableTime.value;
  });

  return {
    bestNumberOfTables,
    bestTime,
    availableTime,
    sakkaOptions,
    isTimeValid,
  };
}; 