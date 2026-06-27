import type { Match, MatchLifecycleState } from "~/features/tournament/models/group";

/** Whether admin can roll back the last moshtara for this match */
export function canBackMatch(match: Match): boolean {
  return match.level === 1 || match.parentMatch?.state === "Created";
}

/** Whether this ended match should use final gold/silver styling */
export function isTournamentFinalPlacement(
  match: Match,
  state: MatchLifecycleState,
): boolean {
  return (
    state === "Ended" &&
    match.level === 1 &&
    (match.winner?.toLowerCase() === "us" || match.winner?.toLowerCase() === "them")
  );
}
