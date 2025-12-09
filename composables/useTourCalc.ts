export const useTourCalc = () => {
const teamsCount = ref(0);
const tablesCount = ref(0);
const sakkTime = ref(30); // Time for 1 sakka
const sakkTime3 = ref(90); // Time for 3 sakkas
const sakkTime5 = ref(150); // Time for 5 sakkas

// Helper function to get time based on sakkanumber
const getSakkTime = (sakkanumber: number): number => {
  switch (sakkanumber) {
    case 1:
      return sakkTime.value;
    case 3:
      return sakkTime3.value;
    case 5:
      return sakkTime5.value;
    default:
      return sakkTime.value;
  }
};

// Store sakkanumber for each round (key: round array index, value: sakkanumber)
const rounds = ref<
{
  id:number;
  name:string;
  matches:number;
  level:number;
  sakkanumber:number;
  Time:number;
  waves:number; // Number of waves/batches needed to play all matches
}[]
>([])
;
// Calculate rounds without splitting - calculate time based on table capacity
const calculateRounds = () => {
  if (teamsCount.value <= 0 || tablesCount.value <= 0) {
    rounds.value = [];
    return;
  }
  
  const numberOfRounds = Math.ceil(Math.log2(teamsCount.value));
  const allRounds: {
    id:number;
    name:string;
    matches:number;
    level:number;
    sakkanumber:number;
    Time:number;
    waves:number;
  }[] = [];
  let roundCounter = 1; // Counter for sequential round numbering
  
  // Generate base rounds structure
  for (let index = 0; index < numberOfRounds; index++) {
    const matchesInRound =
      index == numberOfRounds - 1    // last round 
        ? teamsCount.value - Math.pow(2, index) // remaining teams
        : Math.pow(2, index); // matches in round
    
    // Calculate how many waves/batches are needed to play all matches
    // Each wave can play as many matches as we have tables
    const wavesNeeded = tablesCount.value > 0 
      ? Math.ceil(matchesInRound / tablesCount.value) 
      : 1;
    
    // Calculate time: waves × timeForSakkanumber
    // Initially sakkanumber is 1, but user can change it
    const initialSakkanumber = 1;
    const timeForRound = wavesNeeded * getSakkTime(initialSakkanumber);
    
    // Generate round name - sequential numbering
    const roundName = roundCounter == 1 
      ? 'الدور النهائي' 
      : roundCounter == 2 
      ? 'نصف النهائي' 
      : roundCounter == 3 
      ? 'ربع النهائي' 
      : `الدور ${roundCounter}`;
    
    allRounds.push({
      id: roundCounter,
      name: roundName,
      matches: matchesInRound,
      level: index,
      sakkanumber: initialSakkanumber,
      Time: timeForRound,
      waves: wavesNeeded,
    });
    
    roundCounter++; // Increment for next round
  }
  
  rounds.value = allRounds;
};
// Recalculate rounds when teamsCount or tablesCount changes
watch([teamsCount, tablesCount], () => {
  calculateRounds();
}, { immediate: true })

// Update time when sakkTime, sakkTime3, or sakkTime5 changes (preserve sakkanumber values)
watch([sakkTime, sakkTime3, sakkTime5], () => {
  rounds.value.forEach(round => {
    // Time = waves × timeForSakkanumber
    round.Time = round.waves * getSakkTime(round.sakkanumber);
  });
}, { immediate: true })

// Recalculate time for each round when sakkanumber changes
watch(() => rounds.value.map(round => round.sakkanumber), () => {
  rounds.value.forEach(round => {
    // Time = waves × timeForSakkanumber
    round.Time = round.waves * getSakkTime(round.sakkanumber);
  });
}, { deep: true, immediate: true })

const totalTime = computed(() => {
return rounds.value.reduce((total, round) => total + round.Time, 0);
})
const totalMatches = computed(() => {
  return teamsCount.value-1;
})







return { 
  rounds, 
  teamsCount, 
  tablesCount, 
  sakkTime,
  sakkTime3,
  sakkTime5,
  totalTime,
  totalMatches,
};
}