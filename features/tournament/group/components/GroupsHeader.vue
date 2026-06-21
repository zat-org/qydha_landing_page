<template>
    <div class="flex items-center  justify-between w-full ">
        <div class="flex flex-col gap-6 ">
            <div class="flex items-center gap-4">
                <UButton
                    v-if="showBackButton"
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
import { DEFAULT_TOURNAMENT_OUTLET_MODE, TOURNAMENT_OUTLET_MODES } from '~/features/tournament/detail/constants/tournamentEmbed.config';
import type { TournamentOutletMode } from '~/features/tournament/detail/types/outlet.types';

const props = withDefaults(
  defineProps<{
    mode?: TournamentOutletMode;
  }>(),
  { mode: DEFAULT_TOURNAMENT_OUTLET_MODE },
);

const router = useRouter();
const showBackButton = computed(() => TOURNAMENT_OUTLET_MODES[props.mode].showBackButton);
</script>
