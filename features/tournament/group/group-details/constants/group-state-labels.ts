import { GroupState } from "~/features/tournament/models/group";

export const GROUP_STATE_LABELS_AR: Record<GroupState, string> = {
  [GroupState.Created]: "تم الإنشاء",
  [GroupState.TeamsLinking]: "ربط الفرق",
  [GroupState.MatchesGenerated]: "تم إنشاء المباريات",
  [GroupState.MatchesRunning]: "المباريات جارية",
  [GroupState.MatchesFinished]: "انتهت المباريات",
};

export function groupStateLabel(state: GroupState): string {
  return GROUP_STATE_LABELS_AR[state] ?? state;
}
