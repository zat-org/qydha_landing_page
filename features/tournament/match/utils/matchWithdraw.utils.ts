import type { Match } from "~/features/tournament/models/group";

export type MatchWithdrawKind = "joinRequest" | "notAttend";

export type GroupWithdrawCounts = {
  joinRequest: number;
  notAttend: number;
  total: number;
};

function hasValue(value?: string | null): boolean {
  return Boolean(value && String(value).trim());
}

function normalizedReason(endReason?: string | null): string {
  return (endReason || "").trim().toLowerCase().replace(/[\s_-]/g, "");
}

function isAdminWithdrawReason(endReason?: string | null): boolean {
  const reason = normalizedReason(endReason);
  if (!reason) return false;
  return (
    reason.includes("withdraw") ||
    reason.includes("notattend") ||
    reason.includes("absent") ||
    reason.includes("noshow")
  );
}

function isBothSidesWithdrawReason(endReason?: string | null): boolean {
  const reason = normalizedReason(endReason);
  if (!reason) return false;
  return (
    reason.includes("both") ||
    reason.includes("all") ||
    reason === "withdrawall"
  );
}

function sideWithdrawKind(
  teamId?: string | null,
  qualifyId?: string | null,
  teamName?: string | null,
  endReason?: string | null,
  matchEnded = false,
  bothSidesWithdraw = false,
): MatchWithdrawKind | null {
  const hasTeam = hasValue(teamId);
  const hasQualify = hasValue(qualifyId);

  if (!hasTeam && !hasQualify) return "joinRequest";

  if (
    hasTeam &&
    (bothSidesWithdraw ||
      isAdminWithdrawReason(endReason) ||
      (matchEnded && !hasValue(teamName)))
  ) {
    return "notAttend";
  }

  return null;
}

export function countGroupWithdraws(matches: Match[] | undefined | null): GroupWithdrawCounts {
  const counts: GroupWithdrawCounts = {
    joinRequest: 0,
    notAttend: 0,
    total: 0,
  };

  if (!matches?.length) return counts;

  for (const match of matches) {
    const bothSides = isBothSidesWithdrawReason(match.endReason);
    const matchEnded = match.state === "Ended";
    const sides: Array<MatchWithdrawKind | null> = [
      sideWithdrawKind(
        match.usTeamId,
        match.matchQualifyUsTeamId,
        match.usTeamName,
        match.endReason,
        matchEnded,
        bothSides,
      ),
      sideWithdrawKind(
        match.themTeamId,
        match.matchQualifyThemTeamId,
        match.themTeamName,
        match.endReason,
        matchEnded,
        bothSides,
      ),
    ];

    for (const kind of sides) {
      if (kind === "joinRequest") counts.joinRequest += 1;
      else if (kind === "notAttend") counts.notAttend += 1;
    }
  }

  counts.total = counts.joinRequest + counts.notAttend;
  return counts;
}
