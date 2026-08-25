export type TournamentUserQuestionSender = {
  id: string;
  username: string;
  name: string | null;
  avatarUrl: string | null;
};

export type TournamentUserQuestion = {
  id: string;
  tournamentId: string;
  question: string;
  sentBy: TournamentUserQuestionSender;
  sentAt: string;
  answeredAt: string | null;
};

export type PagedList<T> = {
  items: T[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
};

export type GetTournamentUserQuestionsParams = {
  pageNumber: number;
  pageSize: number;
  searchToken?: string | null;
};
