import type { Match } from "~/features/tournament/models/group";
import { MATCH_STATE_CONFIG } from "../config/matchState.config";
import { normalizeMatchState } from "../utils/matchState.utils";
import type { MatchViewContext, MatchViewModel } from "../types/matchViewModel.types";
import {
  getMatchInfoTooltip,
  getTeamClasses,
  getTeamNameClasses,
} from "../utils/matchDisplay.utils";
import { isTournamentFinalPlacement } from "../utils/matchRules.utils";
import {
  resolveAdminActions,
  resolveCanBack,
  resolveCanReset,
  resolveShowInfoButton,
} from "../utils/matchResolvers.utils";

export function toMatchViewModel(match: Match, ctx: MatchViewContext): MatchViewModel {
  const state = normalizeMatchState(match.state);
  const config = MATCH_STATE_CONFIG[state];

  return {
    state,
    match,
    cardToneClass: config.cardToneClass,
    statusBadgeText: config.statusBadgeText,
    statusBadgeClass: config.statusBadgeClass,
    nodeStatusBadgeClass: config.nodeStatusBadgeClass,
    matchStatusText: config.matchStatusText,
    matchInfoTooltip: getMatchInfoTooltip(match),
    statusIcon: config.statusIcon,
    showInfoButton: resolveShowInfoButton(config, match),
    firstTeamClasses: getTeamClasses(match, state, "us"),
    secondTeamClasses: getTeamClasses(match, state, "them"),
    firstTeamNameClasses: getTeamNameClasses(match, state, "us"),
    secondTeamNameClasses: getTeamNameClasses(match, state, "them"),
    adminActions: resolveAdminActions(config, match, ctx),
    canEdit: config.canEdit,
    canReset: resolveCanReset(config, ctx),
    canBack: resolveCanBack(config, match, ctx),
    isFinalPlacement: isTournamentFinalPlacement(match, state),
  };
}
