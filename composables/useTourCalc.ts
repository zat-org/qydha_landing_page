const useTourCalc = () => {
    const teamsCount = ref(0);
    const tablesCount = ref(0);
    const sakkTime = ref(30);
    
    // Store sakkanumber for each round (key: round array index, value: sakkanumber)
    const rounds = ref<any[]>([]);
    // Computed rounds that automatically recalculate when teamsCount, tablesCount, sakkTime, or roundSakkanumbers change
  const calculateRounds = () => {
      if (teamsCount.value <= 0 || tablesCount.value <= 0) {
        return [];
      }
      const numberOfRounds = Math.ceil(Math.log2(teamsCount.value));
      const allRounds: any[] = [];
      let roundCounter = 1; // Counter for sequential round numbering
      let arrayIndex = 0; // Track the array index for each round
      
      // Generate base rounds structure
      for (let index = 0; index < numberOfRounds; index++) {
        const matchesInRound =
          index == numberOfRounds - 1    // last round 
            ? teamsCount.value - Math.pow(2, index) // remaining teams
            : Math.pow(2, index); // matches in round
        
        // If matches exceed table count, split into multiple rounds
        if (matchesInRound > tablesCount.value && tablesCount.value > 0) {
          const subRoundsNeeded = Math.ceil(matchesInRound / tablesCount.value); // number of sub rounds needed
          
          for (let subRoundIndex = 0; subRoundIndex < subRoundsNeeded; subRoundIndex++) {
            const isLastSubRound = subRoundIndex === subRoundsNeeded - 1; // last sub round 
            
            // Calculate matches for this round
            const matchesInSubRound = isLastSubRound
                  ? matchesInRound - (subRoundIndex * tablesCount.value) // remaining matches
              : tablesCount.value; // matches in sub round
            
            // Generate round name - sequential numbering
            allRounds.push({
              id:roundCounter,
              name:roundCounter==1? ' الدور النهائي':  roundCounter==2? 'نصف النهائي':  roundCounter==3? 'ربع النهائي': `الدور ${roundCounter}`,
              matches: matchesInSubRound,
              level: index,
              // subRoundIndex: subRoundIndex,
              sakkanumber: 1,
              Time: 1 * sakkTime.value,
              // isSplit: subRoundsNeeded > 1,
            });
            
            roundCounter++; // Increment for next round
            arrayIndex++; // Increment array index
          }
        } else {
          // No splitting needed, use original round
          // const sakkanumber = roundSakkanumbers.value[arrayIndex] ?? 1; // Use stored value or default to 1
          allRounds.push({
            id:roundCounter,
            name:roundCounter==1? ' الدور النهائي':  roundCounter==2? 'نصف النهائي':  roundCounter==3? 'ربع النهائي': `الدور ${roundCounter}`,
            matches: matchesInRound,
            level: index,
            // subRoundIndex: 0,
            sakkanumber: 1,
            Time: 1 * sakkTime.value,
            // isSplit: false,
          });          
          roundCounter++; // Increment for next round
          arrayIndex++; // Increment array index
        }
      }
      rounds.value = allRounds;
      // return allRounds;
    };
    watch([teamsCount, tablesCount, sakkTime], () => {
      calculateRounds();
    },{immediate: true})
    
watch(()=>rounds.value.map(round => round.sakkanumber), () => {
  rounds.value.forEach(round => {
    round.Time = round.sakkanumber * sakkTime.value;
  })
},{deep: true, immediate: true})

const totalTime = computed(() => {
  return rounds.value.reduce((total, round) => total + round.Time, 0);
})

    return { 
      rounds, 
      teamsCount, 
      tablesCount, 
      sakkTime,
      totalTime
    };


};

export default useTourCalc;
