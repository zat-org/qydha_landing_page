import type { RouteLocationNormalizedLoaded } from "vue-router";
import type { TournamentDetailedState } from "~/features/tournament/models/tournament";
import {
  OUTLET_VIEW_CONFIG,
  TAB_VIEW_CONFIG,
} from "../constants/tournamentNavigation.config";
import { getPhaseConfig } from "~/features/tournament/phase/tournamentPhase.config";
import type {
  TournamentOutletView,
  TournamentPhaseView,
  TournamentTabView,
} from "../types/navigation.types";

const EMBEDDED_OUTLET_SEGMENTS = new Set<string>(
  Object.values(OUTLET_VIEW_CONFIG).map(({ pathSegment }) => pathSegment),
);

export function getTournamentDetailBasePath(tournamentId: string): string {
  return `/tournament/${tournamentId}`;
}

/** True when the route should render inside the tournament detail shell. */
export function shouldShowTournamentDetailShell(
  route: RouteLocationNormalizedLoaded,
  tournamentId: string,
): boolean {
  const base = getTournamentDetailBasePath(tournamentId);
  const path = route.path.replace(/\/+$/, "");

  if (path === base) {
    return true;
  }

  if (!path.startsWith(`${base}/`)) {
    return false;
  }

  const segment = path.slice(base.length + 1).split("/")[0]?.toLowerCase();
  return segment ? EMBEDDED_OUTLET_SEGMENTS.has(segment) : false;
}

export function getOutletViewsForPhase(
  state: TournamentDetailedState | undefined,
): TournamentOutletView[] {
  return getPhaseConfig(state).outlets;
}

export function getTabViewsForPhase(
  state: TournamentDetailedState | undefined,
): TournamentTabView[] {
  return getPhaseConfig(state).externalTabs;
}

export function getPhaseViewPath(
  view: TournamentPhaseView,
  tournamentId: string,
): string {
  const base = getTournamentDetailBasePath(tournamentId);
  const pathSegment =
    view in OUTLET_VIEW_CONFIG
      ? OUTLET_VIEW_CONFIG[view as TournamentOutletView].pathSegment
      : TAB_VIEW_CONFIG[view as TournamentTabView].pathSegment;

  return `${base}/${pathSegment}`;
}

export function getDefaultOutletPath(
  tournamentId: string,
  outlets: TournamentOutletView[],
): string | null {
  const firstOutlet = outlets[0];
  if (!firstOutlet) return null;
  return getPhaseViewPath(firstOutlet, tournamentId);
}

export function getOutletViewFromPathSegment(
  segment: string,
): TournamentOutletView | null {
  const normalized = segment.toLowerCase();

  for (const [view, meta] of Object.entries(OUTLET_VIEW_CONFIG) as [
    TournamentOutletView,
    (typeof OUTLET_VIEW_CONFIG)[TournamentOutletView],
  ][]) {
    if (meta.pathSegment.toLowerCase() === normalized) {
      return view;
    }
  }

  return null;
}

export function getEmbeddedOutletViewFromRoute(
  route: RouteLocationNormalizedLoaded,
  tournamentId: string,
): TournamentOutletView | null {
  const base = getTournamentDetailBasePath(tournamentId);
  const path = route.path.replace(/\/+$/, "");

  if (path === base || !path.startsWith(`${base}/`)) {
    return null;
  }

  const segment = path.slice(base.length + 1).split("/")[0]?.toLowerCase();
  if (!segment || !EMBEDDED_OUTLET_SEGMENTS.has(segment)) {
    return null;
  }

  return getOutletViewFromPathSegment(segment);
}

/** Returns the path the router should use for the current phase, or null if unchanged. */
export function resolveOutletRouteForPhase(
  route: RouteLocationNormalizedLoaded,
  tournamentId: string,
  outlets: TournamentOutletView[],
): string | null {
  const base = getTournamentDetailBasePath(tournamentId);
  const currentView = getEmbeddedOutletViewFromRoute(route, tournamentId);

  if (currentView && outlets.includes(currentView)) {
    return null;
  }

  if (currentView && !outlets.includes(currentView)) {
    return getDefaultOutletPath(tournamentId, outlets) ?? base;
  }

  if (!currentView && outlets.length > 0) {
    return getDefaultOutletPath(tournamentId, outlets);
  }

  if (currentView && outlets.length === 0) {
    return base;
  }

  return null;
}

export function getOutletViewMeta(view: TournamentOutletView) {
  return OUTLET_VIEW_CONFIG[view];
}

export function getTabViewMeta(view: TournamentTabView) {
  return TAB_VIEW_CONFIG[view];
}

export function openTournamentViewInNewTab(
  view: TournamentPhaseView,
  tournamentId: string,
) {
  if (!import.meta.client) return;
  window.open(
    getPhaseViewPath(view, tournamentId),
    "_blank",
    "noopener,noreferrer",
  );
}
