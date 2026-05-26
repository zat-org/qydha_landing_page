import { toValue, type MaybeRefOrGetter } from 'vue';
import { TournamentDetailedState } from '~/features/tournament/models/tournament';
import { useTournamentGetWorkspace } from './useTournamentGetWorkspace';

/** Views shown inside the tournament page outlet */
export type TournamentOutletView = 'team' | 'joinRequest' | 'group';

/** Views that always open in a new browser tab */
export type TournamentTabView = 'bracket' | 'statistics';

export type TournamentPhaseView = TournamentOutletView | TournamentTabView;

export const OUTLET_VIEW_LABELS: Record<TournamentOutletView, string> = {
  team: 'الفرق واللاعبين',
  joinRequest: 'طلبات الانضمام',
  group: 'المجموعات والمباريات',
};

export const OUTLET_VIEW_ICONS: Record<TournamentOutletView, string> = {
  team: 'i-mdi-account-group',
  joinRequest: 'i-mdi-account-arrow-right',
  group: 'i-mdi-user-group',
};

export const TAB_VIEW_LABELS: Record<TournamentTabView, string> = {
  bracket: 'خريطة البطولة',
  statistics: 'إحصائيات البطولة',
};

export const TAB_VIEW_ICONS: Record<TournamentTabView, string> = {
  bracket: 'i-mdi-tournament',
  statistics: 'i-mdi-chart-box',
};

const PHASE_OUTLET_VIEWS: Record<TournamentDetailedState, TournamentOutletView[]> = {
  [TournamentDetailedState.Created]: ['team'],
  [TournamentDetailedState.ReceivingJoinRequests]: ['joinRequest'],
  [TournamentDetailedState.ManagingJoinRequests]: ['joinRequest'],
  [TournamentDetailedState.ManagingTeams]: ['team'],
  [TournamentDetailedState.LinkingFinalGroupTeams]: ['group'],
  [TournamentDetailedState.ManagingFinalGroupBracket]: ['group'],
  [TournamentDetailedState.WaitingFinalGroupStarting]: [],
  [TournamentDetailedState.FinalGroupRunning]: ['group'],
  [TournamentDetailedState.Finished]: [],
};

const PHASE_TAB_VIEWS: Record<TournamentDetailedState, TournamentTabView[]> = {
  [TournamentDetailedState.Created]: [],
  [TournamentDetailedState.ReceivingJoinRequests]: [],
  [TournamentDetailedState.ManagingJoinRequests]: [],
  [TournamentDetailedState.ManagingTeams]: [],
  [TournamentDetailedState.LinkingFinalGroupTeams]: [],
  [TournamentDetailedState.ManagingFinalGroupBracket]: ['bracket'],
  [TournamentDetailedState.WaitingFinalGroupStarting]: ['bracket'],
  [TournamentDetailedState.FinalGroupRunning]: ['bracket', 'statistics'],
  [TournamentDetailedState.Finished]: ['bracket', 'statistics'],
};

const UNKNOWN_OUTLET_VIEWS: TournamentOutletView[] = ['team', 'group'];

export function isTabView(view: TournamentPhaseView): view is TournamentTabView {
  return view === 'bracket' || view === 'statistics';
}

export function getOutletViewsForPhase(
  state: TournamentDetailedState | undefined,
): TournamentOutletView[] {
  if (!state) return UNKNOWN_OUTLET_VIEWS;
  return PHASE_OUTLET_VIEWS[state] ?? UNKNOWN_OUTLET_VIEWS;
}

export function getTabViewsForPhase(
  state: TournamentDetailedState | undefined,
): TournamentTabView[] {
  if (!state) return [];
  return PHASE_TAB_VIEWS[state] ?? [];
}

export function getPhaseViewPath(
  view: TournamentPhaseView,
  tournamentId: string,
): string {
  const base = `/tournament/${tournamentId}`;
  const paths: Record<TournamentPhaseView, string> = {
    team: `${base}/team`,
    joinRequest: `${base}/joinRequest`,
    group: `${base}/group`,
    bracket: `${base}/bracket`,
    statistics: `${base}/statistics`,
  };
  return paths[view];
}

export function openPhaseTabView(
  view: TournamentTabView,
  tournamentId: string,
) {
  if (!import.meta.client) return;
  window.open(
    getPhaseViewPath(view, tournamentId),
    '_blank',
    'noopener,noreferrer',
  );
}

export function useTournamentGetAutoOpen(
  detailedState: MaybeRefOrGetter<TournamentDetailedState | undefined>,
  enabled: MaybeRefOrGetter<boolean> = true,
) {
  const workspace = useTournamentGetWorkspace();
  const lastAutoOpenedState = ref<TournamentDetailedState | undefined>();

  watch(
    () => ({
      state: toValue(detailedState),
      enabled: toValue(enabled),
    }),
    ({ state, enabled }) => {
      if (!enabled || !workspace || !state) return;
      if (lastAutoOpenedState.value === state) return;
      lastAutoOpenedState.value = state;

      const outletViews = getOutletViewsForPhase(state);
      if (outletViews.length > 0) {
        workspace.openView(outletViews[0]);
        return;
      }

      const tabViews = getTabViewsForPhase(state);
      if (tabViews.length > 0) {
        openPhaseTabView(tabViews[0], workspace.tournamentId);
      }
    },
    { immediate: true },
  );
}
