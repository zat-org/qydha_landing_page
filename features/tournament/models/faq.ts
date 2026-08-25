export type TournamentFaqInput = {
  question: string;
  answer: string;
  appearOrder: number;
};

export type TournamentFaq = {
  id: string;
  tournamentId: string;
  question: string;
  answer: string;
  appearOrder: number;
};

export type TournamentFaqDashboard = TournamentFaq & {
  createdBy: {
    id: string;
    username: string;
    name: string | null;
  };
  createdAt: string;
};

export function createEmptyTournamentFaqInput(
  appearOrder = 0,
  initial?: Partial<Pick<TournamentFaqInput, "question" | "answer">>,
): TournamentFaqInput {
  return {
    question: initial?.question ?? "",
    answer: initial?.answer ?? "",
    appearOrder,
  };
}
