<template>
  <UButtonGroup size="2xs" orientation="horizontal" v-if="groupsREQ.data.value" class="flex flex-wrap">
    <UButton class="basis-[20px] grow" v-for="item in groupsREQ.data.value.data" :label="`${item.name}`"
      :color="selected_group == item.id ? 'green' : 'white'" block @click="handleGroupSelection(item.id)" />
  </UButtonGroup>
  <VueFlow v-if="groupMatchesREQ.graphData.value" :nodes="OrderedNodes" :edges="groupMatchesREQ.graphData.value.edges"
    @nodes-initialized="layoutGraph('LR')">
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
import { ref } from "vue";
const { onPaneReady, fitView } = useVueFlow();
const props = defineProps<{ group_id?: number }>();
const { layout } = useLayout()

const selected_group = ref<number>(props.group_id ?? 0);

const handleGroupSelection = (group_id: number) => {
  selected_group.value = group_id;
  useRouter().push({ path: useRoute().path, query: { group: group_id } });
};

const groupApi = useGroup();
const groupsREQ = await groupApi.getGroups();
await groupsREQ.fetchREQ();

const groupMatchesREQ = await groupApi.getGroupMatches();

if (groupsREQ.status.value == "success" && groupsREQ.data.value && selected_group.value === 0) {
  selected_group.value = groupsREQ.data.value.data[0].id;
}
await groupMatchesREQ.fetchREQ(selected_group.value);
const OrderedNodes = ref(groupMatchesREQ.graphData.value ? groupMatchesREQ.graphData.value.nodes : undefined);

// onPaneReady((instance) => instance.fitView());
async function layoutGraph(direction: "TB" | "BT" | "LR" | "RL") {
  if (!groupMatchesREQ.graphData.value) return;
  OrderedNodes.value = layout(groupMatchesREQ.graphData.value.nodes, groupMatchesREQ.graphData.value.edges, direction)
  nextTick(() => {
    fitView()
  })
}

watch(selected_group, async (new_value, old_value) => {

});

</script>

<style>
@import "@vue-flow/core/dist/style.css";
@import "@vue-flow/core/dist/theme-default.css";
</style>
