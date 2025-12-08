const useTourCalc = () => {
    const teamsCount = ref(0);
    const tablesCount = ref(0);
    const sakkTime = ref(30);
    
    // Store sakkanumber for each round (key: round array index, value: sakkanumber)
    const roundSakkanumbers = ref<Record<number, number>>({});
    
    // Computed rounds that automatically recalculate when teamsCount, tablesCount, sakkTime, or roundSakkanumbers change
    const rounds = computed(() => {
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
          index == numberOfRounds - 1
            ? teamsCount.value - Math.pow(2, index)
            : Math.pow(2, index);
        
        // If matches exceed table count, split into multiple rounds
        if (matchesInRound > tablesCount.value && tablesCount.value > 0) {
          const subRoundsNeeded = Math.ceil(matchesInRound / tablesCount.value);
          
          for (let subRoundIndex = 0; subRoundIndex < subRoundsNeeded; subRoundIndex++) {
            const isLastSubRound = subRoundIndex === subRoundsNeeded - 1;
            
            // Calculate matches for this round
            const matchesInSubRound = isLastSubRound
                  ? matchesInRound - (subRoundIndex * tablesCount.value)
              : tablesCount.value;
            
            // Generate round name - sequential numbering
            const sakkanumber = roundSakkanumbers.value[arrayIndex] ?? 1; // Use stored value or default to 1
            allRounds.push({
              name: `الدور ${roundCounter}`,
              matches: matchesInSubRound,
              originalRoundIndex: index,
              subRoundIndex: subRoundIndex,
              sakkanumber: sakkanumber,
              Time: sakkanumber * sakkTime.value,
              isSplit: subRoundsNeeded > 1,
            });
            
            roundCounter++; // Increment for next round
            arrayIndex++; // Increment array index
          }
        } else {
          // No splitting needed, use original round
          const sakkanumber = roundSakkanumbers.value[arrayIndex] ?? 1; // Use stored value or default to 1
          allRounds.push({
            name: `الدور ${roundCounter}`,
            matches: matchesInRound,
            originalRoundIndex: index,
            subRoundIndex: 0,
            sakkanumber: sakkanumber,
            Time: sakkanumber * sakkTime.value,
            isSplit: false,
          });
          
          roundCounter++; // Increment for next round
          arrayIndex++; // Increment array index
        }
      }
      
      return allRounds;
    });
    
    // Function to update sakkanumber for a specific round by its array index
    const setRoundSakkanumber = (roundIndex: number, sakkanumber: number) => {
      if (roundIndex >= 0 && roundIndex < rounds.value.length) {
        roundSakkanumbers.value[roundIndex] = sakkanumber;
      }
    };

    const getNumberOfRounds = (): number => {
      return rounds.value.length;
    };

    return { 
      getNumberOfRounds, 
      rounds: readonly(rounds), 
      teamsCount, 
      tablesCount, 
      sakkTime,
      setRoundSakkanumber 
    };


};

export default useTourCalc;
