export enum TournamentPrizeCurrency {
    USD = "USD",
    EGP = "EGP",
    SAR = "SAR",
    AED = "AED",
    EUR = "EUR",
    JOD = "JOD",
    KWD = "KWD",
    TRY = "TRY",
    GBP = "GBP",
  }
  export interface TournamentPrize {
    isFinancial: boolean;
    isNonFinancial: boolean;
    type: TournamentPrizeType;
    financialPrizeAmount: number;
    financialPrizeCurrency: TournamentPrizeCurrency;
    nonFinancialPrizes: string[];
  }
  export enum TournamentPrizeType {
    one = "One",
    two = "Two",
    three = "Three",
    four = "Four",
  }
  