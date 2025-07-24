interface TournamentDate {
  date: string;
  startTime: string;
  endTime: string;
}

interface TournamentRound {
  name: string;
  matches: number;
  timeNeeded: number;
  tablesNeeded: number;
}

interface SakkaOption {
  group: string;
  sakka: string;
}

export const useTournamentCalculations = () => {
  const TIME_OF_MATCH = 30; // minutes per match

  /**
   * Calculate tournament rounds structure based on team count
   */
  const calculateTournamentRounds = (teamsCount: number, tablesCount: number = 1): TournamentRound[] => {
    if (teamsCount <= 1) return [];

    const rounds: TournamentRound[] = [];
    const nextPowerOf2 = Math.pow(2, Math.floor(Math.log2(teamsCount)));
    let remainingTeams = teamsCount;

    // Play-in round if needed
    if (teamsCount > nextPowerOf2) {
      const matches = teamsCount - nextPowerOf2;
      const tablesNeeded = Math.min(matches, tablesCount);
      const timeNeeded = Math.ceil(matches / tablesCount) * TIME_OF_MATCH;

      rounds.push({
        name: "دور التأهل",
        matches,
        timeNeeded,
        tablesNeeded
      });

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

      const matches = remainingTeams / 2;
      const tablesNeeded = Math.min(matches, tablesCount);
      const timeNeeded = Math.ceil(matches / tablesCount) * TIME_OF_MATCH;

      rounds.push({
        name: roundName,
        matches,
        timeNeeded,
        tablesNeeded
      });

      remainingTeams = remainingTeams / 2;
    }

    return rounds;
  };

  /**
   * Calculate sakka options for each round
   */
  const calculateSakkaOptions = (teamsCount: number): SakkaOption[] => {
    if (teamsCount <= 1) return [];

    const sakkaOptions: SakkaOption[] = [];
    const nextPowerOf2 = Math.pow(2, Math.floor(Math.log2(teamsCount)));
    let remainingTeams = teamsCount;

    // First round: Play-in games if needed
    if (teamsCount > nextPowerOf2) {
      sakkaOptions.push({
        group: "دور التأهل",
        sakka: "1"
      });
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

      sakkaOptions.push({
        group: roundName,
        sakka: "1"
      });

      remainingTeams = remainingTeams / 2;
    }

    return sakkaOptions;
  };

  /**
   * Calculate total time needed for tournament
   */
  const calculateTournamentTime = (teamsCount: number, tablesCount: number): number => {
    if (teamsCount <= 1 || tablesCount <= 0) return 0;

    const nextPowerOf2 = Math.pow(2, Math.floor(Math.log2(teamsCount)));
    let remainingTeams = teamsCount;
    let totalTimeSlots = 0;

    // First round: Play-in games if needed
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

    return totalTimeSlots * TIME_OF_MATCH;
  };

  /**
   * Calculate available time from tournament dates
   */
  const calculateAvailableTime = (tournamentDates: TournamentDate[]): number => {
    let totalMinutes = 0;

    tournamentDates.forEach(date => {
      if (date.startTime && date.endTime) {
        const startTime = new Date(`1970-01-01T${date.startTime}`);
        const endTime = new Date(`1970-01-01T${date.endTime}`);
        const diffMs = Math.abs(endTime.getTime() - startTime.getTime());
        const diffMinutes = diffMs / (1000 * 60);
        totalMinutes += diffMinutes;
      }
    });

    return totalMinutes;
  };

  /**
   * Calculate optimal number of tables for tournament
   */
  const calculateOptimalTables = (teamsCount: number): number => {
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
  };

  /**
   * Calculate total number of matches in tournament
   */
  const calculateTotalMatches = (rounds: TournamentRound[]): number => {
    return rounds.reduce((total, round) => total + round.matches, 0);
  };

  /**
   * Format time in hours and minutes
   */
  const formatTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}د`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (remainingMinutes === 0) {
      return `${hours}س`;
    }
    return `${hours}س ${remainingMinutes}د`;
  };

  /**
   * Calculate available time for a specific day
   */
  const calculateDayAvailableTime = (date: TournamentDate): number => {
    if (!date.startTime || !date.endTime) return 0;

    const startTime = new Date(`1970-01-01T${date.startTime}`);
    const endTime = new Date(`1970-01-01T${date.endTime}`);
    const diffMs = Math.abs(endTime.getTime() - startTime.getTime());
    return diffMs / (1000 * 60); // Convert to minutes
  };

  /**
   * Validate if tournament time fits within available time
   */
  const validateTournamentTime = (
    teamsCount: number, 
    tablesCount: number, 
    tournamentDates: TournamentDate[]
  ): { isValid: boolean; timeNeeded: number; timeAvailable: number } => {
    const timeNeeded = calculateTournamentTime(teamsCount, tablesCount);
    const timeAvailable = calculateAvailableTime(tournamentDates);
    
    return {
      isValid: timeNeeded <= timeAvailable,
      timeNeeded,
      timeAvailable
    };
  };

  return {
    calculateTournamentRounds,
    calculateSakkaOptions,
    calculateTournamentTime,
    calculateAvailableTime,
    calculateOptimalTables,
    calculateTotalMatches,
    calculateDayAvailableTime,
    validateTournamentTime,
    formatTime,
    TIME_OF_MATCH
  };
}; 