import type { Match, MatchLifecycleState } from "~/features/tournament/models/group";

export function getMatchInfoTooltip(match: Match): string {
  const parts = [];
  if (match.tableName) parts.push(`الطاولة: ${match.tableName}`);
  if (match.roundName) parts.push(`الجولة: ${match.roundName}`);
  if (match.startAt) parts.push(`الوقت: ${formatDateTime(match.startAt)}`);
  return parts.length > 0 ? parts.join(" | ") : "";
}

export function getTeamClasses(
  match: Match,
  state: MatchLifecycleState,
  side: "us" | "them",
): string {
  const winner = match.winner?.toLowerCase();
  if (winner === side) return "match-team--winner";
  if (state === "Ended") return "match-team--loser";
  return "match-team--default";
}

export function getTeamNameClasses(
  match: Match,
  state: MatchLifecycleState,
  side: "us" | "them",
) {
  const opponent = side === "us" ? "them" : "us";
  return {
    "line-through opacity-60":
      state === "Ended" &&
      !match.qydhaGameId &&
      (match.winner?.toLowerCase() === opponent || !match.winner),
  };
}
