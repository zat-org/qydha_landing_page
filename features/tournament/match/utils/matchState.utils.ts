import type { MatchLifecycleState } from "~/features/tournament/models/group";
import {
  MATCH_STATE_CONFIG,
  type MatchListBadgeColor,
} from "../config/matchState.config";

const LIFECYCLE_STATES = new Set<MatchLifecycleState>([
  "Created",
  "Running",
  "Paused",
  "Ended",
]);

export function normalizeMatchState(state: string): MatchLifecycleState {
  if (LIFECYCLE_STATES.has(state as MatchLifecycleState)) {
    return state as MatchLifecycleState;
  }
  return "Created";
}

export function getMatchStateLabel(state: string): string {
  const lifecycle = normalizeMatchState(state);
  if (state === lifecycle) {
    return MATCH_STATE_CONFIG[lifecycle].listLabel;
  }

  const fallbackLabels: Record<string, string> = {
    Cancelled: "ملغاة",
  };
  return fallbackLabels[state] ?? state;
}

export function getMatchStateColor(state: string): MatchListBadgeColor {
  const lifecycle = normalizeMatchState(state);
  if (state === lifecycle) {
    return MATCH_STATE_CONFIG[lifecycle].listBadgeColor;
  }

  const fallbackColors: Record<string, MatchListBadgeColor> = {
    Cancelled: "error",
  };
  return fallbackColors[state] ?? "neutral";
}
