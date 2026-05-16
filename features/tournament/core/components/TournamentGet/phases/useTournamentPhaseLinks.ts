import { computed, type MaybeRefOrGetter, toValue } from "vue";

export function useTournamentPhaseLinks(
  tournamentId: MaybeRefOrGetter<string>,
) {
  const base = computed(() => `/tournament/${toValue(tournamentId)}`);

  return {
    team: computed(() => `${base.value}/team`),
    joinRequest: computed(() => `${base.value}/joinRequest`),
    group: computed(() => `${base.value}/group`),
    bracket: computed(() => `${base.value}/bracket`),
    statistics: computed(() => `${base.value}/statistics`),
  };
}
