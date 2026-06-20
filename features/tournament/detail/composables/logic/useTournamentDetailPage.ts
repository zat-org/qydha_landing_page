import { GroupType } from "~/features/tournament/models/group";
import {
  TournamentState,
  type DetailTournament,
} from "~/features/tournament/models/tournament";

export async function useTournamentDetailPage(tournamentId: string) {
  const { getSingelTournament } = useSingleTournament();
  const getREQ = await getSingelTournament(tournamentId);

  const pending = computed(() => getREQ.pending.value);
  const tour = computed(() => getREQ.data.value);

  const refresh = async () => {
    await getREQ.refresh();
  };

  const finalGroup = computed(() =>
    tour.value?.tournament?.groups?.find((g) => g.type === GroupType.Final),
  );

  const detailedState = computed(() => tour.value?.tournament?.detailedState);

  const winnersSorted = computed(() =>
    [...(tour.value?.tournament?.winners ?? [])].sort(
      (a, b) => a.order - b.order,
    ),
  );

  const showWinnersSection = computed(
    () =>
      tour.value?.tournament?.state === TournamentState.Finished &&
      winnersSorted.value.length > 0,
  );

  return {
    pending,
    tour,
    refresh,
    finalGroup,
    detailedState,
    winnersSorted,
    showWinnersSection,
  };
}

export type TournamentDetailPage = Awaited<
  ReturnType<typeof useTournamentDetailPage>
>;
