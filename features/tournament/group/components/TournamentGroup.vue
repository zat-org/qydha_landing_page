<template>
    <UCard class="flex flex-col flex-1 [&_[data-slot=body]]:flex-1">
        <template #header>
            <GroupsHeader />
        </template>

        <div v-if="status == 'pending'" class="flex justify-center items-center py-8">
            <Loading />
        </div>
        <div v-else-if="error" class="text-red-500 p-4">
            <UAlert color="error" variant="soft" icon="i-heroicons-exclamation-triangle" title="خطأ في تحميل المجموعات" :description="error.message" />
        </div>

        <UAccordion v-else :items="accordionItems"  class="w-full  border border-gray-200 dark:border-gray-700 rounded-lg px-2" v-model="active">
            <template v-for="(item, index) in accordionItems" :key="`slot-${index}`" v-slot:[item.slot] class="px-4">
                <Suspense>
                    <GroupDetails :group="groups[index]" v-if="groups[index].state == GroupState.TeamsLinking || groups[index].state == GroupState.Created"  />
                    <RoundsGroupDetails
                        :group="groups[index]"
                        v-else-if="
                            groups[index].state == GroupState.MatchesGenerated
                            || groups[index].state == GroupState.MatchesRunning
                            || groups[index].state == GroupState.MatchesFinished
                        "
                    />
                    <template #fallback>   
                        <Loading />
                    </template>
                </Suspense>
            </template>
        </UAccordion>

    </UCard>
</template>

<script lang="ts" setup>
import GroupsHeader from "./GroupsHeader.vue";
import Loading from "~/components/loading.vue";
import GroupDetails from "./GroupDetails.vue";
import RoundsGroupDetails from "./RoundsGroupDetails.vue";
import { GroupState } from "~/features/tournament/models/group";
// Props
interface Props {
    tournamentId: string;
}
const active = ref("0")
const props = defineProps<Props>();

const groupApi = useGroup();

const { data, pending, error, refresh, status } =   await groupApi.getGroups(props.tournamentId);

const groups = computed(() => {
    return data.value?.data.groups || []
})

const accordionItems = computed(() => {
    return groups.value.map((group, index) => ({
        label: group.name || `Group ${index + 1}`,
        slot: `group-${index}`,
        defaultOpen: false
    }))
})

</script>

<style scoped>
</style>
