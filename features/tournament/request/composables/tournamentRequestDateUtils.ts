import type { QualificationsStageInfo } from "~/features/tournament/models/place";

export function parseFormDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function isDateAfter(
  later: string | undefined | null,
  earlier: string | undefined | null,
): boolean {
  const laterDate = parseFormDate(later);
  const earlierDate = parseFormDate(earlier);
  if (!laterDate || !earlierDate) return true;
  return laterDate.getTime() > earlierDate.getTime();
}

export function maxQualificationEndDate(
  qualificationsStageInfo: QualificationsStageInfo | null | undefined,
): Date | null {
  const places = qualificationsStageInfo?.places ?? [];
  if (!places.length) return null;

  const endDates = places
    .map((place) => parseFormDate(place.endAt))
    .filter((date): date is Date => date !== null);

  if (!endDates.length) return null;
  return new Date(Math.max(...endDates.map((date) => date.getTime())));
}

export function minFinalStartDate(
  addPlayersByQydha: boolean,
  joinRequestEndAt: string | undefined,
  qualificationsStageInfo: QualificationsStageInfo | null | undefined,
): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxQualEnd = maxQualificationEndDate(qualificationsStageInfo);
  if (maxQualEnd) return maxQualEnd;

  if (addPlayersByQydha) {
    const joinEnd = parseFormDate(joinRequestEndAt);
    if (joinEnd && joinEnd > today) return joinEnd;
  }

  return today;
}

export function minQualificationStartDate(
  addPlayersByQydha: boolean,
  joinRequestEndAt: string | undefined,
): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (addPlayersByQydha) {
    const joinEnd = parseFormDate(joinRequestEndAt);
    if (joinEnd && joinEnd > today) return joinEnd;
  }

  return today;
}

export function sumQualificationTeams(
  qualificationsStageInfo: QualificationsStageInfo | null | undefined,
): number {
  return (qualificationsStageInfo?.places ?? []).reduce(
    (total, place) => total + (Number(place.competingTeamsCount) || 0),
    0,
  );
}

export function sumQualificationTables(
  qualificationsStageInfo: QualificationsStageInfo | null | undefined,
): number {
  return (qualificationsStageInfo?.places ?? []).reduce(
    (total, place) => total + (Number(place.availableTablesCount) || 0),
    0,
  );
}

export function calcTotalTeamsForCalculator(
  finalTeamsCount: number,
  qualificationsStageInfo: QualificationsStageInfo | null | undefined,
): number {
  const qualTeams = sumQualificationTeams(qualificationsStageInfo);
  return (Number(finalTeamsCount) || 0) + qualTeams;
}

export function calcTotalTablesForCalculator(
  finalTablesCount: number,
  qualificationsStageInfo: QualificationsStageInfo | null | undefined,
): number {
  const qualTables = sumQualificationTables(qualificationsStageInfo);
  return (Number(finalTablesCount) || 0) + qualTables;
}
