import type { Ref } from "vue";
import { GroupState, type Match } from "~/features/tournament/models/group";
import { useTournamentBracketStore } from "~/features/tournament/bracket/stores";
import { useMyAuthStore } from "~/store/Auth";
import { toMatchViewModel } from "../mappers/toMatchViewModel";
import { normalizeMatchState } from "../utils/matchState.utils";

function hasStaffOrAdminPrivileges(privilege?: string): boolean {
  const p = privilege?.toLowerCase();
  return p === "admin" || p === "owner" || p === "staff";
}

export function useMatchViewModel(match: Ref<Match>) {
  const tourStore = useTournamentBracketStore();
  const { selectedRound } = storeToRefs(tourStore);
  const authStore = useMyAuthStore();
  const { privilege } = storeToRefs(authStore);

  const canUsePlaceModeratorControls = computed(
    () =>
      hasStaffOrAdminPrivileges(privilege.value) ||
      (tourStore.selectedGroup?.data.isRequesterPlaceModerator ?? false),
  );

  const vm = computed(() =>
    toMatchViewModel(match.value, {
      isGroupRunning: tourStore.selectedGroup?.data.state === GroupState.MatchesRunning,
      hasStaffOrAdminPrivileges: canUsePlaceModeratorControls.value,
    }),
  );

  const roundOpacityClass = computed(() => {
    if (selectedRound.value?.name) {
      return selectedRound.value.name !== match.value.roundName
        ? "opacity-50"
        : "";
    }

    return normalizeMatchState(match.value.state) === "Running"
      ? "opacity-100"
      : "opacity-70";
  });

  const requesterMatchClass = computed(() =>
    tourStore.isRequesterMatch(match.value.id) ? "match-card--requester" : "",
  );

  return {
    vm,
    roundOpacityClass,
    requesterMatchClass,
    hasStaffOrAdminPrivileges: canUsePlaceModeratorControls,
  };
}
