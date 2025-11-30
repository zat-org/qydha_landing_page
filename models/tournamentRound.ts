export interface TournamentRoundUpdate {
  startAt: string;
  gameSettings: {
    isFlipped: boolean;
    isAdvancedRecording: boolean;
    isSakkahMashdodahMode: boolean;
    showWhoWonDialogOnDraw: boolean;
    isNumbersSoundEnabled: boolean;
    isCommentsSoundEnabled: boolean;
    isEkakShown: boolean;
    isAklatShown: boolean;
    sakkasCount: number;
    isVoiceRecording: boolean;
  };
}
