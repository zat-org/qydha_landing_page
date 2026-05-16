<template>
    <UDrawer
        v-model:open="open"
        direction="left"
        :handle="false"
        :ui="{
            content:
                'max-w-[min(100vw-1rem,100rem)] w-full border-gray-200/90 dark:border-gray-800 sm:max-w-2xl',
            body: 'flex flex-col min-h-0 overflow-y-auto p-0',
            header: 'border-b border-gray-200/90 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/40',
            footer: 'border-t border-gray-200/90 bg-gray-50/95 dark:border-gray-800 dark:bg-gray-950/50',
        }"
    >
        <template #header>
            <div class="space-y-1 p-2 text-start">
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ drawerTitle }}</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ drawerSubtitle }}
                    <span class="font-semibold text-gray-700 dark:text-gray-200">{{ group.name }}</span>
                </p>
            </div>
        </template>

        <template #body>
            <div class="flex min-h-0 flex-col px-4 py-4">
                <UForm ref="form" :schema="schema" :state="formState" class="flex flex-col gap-6">
                    <!-- الطاولات -->
                    <UFormField label="الطاولات المستخدمة" name="usedTables">
                        <div
                            class="overflow-hidden rounded-2xl border border-gray-200/90 bg-white/90 shadow-sm dark:border-gray-800 dark:bg-gray-900/45"
                        >
                            <div v-if="getTableREQ.pending.value" class="flex flex-col items-center gap-2 py-12">
                                <UIcon name="i-mdi-loading" class="size-10 animate-spin text-primary" />
                                <span class="text-sm text-gray-500 dark:text-gray-400">جاري تحميل الطاولات…</span>
                            </div>
                            <UAlert
                                v-else-if="getTableREQ.error.value"
                                color="error"
                                variant="soft"
                                icon="i-mdi-alert-circle-outline"
                                title="تعذّر تحميل الطاولات"
                                class="m-3"
                            />
                            <div v-else-if="!tables.length" class="px-4 py-10 text-center text-sm text-gray-500">
                                <UIcon name="i-mdi-table-furniture" class="mx-auto mb-2 size-12 text-gray-400" />
                                لا توجد طاولات مسجّلة لهذه البطولة.
                            </div>

                            <template v-else>
                                <!-- عرض: جدول / شبكة -->
                                <div
                                    class="flex shrink-0 items-center justify-end border-b border-gray-200/90 bg-gray-50/90 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50 sm:px-4"
                                >
                                    <div
                                        class="inline-flex rounded-xl border border-gray-200/90 bg-white p-0.5 shadow-sm dark:border-gray-700 dark:bg-gray-900/80"
                                    >
                                        <UButton
                                            :color="tablesViewMode === 'table' ? 'primary' : 'neutral'"
                                            :variant="tablesViewMode === 'table' ? 'solid' : 'ghost'"
                                            size="xs"
                                            icon="i-mdi-table-row"
                                            label="جدول"
                                            class="min-w-[4rem]"
                                            @click="tablesViewMode = 'table'"
                                        />
                                        <UButton
                                            :color="tablesViewMode === 'grid' ? 'primary' : 'neutral'"
                                            :variant="tablesViewMode === 'grid' ? 'solid' : 'ghost'"
                                            size="xs"
                                            icon="i-mdi-view-grid-outline"
                                            label="شبكة"
                                            class="min-w-[4rem]"
                                            @click="tablesViewMode = 'grid'"
                                        />
                                    </div>
                                </div>

                                <div
                                    class="flex flex-wrap items-center justify-between gap-2 border-b border-primary/15 bg-primary/[0.04] px-3 py-2 text-xs dark:bg-primary/[0.08] sm:px-4"
                                >
                                    <span class="text-gray-600 dark:text-gray-300">
                                        <UIcon name="i-mdi-cursor-default-click" class="me-1 inline size-4 text-primary" />
                                        اضغط على الصف أو البطاقة للتحديد.
                                    </span>
                                    <div class="flex gap-1.5">
                                        <UButton
                                            size="xs"
                                            color="neutral"
                                            variant="soft"
                                            icon="i-mdi-checkbox-multiple-marked-outline"
                                            label="تحديد الكل"
                                            @click="selectAllTables"
                                        />
                                        <UButton
                                            size="xs"
                                            color="neutral"
                                            variant="ghost"
                                            icon="i-mdi-close-circle-outline"
                                            label="إلغاء"
                                            :disabled="selectedTableCount === 0"
                                            @click="clearTableSelection"
                                        />
                                    </div>
                                </div>

                                <div
                                    v-if="selectedTableCount > 0"
                                    class="border-b border-primary/20 bg-primary/[0.06] px-3 py-2 text-sm font-medium text-primary dark:bg-primary/15 sm:px-4"
                                >
                                    تم اختيار {{ selectedTableCount }}
                                    {{ selectedTableCount === 1 ? 'طاولة' : 'طاولات' }}
                                </div>

                                <div class="max-h-[min(44vh,380px)] min-h-[160px] overflow-y-auto overscroll-y-contain">
                                    <!-- جدول -->
                                    <div
                                        v-show="tablesViewMode === 'table'"
                                        class="divide-y divide-gray-100 dark:divide-gray-800"
                                    >
                                        <button
                                            v-for="t in tables"
                                                :key="'tb-' + t.id"
                                                type="button"
                                                class="flex w-full items-center gap-3 px-3 py-3 text-start transition-colors sm:px-4"
                                                :class="tableRowClasses(t.id)"
                                                :aria-pressed="!!selectedTables[t.id]"
                                                @click="toggleTable(t.id)"
                                            >
                                                <span
                                                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20"
                                                >
                                                    <UIcon name="i-mdi-table-furniture" class="size-5" />
                                                </span>
                                                <span
                                                    class="min-w-0 flex-1 text-sm font-medium text-gray-900 dark:text-gray-100"
                                                >
                                                    {{ t.name }}
                                                </span>
                                                <span
                                                    class="flex size-9 shrink-0 items-center justify-center rounded-full border-2 transition-all"
                                                    :class="
                                                        selectedTables[t.id]
                                                            ? 'border-primary bg-primary text-white shadow-sm'
                                                            : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900/80'
                                                    "
                                                    aria-hidden="true"
                                                >
                                                    <UIcon
                                                        :name="selectedTables[t.id] ? 'i-mdi-check' : 'i-mdi-checkbox-blank-circle-outline'"
                                                        class="size-4"
                                                        :class="selectedTables[t.id] ? '' : 'text-gray-400'"
                                                    />
                                                </span>
                                        </button>
                                    </div>

                                    <!-- شبكة -->
                                    <div v-show="tablesViewMode === 'grid'" class="p-3">
                                        <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                                            <button
                                                v-for="t in tables"
                                                    :key="'tg-' + t.id"
                                                    type="button"
                                                    class="relative flex min-h-[5.5rem] flex-col gap-2 rounded-2xl border p-3 text-start transition-all"
                                                    :class="tableGridClasses(t.id)"
                                                    :aria-pressed="!!selectedTables[t.id]"
                                                    @click="toggleTable(t.id)"
                                                >
                                                    <span
                                                        class="absolute end-2 top-2 flex size-8 items-center justify-center rounded-full border-2"
                                                        :class="
                                                            selectedTables[t.id]
                                                                ? 'border-primary bg-primary text-white'
                                                                : 'border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900/90'
                                                        "
                                                        aria-hidden="true"
                                                    >
                                                        <UIcon
                                                            :name="selectedTables[t.id] ? 'i-mdi-check' : 'i-mdi-checkbox-blank-circle-outline'"
                                                            class="size-3.5"
                                                        />
                                                    </span>
                                                    <span
                                                        class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"
                                                    >
                                                        <UIcon name="i-mdi-table-furniture" class="size-5" />
                                                    </span>
                                                    <p
                                                        class="line-clamp-2 pe-7 text-sm font-semibold leading-snug text-gray-900 dark:text-gray-100"
                                                    >
                                                        {{ t.name }}
                                                    </p>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </UFormField>

                    <!-- فترة اللعبة -->
                    <UFormField label="فترة اللعبة" name="defaultGameInterval">
                        <div
                            class="flex flex-wrap items-end gap-3 rounded-xl border border-gray-200/90 bg-gray-50/50 p-4 dark:border-gray-800 dark:bg-gray-900/40"
                        >
                            <div class="flex flex-col gap-1">
                                <label class="text-xs font-medium text-gray-500 dark:text-gray-400" for="durationHours"
                                    >ساعات</label
                                >
                                <UInput
                                    id="durationHours"
                                    v-model.number="durationHours"
                                    type="number"
                                    placeholder="0"
                                    :min="0"
                                    :max="23"
                                    class="w-20"
                                    @update:model-value="updateDuration"
                                />
                            </div>
                            <span class="pb-2 text-lg font-light text-gray-400">:</span>
                            <div class="flex flex-col gap-1">
                                <label class="text-xs font-medium text-gray-500 dark:text-gray-400" for="durationMinutes"
                                    >دقائق</label
                                >
                                <UInput
                                    id="durationMinutes"
                                    v-model.number="durationMinutes"
                                    type="number"
                                    placeholder="0"
                                    :min="0"
                                    :max="59"
                                    class="w-20"
                                    @update:model-value="updateDuration"
                                />
                            </div>
                            <div
                                class="ms-auto rounded-lg bg-white px-3 py-2 text-sm font-mono text-gray-800 shadow-sm ring-1 ring-gray-200/80 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                            >
                                {{ formState.defaultGameInterval || "00:00:00" }}
                            </div>
                        </div>
                    </UFormField>

                    <!-- إعدادات اللعبة -->
                    <div class="space-y-4 rounded-2xl border border-gray-200/90 bg-white/60 p-4 dark:border-gray-800 dark:bg-gray-900/35">
                        <h3 class="text-base font-bold text-gray-900 dark:text-white">إعدادات اللعبة الافتراضية</h3>

                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <UFormField name="defaultGameSettings.isFlipped">
                                <div class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50">
                                    <label class="text-sm font-medium">معكوس</label>
                                    <USwitch v-model="formState.defaultGameSettings.isFlipped" size="lg" />
                                </div>
                            </UFormField>

                            <UFormField name="defaultGameSettings.isAdvancedRecording">
                                <div class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50">
                                    <label class="text-sm font-medium">تسجيل متقدم</label>
                                    <USwitch v-model="formState.defaultGameSettings.isAdvancedRecording" size="lg" />
                                </div>
                            </UFormField>

                            <UFormField name="defaultGameSettings.isSakkahMashdodahMode">
                                <div class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50">
                                    <label class="text-sm font-medium">وضع صكة مشدودة</label>
                                    <USwitch v-model="formState.defaultGameSettings.isSakkahMashdodahMode" />
                                </div>
                            </UFormField>

                            <UFormField name="defaultGameSettings.showWhoWonDialogOnDraw">
                                <div class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50">
                                    <label class="text-sm font-medium">عرض من فاز عند التعادل</label>
                                    <USwitch v-model="formState.defaultGameSettings.showWhoWonDialogOnDraw" />
                                </div>
                            </UFormField>

                            <UFormField name="defaultGameSettings.isNumbersSoundEnabled">
                                <div class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50">
                                    <label class="text-sm font-medium">صوت الأرقام</label>
                                    <USwitch v-model="formState.defaultGameSettings.isNumbersSoundEnabled" />
                                </div>
                            </UFormField>

                            <UFormField name="defaultGameSettings.isCommentsSoundEnabled">
                                <div class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50">
                                    <label class="text-sm font-medium">صوت التعليقات</label>
                                    <USwitch v-model="formState.defaultGameSettings.isCommentsSoundEnabled" />
                                </div>
                            </UFormField>

                            <UFormField name="defaultGameSettings.isEkakShown">
                                <div class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50">
                                    <label class="text-sm font-medium">عرض الإكك</label>
                                    <USwitch v-model="formState.defaultGameSettings.isEkakShown" />
                                </div>
                            </UFormField>

                            <UFormField name="defaultGameSettings.isAklatShown">
                                <div class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50">
                                    <label class="text-sm font-medium">عرض الأكلات</label>
                                    <USwitch v-model="formState.defaultGameSettings.isAklatShown" />
                                </div>
                            </UFormField>

                            <UFormField name="defaultGameSettings.isVoiceRecording">
                                <div class="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950/50">
                                    <label class="text-sm font-medium">تسجيل صوتي</label>
                                    <USwitch v-model="formState.defaultGameSettings.isVoiceRecording" />
                                </div>
                            </UFormField>

                            <UFormField
                                label="عدد الصكات"
                                name="defaultGameSettings.sakkasCount"
                                class="sm:col-span-2"
                            >
                                <USelect
                                    v-model="formState.defaultGameSettings.sakkasCount"
                                    :items="sakkasCountOptions"
                                    placeholder="اختر عدد الصكات"
                                    class="w-full max-w-xs"
                                />
                            </UFormField>
                        </div>
                    </div>
                </UForm>
            </div>
        </template>

        <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <UButton color="neutral" variant="soft" label="إلغاء" class="min-h-10" @click="open = false" />
                <UButton
                    color="primary"
                    icon="i-mdi-content-save-outline"
                    label="حفظ وإنشاء المباراة"
                    class="min-h-10"
                    :loading="isCreateMatchPending"
                    :disabled="isCreateMatchPending"
                    @click="handleSubmit"
                />
            </div>
        </template>
    </UDrawer>
</template>

<script lang="ts" setup>
import { object, array, string, boolean, number } from "yup";
import type { ITable } from "~/features/tournament/models/Table";
import type { Group } from "~/features/tournament/models/group";
import type { CreateMatch } from "~/features/tournament/models/group";

const route = useRoute();
const tour_id = route.params.id.toString();
const props = withDefaults(
    defineProps<{
        group: Group;
        /** عنوان الدرج */
        drawerTitle?: string;
        /** نص قبل اسم المجموعة */
        drawerSubtitle?: string;
    }>(),
    {
        drawerTitle: "إنشاء مباراة",
        drawerSubtitle: "اختر الطاولات والمدة وإعدادات اللعب للمجموعة",
    },
);

const emit = defineEmits<{
    /** بعد نجاح الطلب وقبل إغلاق الدرج */
    success: [];
}>();

const { getTable } = useTournamentTable();
const getTableREQ = getTable(tour_id);

const tables = computed<ITable[]>(() => {
    const list = getTableREQ.data.value?.data ?? [];
    return [...list].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }),
    );
});

const tablesViewMode = ref<"table" | "grid">("table");
const selectedTables = ref<Record<string, boolean>>({});

const selectedTableCount = computed(
    () => Object.values(selectedTables.value).filter(Boolean).length,
);

function syncUsedTablesToForm() {
    formState.value.usedTables = Object.entries(selectedTables.value)
        .filter(([, on]) => on)
        .map(([id]) => id);
}

watch(
    selectedTables,
    () => {
        syncUsedTablesToForm();
    },
    { deep: true },
);

function tableRowClasses(id: string) {
    return selectedTables.value[id]
        ? "cursor-pointer bg-primary/[0.07] ring-1 ring-inset ring-primary/30 hover:bg-primary/[0.1] dark:bg-primary/15"
        : "cursor-pointer hover:bg-gray-50 active:bg-gray-100/80 dark:hover:bg-gray-800/50";
}

function tableGridClasses(id: string) {
    return selectedTables.value[id]
        ? "cursor-pointer border-primary/45 bg-primary/[0.06] ring-2 ring-primary/25 shadow-sm dark:bg-primary/15"
        : "cursor-pointer border-gray-200/90 bg-white/95 hover:border-primary/25 dark:border-gray-800 dark:bg-gray-900/45";
}

function toggleTable(id: string) {
    selectedTables.value = {
        ...selectedTables.value,
        [id]: !selectedTables.value[id],
    };
}

function selectAllTables() {
    const next = { ...selectedTables.value };
    for (const t of tables.value) {
        next[t.id] = true;
    }
    selectedTables.value = next;
}

function clearTableSelection() {
    selectedTables.value = {};
}

const durationHours = ref(0);
const durationMinutes = ref(0);

const parseDuration = (duration: string) => {
    if (!duration || !/^\d{2}:\d{2}:\d{2}$/.test(duration)) {
        return { hours: 0, minutes: 0 };
    }
    const p = duration.split(":").map(Number);
    return { hours: p[0] ?? 0, minutes: p[1] ?? 0 };
};

const updateDuration = () => {
    const h = String(durationHours.value || 0).padStart(2, "0");
    const m = String(durationMinutes.value || 0).padStart(2, "0");
    formState.value.defaultGameInterval = `${h}:${m}:00`;
};

const sakkasCountOptions: Array<{ label: string; value: number }> = [
    { label: "1 صكة", value: 1 },
    { label: "3 صكات", value: 3 },
    { label: "5 صكات", value: 5 },
];

const formState = ref<CreateMatch>({
    usedTables: [] as string[],
    defaultGameInterval: "00:30:00",
    defaultGameSettings: {
        isFlipped: false,
        isAdvancedRecording: true,
        isSakkahMashdodahMode: false,
        showWhoWonDialogOnDraw: true,
        isNumbersSoundEnabled: false,
        isCommentsSoundEnabled: false,
        isEkakShown: false,
        isAklatShown: false,
        sakkasCount: 1,
        isVoiceRecording: false,
    },
});

const schema = object({
    usedTables: array().of(string()).min(1, "يجب اختيار طاولة واحدة على الأقل"),
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
        isVoiceRecording: boolean(),
    }),
});

const form = useTemplateRef<HTMLFormElement>("form");
const open = ref(false);

watch(open, async (isOpen) => {
    if (!isOpen) return;
    tablesViewMode.value = "table";
    selectedTables.value = {};
    formState.value.usedTables = [];
    await getTableREQ.refresh();
    selectAllTables();
    const parsed = parseDuration(formState.value.defaultGameInterval);
    durationHours.value = parsed.hours;
    durationMinutes.value = parsed.minutes;
});

const createMatchREQ = useGroup().ceateMatchesForFinalGroup();
const isCreateMatchPending = computed(() => createMatchREQ.result.status.value === "pending");
const toast = useToast();

const handleSubmit = async () => {
    try {
        await form.value?.validate();
        await createMatchREQ.fetchREQ(tour_id, formState.value, props.group.id);
        if (createMatchREQ.result.status.value === "success") {
            toast.add({ title: "تم إنشاء المباراة بنجاح", color: "success" });
            emit("success");
            open.value = false;
        } else {
            toast.add({ title: "خطأ في إنشاء المباراة", color: "error" });
        }
    } catch {
        /* validation failed */
    }
};

defineExpose({
    open,
    formState: readonly(formState),
});
</script>
