import type { GetTournamentPlace } from "~/features/tournament/models/place";

/** Places eligible as `targetedPlaceId` during join-request consideration. */
export function getJoinRequestTargetPlaces(
  places: GetTournamentPlace[],
): GetTournamentPlace[] {
  const qual = places.filter((p) => p.stageType === "Qualification");
  if (qual.length > 0) return qual;
  return places.filter((p) => p.stageType === "Final");
}

export function placeOptionLabel(place: GetTournamentPlace): string {
  return place.locationDescription || place.id;
}
