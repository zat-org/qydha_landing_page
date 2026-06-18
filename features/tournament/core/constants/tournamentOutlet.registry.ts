import TournamentTeam from '~/features/tournament/teams/components/TournamentTeam.vue';
import TournamentJoiningRequest from '~/features/tournament/join-request/components/TournamentJoiningRequest.vue';
import TournamentGroup from '~/features/tournament/group/components/TournamentGroup.vue';
import type {
  TournamentOutletContext,
  TournamentOutletDef,
  TournamentOutletView,
} from '../types';

export const TOURNAMENT_OUTLET_REGISTRY: Record<
  TournamentOutletView,
  TournamentOutletDef
> = {
  team: {
    component: TournamentTeam,
    props: (ctx: TournamentOutletContext) => ({
      mode: ctx.mode,
      tournamentId: ctx.tournamentId,
    }),
  },
  joinRequest: {
    component: TournamentJoiningRequest,
    props: (ctx: TournamentOutletContext) => ({
      mode: ctx.mode,
      tournamentId: ctx.tournamentId,
    }),
  },
  group: {
    component: TournamentGroup,
    props: (ctx: TournamentOutletContext) => ({
      mode: ctx.mode,
      tournamentId: ctx.tournamentId,
    }),
  },
};
