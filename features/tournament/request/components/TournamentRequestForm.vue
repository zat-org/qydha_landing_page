<template>
    <Suspense>
    <component :is="FormComponent" class="flex min-h-0 flex-1 flex-col" />
    <template #fallback>
        <loading class="mt-10" />
    </template>
    </Suspense>
</template>

<script setup lang="ts" >
import { TournamentRequsetFormType} from '~/features/tournament/models/tournamentRequest';

import AddForm from '~/features/tournament/request/components/Add/index.vue'
import UpdateForm from '~/features/tournament/request/components/Update/index.vue'
import { Suspense } from 'vue';

const { mode } = defineProps<{ mode: TournamentRequsetFormType }>()

const FormComponent = computed(() => {
    if (mode == TournamentRequsetFormType.Add) {
        return AddForm
    }
    else if (mode == TournamentRequsetFormType.Update) {
        return UpdateForm
    }
})


</script>

<style scoped></style>
