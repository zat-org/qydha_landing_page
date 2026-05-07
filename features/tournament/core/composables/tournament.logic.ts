import type { DetailTournament } from "~/features/tournament/models/tournament";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import { useMyAuthStore } from "~/store/Auth";

export const useTournamentLogic = () => {
  const authStore = useMyAuthStore();
  const { user } = storeToRefs(authStore);

  const hasAdminOrStaffRole = computed(() => {
    const roles = user.value?.user?.roles ?? [];
    return roles.includes("SuperAdmin") || roles.includes("StaffAdmin");
  });

  const updatableStates = new Set<TournamentDetailedState>([
    TournamentDetailedState.Created,
    TournamentDetailedState.ReceivingJoinRequests,
    TournamentDetailedState.ManagingJoinRequests,
    TournamentDetailedState.ManagingTeams,
  ]);

  const canUpdateTournament  =(detailedState:TournamentDetailedState)=>{
    
    return hasAdminOrStaffRole.value && updatableStates.has(detailedState);

  }

  return {
    canUpdateTournament,
  };
};