<template>
    <UCard :ui="{ root: 'flex flex-col flex-1', body: 'flex-1 ' }">
        <template #header>
            <GroupsHeader :tournament-id="props.tournamentId" />
        </template>

        <div v-if="status == 'pending'" class="flex justify-center items-center py-8">
            <loading />
        </div>
        <div v-else-if="error" class="text-red-500 p-4">
            <UAlert color="error" variant="soft" icon="i-heroicons-exclamation-triangle" title="خطأ في تحميل المجموعات" :description="error.message" />
        </div>

        <UAccordion v-else :items="accordionItems"  class="w-full  border border-gray-200 dark:border-gray-700 rounded-lg px-2" v-model="active">
            <template v-for="(item, index) in accordionItems" :key="`slot-${index}`" v-slot:[item.slot] class="px-4">
                <Suspense>
                    <GroupDetails :group="groups[index]" v-if="groups[index].state == GroupState.TeamsLinking || groups[index].state == GroupState.Created"  />
                    <RoundsGroupDetails :group="groups[index]" v-else-if="groups[index].state == GroupState.MatchesGenerated || groups[index].state == GroupState.MatchesRunning" />
                    <template #fallback>   
                        <loading />
                    </template>
                </Suspense>
            </template>
        </UAccordion>

    </UCard>
</template>

<script lang="ts" setup>
import GroupsHeader from "./GroupsHeader.vue";
import loading from "~/components/loading.vue";
import GroupDetails from "./GroupDetails.vue";
import RoundsGroupDetails from "./RoundsGroupDetails.vue";
import { GroupState } from "~/models/group";
import type { Group, Match } from "~/models/group";
// Props
interface Props {
    tournamentId: string;
}
const active = ref("0")
const props = defineProps<Props>();

const groupApi = useGroup();

// Expanded groups and rounds state

// Data fetching

const { data, pending, error, refresh, status } =   await groupApi.getGroups(props.tournamentId);

const groups = computed(() => {
    return data.value?.data.groups || []
})

// Create accordion items from groups
const accordionItems = computed(() => {
    return groups.value.map((group, index) => ({
        label: group.name || `Group ${index + 1}`,
        slot: `group-${index}`,
        defaultOpen: false
    }))
})

// Fetch groups on component mount
// onMounted(async () => {
//     if (props.tournamentId) {
//         await fetchREQ(props.tournamentId);
//     }
// });



</script>

<style scoped>
/* Custom styles if needed */
</style>
