import {
  GroupType,
  type Group,
  type GroupState,
  type Match,
  type MatchLifecycleState,
} from "~/features/tournament/models/group";
import type { GetTournamentPlace } from "~/features/tournament/models/place";
import type { DetailTournament } from "~/features/tournament/models/tournament";
import type { ITeam } from "~/features/tournament/models/tournamentTeam";
import { groupStateLabel } from "~/features/tournament/group/group-details/constants/group-state-labels";

export interface TeamsByPlaceRow {
  placeId: string;
  label: string;
  teamsCount: number;
  capacity: number;
  dateWindow: string;
}

export interface GroupSummaryRow {
  id: string;
  name: string;
  state: GroupState;
  stateLabel: string;
  matchesTotal: number;
  matchesFinished: number;
  matchesRunning: number;
}

export interface PlaceDayRow {
  dateKey: string;
  dateLabel: string;
  dayIndex: number;
  groups: GroupSummaryRow[];
}

export interface PlaceTreeRow {
  placeId: string;
  label: string;
  dateWindow: string;
  teamsCount: number;
  capacity: number;
  days: PlaceDayRow[];
}

export interface JoinRequestPlaceSummaryRow {
  placeId: string | null;
  label: string;
  /** Virtual bucket for requests without `selectedQualificationsPlaceId`. */
  isNoPreference?: boolean;
  /** Max teams at this qualification place; null for virtual row. */
  capacity: number | null;
  /** Teams that preferred this place, or pending count for virtual row. */
  choseCount: number;
  /** Teams assigned by the system; null display for virtual row. */
  assignedCount: number | null;
  /** State-dependent remaining slots; null for virtual row. */
  remaining: number | null;
}

export interface JoinRequestsSummary {
  total: number;
  max: number | null;
  pending: number;
  underReview: number;
  accepted: number;
  waitingList: number;
  canceled: number;
  joinWindow: string;
  placeRows: JoinRequestPlaceSummaryRow[];
  noPreferenceWaiting: number;
  isManagingJoinRequests: boolean;
}

/** Receiving: capacity − chose. Managing: capacity − assigned. */
export function computePlaceRemaining(
  capacity: number,
  choseCount: number,
  assignedCount: number,
  isManagingJoinRequests: boolean,
): number {
  const filled = isManagingJoinRequests ? assignedCount : choseCount;
  return Math.max(0, capacity - filled);
}

export interface FinalGroupSummary {
  id: string;
  name: string;
  state: GroupState;
  stateLabel: string;
  teamsLinked: number;
  matchesTotal: number;
  matchesFinished: number;
  matchesRunning: number;
}

export interface MatchAggregates {
  total: number;
  finished: number;
  running: number;
}

export function aggregateMatches(matches: Match[]): MatchAggregates {
  let finished = 0;
  let running = 0;

  for (const match of matches) {
    if (match.state === "Ended") finished += 1;
    else if (match.state === "Running" || match.state === "Paused")
      running += 1;
  }

  return { total: matches.length, finished, running };
}

export function toDateKey(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

export function eachCalendarDay(startAt: string, endAt: string): string[] {
  const days: string[] = [];
  const start = new Date(startAt);
  const end = new Date(endAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return days;

  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export function formatPlaceDateWindow(place: GetTournamentPlace): string {
  const start = new Date(place.startAt);
  const end = new Date(place.endAt);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "—";
  const fmt = (d: Date) =>
    d.toLocaleDateString("ar-EG", { day: "numeric", month: "short" });
  return `${fmt(start)}–${fmt(end)}`;
}

export function countTeamsByPlace(teams: ITeam[], placeId: string): number {
  return teams.filter((team) =>
    team.stageEntries?.some((entry) => entry.placeId === placeId),
  ).length;
}

export function buildTeamsByPlace(
  places: GetTournamentPlace[],
  teams: ITeam[],
): TeamsByPlaceRow[] {
  return places.map((place) => ({
    placeId: place.id,
    label: place.locationDescription || place.id,
    teamsCount: countTeamsByPlace(teams, place.id),
    capacity: place.competingTeamsCount,
    dateWindow: formatPlaceDateWindow(place),
  }));
}

function buildGroupSummaryRow(
  group: Group,
  matchMap: Map<string, MatchAggregates>,
): GroupSummaryRow {
  const aggregates = matchMap.get(group.id) ?? {
    total: 0,
    finished: 0,
    running: 0,
  };

  return {
    id: group.id,
    name: group.name,
    state: group.state,
    stateLabel: groupStateLabel(group.state),
    matchesTotal: aggregates.total,
    matchesFinished: aggregates.finished,
    matchesRunning: aggregates.running,
  };
}

export function buildPlacesTree(
  places: GetTournamentPlace[],
  groups: Group[],
  teams: ITeam[],
  matchMap: Map<string, MatchAggregates>,
): PlaceTreeRow[] {
  const qualGroups = groups.filter((g) => g.type === GroupType.Qualification);

  return places.map((place) => {
    const placeGroups = qualGroups.filter((g) => g.placeId === place.id);
    const dayKeys = eachCalendarDay(place.startAt, place.endAt);

    const groupsByDay = new Map<string, Group[]>();
    for (const key of dayKeys) groupsByDay.set(key, []);

    for (const group of placeGroups) {
      const key =
        toDateKey(group.startPlayAt) ??
        toDateKey(group.checkInAt) ??
        dayKeys[0] ??
        "";
      if (!key) continue;
      if (!groupsByDay.has(key)) groupsByDay.set(key, []);
      groupsByDay.get(key)!.push(group);
    }

    const days: PlaceDayRow[] = dayKeys.map((dateKey, index) => ({
      dateKey,
      dateLabel: new Date(dateKey).toLocaleDateString("ar-EG", {
        day: "numeric",
        month: "short",
      }),
      dayIndex: index + 1,
      groups: (groupsByDay.get(dateKey) ?? []).map((group) =>
        buildGroupSummaryRow(group, matchMap),
      ),
    }));

    return {
      placeId: place.id,
      label: place.locationDescription || place.id,
      dateWindow: formatPlaceDateWindow(place),
      teamsCount: countTeamsByPlace(teams, place.id),
      capacity: place.competingTeamsCount,
      days,
    };
  });
}

export function buildFinalGroupSummary(
  groups: Group[],
  teamsLinked: number,
  matchMap: Map<string, MatchAggregates>,
): FinalGroupSummary | null {
  const finalGroup = groups.find((g) => g.type === GroupType.Final);
  if (!finalGroup) return null;

  const aggregates = matchMap.get(finalGroup.id) ?? {
    total: 0,
    finished: 0,
    running: 0,
  };

  return {
    id: finalGroup.id,
    name: finalGroup.name,
    state: finalGroup.state,
    stateLabel: groupStateLabel(finalGroup.state),
    teamsLinked,
    matchesTotal: aggregates.total,
    matchesFinished: aggregates.finished,
    matchesRunning: aggregates.running,
  };
}

export type { MatchLifecycleState };

export function tourNeedsMatchData(
  tour: DetailTournament | null | undefined,
): boolean {
  if (!tour) return false;
  const groups = tour.tournament.groups ?? [];
  return groups.length > 0;
}
