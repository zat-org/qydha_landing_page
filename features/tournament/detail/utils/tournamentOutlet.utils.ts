import { TOURNAMENT_OUTLET_MODES } from "../constants/tournamentEmbed.config";
import type { TournamentOutletMode } from "../types/outlet.types";

export function shouldShowBackButton(mode: TournamentOutletMode): boolean {
  return TOURNAMENT_OUTLET_MODES[mode].showBackButton;
}

export function shouldCompleteWithEmit(mode: TournamentOutletMode): boolean {
  return TOURNAMENT_OUTLET_MODES[mode].completeWithEmit;
}
