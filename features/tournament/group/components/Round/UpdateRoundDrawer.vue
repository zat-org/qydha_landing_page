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
                <h2 class="text-lg font-bold text-gray-900 dark:text-white">تعديل الروند</h2>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                    تحديث وقت البدء
                    <span
                        v-if="round?.name"
                        class="font-semibold text-gray-700 dark:text-gray-200"
                    >
                        — {{ round.name }}
                    </span>
                </p>
            </div>
        </template>

        <template #body>
            <div class="flex min-h-0 flex-col px-4 py-4">
                <UForm ref="form" :schema="schema" :state="formState" class="flex flex-col gap-6">
                    <div
                        class="space-y-4 rounded-2xl border border-gray-200/90 bg-white/60 p-4 dark:border-gray-800 dark:bg-gray-900/35"
                    >
                        <h3 class="text-base font-bold text-gray-900 dark:text-white">الجدولة</h3>
                        <UFormField label="تاريخ ووقت البدء" name="startAt">
                            <div
                                class="rounded-xl border border-gray-200/90 bg-gray-50/50 p-3 dark:border-gray-800 dark:bg-gray-900/40"
                            >
                                <AsyncDatePicker v-model="formState.startAt" class="w-full" />
                            </div>
                        </UFormField>
                    </div>
                </UForm>
            </div>
        </template>

        <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <UButton
                    color="neutral"
                    variant="soft"
                    label="إلغاء"
                    class="min-h-10"
                    :disabled="isUpdatePending"
                    @click="open = false"
                />
                <UButton
                    color="primary"
                    icon="i-mdi-content-save-outline"
                    label="حفظ التعديلات"
                    class="min-h-10"
                    :loading="isUpdatePending"
                    :disabled="isUpdatePending"
                    @click="handleSubmit"
                />
            </div>
        </template>
    </UDrawer>
</template>

<script lang="ts" setup>
import { object, string } from "yup";
import type { RoundGroupDetails } from "~/features/tournament/models/group";
import type { TournamentRoundUpdate } from "~/features/tournament/models/tournamentRound";
import { useGroup } from "~/features/tournament/group/composables/group";

const props = defineProps<{
    round: RoundGroupDetails["rounds"][0] | null;
    tourId: string;
    groupId: string;
}>();

const emit = defineEmits<{
    (e: "updated"): void;
}>();

const open = ref(false);
const toast = useToast();

const formatDateTimeForInput = (isoString: string): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const convertToISO = (localDateTime: string): string => {
    if (!localDateTime) return "";
    return new Date(localDateTime).toISOString();
};

const formState = ref({
    startAt: props.round ? formatDateTimeForInput(props.round.startAt) : "",
});

watch(
    () => props.round,
    (newRound) => {
        if (newRound) {
            formState.value = {
                startAt: formatDateTimeForInput(newRound.startAt),
            };
        }
    },
    { deep: true, immediate: true },
);

const schema = object({
    startAt: string().required("تاريخ البدء مطلوب"),
});

const form = useTemplateRef("form");
const updateRoundREQ = useGroup().updateTournamentRound();

const isUpdatePending = computed(() => updateRoundREQ.status.value === "pending");

const handleSubmit = async () => {
    try {
        await form.value?.validate();

        if (!props.round) {
            toast.add({
                title: "خطأ",
                description: "الروند غير موجود",
                color: "error",
            });
            return;
        }

        const updateData: TournamentRoundUpdate = {
            startAt: convertToISO(formState.value.startAt),
            gameSettings: { ...props.round.gameSettings },
        };

        await updateRoundREQ.fetchREQ(
            props.tourId,
            props.round.id,
            props.groupId,
            updateData,
        );

        if (updateRoundREQ.status.value === "success") {
            toast.add({
                title: "نجح التحديث",
                description: "تم تحديث الروند بنجاح",
                color: "success",
            });
            open.value = false;
            emit("updated");
        } else if (updateRoundREQ.error.value) {
            toast.add({
                title: "خطأ في التحديث",
                description:
                    updateRoundREQ.error.value.message ||
                    "حدث خطأ أثناء تحديث الروند",
                color: "error",
            });
        }
    } catch (error) {
        console.error("Validation error:", error);
        toast.add({
            title: "خطأ في التحقق",
            description: "يرجى التحقق من البيانات المدخلة",
            color: "error",
        });
    }
};

defineExpose({
    open,
});
</script>
