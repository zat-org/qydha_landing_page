import type { RouteLocationNormalizedLoaded } from "vue-router";
import {
  OUTLET_PATH_SEGMENTS,
  TAB_VIEW_CONFIG,
} from "../constants/tournamentNavigation.config";
import type {
  TournamentOutletView,
  TournamentPhaseView,
  TournamentTabNavItem,
  TournamentTabView,
} from "../types/navigation.types";

const EMBEDDED_OUTLET_SEGMENTS = new Set(
  Object.values(OUTLET_PATH_SEGMENTS).map((segment) => segment.toLowerCase()),
);

const PATH_SEGMENT_BY_VIEW = {
  ...OUTLET_PATH_SEGMENTS,
  ...Object.fromEntries(
    Object.entries(TAB_VIEW_CONFIG).map(([view, meta]) => [
      view,
      meta.pathSegment,
    ]),
  ),
} as Record<TournamentPhaseView, string>;

export function getTournamentDetailBasePath(tournamentId: string): string {
  return `/tournament/${tournamentId}`;
}

export function normalizeRoutePath(path: string): string {
  return path.replace(/\/+$/, "");
}

function parseTournamentDetailRoute(
  route: RouteLocationNormalizedLoaded,
  tournamentId: string,
) {
  const base = getTournamentDetailBasePath(tournamentId);
  const path = normalizeRoutePath(route.path);
  const isBase = path === base;
  const isUnderBase = !isBase && path.startsWith(`${base}/`);
  const firstSegment = isUnderBase
    ? (path.slice(base.length + 1).split("/")[0]?.toLowerCase() ?? null)
    : null;

  return { base, path, isBase, isUnderBase, firstSegment };
}

/** True when the route should render inside the tournament detail shell. */
export function shouldShowTournamentDetailShell(
  route: RouteLocationNormalizedLoaded,
  tournamentId: string,
): boolean {
  const { isBase, isUnderBase, firstSegment } = parseTournamentDetailRoute(
    route,
    tournamentId,
  );

  if (isBase) return true;
  if (!isUnderBase || !firstSegment) return false;

  return EMBEDDED_OUTLET_SEGMENTS.has(firstSegment);
}

export function getActiveOutletView(
  route: RouteLocationNormalizedLoaded,
  tournamentId: string,
): TournamentOutletView | null {
  const { isBase, firstSegment } = parseTournamentDetailRoute(
    route,
    tournamentId,
  );
  if (isBase || !firstSegment) return null;

  for (const [view, segment] of Object.entries(OUTLET_PATH_SEGMENTS)) {
    if (firstSegment === segment.toLowerCase()) {
      return view as TournamentOutletView;
    }
  }
  return null;
}

export function getPhaseViewPath(
  view: TournamentPhaseView,
  tournamentId: string,
): string {
  return `${getTournamentDetailBasePath(tournamentId)}/${PATH_SEGMENT_BY_VIEW[view]}`;
}

export function buildTabNavItems(
  views: readonly TournamentTabView[],
  tournamentId: string,
): TournamentTabNavItem[] {
  return views.map((view) => {
    const meta = TAB_VIEW_CONFIG[view];
    return {
      view,
      label: meta.label,
      icon: meta.icon,
      to: getPhaseViewPath(view, tournamentId),
      openInNewTab: meta.openInNewTab,
    };
  });
}

export function navigateToTabView(
  view: TournamentTabView,
  tournamentId: string,
) {
  if (TAB_VIEW_CONFIG[view].openInNewTab) {
    openTournamentViewInNewTab(view, tournamentId);
    return;
  }
  void navigateTo(getPhaseViewPath(view, tournamentId));
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
