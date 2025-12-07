const useTourCalc = () => {
  const rounds = ref<any[]>([]);
  const getNumberOfRounds = (teamCount: number, tabelCount: number): number => {
    const numberOfRounds = Math.ceil(Math.log2(teamCount));
    const allRounds: any[] = [];
    
    // Generate base rounds structure
    for (let index = 0; index < numberOfRounds; index++) {
      const matchesInRound =
        index == numberOfRounds - 1
          ? teamCount - Math.pow(2, index)
          : Math.pow(2, index);
      
      // If matches exceed table count, split into multiple sub-rounds
      if (matchesInRound > tabelCount && tabelCount > 0) {
        const subRoundsNeeded = Math.ceil(matchesInRound / tabelCount);
        
        for (let subRoundIndex = 0; subRoundIndex < subRoundsNeeded; subRoundIndex++) {
          const isLastSubRound = subRoundIndex === subRoundsNeeded - 1;
          
          // Calculate matches for this sub-round
          const matchesInSubRound = isLastSubRound
            ? matchesInRound - (subRoundIndex * tabelCount)
            : tabelCount;
          
          // Generate round name
          let roundName = `الدور ${index + 1}`;
          if (subRoundsNeeded > 1) {
            roundName += ` - الجزء ${subRoundIndex + 1}`;
          }
          
          allRounds.push({
            name: roundName,
            matches: matchesInSubRound,
            originalRoundIndex: index,
            subRoundIndex: subRoundIndex,
            isSplit: subRoundsNeeded > 1,
          });
        }
      } else {
        // No splitting needed, use original round
        allRounds.push({
          name: `الدور ${index + 1}`,
          matches: matchesInRound,
          originalRoundIndex: index,
          subRoundIndex: 0,
          isSplit: false,
        });
      }
    }
    
    rounds.value = allRounds;
    return allRounds.length;
  };
  return { getNumberOfRounds, rounds: readonly(rounds) };


};

export default useTourCalc;
