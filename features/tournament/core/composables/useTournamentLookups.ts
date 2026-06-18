import type { TournamentState } from '~/features/tournament/models/tournament';
import type { TournamentType } from '~/features/tournament/models/tournamenetType';
import type { TournamentPrizeCurrency } from '~/features/tournament/models/tournamentPrize';

export function useTournamentLookups() {
  const { getTournamnetStateOptions } = useTournament();
  const { getTournamentTypeOptions, getTournamentPrizeCurrency } =
    useTournamentRequest();

  const states = getTournamnetStateOptions();
  const types = getTournamentTypeOptions();
  const currencies = getTournamentPrizeCurrency();

  const getState = (value: TournamentState) =>
    states.find((s) => s.value === value);

  const getType = (value: TournamentType) =>
    types.find((s) => s.value === value);

  const getCurrency = (value: TournamentPrizeCurrency) =>
    currencies.find((cur) => cur.value === value);

  return { getState, getType, getCurrency };
}
