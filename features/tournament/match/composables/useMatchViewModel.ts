import type { Ref } from "vue";
import { GroupState, type Match } from "~/features/tournament/models/group";
import { useTournamentBracketStore } from "~/features/tournament/bracket/stores";
import { useMyAuthStore } from "~/store/Auth";
import { toMatchViewModel } from "../mappers/toMatchViewModel";

function hasStaffOrAdminPrivileges(privilege?: string): boolean {
  const p = privilege?.toLowerCase();
  return p === "admin" || p === "owner" || p === "staff";
}

export function useMatchViewModel(match: Ref<Match>) {
  const tourStore = useTournamentBracketStore();
  const { selectedRound } = storeToRefs(tourStore);
  const authStore = useMyAuthStore();
  const { privilege } = storeToRefs(authStore);

  const vm = computed(() =>
    toMatchViewModel(match.value, {
      isGroupRunning: tourStore.selectedGroup?.data.state === GroupState.MatchesRunning,
      hasStaffOrAdminPrivileges: hasStaffOrAdminPrivileges(privilege.value),
    }),
  );

  const roundOpacityClass = computed(() =>
    selectedRound.value?.name && selectedRound.value.name !== match.value.roundName
      ? "opacity-50"
      : "",
  );

  const requesterMatchClass = computed(() =>
    tourStore.isRequesterMatch(match.value.id) ? "match-card--requester" : "",
  );

  const hasStaffOrAdminPrivilegesRef = computed(() =>
    hasStaffOrAdminPrivileges(privilege.value),
  );

  return {
    vm,
    roundOpacityClass,
    requesterMatchClass,
    hasStaffOrAdminPrivileges: hasStaffOrAdminPrivilegesRef,
  };
}
