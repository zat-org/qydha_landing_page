<template>
    <UDrawer v-model:open="open" direction="left" :handle="false">
        <template #header>
            <h1>انشاء مباراة</h1>
        </template>
        <template #body> 
            <div class="w-[500px] p-4">
                <UForm :schema="schema" :state="formState" class="flex flex-col space-y-6" ref="form">
                    <!-- Used Tables -->
                    <UFormField label="الطاولات المستخدمة" name="usedTables">
                        <div v-if="getTableREQ.pending.value" class="flex justify-center items-center py-4">
                            <UIcon name="i-heroicons-arrow-path" class="w-6 h-6 animate-spin text-primary" />
                        </div>
                        <div v-else-if="getTableREQ.error.value" class="text-red-500 text-sm">
                            خطأ في تحميل الطاولات
                        </div>
                        <div v-else-if="!tables || tables.length === 0" class="text-center py-4 text-gray-400 text-sm">
                            لا توجد طاولات متاحة
                        </div>
                        <div v-else class="max-h-[300px] overflow-y-auto rounded-lg">
                            <!-- v-model:row-selection="selectedTables" -->
                            <UTable 
                                ref="tablesTable"
                                :data="tables" 
                                :columns="tableColumns"
                                :loading="getTableREQ.pending.value"
                            />
                        </div>
                    </UFormField>

                    <!-- Default Game Interval -->
                    <UFormField label="فترة اللعبة" name="defaultGameInterval">
                        <div class="flex items-center gap-2">
                            
                            <div class="flex flex-col gap-1">
                                <label for="durationMinutes">دقائق</label>
                            <UInput 
                                v-model.number="durationMinutes" 
                                type="number" 
                                placeholder="دقائق"
                                :min="0"
                                :max="59"
                                class="w-24"
                                @update:model-value="updateDuration"
                            />
                            </div>
                            <span class="text-gray-500">:</span>

                            <div class="flex flex-col gap-1">
                                <label for="durationHours">ساعات</label>
                            <UInput 
                                v-model.number="durationHours" 
                                type="number" 
                                placeholder="ساعات"
                                :min="0"
                                :max="23"
                                class="w-24"
                                @update:model-value="updateDuration"
                            />
                            </div>
                            <span class="text-sm text-gray-500">{{ formState.defaultGameInterval || '00:00:00' }}</span>
                        </div>
                    </UFormField>

                    <!-- Default Game Settings -->
                    <div class="border-t pt-4">
                        <h3 class="text-lg font-semibold mb-4">إعدادات اللعبة الافتراضية</h3>
                        
                        <UFormField label="معكوس" name="defaultGameSettings.isFlipped">
                            <USwitch v-model="formState.defaultGameSettings.isFlipped" />
                        </UFormField>

                        <UFormField label="تسجيل متقدم" name="defaultGameSettings.isAdvancedRecording">
                            <USwitch v-model="formState.defaultGameSettings.isAdvancedRecording" />
                        </UFormField>

                        <UFormField label="وضع سكة مشدودة" name="defaultGameSettings.isSakkahMashdodahMode">
                            <USwitch v-model="formState.defaultGameSettings.isSakkahMashdodahMode" />
                        </UFormField>

                        <UFormField label="عرض من فاز في حالة التعادل" name="defaultGameSettings.showWhoWonDialogOnDraw">
                            <USwitch v-model="formState.defaultGameSettings.showWhoWonDialogOnDraw" />
                        </UFormField>

                        <UFormField label="تفعيل صوت الأرقام" name="defaultGameSettings.isNumbersSoundEnabled">
                            <USwitch v-model="formState.defaultGameSettings.isNumbersSoundEnabled" />
                        </UFormField>

                        <UFormField label="تفعيل صوت التعليقات" name="defaultGameSettings.isCommentsSoundEnabled">
                            <USwitch v-model="formState.defaultGameSettings.isCommentsSoundEnabled" />
                        </UFormField>

                        <UFormField label="عرض الإكاك" name="defaultGameSettings.isEkakShown">
                            <USwitch v-model="formState.defaultGameSettings.isEkakShown" />
                        </UFormField>

                        <UFormField label="عرض الأكلات" name="defaultGameSettings.isAklatShown">
                            <USwitch v-model="formState.defaultGameSettings.isAklatShown" />
                        </UFormField>

                        <UFormField label="عدد الصكات" name="defaultGameSettings.sakkasCount">
                            <USelect 
                                v-model="formState.defaultGameSettings.sakkasCount" 
                                :items="sakkasCountOptions"
                                placeholder="اختر عدد الصكات"
                            />
                        </UFormField>

                        <UFormField label="تسجيل صوتي" name="defaultGameSettings.isVoiceRecording">
                            <USwitch v-model="formState.defaultGameSettings.isVoiceRecording" />
                        </UFormField>
                    </div>

                    <!-- Form Actions -->
                    <div class="flex justify-end gap-2 pt-4 border-t">
                        <UButton color="neutral" variant="ghost" @click="open = false">
                            إلغاء
                        </UButton>
                        <UButton color="primary" @click="handleSubmit">
                            حفظ
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UDrawer>
</template>

<script lang="ts" setup>
import { object, array, string, boolean, number } from "yup";
import type { ITable } from "~/models/Table";
import { h, resolveComponent } from 'vue';
import type { TableColumn } from '@nuxt/ui';
import type { Group } from "~/models/group";
import type { CreateMatch } from "~/models/group";

// Get tournament ID from route
const route = useRoute();
const tour_id = route.params.id.toString();
const props = defineProps<{ group: Group }>();
// Fetch tables
const { getTable } = useTournamentTable();
const getTableREQ = getTable(tour_id);

// Tables data
const tables = computed<ITable[]>(() => {
    return getTableREQ.data.value?.data || [];
});

// Table columns with selection
const UCheckbox = resolveComponent('UCheckbox');
const tableColumns: TableColumn<ITable>[] = [
    {
        id: 'select',
        header: ({ table }: any) =>
            h(UCheckbox, {
                modelValue: table.getIsSomePageRowsSelected()
                    ? 'indeterminate'
                    : table.getIsAllPageRowsSelected(),
                'onUpdate:modelValue': (value: boolean | 'indeterminate') =>
                    table.toggleAllPageRowsSelected(!!value),
                'aria-label': 'Select all'
            }),
        cell: ({ row }: any) =>
            h(UCheckbox, {
                modelValue: row.getIsSelected(),
                'onUpdate:modelValue': (value: boolean | 'indeterminate') => row.selected = row.toggleSelected(!!value),
                'aria-label': 'Select table'
            }),
    },
    { accessorKey: 'name', header: 'اسم الطاولة' },
];



// Table selection
const tablesTable = useTemplateRef('tablesTable');
const selectedTablesIds = computed(() => {
    return tablesTable.value?.tableApi?.getFilteredSelectedRowModel().rows?.map((item: any) => item.original.id) || [];
});

// Watch selected tables and update formState
watch(selectedTablesIds, () => {
    formState.value.usedTables = selectedTablesIds.value;
}, { deep: true});


// Duration inputs
const durationHours = ref<number>(0);
const durationMinutes = ref<number>(0);

// Parse duration from hh:mm:ss format
const parseDuration = (duration: string) => {
    if (!duration || !duration.match(/^\d{2}:\d{2}:\d{2}$/)) {
        return { hours: 0, minutes: 0 };
    }
    const [hours, minutes] = duration.split(':').map(Number);
    return { hours: hours || 0, minutes: minutes || 0 };
};

// Update duration in hh:mm:ss format
const updateDuration = () => {
    const hours = String(durationHours.value || 0).padStart(2, '0');
    const minutes = String(durationMinutes.value || 0).padStart(2, '0');
    formState.value.defaultGameInterval = `${hours}:${minutes}:00`;
};

// Sakkas count options
const sakkasCountOptions: Array<{ label: string; value: number }> = [
    { label: "1 صكة", value: 1 },
    { label: "3 صكات", value: 3 },
    { label: "5 صكات", value: 5 }
];

// Form state
const formState = ref<CreateMatch>({
    usedTables: [] as string[],
    defaultGameInterval: "00:30:00",
    defaultGameSettings: {
        isFlipped: true,
        isAdvancedRecording: true,
        isSakkahMashdodahMode: true,
        showWhoWonDialogOnDraw: true,
        isNumbersSoundEnabled: true,
        isCommentsSoundEnabled: true,
        isEkakShown: true,
        isAklatShown: true,
        sakkasCount: 1,
        isVoiceRecording: true
    }
});

// Yup schema
const schema = object({
    usedTables: array().of(string()).min(1, "يجب أن يكون لديك على الأقل طاولة واحدة مختارة"),
    defaultGameInterval: string().matches(/^\d{2}:\d{2}:\d{2}$/, "يجب أن تكون الفترة بصيغة hh:mm:ss"),
    defaultGameSettings: object({
        isFlipped: boolean(),
        isAdvancedRecording: boolean(),
        isSakkahMashdodahMode: boolean(),
        showWhoWonDialogOnDraw: boolean(),
        isNumbersSoundEnabled: boolean(),
        isCommentsSoundEnabled: boolean(),
        isEkakShown: boolean(),
        isAklatShown: boolean(),
        sakkasCount: number().min(1, "يجب أن يكون عدد السكك على الأقل 1"),
        isVoiceRecording: boolean()
    })
});

const form = useTemplateRef<HTMLFormElement>("form");
const open = ref(false);

// Reset form when drawer opens
watch(open, async (isOpen) => {
    if (isOpen) {
        // Refresh tables
        await getTableREQ.refresh();
        
        // Parse existing duration or reset
        const parsed = parseDuration(formState.value.defaultGameInterval);
        durationHours.value = parsed.hours;
        durationMinutes.value = parsed.minutes;
        
        // Reset table selection
        // selectedTables.value = {};
        formState.value.usedTables = [];
    }
});
const createMatchREQ = useGroup().ceateMatchesForGroup();

const handleSubmit = async () => {
    try {
        await form.value?.validate();
        // Form is valid, you can emit or handle the data here
        console.log("Form data:", formState.value);
        await createMatchREQ.fetchREQ(tour_id, props.group.id, formState.value);
        // TODO: Add your submit logic here
    } catch (error) {

        console.error("Validation error:", error);
    }
};

defineExpose({
    open,
    formState: readonly(formState)
})
</script>