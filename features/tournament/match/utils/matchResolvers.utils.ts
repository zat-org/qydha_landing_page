import type { Match } from "~/features/tournament/models/group";
import type { MatchAction } from "../types/matchAction.types";
import type { MatchViewContext } from "../types/matchViewModel.types";
import { MATCH_ACTIONS, type MatchStateConfig } from "../config/matchState.config";
import { canBackMatch } from "./matchRules.utils";

export function resolveShowInfoButton(config: MatchStateConfig, match: Match): boolean {
  if (!config.showInfoButton) return false;
  return !!match.qydhaGameId;
}

export function resolveCanReset(
  config: MatchStateConfig,
  ctx: MatchViewContext,
): boolean {
  return config.allowResetWhenGroupRunning && ctx.isGroupRunning;
}

export function resolveCanBack(
  config: MatchStateConfig,
  match: Match,
  ctx: MatchViewContext,
): boolean {
  return (
    config.allowBackWhenGroupRunning && ctx.isGroupRunning && canBackMatch(match)
  );
}

export function resolveAdminActions(
  config: MatchStateConfig,
  match: Match,
  ctx: MatchViewContext,
): MatchAction[] {
  return config.actions
    .filter((type) => {
      if (type === "reset") return resolveCanReset(config, ctx);
      if (type === "back") return resolveCanBack(config, match, ctx);
      return true;
    })
    .map((type) => MATCH_ACTIONS[type]);
}
