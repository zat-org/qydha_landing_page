<template>
  <section class="mt-4 space-y-4" aria-label="إدارة المرحلة">
    <div class="flex flex-wrap items-center gap-2">
      <UButton
        icon="i-mdi-arrow-right"
        label="العودة للوحة التحكم"
        variant="ghost"
        color="neutral"
        @click="goBack"
      />
    </div>

    <component
      :is="outletComponent"
      :tournament-id="tournamentId"
      @done="emit('refreshed')"
    />
  </section>
</template>

<script lang="ts" setup>
import type { Component } from "vue";
import type { TournamentOutletView } from "~/features/tournament/detail/types/navigation.types";
import { getTournamentDetailBasePath } from "~/features/tournament/detail/utils/tournamentNavigation.utils";
import TournamentTeam from "~/features/tournament/teams/components/TournamentTeam.vue";
import TournamentJoiningRequest from "~/features/tournament/join-request/components/TournamentJoiningRequest.vue";
import TournamentGroup from "~/features/tournament/group/components/TournamentGroup.vue";

const props = defineProps<{
  tournamentId: string;
  outlet: TournamentOutletView;
}>();

const emit = defineEmits<{ refreshed: [] }>();

const OUTLET_COMPONENTS: Record<TournamentOutletView, Component> = {
  team: TournamentTeam,
  joinRequest: TournamentJoiningRequest,
  group: TournamentGroup,
};

const outletComponent = computed(() => OUTLET_COMPONENTS[props.outlet]);

function goBack() {
  void navigateTo(getTournamentDetailBasePath(props.tournamentId));
}
</script>
