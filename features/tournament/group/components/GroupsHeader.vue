<template>
    <div class="flex items-center  justify-between w-full ">
        <div class="flex flex-col gap-6 ">
            <div class="flex items-center gap-4">
                <UButton
                    v-if="!embedded"
                    icon="i-heroicons-arrow-right"
                    variant="ghost"
                    @click="router.back()"
                >
                    عودة
                </UButton>
                <div>
                    <h1 class="text-xl font-bold">مجموعات البطولة</h1>
                    <p class="text-gray-500 mt-1 text-sm">عرض المجموعات والجولات والمباريات</p>
                </div>
            </div>
        </div>
        <div>
            <!-- <UButton
                v-if="showBracketButton"
                label="عرض الخريطه "
                target="_blank"
                :to="`/tournament/${tournamentId}/bracket`"
            /> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useTournamentEmbedded } from '~/features/tournament/core/components/TournamentGet/useTournamentGetWorkspace';

defineProps<{
    showBracketButton?: boolean;
}>();

const router = useRouter();
const route = useRoute();
const tournamentId = route.params.id?.toString() ?? "";
const embedded = useTournamentEmbedded();
</script>
