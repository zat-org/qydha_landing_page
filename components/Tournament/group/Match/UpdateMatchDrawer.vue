<template>
    <UDrawer v-model:open="open" direction="left" :handle="false" title="تعديل المباراة" description="تعديل المباراة">
        <template #body>
            <div class="w-[500px] p-4">
                <!-- Loading State -->
                <div v-if="choicesREQ && (choicesREQ.pending as any).value" class="flex justify-center items-center py-12">
                    <loading />
                </div>

                <!-- Error State -->
                <div v-else-if="choicesREQ && (choicesREQ.error as any)?.value" class="p-4">
                    <UAlert 
                        color="error" 
                        variant="soft" 
                        icon="i-heroicons-exclamation-triangle"
                        title="خطأ في تحميل البيانات" 
                        :description="((choicesREQ.error as any)?.value as any)?.message || 'حدث خطأ أثناء تحميل البيانات'" 
                    />
                </div>

                <!-- Form -->
                <UForm 
                    v-else-if="matchChoices" 
                    :state="formState" 
                    :schema="schema" 
                    @submit="onSubmit" 
                    class="flex flex-col gap-5"
                    ref="form"
                >
                    <UFormField label="الحكم" name="refereeId" :ui="{ error: 'm-0' }" class="w-full">
                        <div class="flex flex-col gap-2">
                            <div class="flex gap-2 items-end">
                                <UInputMenu 
                                    v-model="formState.refereeId" 
                                    :items="refereeItems" 
                                    label-key="username" 
                                    value-key="id"
                                    :search-attributes="['username']" 
                                    class="flex-1" 
                                    :placeholder="selectedRefereeDisplay || 'اختر الحكم'"
                                />
                                <UButton 
                                    v-if="formState.refereeId" 
                                    icon="i-heroicons-x-mark" 
                                    color="neutral" 
                                    variant="soft" 
                                    size="sm"
                                    @click="formState.refereeId = undefined"
                                    :title="'إزالة الحكم'"
                                />
                            </div>
                            <UAlert 
                                v-if="selectedRefereeNotInAvailable" 
                                color="warning" 
                                variant="soft" 
                                size="xs"
                                :title="`الحكم المحدد (${selectedRefereeDisplay}) غير متاح حالياً`"
                            />
                        </div>
                    </UFormField>

                    <UFormField label="الطاولة" name="tableId" class="w-full">
                        <div class="flex flex-col gap-2">
                            <div class="flex gap-2 items-end">
                                <UInputMenu 
                                    v-model="formState.tableId" 
                                    :items="tableItems" 
                                    label-key="name" 
                                    value-key="id"
                                    :search-attributes="['name']" 
                                    :popper="{ placement: 'left-end' }" 
                                    class="flex-1"
                                    :placeholder="selectedTableDisplay || 'اختر الطاولة'"
                                />
                                <UButton 
                                    v-if="formState.tableId" 
                                    icon="i-heroicons-x-mark" 
                                    color="neutral" 
                                    variant="soft" 
                                    size="sm"
                                    @click="formState.tableId = undefined"
                                    :title="'إزالة الطاولة'"
                                />
                            </div>
                            <UAlert 
                                v-if="selectedTableNotInAvailable" 
                                color="warning" 
                                variant="soft" 
                                size="xs"
                                :title="`الطاولة المحددة (${selectedTableDisplay}) غير متاحة حالياً`"
                            />
                        </div>
                    </UFormField>

                    <UFormField label="مميز" name="isMarked" class="w-full">
                        <UCheckbox v-model="formState.isMarked" />
                    </UFormField>
                </UForm>

                <!-- Empty State -->
                <div v-else class="text-center py-12 text-gray-400">
                    <UIcon name="i-heroicons-information-circle" class="text-4xl mb-2" />
                    <p>لا توجد بيانات متاحة</p>
                </div>
            </div>
        </template>
        
        <template #footer>
            <div class="flex justify-end gap-3" v-if="matchChoices">
                <UButton 
                    label="إلغاء" 
                    color="neutral" 
                    variant="soft" 
                    @click="open = false" 
                />
                <UButton 
                    label="حفظ" 
                    @click="form?.submit()" 
                    :loading="updateREQ.status.value === 'pending'" 
                    :disabled="updateREQ.status.value === 'pending'"
                />
            </div>
        </template>
    </UDrawer>
</template>
<script lang="ts" setup>   
import { object, string, boolean } from "yup";
import type { IMatchUpdate, IUpdateChoicesForMatch } from "~/models/match";
import loading from "~/components/loading.vue";

const route = useRoute();
const tour_id = route.params.id.toString();
const toast = useToast();

// Use useState to get shared state
const matchId = useState<string | null>('matchDrawer.matchId', () => null);
const open = useState<boolean>('matchDrawer.open', () => false);

const { updateMatch, getUpdateChoicesForMatch } = useMatch();

// Form state
const formState = reactive<IMatchUpdate>({
    refereeId: undefined,
    tableId: undefined,
    isMarked: false
});

// Schema for validation
const schema = object({
    refereeId: string().nullable(),
    tableId: string().nullable(),
    isMarked: boolean()
});

const form = useTemplateRef('form');

// Reactive state for choices - will be initialized when matchId is available
const choicesREQ = ref<ReturnType<typeof getUpdateChoicesForMatch> | null>(null);

// Match choices data
const matchChoices = computed<IUpdateChoicesForMatch | null>(() => {
    const req = choicesREQ.value as any;
    if (req && req.status?.value === "success" && req.data?.value?.data) {
        return req.data.value.data || null;
    }
    return null;
});

// Computed items that include selected items even if not in available
const refereeItems = computed(() => {
    if (!matchChoices.value) return [];
    const available = matchChoices.value.availableReferee || [];
    const selected = matchChoices.value.selectedReferee;
    
    // If selected referee exists, add it to the list (even if not in available)
    if (selected) {
        return [selected, ...available];
    }
    return available;
});

const tableItems = computed(() => {
    if (!matchChoices.value) return [];
    const available = matchChoices.value.availableTable || [];
    const selected = matchChoices.value.selectedTable;
    
    // If selected table exists, add it to the list (even if not in available)
    if (selected) {
        return [selected, ...available];
    }
    return available;
});

// Check if selected items are not in available (for warning display)
// Only show warning if the form value matches the originally selected value AND it's not in available
const selectedRefereeNotInAvailable = computed(() => {
    if (!matchChoices.value || !formState.refereeId) return false;
    const selected = matchChoices.value.selectedReferee;
    const available = matchChoices.value.availableReferee || [];
    // Only show warning if formState matches the originally selected referee and it's not in available
    return selected && selected.id === formState.refereeId && !available.find(r => r.id === selected.id);
});

const selectedTableNotInAvailable = computed(() => {
    if (!matchChoices.value || !formState.tableId) return false;
    const selected = matchChoices.value.selectedTable;
    const available = matchChoices.value.availableTable || [];
    // Only show warning if formState matches the originally selected table and it's not in available
    return selected && selected.id === formState.tableId && !available.find(t => t.id === selected.id);
});

// Display names for selected items
const selectedRefereeDisplay = computed(() => {
    if (!matchChoices.value || !formState.refereeId) return null;
    const selected = matchChoices.value.selectedReferee;
    if (selected && selected.id === formState.refereeId) {
        return selected.username || selected.name || selected.id;
    }
    // Find in available or items
    const found = refereeItems.value.find(r => r.id === formState.refereeId);
    return found?.username || found?.name || formState.refereeId;
});

const selectedTableDisplay = computed(() => {
    if (!matchChoices.value || !formState.tableId) return null;
    const selected = matchChoices.value.selectedTable;
    if (selected && selected.id === formState.tableId) {
        return selected.name;
    }
    // Find in available or items
    const found = tableItems.value.find(t => t.id === formState.tableId);
    return found?.name || formState.tableId;
});

// Watch for matchId changes and fetch choices when drawer opens
watch([matchId, open], async ([newMatchId, isOpen]) => {
    if (newMatchId && isOpen) {
        // Fetch choices for the match
        choicesREQ.value = getUpdateChoicesForMatch(tour_id, newMatchId);
        
        // Wait for data to load, then initialize form
        await nextTick();
        // Wait a bit more for async data to load
        await new Promise(resolve => setTimeout(resolve, 100));
        const choices = matchChoices.value;
        if (choices) {
            formState.refereeId = choices.selectedReferee?.id || undefined;
            formState.tableId = choices.selectedTable?.id || undefined;
            formState.isMarked = false; // You may need to get this from the match data
        }
    }
}, { immediate: true });

// Update match function
const updateREQ = await updateMatch();

const onSubmit = async () => {
    if (!matchId.value) {
        toast.add({ title: "خطأ", description: "معرف المباراة غير موجود", color: "error" });
        return;
    }

    await updateREQ.fetchREQ(tour_id, matchId.value, formState);
    
    if (updateREQ.status.value === "success") {
        toast.add({ title: "تم التحديث بنجاح", color: "success" });
        open.value = false;
        // Refresh choices to get updated data
        if (matchId.value) {
            choicesREQ.value = getUpdateChoicesForMatch(tour_id, matchId.value);
        }
    } else if (updateREQ.error.value) {
        toast.add({ 
            title: "خطأ في التحديث", 
            description: updateREQ.error.value.message || "حدث خطأ أثناء التحديث",
            color: "error" 
        });
    }
};

defineExpose({
    open
});

</script>