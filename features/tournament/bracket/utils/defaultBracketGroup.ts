import { GroupType, type Group } from '~/features/tournament/models/group';

export function isFinalGroup(group: Group) {
  return (
    group.type === GroupType.Final ||
    group.stageType === 'Final' ||
    group.type?.toLowerCase() === 'final'
  );
}

export function lastRequesterMatchId(ids?: string[]) {
  if (!ids?.length) return undefined;
  return String(ids[ids.length - 1]);
}

export function hasRequesterMatches(group: Group) {
  return (group.requesterMatchIds?.length ?? 0) > 0;
}

/** Final first, then other groups — used when probing matches for the requester. */
export function bracketGroupsProbeOrder(groups: Group[]): Group[] {
  const finals = groups.filter(isFinalGroup);
  const rest = groups.filter((group) => !isFinalGroup(group));
  return [...finals, ...rest];
}

export function defaultBracketGroup(groups: Group[]): Group | undefined {
  if (groups.length === 0) return undefined;

  const final = groups.find(isFinalGroup);
  const withMatches = groups.filter(hasRequesterMatches);

  const finalWithMatches = withMatches.find(isFinalGroup);
  if (finalWithMatches) return finalWithMatches;

  const qualWithMatches = withMatches.find((group) => !isFinalGroup(group));
  if (qualWithMatches) return qualWithMatches;

  if (final) return final;

  return groups.find((group) => !isFinalGroup(group)) ?? groups[0];
}
