import type { UpdateJoinRequestSeetingsBody } from "~/features/tournament/models/tournament";

export function useUpdateJoinRequestSettings() {
  const { $api } = useNuxtApp();
  const { pending, status, error, execute } = useMutationRequest();

  const fetchREQ = async (
    tournamentId: string,
    body: UpdateJoinRequestSeetingsBody,
  ) => {
    await execute(async () => {
      await $api(`/tournaments/${tournamentId}/add-players-by-qydha`, {
        method: "PUT",
        body,
      });
      refreshNuxtData(`getSingelTournament-${tournamentId}`);
    });
  };

  return { pending, status, error, fetchREQ };
}
