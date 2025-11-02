<template>
    <Suspense>
    <component :is="FormComponent" />
    <template #fallback>
        <loading class="mt-10" />
    </template>
    </Suspense>
</template>

<script setup lang="ts" >
import { TournamentRequsetFormType} from '~/models/tournamentRequest';

import AddForm from '~/components/Tournament/Request/Add/index.vue'
import UpdateForm from '~/components/Tournament/Request/Update/index.vue'
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