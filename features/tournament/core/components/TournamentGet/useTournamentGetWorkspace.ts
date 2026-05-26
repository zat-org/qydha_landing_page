import type { InjectionKey, Ref } from 'vue';
import type { TournamentOutletView } from './useTournamentPhaseNavigation';

export type { TournamentOutletView };

/** @deprecated Use TournamentOutletView */
export type TournamentEmbedView = TournamentOutletView;

export interface TournamentGetWorkspace {
  tournamentId: string;
  activeView: Ref<TournamentOutletView | null>;
  openView: (view: TournamentOutletView) => void;
  closeView: () => void;
}

export const TOURNAMENT_GET_WORKSPACE_KEY: InjectionKey<TournamentGetWorkspace> =
  Symbol('tournamentGetWorkspace');

export const TOURNAMENT_EMBEDDED_KEY: InjectionKey<boolean> =
  Symbol('tournamentEmbedded');

export function provideTournamentGetWorkspace(tournamentId: string) {
  const activeView = ref<TournamentOutletView | null>(null);

  const workspace: TournamentGetWorkspace = {
    tournamentId,
    activeView,
    openView(view) {
      activeView.value = view;
    },
    closeView() {
      activeView.value = null;
    },
  };

  provide(TOURNAMENT_GET_WORKSPACE_KEY, workspace);
  return workspace;
}

export function useTournamentGetWorkspace() {
  return inject(TOURNAMENT_GET_WORKSPACE_KEY, null);
}

/** Unwrapped active view for templates (nested refs on plain workspace are not reactive in template). */
export function useTournamentGetActiveView() {
  const workspace = useTournamentGetWorkspace();
  return computed(() => workspace?.activeView.value ?? null);
}

export function useTournamentEmbedded() {
  return inject(TOURNAMENT_EMBEDDED_KEY, false);
}
