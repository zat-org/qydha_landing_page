<!-- <template>
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
import { VueFlow, useVueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import type { Node, Edge } from "@vue-flow/core";
import MatchNode from "./MatchNode.vue";
import type { Match } from "~/models/group";
const { onPaneReady } = useVueFlow();
onPaneReady((instance) => instance.fitView());
const props = defineProps<{ group_id?: number }>();

import * as signalR from "@microsoft/signalr";
import { onMounted, ref } from "vue";

const groupApi = useGroup();
const groupsREQ = await groupApi.getGroups();
await groupsREQ.fetchREQ();
const groupMatchesREQ = await groupApi.getGroupMatches();
const selected_group = ref();
const router = useRouter();
const route = useRoute();
const new_edges = ref<{ id: string; source: string; target: string }[]>([]);
const new_nodes = ref<any[]>([]);
const socketMatch = ref<Match[]>([]);

  // const connection = new signalR.HubConnectionBuilder()
  //   .withUrl(
  //     "https://sam-baloot-admin.online/saudi-baloot-olympics/prod/bracket-hub",
  //     {
  //       withCredentials: true,
  //     }
  //   )
  //   .build();

  // onMounted(async () => {
    // try {
    //   await connection.start();

    //   gameString.value = await connection.invoke(
    //     "GetGroupBracket",
    //     selected_group.value
    //   );

    //   if (gameString.value) {
    //     var gameObject = JSON.parse(gameString.value);
    //     socketMatch.value = gameObject;
    //   }
    // } catch (err) {
    //   console.error(err);
    // }
  //   connection.on("BracketChanged", (groupId: number, groupData: string) => {
  //     console.log(groupId)
  //     if (groupId == selected_group.value) {
  //       gameString.value = groupData;
  //       if (gameString.value) {
  //         var gameObject = JSON.parse(gameString.value);
  //         socketMatch.value = gameObject.data;
  //         RoundNatchCounter = {};
  //         new_nodes.value = [];
  //         new_edges.value = [];
  //         const winner_round = socketMatch.value.filter((m) => {
  //           return m.level == 1;
  //         });
  //         winner_round.map((wm) => {
  //           add_node(wm);
  //           add_childre(wm);
  //         });
  //       }
  //     }
  //   });
  // });

const gameString = ref<null | string>(null);

let RoundNatchCounter: Record<number, number> = {};
const maxRoundNumebr = computed(() => {
  // if (groupMatchesREQ.data.value) {
  return socketMatch.value[0].level;
  // }
});
const calculateNodePosition = (m: Match, level: number, index: number) => {
  const xOffset = 400; // Horizontal spacing between rounds
  const yOffset = 400; // Vertical spacing between matches
  const x = (maxRoundNumebr.value! - level) * xOffset;
  let y = index * yOffset;
  if (level != 1) {
    const parentmatch = socketMatch.value.find((ma) => {
      return (
        ma.matchQualifyThemTeamId == m.id || ma.matchQualifyUsTeamId == m.id
      );
    });
    const parentnode = new_nodes.value.find((n) => {
      return parentmatch!.id == n.id;
    });

    // if (parentmatch?.matchQualifyThemTeamId  == m.id){
    //   // y = (parentnode.position.y)+(yOffset/(maxRoundNumebr.value!)-level);
    //   y = (parentnode.position.y)+50;

    // }else{
    //   y = (parentnode.position.y)-50;
    //   // y = (parentnode.position.y)-(yOffset/(maxRoundNumebr.value!)-level);

    // }

    if (level == 2) {
      if (parentmatch?.matchQualifyThemTeamId == m.id) {
        // y = (parentnode.position.y)+(yOffset/(maxRoundNumebr.value!)-level);
        y = parentnode.position.y + 100;
      } else {
        y = parentnode.position.y - 100;
        // y = (parentnode.position.y)-(yOffset/(maxRoundNumebr.value!)-level);
      }
    }

    if (level == 3) {
      if (parentmatch?.matchQualifyThemTeamId == m.id) {
        // y = (parentnode.position.y)+(yOffset/(maxRoundNumebr.value!)-level);
        y = parentnode.position.y + 50;
      } else {
        y = parentnode.position.y - 50;
        // y = (parentnode.position.y)-(yOffset/(maxRoundNumebr.value!)-level);
      }
    }
    if (level == 4) {
      if (parentmatch?.matchQualifyThemTeamId == m.id) {
        // y = (parentnode.position.y)+(yOffset/(maxRoundNumebr.value!)-level);
        y = parentnode.position.y + 15;
      } else {
        y = parentnode.position.y - 15;
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
    draggable: false,
    position: calculateNodePosition(m, m.level, RoundNatchCounter[m.level]),
  });
  RoundNatchCounter[m.level]++;
};

const add_childre = (pm: Match) => {
  if (pm.matchQualifyThemTeamId) {
    const beforethem = socketMatch.value.find((m) => {
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
    const beforeus = socketMatch.value.find((m) => {
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
  // console.log( groupsREQ.data.value?.data[0].id)
  selected_group.value = groupsREQ.data.value?.data[0].id;
  // typeof value !== 'undefined' && !isNaN(value)
  if (typeof props.group_id !== "undefined") {
    selected_group.value = props.group_id;
  }
  // try {
  //   gameString.value = await connection.invoke(
  //     "GetGroupBracket",
  //     selected_group.value
  //   );

  //   if (gameString.value) {
  //     var gameObject: { data: Match[]; message: string } = JSON.parse(
  //       gameString.value
  //     );
  //     socketMatch.value = gameObject.data;
  //   }
  // } catch (err) {
  //   console.error(err);
  // }
  await groupMatchesREQ.fetchREQ(selected_group.value);
  if (groupMatchesREQ.data.value) {
    socketMatch.value = groupMatchesREQ.data.value.data;
    const winner_round = socketMatch.value.filter((m) => {
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
  router.push({ path: route.path, query: { group: group_id } });
};

watch(selected_group, async (new_value, old_value) => {
  RoundNatchCounter = {};
  new_nodes.value = [];
  new_edges.value = [];
  // try {
  //   gameString.value = await connection.invoke(
  //     "GetGroupBracket",
  //     selected_group.value
  //   );

  //   if (gameString.value) {
  //     var gameObject: { data: Match[]; message: string } = JSON.parse(
  //       gameString.value
  //     );
  //     socketMatch.value = gameObject.data;
  //     // console.log(gameObject.Data)
  //   }
  // } catch (err) {
  //   console.error(err);
  // }
  await groupMatchesREQ.fetchREQ(selected_group.value);
  if (groupMatchesREQ.data.value) {
    socketMatch.value = groupMatchesREQ.data.value.data;

  const winner_round = socketMatch.value.filter((m) => {
    return m.level == 1;
  });

  winner_round.map((wm) => {
    add_node(wm);
    add_childre(wm);
  });
  }
});

</script>

<style>
@import "@vue-flow/core/dist/style.css";

/* import the default theme, this is optional but generally recommended */
@import "@vue-flow/core/dist/theme-default.css";
</style> -->
