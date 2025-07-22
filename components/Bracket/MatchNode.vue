<template>
  <div>
    <Handle type="target" :position="Position.Left" style="opacity: 0" />
    <div class="flex flex-col w-[300px] h-[86px] text-xs font-semibold p-1 rounded transition-colors duration-200" 
      :class="matchContainerClasses">
      
      <div :class="firstTeamClasses"
        class="flex justify-between items-center pe-1 bg-gray-300 dark:bg-gray-700 rounded rounded-b-none border border-gray-500 dark:border-gray-600 h-[22px] w-full">

        <div class="border-e-2 w-[30px] h-full border-gray-900 dark:border-gray-400 text-center flex justify-center items-center bg-gray-300 dark:bg-gray-700">
          <p class="dark:text-gray-200">
            {{ firstTeamId }}
          </p>
        </div>

        <p v-if="data.match.usTeamId" class="grow text-center dark:text-gray-200" :class="firstTeamNameClasses">
          {{ data.match.usTeamName }}
        </p>
        <p class="grow text-center text-gray-600 dark:text-gray-400" v-else-if="!data.match.usTeamId && data.match.state !== 'Ended'">
          لم يحدد بعد
        </p>
        <p class="grow text-center text-red-500 dark:text-red-400" v-else-if="!data.match.usTeamId && data.match.state === 'Ended'">
          انسحب كلا الفريقين
        </p>
      </div>

      <div :class="secondTeamClasses"
        class="flex justify-between items-center pe-1 bg-gray-300 dark:bg-gray-700 border border-gray-500 dark:border-gray-600 text-center h-[22px] w-full">

        <div class="border-e-2 w-[30px] h-full border-gray-900 dark:border-gray-400 text-center flex justify-center items-center bg-gray-300 dark:bg-gray-700">
          <p class="dark:text-gray-200">
            {{ secondTeamId }}
          </p>
        </div>

        <p v-if="data.match.themTeamName" class="grow text-center dark:text-gray-200" :class="secondTeamNameClasses">
          {{ data.match.themTeamName }}
        </p>
        <p class="grow text-center text-gray-600 dark:text-gray-400" v-else-if="!data.match.themTeamId && data.match.state != 'Ended'">
          لم يحدد بعد
        </p>
        <p class="grow text-center text-red-500 dark:text-red-400" v-else-if="!data.match.themTeamId && data.match.state == 'Ended'">
          انسحب كلا الفريقين
        </p>
      </div>

      <div class="flex justify-between text-center h-7 gap-1">
        <div class="flex items-center bg-gray-300 dark:bg-gray-700 rounded rounded-t-none border border-gray-500 dark:border-gray-600 px-2 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-200">
          <IconSleepGame v-if="isMatchCreatedOrPaused" class="text-gray-700 dark:text-gray-300" />
          <IconRunningGame v-if="isMatchRunning" class="text-green-600 dark:text-green-400 animate-pulse" />
          <IconEndedGame v-if="isMatchEnded" class="text-red-600 dark:text-red-400" />
        </div>

        <!-- Action buttons with hover effects -->
        <div class="flex gap-1">
          <button v-if="showInfoButton" 
            class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            @click="onclick">
            <IconInfo class="text-xl text-green-500 dark:text-green-400" />
          </button>

          <button v-if="hasAdminPrivileges"
            class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
            @click="onEdit">
            <IconSetting class="text-xl text-yellow-500 dark:text-yellow-400" />
          </button>

          <UTooltip v-if="showRefereeIcon"
            :text="data.match.referee?.username">
            <button class="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
              <IconRefree class="text-xl text-blue-500 dark:text-blue-400" />
            </button>
          </UTooltip>
        </div>

        <!-- Match info with hover effects -->
        <div class="flex items-center bg-gray-300 dark:bg-gray-700 rounded rounded-t-none border border-gray-500 dark:border-gray-600 px-2 hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
          @click="copyClibboard">
          <IconTable class="text-xl mr-1" />
          <p class="dark:text-gray-200">{{ data.match.tableName }}</p>
        </div>
      </div>
    </div>
    <Handle type="source" :position="Position.Right" style="opacity: 0" />
  </div>
</template>

<script lang="ts" setup>
import { Position } from "@vue-flow/core";
import { Handle } from "@vue-flow/core";
import type { Match } from "@/models/group";
import { useMyAuthStore } from "@/store/Auth";
import StatusModal from "../Bracket/StatusModal.vue";
import EditModal from "../Bracket/EditModal.vue";

const props = defineProps<{ data: { match: Match } }>();
const useStore = useMyAuthStore()
const { privilege, permissions } = storeToRefs(useStore)
const overlay = useOverlay();
const toast = useToast();

// Computed properties for conditional classes
const matchContainerClasses = computed(() => ({
  'bg-blue-200 dark:bg-blue-800': props.data.match.state == 'Running' || props.data.match.state == 'Paused',
  'bg-white dark:bg-gray-800': props.data.match.level != 1 && props.data.match.state == 'Created' || props.data.match.state == 'Ended',
  'border-2 border-[#FFD200] dark:border-yellow-500': props.data.match.level == 1 && props.data.match.matchQualifyThemTeamFrom == 'Winner' && props.data.match.matchQualifyUsTeamFrom == 'Winner',
  'border-2 border-[#536976] dark:border-gray-600': props.data.match.level == 1 && props.data.match.matchQualifyThemTeamFrom == 'Loser' && props.data.match.matchQualifyUsTeamFrom == 'Loser',
}));

const firstTeamClasses = computed(() => ({
  'bg-green-300 dark:bg-green-700': props.data.match.winner?.toLowerCase() == 'us' && props.data.match.level != 1,
  'bg-gradient-to-r from-[#F7971E] to-[#FFD200] dark:from-yellow-600 dark:to-yellow-400': props.data.match.winner?.toLowerCase() == 'us' && props.data.match.level == 1,
  'bg-red-300 dark:bg-red-700': props.data.match.state == 'Ended' && (props.data.match.winner?.toLowerCase() == 'them' || !props.data.match.winner),
  'bg-gradient-to-r to-slate-300 from-slate-500 dark:to-gray-600 dark:from-gray-800': props.data.match.winner?.toLowerCase() != 'us' && props.data.match.level == 1 && props.data.match.matchQualifyThemTeamFrom == 'Winner',
}));

const secondTeamClasses = computed(() => ({
  'bg-green-300 dark:bg-green-700': props.data.match.winner?.toLowerCase() == 'them' && props.data.match.level != 1,
  'bg-gradient-to-r from-[#F7971E] to-[#FFD200] dark:from-yellow-600 dark:to-yellow-400': props.data.match.winner?.toLowerCase() == 'them' && props.data.match.level == 1,
  'bg-red-300 dark:bg-red-700': props.data.match.state == 'Ended' && (props.data.match.winner?.toLowerCase() == 'us' || !props.data.match.winner),
  'bg-gradient-to-r to-slate-300 from-slate-500 dark:to-gray-600 dark:from-gray-800': props.data.match.winner?.toLowerCase() == 'us' && props.data.match.level == 1 && props.data.match.matchQualifyThemTeamFrom == 'Winner',
}));

const firstTeamNameClasses = computed(() => ({
  'line-through opacity-50': props.data.match.state == 'Ended' && !props.data.match.qydhaGameId && 
    (props.data.match.winner?.toLowerCase() == 'them' || !props.data.match.winner),
}));

const secondTeamNameClasses = computed(() => ({
  'line-through opacity-50': props.data.match.state == 'Ended' && !props.data.match.qydhaGameId && 
    (props.data.match.winner?.toLowerCase() == 'us' || !props.data.match.winner),
}));

// Computed properties for team IDs
const firstTeamId = computed(() => {
  return props.data.match.usTeamName && props.data.match.usTeamName.split("-").length > 1 
    ? props.data.match.usTeamName.split("-")[0] 
    : props.data.match.usTeamId;
});

const secondTeamId = computed(() => {
  return props.data.match.themTeamName && props.data.match.themTeamName.split("-").length > 1 
    ? props.data.match.themTeamName.split("-")[0] 
    : props.data.match.themTeamId;
});

// Computed properties for conditional rendering
const isMatchCreatedOrPaused = computed(() => 
  props.data.match.state == 'Created' || props.data.match.state == 'Paused'
);

const isMatchRunning = computed(() => 
  props.data.match.state == 'Running'
);

const isMatchEnded = computed(() => 
  props.data.match.state == 'Ended'
);

const showInfoButton = computed(() => 
  props.data.match.qydhaGameId && props.data.match.state != 'Created'
);

const hasAdminPrivileges = computed(() => 
  privilege?.value?.toLowerCase() == 'admin' || 
  privilege?.value?.toLowerCase() == 'owner' || 
  permissions.value.includes('')
);

const showRefereeIcon = computed(() => 
  hasAdminPrivileges.value && props.data.match.referee
);

const onclick = () => {
  overlay.create(StatusModal, {
    props: {
      m: props.data.match
    }
  }).open();
};

const copyClibboard = async () => {
  try {
    await navigator.clipboard.writeText(`
    id:${props.data.match.id}
    qydhaGameId: ${props.data.match.qydhaGameId} 
    refereeId: ${props.data.match.referee?.id}
    `);
    toast.add({
      title: 'Copied!',
      description: 'Match details copied to clipboard',
      duration: 2000
    });
  } catch (error) {
    console.error('Failed to copy text to clipboard:', error);
    toast.add({
      title: 'Error',
      description: 'Failed to copy to clipboard',
      color: 'error'
    });
  }
};

const onEdit = () => {
  overlay.create(EditModal, {
    props: {
      match: props.data.match
    }
  }).open()
}
</script>

<style>
.dark {
  color-scheme: dark;
}
</style>
