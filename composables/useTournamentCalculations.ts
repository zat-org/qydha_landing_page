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
  const BASE_TIME_OF_MATCH = 30; // Base time for 1 sakka (minutes)

  /**
   * Calculate time per match based on sakka count
   * Formula: 30 + (sakka - 1) * 15
   * 1 sakka = 30 min, 3 sakka = 60 min, 5 sakka = 90 min
   */
  const calculateMatchTime = (sakkaCount: number): number => {
    return BASE_TIME_OF_MATCH + (sakkaCount - 1) * 15;
  };

  /**
   * Generate round name based on remaining teams
   */
  const generateRoundName = (remainingTeams: number): string => {
    if (remainingTeams === 2) return "النهائي";
    if (remainingTeams === 4) return "نصف النهائي";
    if (remainingTeams === 8) return "ربع النهائي";
    if (remainingTeams === 16) return "دور الـ16";
    if (remainingTeams === 32) return "دور الـ32";
    if (remainingTeams === 64) return "دور الـ64";
    if (remainingTeams === 128) return "دور الـ128";
    return `دور الـ${remainingTeams}`;
  };

  /**
   * Helper function to get sakka count for a specific round
   */
  const getSakkaForRound = (
    roundName: string,
    sakkaOptions: { group: string; sakka: string }[]
  ): number => {
    const sakkaOption = sakkaOptions.find(
      (option) => option.group === roundName
    );
    return sakkaOption ? parseInt(sakkaOption.sakka) : 1;
  };

  /**
   * Generate basic round structure (names and match counts) for tournament
   * This eliminates code duplication between different calculation functions
   */
  const generateRoundStructure = ( teamsCount: number ): Array<{ name: string; matches: number; remainingTeams: number }> => {
    if (teamsCount <= 1) return [];

    const rounds: Array<{
      name: string;
      matches: number;
      remainingTeams: number;
    }> = [];
    const nextPowerOf2 = Math.pow(2, Math.floor(Math.log2(teamsCount)));
    let remainingTeams = teamsCount;

    // Play-in round if needed
    if (teamsCount > nextPowerOf2) {
      rounds.push({
        name: "دور التأهل",
        matches: teamsCount - nextPowerOf2,
        remainingTeams,
      });
      remainingTeams = nextPowerOf2;
    }

    // Regular knockout rounds
    while (remainingTeams > 1) {
      const roundName = generateRoundName(remainingTeams);
      rounds.push({
        name: roundName,
        matches: remainingTeams / 2,
        remainingTeams,
      });
      remainingTeams = remainingTeams / 2;
    }

    return rounds;
  };

  /**
   * Calculate tournament rounds structure based on team count and sakka options
   */
  const calculateTournamentRounds = (
    teamsCount: number,
    tablesCount: number = 1,
    sakkaOptions: { group: string; sakka: string }[] = []
  ): TournamentRound[] => {
    const roundStructure = generateRoundStructure(teamsCount);

    return roundStructure.map((round) => {
      const tablesNeeded = Math.min(round.matches, tablesCount);
      const sakkaCount = getSakkaForRound(round.name, sakkaOptions);
      const matchTime = calculateMatchTime(sakkaCount);
      const timeNeeded = Math.ceil(round.matches / tablesCount) * matchTime;

      return {
        name: round.name,
        matches: round.matches,
        timeNeeded,
        tablesNeeded,
      };
    });
  };

  /**
   * Calculate sakka options for each round
   */
  const calculateSakkaOptions = (teamsCount: number): SakkaOption[] => {
    const roundStructure = generateRoundStructure(teamsCount);

    return roundStructure.map((round) => ({
      group: round.name,
      sakka: "1", // Default to 1 sakka
    }));
  };

  /**
   * Calculate total time needed for tournament with sakka considerations
   */
  const calculateTournamentTime = (
    teamsCount: number,
    tablesCount: number,
    sakkaOptions: { group: string; sakka: string }[] = []
  ): number => {
    const rounds = calculateTournamentRounds(
      teamsCount,
      tablesCount,
      sakkaOptions
    );
    return rounds.reduce((total, round) => total + round.timeNeeded, 0);
  };

  /**
   * Helper function to create a Date object from time string
   * Centralizes date creation pattern used across time calculations
   */
  const createTimeDate = (timeString: string): Date => {
    return new Date(`1970-01-01T${timeString}`);
  };

  /**
   * Helper function to calculate time difference between start and end time
   * Centralizes the time calculation logic to eliminate redundancy
   */
  const calculateTimeDifference = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    
    const start = createTimeDate(startTime);
    const end = createTimeDate(endTime);
    const diffMs = Math.abs(end.getTime() - start.getTime());
    return diffMs / (1000 * 60); // Convert to minutes
  };

  /**
   * Helper function to validate that start time is before end time
   * Reusable validation logic for time ranges
   */
  const isValidTimeRange = (startTime: string, endTime: string): boolean => {
    if (!startTime || !endTime) return true; // Skip validation if either is missing
    
    const start = createTimeDate(startTime);
    const end = createTimeDate(endTime);
    return start < end;
  };

  /**
   * Calculate available time for a specific day
   */
  const calculateDayAvailableTime = (date: TournamentDate): number => {
    return calculateTimeDifference(date.startTime, date.endTime);
  };

  /**
   * Calculate total available time from all tournament dates
   */
  const calculateAvailableTime = (
    tournamentDates: TournamentDate[]
  ): number => {
    return tournamentDates.reduce((totalMinutes, date) => {
      return totalMinutes + calculateDayAvailableTime(date);
    }, 0);
  };

  const calculateOptimalTables = (teamsCount: number): number => {
    const roundStructure = generateRoundStructure(teamsCount);

    if (roundStructure.length === 0) return 0;

    // Find the round with the maximum number of matches
    return Math.max(...roundStructure.map((round) => round.matches));
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
 
  /**
   * Validate if tournament time fits within available time
   */
  const validateTournamentTime = (
    teamsCount: number,
    tablesCount: number,
    tournamentDates: TournamentDate[],
    sakkaOptions: { group: string; sakka: string }[] = []
  ): { isValid: boolean; timeNeeded: number; timeAvailable: number } => {
    const timeNeeded = calculateTournamentTime(
      teamsCount,
      tablesCount,
      sakkaOptions
    );
    const timeAvailable = calculateAvailableTime(tournamentDates);

    return {
      isValid: timeNeeded <= timeAvailable,
      timeNeeded,
      timeAvailable,
    };
  };

  return {
    // Main calculation functions
    calculateTournamentRounds,
    calculateSakkaOptions,
    calculateTournamentTime,
    calculateAvailableTime,
    calculateOptimalTables,
    calculateTotalMatches,
    calculateDayAvailableTime,
    validateTournamentTime,
    calculateMatchTime,
    formatTime,

    // Helper utilities (exposed for reuse)
    generateRoundStructure,
    generateRoundName,
    getSakkaForRound,
    calculateTimeDifference,
    createTimeDate,
    isValidTimeRange,

    // Constants
    BASE_TIME_OF_MATCH,
    // Legacy support - kept for backward compatibility
    TIME_OF_MATCH: BASE_TIME_OF_MATCH,
  };
};
