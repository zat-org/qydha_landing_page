<template>
    <UCard>
        <template #header>
            <div class="flex flex-col gap-6 w-full">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold">مجموعات البطولة</h1>
                        <p class="text-gray-500 mt-1">عرض المجموعات والجولات والمباريات</p>
                    </div>
                    <UButton to="/tournament" icon="i-heroicons-arrow-left" variant="ghost">
                        عودة
                    </UButton>
                </div>

                <!-- Search and Filter -->

            </div>
        </template>

        <div class="flex flex-col flex-1">
            <!-- Loading State -->
            <div v-if="pending" class="flex items-center justify-center py-12">
                <UProgress indeterminate />
            </div>

            <!-- Empty State -->
            <div v-else-if="groups?.data?.groups.length === 0"
                class="flex flex-col items-center justify-center py-12 px-4">
                <UIcon name="i-heroicons-user-group" class="text-4xl text-gray-400 mb-2" />
                <p class="text-gray-500">لا توجد مجموعات متاحة</p>
            </div>

            <!-- Groups with Rounds -->
            <div v-else class="space-y-4">
                <UCard v-for="group in groups?.data?.groups || []" :key="group.id" class="overflow-hidden">
                    <!-- Group Header -->
                    <div class="p-4 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-b border-primary-200 dark:border-primary-800 cursor-pointer hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
                        @click="toggleGroup(group.id)">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-4 flex-1">
                                <UAvatar :text="group.name.charAt(0)" size="md" color="primary" />
                                <div class="flex-1">
                                    <div class="flex items-center gap-3 flex-wrap">
                                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                                            {{ group.name }}
                                        </h3>
                                        <UBadge variant="soft" size="sm">
                                            {{ getGroupTypeLabel(group.type) }}
                                        </UBadge>
                                        <!-- <UBadge :color="getTeamCountColor(group.teamCount)" variant="subtle" size="sm">
                                            {{ group.teamCount }} فريق
                                        </UBadge> -->
                                    </div>
                                    <!-- <div class="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        <div class="flex items-center gap-1">
                                            <UIcon name="i-mdi-clock-check-outline" class="text-base" />
                                            <span>{{ formatDateTime(group.checkInAt) }}</span>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <UIcon name="i-mdi-play-circle-outline" class="text-base" />
                                            <span>{{ formatDateTime(group.startPlayAt) }}</span>
                                        </div>
                                    </div> -->
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <UButton color="primary" variant="ghost" icon="i-heroicons-eye" label="عرض التفاصيل"
                                    @click.stop="viewGroup(group)" />
                                <UIcon
                                    :name="expandedGroups.has(group.id) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                    class="text-2xl text-gray-500 transition-transform" />
                            </div>
                        </div>
                    </div>

                    <!-- Group Rounds (Expandable) -->
                    <div v-if="expandedGroups.has(group.id)" class="p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
                        <!-- Loading Rounds -->
                        <div v-if="loadingRounds.has(group.id)" class="flex items-center justify-center py-8">
                            <UProgress indeterminate size="sm" />
                        </div>

                        <!-- Rounds -->
                        <div v-else-if="getGroupRounds(group.id)?.length" class="space-y-3">
                            <div v-for="(round, roundIndex) in getGroupRounds(group.id)" :key="round.name"
                                class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                                <!-- Round Header -->
                                <div class="p-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 flex items-center justify-between cursor-pointer hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                    @click="toggleRound(group.id, round.name)">
                                    <div class="flex items-center gap-3">
                                        <UIcon name="i-mdi-tournament"
                                            class="text-xl text-blue-600 dark:text-blue-400" />
                                        <div>
                                            <h4 class="font-semibold text-gray-900 dark:text-white">
                                                {{ round.name }}
                                            </h4>
                                            <p class="text-xs text-gray-600 dark:text-gray-400">
                                                {{ round.matches.length }} مباراة
                                            </p>
                                        </div>
                                    </div>
                                    <UIcon
                                        :name="expandedRounds.has(`${group.id}-${round.name}`) ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'"
                                        class="text-xl text-gray-500" />
                                </div>

                                <!-- Round Matches (Expandable) -->
                                <div v-if="expandedRounds.has(`${group.id}-${round.name}`)"
                                    class="p-3 bg-white dark:bg-gray-800 space-y-2">
                                    <div v-for="match in round.matches" :key="match.id"
                                        class="p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-sm transition-all">
                                        <div class="flex items-center justify-between flex-wrap gap-3">
                                            <div class="flex-1 min-w-0">
                                                <div class="flex items-center gap-2 mb-2">
                                                    <UBadge variant="soft" size="xs">
                                                        {{ getMatchStateLabel(match.state) }}
                                                    </UBadge>
                                                    <span class="text-xs text-gray-500">
                                                        {{ formatDateTime(match.startAt) }}
                                                    </span>
                                                </div>
                                                <div class="flex items-center gap-3 flex-wrap">
                                                    <div class="flex items-center gap-2">
                                                        <span class="font-medium text-gray-900 dark:text-white">
                                                            {{ match.usTeamName }}
                                                        </span>
                                                        <span class="text-gray-400">vs</span>
                                                        <span class="font-medium text-gray-900 dark:text-white">
                                                            {{ match.themTeamName }}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                                    <span v-if="match.tableName" class="flex items-center gap-1">
                                                        <UIcon name="i-mdi-table" class="text-sm" />
                                                        {{ match.tableName }}
                                                    </span>
                                                    <span v-if="match.referee?.username"
                                                        class="flex items-center gap-1">
                                                        <UIcon name="i-mdi-whistle" class="text-sm" />
                                                        {{ match.referee.username }}
                                                    </span>
                                                </div>
                                            </div>
                                            <UButton v-if="match.winner" color="success" variant="ghost" size="xs"
                                                icon="i-mdi-trophy" :label="`الفائز: ${match.winner}`" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- No Rounds -->
                        <div v-else class="text-center py-8">
                            <UIcon name="i-mdi-tournament" class="text-4xl text-gray-400 mb-2" />
                            <p class="text-gray-500">لا توجد جولات متاحة لهذه المجموعة</p>
                        </div>
                    </div>
                </UCard>
            </div>

            <!-- Tournament Levels Configuration -->
            <div v-if="editableLevels && editableLevels.length > 0" class="px-5 mt-8">
                <!-- <UDivider label="تخطيط الجولات والمستويات" class="mb-6" /> -->
                <div class="space-y-4">
                    <UCard 
                        v-for="(level, index) in editableLevels" 
                        :key="level.level"
                        class="overflow-hidden"
                    >
                        <!-- Level Header with Sakka Input -->
                        <div class="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-b border-indigo-200 dark:border-indigo-800">
                            <div class="flex items-center justify-between flex-wrap gap-4">
                                <div class="flex items-center gap-4 flex-wrap">
                                    <div class="p-2 rounded-full bg-indigo-500 text-white">
                                        <UIcon name="i-mdi-tournament" class="text-xl" />
                                    </div>
                                    <div>
                                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                                            المستوى {{ level.level }} - {{ getLevelName(level.level, editableLevels.length) }}
                                        </h3>
                                        <div class="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
                                            <span>{{ level.matchesCount }} مباراة</span>
                                            <span>•</span>
                                            <span>{{ level.roundnumber }} جولة</span>
                                            <span>•</span>
                                            <span>{{ formatTimeDuration(level.timeNeeded) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-3">
                                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                                        عدد السكك:
                                    </label>
                                    <UInput 
                                        v-model.number="level.sakkaCount" 
                                        type="number" 
                                        min="1" 
                                        max="10"
                                        placeholder="سكة"
                                        class="w-20"
                                        size="sm"
                                        @update:model-value="updateLevelSakka(level)"
                                    />
                                    <span class="text-xs text-gray-500">
                                        ({{ formatTimeDuration(calculateMatchTime(level.sakkaCount)) }}/مباراة)
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Level Configuration -->
                        <div class="p-4 space-y-4">

                            <!-- Rounds Schedule -->
                            <div class="space-y-3">
                                <div class="flex items-center justify-between">
                                    <h4 class="text-base font-semibold text-gray-900 dark:text-white">
                                        جدول الجولات
                                    </h4>
                                    <UBadge color="info" variant="soft" size="sm">
                                        {{ level.rounds.length }} جولة
                                    </UBadge>
                                </div>
                                
                                <div class="space-y-2">
                                    <div 
                                        v-for="(round, roundIndex) in level.rounds" 
                                        :key="round.id"
                                        class="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                                    >
                                        <div class="flex items-center gap-4 flex-wrap">
                                            <div class="flex items-center gap-2 min-w-[100px]">
                                                <h5 class="text-sm font-medium text-gray-900 dark:text-white">
                                                    الجولة {{ roundIndex + 1 }}
                                                </h5>
                                                <UBadge color="primary" variant="subtle" size="xs">
                                                    {{ Math.ceil(level.matchesCount / level.roundnumber) }} مباراة
                                                </UBadge>
                                            </div>
                                            
                                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                                <div class="flex-1 min-w-0">
                                                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                        وقت البدء
                                                    </label>
                                                    <UInput 
                                                        v-model="round.startAt" 
                                                        type="datetime-local"
                                                        placeholder="وقت البدء"
                                                        class="w-full"
                                                        size="sm"
                                                    />
                                                </div>
                                                
                                                <div class="flex-1 min-w-0">
                                                    <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                        وقت الانتهاء
                                                    </label>
                                                    <UInput 
                                                        v-model="round.endAt" 
                                                        type="datetime-local"
                                                        placeholder="وقت الانتهاء"
                                                        class="w-full"
                                                        size="sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>
        </div>



    </UCard>
</template>

<script lang="ts" setup>
import type { Group, Team, Match } from "~/models/group";

// Props
interface Props {
    tournamentId: string;
}
const props = defineProps<Props>();

const groupApi = useGroup();

// Composables
// import { useMyAuthStore } from "~/store/Auth";
// const userStore = useMyAuthStore();
// const { user } = storeToRefs(userStore);

// get tournamnet  teams number 
const tourTeamsReq = await useTourrnamentTeam().getAllTourTeams();
await tourTeamsReq.fetchREQ(props.tournamentId);

const teamsNumber = computed(() => { return 20; tourTeamsReq.data.value?.data.totalCount });


// get tournament  table  avilabel from single tournamnt 
const tourreq = await useTournament().getSingelTournament(props.tournamentId);
const tablesNumber = computed(() => { return 5; tourreq.data.value?.data.tournament?.expectedTablesCount });
const levelnumber = computed(() => {
    return Math.ceil(Math.log2(teamsNumber.value || 0));
});

// Import tournament calculations for match time
const { calculateMatchTime } = useTournamentCalculations();

// Type for editable level
type EditableLevel = {
    level: number;
    matchesCount: number;
    sakkaCount: number;
    timeNeeded: number;
    roundnumber: number;
    rounds: Array<{ id: number; startAt: string; endAt: string }>;
};

// Create a ref for editable levels (for two-way binding)
const editableLevels = ref<EditableLevel[]>([]);

// Function to calculate and update levels
const calculateLevels = () => {
    const levels: EditableLevel[] = [];
    const numLevels = levelnumber.value;
    
    if (numLevels <= 0 || !teamsNumber.value) {
        editableLevels.value = [];
        return;
    }

    for (let i = 1; i <= numLevels; i++) {
        // Calculate number of matches for this level
        // Level 1 (final): 1 match = 2^0
        // Level 2 (semi): 2 matches = 2^1
        // Level 3 (quarter): 4 matches = 2^2
        // Level i: 2^(i-1) matches
        const matchesCount = i == numLevels 
            ? teamsNumber.value - Math.pow(2, i - 1) 
            : Math.pow(2, i - 1);
        const roundnumber = Math.ceil(matchesCount / (tablesNumber.value || 1));
        const sakkaCount = 1; // Default, can be made dynamic based on level
        const matchTime = calculateMatchTime(sakkaCount);
        const timeNeeded = matchTime * roundnumber;

        const rounds = [];
        for (let j = 0; j < roundnumber; j++) {
            rounds.push({
                id: j,
                startAt: '',
                endAt: ''
            });
        }
        
        levels.push({
            level: i,
            matchesCount,
            timeNeeded,
            sakkaCount,
            roundnumber,
            rounds
        });
    }
    
    editableLevels.value = levels;
};

// Watch for changes in source data and recalculate
watch([teamsNumber, tablesNumber], () => {
    calculateLevels();
}, { immediate: true });

// Helper function to format time duration
const formatTimeDuration = (minutes: number): string => {
    if (!minutes || minutes <= 0) return '0 دقيقة';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) {
        return `${hours} ساعة و ${mins} دقيقة`;
    } else if (hours > 0) {
        return `${hours} ساعة`;
    }
    return `${mins} دقيقة`;
};

// Helper function to get level name in Arabic
const getLevelName = (level: number, totalLevels: number): string => {
    const levelNames: Record<number, string> = {
        1: 'النهائي',
        2: 'نصف النهائي',
        3: 'ربع النهائي',
        4: 'دور الـ16',
        5: 'دور الـ32',
        6: 'دور الـ64'
    };
    
    // Calculate the actual round name based on position from final
    const positionFromFinal = totalLevels - level + 1;
    return levelNames[positionFromFinal] || `المستوى ${level}`;
};

// Update level sakka count and recalculate time
const updateLevelSakka = (level: EditableLevel) => {
    if (!level || !level.sakkaCount) return;
    const matchTime = calculateMatchTime(level.sakkaCount);
    // Calculate total time: match time * number of rounds needed
    level.timeNeeded = matchTime * level.roundnumber;
};

// Expanded groups and rounds
const expandedGroups = ref(new Set<number>());
const expandedRounds = ref(new Set<string>());
const groupMatches = ref<Map<number, Match[]>>(new Map());
const loadingRounds = ref(new Set<number>());



// Data fetching
const { data: groups, pending, error, refresh, fetchREQ } = await groupApi.getGroups();
const groupMatchesREQ = await groupApi.getGroupMatches();

// Fetch groups on component mount
onMounted(async () => {
    if (props.tournamentId) {
        await fetchREQ(props.tournamentId);
    }
});



const viewGroup = (group: Group) => {
    navigateTo(`/tournament/${props.tournamentId}/group/${group.id}`);
};

const editGroup = (group: Group) => {
    // TODO: Implement edit functionality
    console.log('Edit group:', group);
};

const deleteGroup = (group: Group) => {
    // TODO: Implement delete functionality with confirmation
    console.log('Delete group:', group);
};

const getTeamCountColor = (count: number) => {
    if (count >= 16) return 'success';
    if (count >= 8) return 'primary';
    if (count >= 4) return 'warning';
    return 'error';
};

// Toggle group expansion
const toggleGroup = async (groupId: number) => {
    if (expandedGroups.value.has(groupId)) {
        expandedGroups.value.delete(groupId);
        // Collapse all rounds for this group
        const rounds = getGroupRounds(groupId) || [];
        rounds.forEach(round => {
            expandedRounds.value.delete(`${groupId}-${round.name}`);
        });
    } else {
        expandedGroups.value.add(groupId);
        // Fetch matches for this group if not already loaded
        if (!groupMatches.value.has(groupId)) {
            await loadGroupMatches(groupId);
        }
    }
};

// Toggle round expansion
const toggleRound = (groupId: number, roundName: string) => {
    const key = `${groupId}-${roundName}`;
    if (expandedRounds.value.has(key)) {
        expandedRounds.value.delete(key);
    } else {
        expandedRounds.value.add(key);
    }
};

// Load matches for a group
const loadGroupMatches = async (groupId: number) => {
    loadingRounds.value.add(groupId);
    try {
        await groupMatchesREQ.fetchREQ(props.tournamentId, groupId);
        if (groupMatchesREQ.data.value?.data) {
            groupMatches.value.set(groupId, groupMatchesREQ.data.value.data);
        }
    } catch (error) {
        console.error('Error loading group matches:', error);
    } finally {
        loadingRounds.value.delete(groupId);
    }
};

// Get rounds for a group (grouped by roundName)
const getGroupRounds = (groupId: number) => {
    const matches = groupMatches.value.get(groupId) || [];
    if (matches.length === 0) return null;

    // Group matches by roundName
    const roundsMap = new Map<string, Match[]>();
    matches.forEach(match => {
        const roundName = match.roundName || 'غير محدد';
        if (!roundsMap.has(roundName)) {
            roundsMap.set(roundName, []);
        }
        roundsMap.get(roundName)!.push(match);
    });

    // Convert to array and sort by level (if available)
    return Array.from(roundsMap.entries())
        .map(([name, matches]) => ({
            name,
            matches: matches.sort((a, b) => (b.level || 0) - (a.level || 0))
        }))
        .sort((a, b) => {
            // Sort rounds by level of first match
            const aLevel = a.matches[0]?.level || 0;
            const bLevel = b.matches[0]?.level || 0;
            return bLevel - aLevel;
        });
};

// Helper functions for colors and labels
// const getGroupTypeColor = (type: string): "error" | "success" | "primary" | "secondary" | "info" | "warning" | "neutral" => {
//     const typeColors: Record<string, "error" | "success" | "primary" | "secondary" | "info" | "warning" | "neutral"> = {
//         'A': 'primary',
//         'B': 'success',
//         'C': 'warning',
//         'D': 'info',
//         'Final': 'error',
//         'Semi-Final': 'warning',
//         'Quarter-Final': 'info'
//     };
//     return typeColors[type] || 'neutral';
// };

const getGroupTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
        'A': 'المجموعة أ',
        'B': 'المجموعة ب',
        'C': 'المجموعة ج',
        'D': 'المجموعة د',
        'Final': 'النهائي',
        'Semi-Final': 'نصف النهائي',
        'Quarter-Final': 'ربع النهائي'
    };
    return typeLabels[type] || type;
};

// const getMatchStateColor = (state: string): "error" | "success" | "primary" | "secondary" | "info" | "warning" | "neutral" => {
//     const stateColors: Record<string, "error" | "success" | "primary" | "secondary" | "info" | "warning" | "neutral"> = {
//         'Pending': 'neutral',
//         'InProgress': 'primary',
//         'Completed': 'success',
//         'Cancelled': 'error',
//         'Postponed': 'warning'
//     };
//     return stateColors[state] || 'neutral';
// };

const getMatchStateLabel = (state: string) => {
    const stateLabels: Record<string, string> = {
        'Pending': 'قيد الانتظار',
        'InProgress': 'جارية',
        'Completed': 'مكتملة',
        'Cancelled': 'ملغاة',
        'Postponed': 'مؤجلة'
    };
    return stateLabels[state] || state;
};

// Watch for tournament ID changes
watch(() => props.tournamentId, async (newId) => {
    if (newId) {
        await fetchREQ(newId);
        // Clear expanded groups and matches when tournament changes
        expandedGroups.value.clear();
        expandedRounds.value.clear();
        groupMatches.value.clear();
    }
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
