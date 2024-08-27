<template>
  <UButtonGroup
    size="2xs"
    orientation="horizontal"
    v-if="groupsREQ.data.value"
    class="flex flex-wrap">
    <UButton
      class="basis-[20px] grow"
      v-for="item in groupsREQ.data.value.data"
      :label="`${item.name}`"
      :color="selected_group == item.id ? 'green' : 'white'"
      block
      @click="onSelect(item.id)" />
  </UButtonGroup>
  <VueFlow v-if="new_nodes" :nodes="new_nodes" :edges="new_edges">
    <Background />
    <template #node-match="matchprops">
      <MatchNode v-bind="matchprops" />
    </template>
  </VueFlow>
</template>

<script lang="ts" setup>
import { VueFlow,useVueFlow  } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import type { Node, Edge } from "@vue-flow/core";
import MatchNode from "./MatchNode.vue";
import type { Match } from "~/models/group";
const { onPaneReady } = useVueFlow()
onPaneReady((instance) => instance.fitView())
const groupApi = useGroup();
const groupsREQ = await groupApi.getGroups();
await groupsREQ.fetchREQ();
const groupMatchesREQ = await groupApi.getGroupMatches();
const selected_group = ref();
const new_edges = ref<{ id: string; source: string; target: string }[]>([]);
const new_nodes = ref<any[]>([]);


let RoundNatchCounter: Record<number, number> = {};
  const maxRoundNumebr = computed(() => {
  if (groupMatchesREQ.data.value) {
    return groupMatchesREQ.data.value.data[0].level;
  }
});
const calculateNodePosition = ( m:Match,level: number, index: number) => {
  const xOffset =250; // Horizontal spacing between rounds
  const yOffset = 300; // Vertical spacing between matches
  const x = (maxRoundNumebr.value! - level) * xOffset;
  let y=index * yOffset;
  if (level!=1){
    const parentmatch = groupMatchesREQ.data.value?.data.find((ma) => {
      return ma.matchQualifyThemTeamId == m.id || ma.matchQualifyUsTeamId == m.id;
    });
    const parentnode =new_nodes.value.find(n=>{return parentmatch!.id==n.id})
    
      // if (parentmatch?.matchQualifyThemTeamId  == m.id){
      //   // y = (parentnode.position.y)+(yOffset/(maxRoundNumebr.value!)-level);
      //   y = (parentnode.position.y)+50;

      // }else{
      //   y = (parentnode.position.y)-50;
      //   // y = (parentnode.position.y)-(yOffset/(maxRoundNumebr.value!)-level);

      // }
  
      if (level== 2)     {
        if (parentmatch?.matchQualifyThemTeamId  == m.id){
        // y = (parentnode.position.y)+(yOffset/(maxRoundNumebr.value!)-level);
        y = (parentnode.position.y)+80;

      }else{
        y = (parentnode.position.y)-80;
        // y = (parentnode.position.y)-(yOffset/(maxRoundNumebr.value!)-level);
      } 
      }
        
      if (level== 3)     {
        if (parentmatch?.matchQualifyThemTeamId  == m.id){
        // y = (parentnode.position.y)+(yOffset/(maxRoundNumebr.value!)-level);
        y = (parentnode.position.y)+40;

      }else{
        y = (parentnode.position.y)-40;
        // y = (parentnode.position.y)-(yOffset/(maxRoundNumebr.value!)-level);
      } 
      }
      if (level== 4)     {
        if (parentmatch?.matchQualifyThemTeamId  == m.id){
        // y = (parentnode.position.y)+(yOffset/(maxRoundNumebr.value!)-level);
        y = (parentnode.position.y)+10;

      }else{
        y = (parentnode.position.y)-10;
        // y = (parentnode.position.y)-(yOffset/(maxRoundNumebr.value!)-level);
      } 
      }
  }

  return { x, y };
};

const add_node = (m: Match) => {
  if (RoundNatchCounter[m.level] === undefined) {
    RoundNatchCounter[m.level] = 0;
  }
  
  new_nodes.value.push({
    id: m.id.toString(),
    data: m,
    type: "match",
    // draggable: false,
    position: calculateNodePosition(m, m.level, RoundNatchCounter[m.level]),
  });
  RoundNatchCounter[m.level]++;


};

const add_childre = (pm: Match) => {
  if (pm.matchQualifyThemTeamId) {
    const beforethem = groupMatchesREQ.data.value?.data.find((m) => {
      return m.id == pm.matchQualifyThemTeamId;
    });
    add_node(beforethem!);
    new_edges.value.push({
      id: pm.matchQualifyThemTeamId.toString() + "=>" + pm.id.toString(),
      source: pm.matchQualifyThemTeamId.toString(),
      target: pm.id.toString(),
    });
    if (
      beforethem?.matchQualifyThemTeamId ||
      beforethem?.matchQualifyUsTeamId
    ) {
      add_childre(beforethem);
    }
  }
  if (pm.matchQualifyUsTeamId) {
    const beforeus = groupMatchesREQ.data.value?.data.find((m) => {
      return m.id == pm.matchQualifyUsTeamId;
    });
    add_node(beforeus!);
    new_edges.value.push({
      id: pm.matchQualifyUsTeamId.toString() + "=>" + pm.id.toString(),
      source: pm.matchQualifyUsTeamId.toString(),
      target: pm.id.toString(),
    });
    if (beforeus?.matchQualifyThemTeamId || beforeus?.matchQualifyUsTeamId) {
      add_childre(beforeus);
    }
  }
};
if (groupsREQ.status.value == "success") {
  selected_group.value = groupsREQ.data.value?.data[0].id;

  await groupMatchesREQ.fetchREQ(selected_group.value);
  if (groupMatchesREQ.data.value) {
  const winner_round = groupMatchesREQ.data.value.data.filter((m) => {
    return m.level == 1;
  });
  winner_round.map((wm) => {
    add_node(wm);
    add_childre(wm);
  });
}
}
const onSelect = (group_id: number) => {
  selected_group.value = group_id;
};
watch(selected_group, async (new_value, old_value) => {
  RoundNatchCounter={}
  new_nodes.value=[]
  new_edges.value =[]
  await groupMatchesREQ.fetchREQ(new_value);
  if (groupMatchesREQ.data.value) {
  const winner_round = groupMatchesREQ.data.value.data.filter((m) => {
    return m.level == 1;
  });
  winner_round.map((wm) => {
    add_node(wm);
    add_childre(wm);
  });
}
});



// if (groupMatchesREQ.data.value) {
//   const winner_round = groupMatchesREQ.data.value.data.filter((m) => {
//     return m.level == 1;
//   });
//   winner_round.map((wm) => {
//     add_node(wm);
//     add_childre(wm);
//   });
// }
// const new_nodes = computed(() => {
//   if (groupMatchesREQ.data.value) {
//     const nodes = groupMatchesREQ.data.value.data.matches.reverse().map((m) => {
//       if (RoundNatchCounter[m.level] === undefined) {
//         RoundNatchCounter[m.level] = 0;
//       }
//       const new_m: Node = {
//         id: m.id.toString(),
//         data: m,
//         type: "match",
//         draggable: false,
//         position: calculateNodePosition(m.level, RoundNatchCounter[m.level]),
//       };
//       RoundNatchCounter[m.level]++;
//       // console.log(m.level);
//       // console.log(m.matchQualifyThemTeamId);
//       // console.log(m.matchQualifyUsTeamId);

//       if (m.matchQualifyThemTeamId !== null) {
//         console.log(m.level);
//         new_edges.value.push({
//           id: m.matchQualifyThemTeamId.toString() + "=>" + m.id.toString(),
//           source: m.matchQualifyThemTeamId.toString(),
//           target: m.id.toString(),
//         });
//       }
//       if (m.matchQualifyUsTeamId !== null) {
//         console.log(m.level);

//         new_edges.value.push({
//           id: m.matchQualifyUsTeamId.toString() + "=>" + m.id.toString(),
//           source: m.matchQualifyUsTeamId.toString(),
//           target: m.id.toString(),
//         });
//       }

//       return new_m;
//     });
//     return nodes;
//   }
// });
const nodes = ref<any[]>([
  {
    id: "1",
    round: 1,
    // all nodes can have a data object containing any data you want to pass to the node
    // a label can property can be used for default nodes
    data: { team1: "team1", team2: "team2" },
    type: "match",
    draggable: false,
  },
  // default node, you can omit `type: 'default'` as it's the fallback type
  {
    id: "2",
    round: 1,
    data: { team1: "team1", team2: "team2" },
    type: "match",
    draggable: false,
  },

  // An output node, specified by using `type: 'output'`
  {
    id: "3",
    round: 2,
    data: { team1: "team1", team2: "team2" },
    type: "match",
    draggable: false,
  },
]);
const matchCounters: Record<number, number> = {};

// const calculateNodePosition = (round: number, index: number) => {
//   const xOffset = 250; // Horizontal spacing between rounds
//   const yOffset = 100; // Vertical spacing between matches
//   const x = (maxRoundNumebr.value! - round) * xOffset;
//   const y = (maxRoundNumebr.value! - round) * 50 + index * yOffset;
//   return { x, y };
// };
nodes.value.forEach((node, index) => {
  const round = node.round;
  if (matchCounters[round] === undefined) {
    matchCounters[round] = 0; // Initialize match counter for this round
  }
  // const position = calculateNodePosition(node.round, matchCounters[round]);
  matchCounters[round]++;
  // node.position = position;
});

const edges = ref<Edge[]>([
  // default bezier edge
  // consists of an edge id, source node id and target node id
  {
    id: "e1->3",
    source: "1",
    target: "3",
  },

  // set `animated: true` to create an animated edge path
  {
    id: "e2->3",
    source: "2",
    target: "3",
  },

  // a custom edge, specified by using a custom type name
  // we choose `type: 'special'` for this example
]);
</script>

<style>
@import "@vue-flow/core/dist/style.css";

/* import the default theme, this is optional but generally recommended */
@import "@vue-flow/core/dist/theme-default.css";
</style>
