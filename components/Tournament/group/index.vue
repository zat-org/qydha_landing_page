<template>
    <UCard>
        <template #header>
            <div class="flex flex-col gap-6 w-full">
                <div class="flex items-center justify-between">
                    <div>
                        <h1 class="text-3xl font-bold">مجموعات البطولة</h1>
                        <p class="text-gray-500 mt-1">عرض وإدارة مجموعات البطولة</p>
                    </div>
                    <UButton to="/tournament" icon="i-heroicons-arrow-left" variant="ghost">
                        قائمة البطولات
                    </UButton>
                </div>
                <div class="flex flex-col md:flex-row gap-4 items-center">
                    <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="البحث عن مجموعة..."
                        class="md:w-64" />

                    <USelectMenu :items="typeOptions" class="w-full md:w-auto" multiple value-key="value"
                        label-key="label" placeholder="تصفية حسب النوع" v-model="selectedTypes" />
                </div>
            </div>
        </template>

        <div class="flex flex-col flex-1">
            <UTable :data="filteredGroups" :columns="columns"  :loading="pending" hover
                class="flex-1">
                <template #empty-state>
                    <div class="flex flex-col items-center justify-center py-12 px-4">
                        <UIcon name="i-heroicons-user-group" class="text-4xl text-gray-400 mb-2" />
                        <p class="text-gray-500">لا توجد مجموعات متاحة</p>
                    </div>
                </template>

                <template #name-cell="{ row }">
                    <div class="flex items-center gap-3">
                        <UAvatar :text="row.original.name.charAt(0)" size="sm" color="primary" />
                        <div>
                            <p class="font-medium">{{ row.original.name }}</p>
                            <p class="text-sm text-gray-500">{{ row.original.type }}</p>
                        </div>
                    </div>
                </template>

                <template #teamCount-cell="{ row }">
                    <UBadge :color="getTeamCountColor(row.original.teamCount)" variant="subtle"
                        :label="`${row.original.teamCount} فريق`" />
                </template>

                <template #checkInAt-cell="{ row }">
                    <div class="text-sm">
                        <p>{{ formatDateTime(row.original.checkInAt) }}</p>
                        <p class="text-gray-500">{{ formatDateTime(row.original.checkInAt) }}</p>
                    </div>
                </template>

                <template #startPlayAt-cell="{ row }">
                    <div class="text-sm">
                        <p>{{ formatDate(row.original.startPlayAt) }}</p>
                        <p class="text-gray-500">{{ formatTime(row.original.startPlayAt) }}</p>
                    </div>
                </template>

                <template #actions-cell="{ row }">
                    <UButtonGroup>
                        <UButton color="primary" variant="ghost" icon="i-heroicons-chat-bubble-left-right"
                            label="إرسال رسالة" @click="sendMessage(row.original)" />
                        <UButton color="primary" variant="ghost" icon="i-heroicons-eye" label="عرض"
                            @click="viewGroup(row.original)" />
                        <!-- <UButton
              v-if="canEditGroup"
              color="warning"
              variant="ghost"
              icon="i-heroicons-pencil-square"
              label="تعديل"
              @click="editGroup(row.original)"
            /> -->
                        <!-- <UButton
              v-if="canDeleteGroup"
              color="error"
              variant="ghost"
              icon="i-heroicons-trash"
              label="حذف"
              @click="deleteGroup(row.original)"
            /> -->
                    </UButtonGroup>
                </template>
            </UTable>

            <UPagination class="mx-auto mt-4" v-if="totalPages > 1" v-model="currentPage" :page-count="totalPages"
                :total="totalItems" />
        </div>

        <!-- Send Message Modal -->
        <UModal title="إرسال رسالة للمجموعة" description="إرسال رسالة للمجموعة" v-model:open="showMessageModal">
            <template #body>
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium mb-2">المجموعة</label>
                        <UInput :value="selectedGroup?.name" readonly disabled />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">عنوان الرسالة</label>
                        <UInput v-model="messageForm.title" placeholder="أدخل عنوان الرسالة..." />
                    </div>

                    <div>
                        <label class="block text-sm font-medium mb-2">محتوى الرسالة</label>
                        <UTextarea v-model="messageForm.content" placeholder="أدخل محتوى الرسالة..." :rows="5" />
                    </div>
                </div>



            </template>
            <template #footer>
                <div class="flex justify-end gap-3">
                    <UButton color="neutral" variant="ghost" label="إلغاء" @click="showMessageModal = false" />
                    <UButton color="primary" variant="solid" label="إرسال الرسالة" :loading="sendingMessage"
                        @click="handleSendMessage" />
                </div>
            </template>
        </UModal>

    </UCard>
</template>

<script lang="ts" setup>
import type { Group, Team } from "~/models/group";

// Props
interface Props {
    tournamentId: string;
}

const props = defineProps<Props>();

// Composables
const groupApi = useGroup();
import { useMyAuthStore } from "~/store/Auth";
import {formatDate,formatTime} from '~/utils/formatDate'
const userStore = useMyAuthStore();
const { user } = storeToRefs(userStore);

// Reactive data
const searchQuery = ref('');
const selectedTypes = ref<string[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const totalItems = ref(0);
const showAddModal = ref(false);
const showMessageModal = ref(false);
const selectedGroup = ref<Group & { teamCount: number } | null>(null);
const sendingMessage = ref(false);


// Message form
const messageForm = ref({
    title: '',
    content: ''
});

// Type options for filtering
const typeOptions = [
    { label: "المجموعة أ", value: "A" },
    { label: "المجموعة ب", value: "B" },
    { label: "المجموعة ج", value: "C" },
    { label: "المجموعة د", value: "D" },
    { label: "نهائيات", value: "Final" },
    { label: "نصف نهائي", value: "Semi-Final" },
];

// Data fetching
const { data, pending, error, refresh, fetchREQ } = await groupApi.getGroups();

// Fetch groups on component mount
onMounted(async () => {
    if (props.tournamentId) {
        await fetchREQ(props.tournamentId);
    }
});

// Computed properties
const groups = computed(() => {
    if (!data.value?.data?.groups) return [];

    // Add team count to each group (mock data - replace with real API call)
    return data.value.data.groups.map((group: Group) => ({
        ...group,
        teamCount: Math.floor(Math.random() * 20) + 4 // Mock team count
    }));
});

const filteredGroups = computed(() => {
    let results = groups.value;

    if (searchQuery.value) {
        results = results.filter((group: any) =>
            group.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
            group.type.toLowerCase().includes(searchQuery.value.toLowerCase())
        );
    }

    if (selectedTypes.value.length) {
        results = results.filter((group: any) =>
            selectedTypes.value.includes(group.type)
        );
    }

    // Update pagination
    totalItems.value = results.length;
    totalPages.value = Math.ceil(results.length / 10);

    return results;
});

const columns = computed(() => [
    {
        accessorKey: "name",
        header: "اسم المجموعة",
    },
    {
        accessorKey: "teamCount",
        header: "عدد الفرق"
    },
    {
        accessorKey: "checkInAt",
        header: "وقت التسجيل"
    },
    {
        accessorKey: "startPlayAt",
        header: "وقت بداية اللعب"
    },
    {
        id: "actions",
        header: "الإجراءات"
    }
]);

// Permission checks
const canAddGroup = computed(() => {
    return user.value?.user.roles.includes('SuperAdmin') ||
        user.value?.user.roles.includes('StaffAdmin') ||
        user.value?.user.roles.includes('TournamentModerator');
});

const canEditGroup = computed(() => {
    return user.value?.user.roles.includes('SuperAdmin') ||
        user.value?.user.roles.includes('StaffAdmin') ||
        user.value?.user.roles.includes('TournamentModerator');
});

const canDeleteGroup = computed(() => {
    return user.value?.user.roles.includes('SuperAdmin') ||
        user.value?.user.roles.includes('StaffAdmin');
});

// Methods
const selectGroup = (row: any) => {
    navigateTo(`/tournament/${props.tournamentId}/group/${row.original.id}`);
};

const sendMessage = (group: Group & { teamCount: number }) => {
    selectedGroup.value = group;
    messageForm.value = { title: '', content: '' };
    showMessageModal.value = true;
};

const handleSendMessage = async () => {
    if (!messageForm.value.title || !messageForm.value.content || !selectedGroup.value) {
        return;
    }

    sendingMessage.value = true;

    try {
        // TODO: Implement actual message sending API
        console.log('Sending message to group:', selectedGroup.value.name);
        console.log('Message:', messageForm.value);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Show success notification
        const toast = useToast();
        toast.add({
            title: 'تم الإرسال بنجاح',
            description: `تم إرسال الرسالة لمجموعة ${selectedGroup.value.name}`,
            color: 'success'
        });

        showMessageModal.value = false;
    } catch (error) {
        console.error('Error sending message:', error);
        const toast = useToast();
        toast.add({
            title: 'خطأ في الإرسال',
            description: 'حدث خطأ أثناء إرسال الرسالة',
            color: 'error'
        });
    } finally {
        sendingMessage.value = false;
    }
};

const viewGroup = (group: Group) => {
    navigateTo(`/tournament/${props.tournamentId}/groups/${group.id}`);
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


// Watch for tournament ID changes
watch(() => props.tournamentId, async (newId) => {
    if (newId) {
        await fetchREQ(newId);
    }
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
