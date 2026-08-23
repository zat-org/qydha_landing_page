import type { TournamentState } from '~/features/tournament/models/tournament';
import type { TournamentType } from '~/features/tournament/models/tournamenetType';
import type { TournamentPrizeCurrency } from '~/features/tournament/models/tournamentPrize';
import { useAllTournament } from '~/features/tournament/list/composables/useAllTournament';
import { useTournamentRequest } from '~/features/tournament/request/composables/TournamentRequest';

export function useTournamentLookups() {
  const { getTournamnetStateOptions } = useAllTournament();
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
