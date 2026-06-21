import { useTournamentPhaseStore } from "~/store/tournamentPhase";
import {
  normalizeRoutePath,
  resolveOutletRouteForPhase,
} from "~/features/tournament/detail/utils/tournamentNavigation.utils";

export function useTournamentOutletRouteSync(
  tournamentId: MaybeRefOrGetter<string>,
) {
  const route = useRoute();
  const phaseStore = useTournamentPhaseStore();
  const { phaseView, context } = storeToRefs(phaseStore);

  watch(
    [context, phaseView, () => toValue(tournamentId), () => route.path],
    ([ctx, view, id]) => {
      if (!id || ctx.tournamentId !== id) return;

      const target = resolveOutletRouteForPhase(route, id, view.outlets);
      if (!target) return;

      const currentPath = normalizeRoutePath(route.path);
      const nextPath = normalizeRoutePath(target);
      if (currentPath === nextPath) return;

      navigateTo(target, { replace: true });
    },
    { immediate: true },
  );
}
