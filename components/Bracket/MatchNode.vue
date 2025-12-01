<template>
  <div>
    <Handle type="target" :position="Position.Left" style="opacity: 0" />
    <div class="flex flex-col w-[300px] h-[86px] text-xs font-semibold p-1 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md relative" 
      :class="matchContainerClasses">

      <!-- Optional logo bound to this node -->
      <img
        v-if="showLogo"
        :src="QydhaLogo"
        alt="Qydha logo"
        class="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white shadow-md pointer-events-none"
      />
      
      <div :class="firstTeamClasses"
        class="flex justify-between items-center pe-1 bg-gray-300 dark:bg-gray-700 rounded-t-md rounded-b-none border border-gray-500 dark:border-gray-600 h-[22px] w-full transition-all duration-200">

        <!-- <div class="border-e-2 w-[30px] h-full border-gray-900 dark:border-gray-400 text-center flex justify-center items-center bg-gray-300 dark:bg-gray-700">
           <p class="dark:text-gray-200">
            {{ firstTeamId }}
          </p> 
        </div> -->

        <p v-if="data.match.usTeamId" class="grow text-center dark:text-gray-200 font-medium px-1 truncate" :class="firstTeamNameClasses">
          {{ data.match.usTeamName }}
        </p>
        <p class="grow text-center text-gray-600 dark:text-gray-400 text-[10px] px-1" v-else-if="!data.match.usTeamId && data.match.state !== 'Ended'">
          لم يحدد بعد
        </p>
        <p class="grow text-center text-red-500 dark:text-red-400 text-[10px] px-1" v-else-if="!data.match.usTeamId && data.match.state === 'Ended'">
          انسحب كلا الفريقين
        </p>
      </div>

      <div :class="secondTeamClasses"
        class="flex justify-between items-center pe-1 bg-gray-300 dark:bg-gray-700 border border-gray-500 dark:border-gray-600 border-t-0 text-center h-[22px] w-full transition-all duration-200">
<!-- 
        <div class="border-e-2 w-[30px] h-full border-gray-900 dark:border-gray-400 text-center flex justify-center items-center bg-gray-300 dark:bg-gray-700">
           <p class="dark:text-gray-200">
            {{ secondTeamId }}
          </p>  </div> -->

        <p v-if="data.match.themTeamName" class="grow text-center dark:text-gray-200 font-medium px-1 truncate" :class="secondTeamNameClasses">
          {{ data.match.themTeamName }}
        </p>
        <p class="grow text-center text-gray-600 dark:text-gray-400 text-[10px] px-1" v-else-if="!data.match.themTeamId && data.match.state != 'Ended'">
          لم يحدد بعد
        </p>
        <p class="grow text-center text-red-500 dark:text-red-400 text-[10px] px-1" v-else-if="!data.match.themTeamId && data.match.state == 'Ended'">
          انسحب كلا الفريقين
        </p>
      </div>

      <div class="flex justify-between items-center text-center h-7 gap-1">
        <!-- Status icon with enhanced styling -->
        <UTooltip :text="matchStatusText" :disabled="!matchStatusText">
          <div class="flex items-center justify-center bg-gray-300 dark:bg-gray-700 rounded-bl-md rounded-br-none rounded-t-none border border-gray-500 dark:border-gray-600 border-t-0 px-2 min-w-[32px] hover:bg-gray-400 dark:hover:bg-gray-600 transition-all duration-200 group">
            <IconSleepGame v-if="isMatchCreatedOrPaused" class="text-gray-700 dark:text-gray-300 text-base group-hover:scale-110 transition-transform" />
            <IconRunningGame v-if="isMatchRunning" class="text-green-600 dark:text-green-400 animate-pulse text-base group-hover:scale-110 transition-transform" />
            <IconEndedGame v-if="isMatchEnded" class="text-red-600 dark:text-red-400 text-base group-hover:scale-110 transition-transform" />
          </div>
        </UTooltip>

        <!-- Action buttons with enhanced hover effects -->
        <div class="flex gap-0.5 items-center">
          <UTooltip v-if="showInfoButton" text="معلومات المباراة">
            <button 
              class="p-1 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 hover:scale-110 active:scale-95 transition-all duration-200"
              @click="onclick">
              <IconInfo class="text-base text-green-500 dark:text-green-400" />
            </button>
          </UTooltip>

          <UTooltip v-if="hasAdminPrivileges && !isMatchEnded" text="تعديل المباراة">
            <button 
              class="p-1 rounded-md hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:scale-110 active:scale-95 transition-all duration-200"
              @click="onEdit">
              <IconSetting class="text-base text-yellow-500 dark:text-yellow-400" />
            </button>
          </UTooltip>

          <UTooltip v-if="showRefereeIcon"
            :text="`الحكم: ${data.match.referee?.username}`">
            <button class="p-1 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-110 active:scale-95 transition-all duration-200">
              <IconRefree class="text-base text-blue-500 dark:text-blue-400" />
            </button>
          </UTooltip>
        </div>

        <!-- Match info with enhanced compact layout -->
        <UTooltip :text="matchInfoTooltip" :disabled="!matchInfoTooltip">
          <div class="flex items-center n gap-1 bg-gray-300 dark:bg-gray-700 rounded-br-md rounded-bl-none rounded-t-none border border-gray-500 dark:border-gray-600 border-t-0 px-2 hover:bg-gray-400 dark:hover:bg-gray-600 active:bg-gray-500 dark:active:bg-gray-500 transition-all duration-200 cursor-pointer flex-1 min-w-0 group"
            @click="copyClibboard">
            <IconTable class="text-sm flex-shrink-0 flex justify-between  text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors" />
            <div class="flex items-center gap-1 min-w-0 flex-1 overflow-hidden">
              <p v-if="data.match.tableName" class="dark:text-gray-200 text-[10px] font-medium truncate">{{ data.match.tableName }}</p>
              
              <template v-if="data.match.roundName">
                <span v-if="data.match.tableName" class="text-[8px] text-gray-400 dark:text-gray-500 flex-shrink-0 mx-0.5">•</span>
                <p class="text-[10px] dark:text-gray-300 text-gray-600 truncate font-medium">{{ data.match.roundName }}</p>
                <span class="text-[9px] text-gray-500 dark:text-gray-400 flex-shrink-0 font-semibold">:جولة</span>
              </template>
              
              <template v-if="data.match.startAt">
                <span v-if="(data.match.tableName || data.match.roundName)" class="text-[8px] text-gray-400 dark:text-gray-500 flex-shrink-0 mx-0.5">•</span>
                <p class="text-[10px] dark:text-gray-300 text-gray-600 truncate font-medium">{{ formatDateTime(data.match.startAt) }}</p>
              </template>
            </div>
          </div>
        </UTooltip>
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
import QydhaLogo from "@/assets/images/qydha-logo.svg";

const props = defineProps<{ data: { match: Match; showLogo?: boolean } }>();

const showLogo = computed(() => props.data.showLogo === true);
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

// Match status text for tooltip
const matchStatusText = computed(() => {
  if (props.data.match.state === 'Running') return 'المباراة جارية';
  if (props.data.match.state === 'Paused') return 'المباراة متوقفة';
  if (props.data.match.state === 'Created') return 'المباراة جاهزة';
  if (props.data.match.state === 'Ended') return 'المباراة انتهت';
  return '';
});

// Compact date time format (shorter for UI)
const compactDateTime = computed(() => {
  if (!props.data.match.startAt) return '';
  try {
    const date = new Date(props.data.match.startAt);
    // Format: DD/MM HH:MM (more compact)
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}/${month} ${hours}:${minutes}`;
  } catch (error) {
    return '';
  }
});

// Full tooltip text for match info
const matchInfoTooltip = computed(() => {
  const parts = [];
  if (props.data.match.tableName) parts.push(`الطاولة: ${props.data.match.tableName}`);
  if (props.data.match.roundName) parts.push(`الجولة: ${props.data.match.roundName}`);
  if (props.data.match.startAt) parts.push(`الوقت: ${formatDateTime(props.data.match.startAt)}`);
  return parts.length > 0 ? parts.join(' | ') : '';
});

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
