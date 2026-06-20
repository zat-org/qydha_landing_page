import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import { useMyAuthStore } from "~/store/Auth";

export function useTournamentEditLogic() {
  const authStore = useMyAuthStore();
  const { user } = storeToRefs(authStore);

  const hasAdminOrStaffRole = computed(() => {
    const roles = user.value?.user?.roles ?? [];
    return roles.includes("SuperAdmin") || roles.includes("StaffAdmin");
  });

  const canUpdateTournament = (_detailedState: TournamentDetailedState) =>
    hasAdminOrStaffRole.value;

  return {
    canUpdateTournament,
  };
}
