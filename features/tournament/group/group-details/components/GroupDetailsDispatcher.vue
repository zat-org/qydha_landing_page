<template>
  <component
    :is="stateComponent"
    :group-details="groupDetails"
    :actions="actions"
    v-bind="linkingProps"
    @update:selected-teams="emit('update:selectedTeams', $event)"
  />
</template>

<script lang="ts" setup>
import type { Component } from "vue";
import { computed } from "vue";
import { GroupState, type DetailGroup } from "~/features/tournament/models/group";
import type { GroupDetailsActions } from "../types";
import GroupCreatedState from "./states/GroupCreatedState.vue";
import GroupTeamsLinkingState from "./states/GroupTeamsLinkingState.vue";

const STATE_COMPONENTS: Partial<Record<GroupState, Component>> = {
  [GroupState.Created]: GroupCreatedState,
  [GroupState.TeamsLinking]: GroupTeamsLinkingState,
};

const props = defineProps<{
  groupDetails: DetailGroup;
  actions: GroupDetailsActions;
  selectedTeams: Record<string, boolean>;
}>();

const emit = defineEmits<{
  "update:selectedTeams": [value: Record<string, boolean>];
}>();

const stateComponent = computed(() => {
  return STATE_COMPONENTS[props.groupDetails.state] ?? GroupCreatedState;
});

const linkingProps = computed(() => {
  if (props.groupDetails.state !== GroupState.TeamsLinking) return {};
  return { selectedTeams: props.selectedTeams };
});
</script>
