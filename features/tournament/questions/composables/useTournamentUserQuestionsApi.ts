import type {
  GetTournamentUserQuestionsParams,
  PagedList,
  TournamentUserQuestion,
} from "~/features/tournament/models/userQuestion";

function buildQuestionsQuery(p: GetTournamentUserQuestionsParams): Record<string, string> {
  const query: Record<string, string> = {
    pageNumber: String(p.pageNumber),
    pageSize: String(p.pageSize),
  };
  if (p.searchToken) {
    query.searchToken = p.searchToken;
  }
  return query;
}

async function refreshQuestionsList(
  tour_id: string,
  params: GetTournamentUserQuestionsParams,
) {
  await refreshAppData(appKeys.tournamentUserQuestions(tour_id, params));
}

export const useTournamentUserQuestionsApi = () => {
  const { $api } = useNuxtApp();

  const getQuestions = (
    tour_id: string,
    params: Ref<GetTournamentUserQuestionsParams>,
  ) => {
    return useAppApiData<PagedList<TournamentUserQuestion>>(
      () =>
        appKeys.tournamentUserQuestions(tour_id, unref(params)),
      () =>
        $api(`/tournaments/${tour_id}/questions`, {
          query: buildQuestionsQuery(unref(params)),
        }),
    );
  };

  const answerQuestion = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      question_id: string,
      params: GetTournamentUserQuestionsParams,
    ) => {
      await execute(async () => {
        await $api(
          `/tournaments/${tour_id}/questions/${question_id}/answer`,
          { method: "patch" },
        );
        await refreshQuestionsList(tour_id, params);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const deleteQuestion = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      question_id: string,
      params: GetTournamentUserQuestionsParams,
    ) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/questions/${question_id}`, {
          method: "delete",
        });
        await refreshQuestionsList(tour_id, params);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return { getQuestions, answerQuestion, deleteQuestion };
};
