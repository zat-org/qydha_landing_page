import type {
  TournamentFaq,
  TournamentFaqInput,
} from "~/features/tournament/models/faq";

async function refreshFaqs(tour_id: string) {
  await refreshAppData(appKeys.tournamentFaqs(tour_id));
}

export const useTournamentFaqsApi = () => {
  const { $api } = useNuxtApp();

  const getFaqs = (tour_id: string) => {
    return useAppApiData<TournamentFaq[]>(
      appKeys.tournamentFaqs(tour_id),
      () => $api(`/tournaments/${tour_id}/faqs`),
    );
  };

  const createFaq = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, body: TournamentFaqInput) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/faqs`, {
          method: "post",
          body,
        });
        await refreshFaqs(tour_id);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const updateFaq = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (
      tour_id: string,
      faq_id: string,
      body: TournamentFaqInput,
    ) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/faqs/${faq_id}`, {
          method: "put",
          body,
        });
        await refreshFaqs(tour_id);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  const deleteFaq = () => {
    const { pending, status, error, execute } = useMutationRequest();

    const fetchREQ = async (tour_id: string, faq_id: string) => {
      await execute(async () => {
        await $api(`/tournaments/${tour_id}/faqs/${faq_id}`, {
          method: "delete",
        });
        await refreshFaqs(tour_id);
      });
    };

    return { pending, status, error, fetchREQ };
  };

  return { getFaqs, createFaq, updateFaq, deleteFaq };
};
