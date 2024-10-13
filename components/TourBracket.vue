<template>
  <VueFlow v-if="OrderedNodes" :nodes="OrderedNodes.nodes" :fit-view-on-init="true" :edges="OrderedNodes.edges"
    :default-zoom="1" :min-zoom="0.2" :max-zoom="4">
    <Background />
    <template #node-match="matchProps">
      <MatchNode v-bind="matchProps" />
    </template>
  </VueFlow>

</template>

<script lang="ts" setup>
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import MatchNode from "./MatchNode.vue";
import type { Group, Match } from "~/models/group";
import { useLayout } from "~/composables/useLayout";
import { useMyTournamentStore } from "~/store/tournament";
const props = defineProps<{ group: Group }>();
const direction = computed(() => props.group.type.toLowerCase() == 'final' ? "LRC" : "LR");
const route = useRoute()
const tourt_id = route.params.id.toString()
// const { fitView, onNodesChange } = useVueFlow();
const { layoutFromMatchesTree } = useLayout()
const groupApi = useGroup();
const { data, fetchREQ, status } = await groupApi.getGroupMatches();


const tourStore = useMyTournamentStore()
onMounted(async () => {
  await fetchREQ(tourt_id, props.group.id);
  if (status.value == 'success') {
    const group = tourStore.tournament.groups.find(g => { g.id == props.group.id })
    if (group) {
      matches.value = group.matches
    }
    else {
      tourStore.tournament.groups.push({ id: props.group.id, matches: matches.value })
    }
   
  }

});



const matchesTree = computed((): Match[] | undefined => {
  if (!matches.value) return undefined;
  let heads: Match[] = [];
  matches.value.forEach((m) => {
    if (
      m.level == 1 &&
      (!m.matchQualifyUsTeamFrom ||
        m.matchQualifyUsTeamFrom === "Winner") &&
      (!m.matchQualifyThemTeamFrom ||
        m.matchQualifyThemTeamFrom === "Winner")
    ) {
      populateChildren(m, matches.value!);
      heads.push(m);
    }
  });

  return heads;
});
const loserMatches = computed((): Match[] | undefined => {
  if (!matches.value) return undefined;
  return matches.value.filter((m) => {
    if (
      m.matchQualifyUsTeamFrom === "Loser" &&
      m.matchQualifyUsTeamId &&
      m.matchQualifyThemTeamFrom === "Loser" &&
      m.matchQualifyThemTeamId
    ) {
      return m;
    }
  });
});
const populateChildren = (match: Match | undefined, matches: Match[]) => {
  if (!match) return undefined;
  if (match.matchQualifyThemTeamId)
    match.matchQualifyThemTeam = matches.find(
      (m) => +m.id == match.matchQualifyThemTeamId
    );
  if (match.matchQualifyUsTeamId)
    match.matchQualifyUsTeam = matches.find(
      (m) => +m.id == match.matchQualifyUsTeamId
    );
  populateChildren(match.matchQualifyThemTeam, matches);
  populateChildren(match.matchQualifyUsTeam, matches);
};



watch(() => props.group.id, async (new_value) => {
  const group = tourStore.tournament.groups.find(g => { g.id == new_value })
  if (group) {
    matches.value = group.matches
  }
  else {
    await fetchREQ(tourt_id, new_value);
    tourStore.tournament.groups.push({ id: props.group.id, matches: matches.value })
  }
});

const OrderedNodes = computed(() => {
    console.log(matchesTree.value )
  if (!matchesTree.value || !loserMatches.value) return undefined;
  return layoutFromMatchesTree(matchesTree.value, loserMatches.value, direction.value);
})
console.log(OrderedNodes.value?.nodes)
</script>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
</style>