import { useMyAuthStore } from "~/store/Auth";
import { useTournamentBracketStore } from "~/features/tournament/bracket/stores";
import { countGroupWithdraws } from "~/features/tournament/match/utils/matchWithdraw.utils";

export function useGroupWithdrawSummary() {
  const authStore = useMyAuthStore();
  const tourStore = useTournamentBracketStore();

  const canSeeWithdrawPanel = computed(
    () =>
      Boolean(
        authStore.user && (authStore.isSuperAdmin || authStore.isStaffAdmin),
      ),
  );

  const counts = computed(() =>
    countGroupWithdraws(tourStore.selectedGroup?.matches),
  );

  return { canSeeWithdrawPanel, counts };
}
