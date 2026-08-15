import type { GetTournamentPlace } from "~/features/tournament/models/place";
import type { DetailTournament } from "~/features/tournament/models/tournament";

type PlacesSource =
  | DetailTournament
  | DetailTournament["tournament"]
  | GetTournamentPlace[]
  | null
  | undefined;

function resolvePlaces(source: PlacesSource): GetTournamentPlace[] {
  if (!source) return [];
  if (Array.isArray(source)) return source;
  if ("qualificationStagePlaces" in source) {
    return (source as { qualificationStagePlaces?: GetTournamentPlace[] })
      .qualificationStagePlaces ?? [];
  }
  if ("tournament" in source && source.tournament) {
    return source.tournament.qualificationStagePlaces ?? [];
  }
  return [];
}

/**
 * Resolve qualification places from dashboard tour data.
 * Accepts DetailTournament, nested tournament, or a places array.
 */
export function useTournamentPlaces(
  source: MaybeRefOrGetter<PlacesSource>,
) {
  const places = computed(() => resolvePlaces(toValue(source)));

  const placesById = computed(() => {
    const map = new Map<string, GetTournamentPlace>();
    for (const place of places.value) {
      map.set(place.id, place);
    }
    return map;
  });

  const placeOptions = computed(() =>
    places.value.map((place) => ({
      label: place.locationDescription || place.id,
      value: place.id,
    })),
  );

  const hasPlaces = computed(() => places.value.length > 0);

  const placeLabel = (placeId: string | null | undefined) => {
    if (!placeId) return "أي مكان";
    return placesById.value.get(placeId)?.locationDescription ?? placeId;
  };

  return {
    places,
    placesById,
    placeOptions,
    hasPlaces,
    placeLabel,
  };
}
