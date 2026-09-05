import { GroupType, type Group } from '~/features/tournament/models/group';

export function isFinalGroup(group: Group) {
  return (
    group.type === GroupType.Final ||
    group.stageType === 'Final' ||
    group.type?.toLowerCase() === 'final'
  );
}

export function defaultBracketGroup(groups: Group[]): Group | undefined {
  if (groups.length === 0) return undefined;

  const final = groups.find(isFinalGroup);
  const withMatches = groups.filter(
    (group) => (group.requesterMatchIds?.length ?? 0) > 0,
  );

  const finalWithMatches = withMatches.find(isFinalGroup);
  if (finalWithMatches) return finalWithMatches;

  const qualWithMatches = withMatches.find((group) => !isFinalGroup(group));
  if (qualWithMatches) return qualWithMatches;

  if (final) return final;

  return groups.find((group) => !isFinalGroup(group)) ?? groups[0];
}
