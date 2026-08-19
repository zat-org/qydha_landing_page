import { defineStore } from "pinia";
import { GroupType } from "~/features/tournament/models/group";
import type { DetailTournament } from "~/features/tournament/models/tournament";
import type {
  PhaseAction,
  PhaseStateConfig,
  TournamentPhaseContext,
} from "~/features/tournament/detail/types/phase.types";
import { getPhaseConfig } from "../tournamentPhase.config";

export function buildPhaseContextFromTour(
  tour: DetailTournament,
  isAdmin: boolean,
): TournamentPhaseContext {
  const finalGroup = tour.tournament.groups?.find(
    (g) => g.type === GroupType.Final,
  );

  return {
    tournamentId: tour.tournament.id,
    isAdmin,
    detailedState: tour.tournament.detailedState,
    tournamentState: tour.tournament.state,
    finalGroupState: finalGroup?.state,
    hasQualificationsStage: tour.tournament.hasQualificationsStage,
  };
}

const emptyContext: TournamentPhaseContext = {
  tournamentId: "",
  isAdmin: false,
};

export const useTournamentPhaseStore = defineStore("tournamentPhase", () => {
  const context = ref<TournamentPhaseContext>({ ...emptyContext });

  const phaseConfig = computed<PhaseStateConfig>(() =>
    getPhaseConfig(context.value.detailedState),
  );

  const visibleActions = computed<PhaseAction[]>(() =>
    phaseConfig.value.actions.filter((action) =>
      action.canExecute(context.value),
    ),
  );

  const phaseLabel = computed(() => phaseConfig.value.label);

  function syncFromTour(tour: DetailTournament, isAdmin: boolean) {
    context.value = buildPhaseContextFromTour(tour, isAdmin);
  }

  function syncContext(next: TournamentPhaseContext) {
    context.value = next;
  }

  function reset() {
    context.value = { ...emptyContext };
  }

  return {
    context,
    phaseConfig,
    visibleActions,
    phaseLabel,
    syncContext,
    syncFromTour,
    reset,
  };
});
