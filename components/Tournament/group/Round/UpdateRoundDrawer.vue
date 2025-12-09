<template>
    <UDrawer v-model:open="open" direction="left" :handle="false" title="تعديل الروند" description="تعديل الروند">
        <template #body>
            <div class="w-[500px] p-4">
                <UForm :schema="schema" :state="formState" class="flex flex-col space-y-6" ref="form">
                    <!-- Start Date/Time -->
                    <UFormField label="تاريخ ووقت البدء" name="startAt">
                        <AsyncDatePicker v-model="formState.startAt" />
                    </UFormField>

                    <!-- Game Settings -->
                    <div class="border-t pt-4 space-y-3">
                        <h3 class="text-lg font-semibold mb-4">إعدادات اللعبة</h3>
                        
                        <UFormField  name="gameSettings.isFlipped">
                            <div class="flex items-center gap-2">
                                <USwitch v-model="formState.gameSettings.isFlipped" />
                                <label class="text-lg ">معكوس</label>
                            </div>
                        </UFormField>

                        <UFormField  name="gameSettings.isAdvancedRecording">
                            <div class="flex items-center gap-2">
                                <USwitch v-model="formState.gameSettings.isAdvancedRecording" />
                                <label class="text-lg ">تسجيل متقدم</label>
                            </div>
                        </UFormField>

                        <UFormField  name="gameSettings.isSakkahMashdodahMode">
                            <div class="flex items-center gap-2">
                                <USwitch v-model="formState.gameSettings.isSakkahMashdodahMode" />
                                <label class="text-lg ">وضع سكة مشدودة</label>
                            </div>
                        </UFormField>

                        <UFormField  name="gameSettings.showWhoWonDialogOnDraw">
                            <div class="flex items-center gap-2">
                                <USwitch v-model="formState.gameSettings.showWhoWonDialogOnDraw" />
                                <label class="text-lg ">عرض من فاز في حالة التعادل</label>
                            </div>
                        </UFormField>

                        <UFormField  name="gameSettings.isNumbersSoundEnabled">
                            <div class="flex items-center gap-2">
                                <USwitch v-model="formState.gameSettings.isNumbersSoundEnabled" />
                                <label class="text-lg ">تفعيل صوت الأرقام</label>
                            </div>
                        </UFormField>

                        <UFormField  name="gameSettings.isCommentsSoundEnabled">
                            <div class="flex items-center gap-2">
                                <USwitch v-model="formState.gameSettings.isCommentsSoundEnabled" />
                                <label class="text-lg ">تفعيل صوت التعليقات</label>
                            </div>
                        </UFormField>

                        <UFormField  name="gameSettings.isEkakShown">
                            <div class="flex items-center gap-2">
                                <USwitch v-model="formState.gameSettings.isEkakShown" />
                                <label class="text-lg ">عرض الإكك</label>
                            </div>
                        </UFormField>

                        <UFormField name="gameSettings.isAklatShown">
                                <div class="flex items-center gap-2">
                                <USwitch v-model="formState.gameSettings.isAklatShown" />
                                <label class="text-lg ">عرض الأكلات</label>
                            </div>
                        </UFormField>
                        <UFormField  name="gameSettings.isVoiceRecording">
                            <div class="flex items-center gap-2">
                                <USwitch v-model="formState.gameSettings.isVoiceRecording" />
                                <label class="text-lg ">تسجيل صوتي</label>
                            </div>
                        </UFormField>
                        <UFormField label="عدد الصكات" name="gameSettings.sakkasCount">
                            <USelect 
                                v-model="formState.gameSettings.sakkasCount" 
                                :items="sakkasCountOptions"
                                placeholder="اختر عدد الصكات"
                            />
                        </UFormField>

                        
                    </div>


                    <!-- Form Actions -->
                    <div class="flex justify-end gap-2 pt-4 border-t">
                        <UButton 
                            color="neutral" 
                            variant="ghost" 
                            @click="open = false"
                            :disabled="updateRoundREQ.result.status.value == 'pending'"
                        >
                            إلغاء
                        </UButton>
                        <UButton 
                            color="primary" 
                            @click="handleSubmit"
                            :loading="updateRoundREQ.result.status.value == 'pending'"
                        >
                            حفظ
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UDrawer>
</template>
<script lang="ts" setup>
import { object, string, boolean, number } from "yup";
import type { RoundGroupDetails } from '~/models/group';
import type { TournamentRoundUpdate } from '~/models/tournamentRound';

const props = defineProps<{
    round: RoundGroupDetails['rounds'][0] | null;
    tourId: string;
    groupId: string;
}>();

const open = ref(false);
const toast = useToast();

// Sakkas count options
const sakkasCountOptions: Array<{ label: string; value: number }> = [
    { label: "1 صكة", value: 1 },
    { label: "3 صكات", value: 3 },
    { label: "5 صكات", value: 5 }
];

// Format datetime for input (convert ISO to local datetime-local format)
const formatDateTimeForInput = (isoString: string): string => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Convert datetime-local format to ISO string
const convertToISO = (localDateTime: string): string => {
    if (!localDateTime) return '';
    return new Date(localDateTime).toISOString();
};

// Initialize form state from round prop
const formState = ref<TournamentRoundUpdate>({
    startAt: props.round ? formatDateTimeForInput(props.round.startAt) : '',
    gameSettings: {
        isFlipped: props.round?.gameSettings.isFlipped ?? true,
        isAdvancedRecording: props.round?.gameSettings.isAdvancedRecording ?? true,
        isSakkahMashdodahMode: props.round?.gameSettings.isSakkahMashdodahMode ?? true,
        showWhoWonDialogOnDraw: props.round?.gameSettings.showWhoWonDialogOnDraw ?? true,
        isNumbersSoundEnabled: props.round?.gameSettings.isNumbersSoundEnabled ?? true,
        isCommentsSoundEnabled: props.round?.gameSettings.isCommentsSoundEnabled ?? true,
        isEkakShown: props.round?.gameSettings.isEkakShown ?? true,
        isAklatShown: props.round?.gameSettings.isAklatShown ?? true,
        sakkasCount: props.round?.gameSettings.sakkasCount ?? 1,
        isVoiceRecording: props.round?.gameSettings.isVoiceRecording ?? true
    }
});

// Watch for round prop changes and update form state
watch(() => props.round, (newRound) => {
    if (newRound) {
        formState.value = {
            startAt: formatDateTimeForInput(newRound.startAt),
            gameSettings: {
                isFlipped: newRound.gameSettings.isFlipped,
                isAdvancedRecording: newRound.gameSettings.isAdvancedRecording,
                isSakkahMashdodahMode: newRound.gameSettings.isSakkahMashdodahMode,
                showWhoWonDialogOnDraw: newRound.gameSettings.showWhoWonDialogOnDraw,
                isNumbersSoundEnabled: newRound.gameSettings.isNumbersSoundEnabled,
                isCommentsSoundEnabled: newRound.gameSettings.isCommentsSoundEnabled,
                isEkakShown: newRound.gameSettings.isEkakShown,
                isAklatShown: newRound.gameSettings.isAklatShown,
                sakkasCount: newRound.gameSettings.sakkasCount,
                isVoiceRecording: newRound.gameSettings.isVoiceRecording
            }
        };
    }
}, { deep: true, immediate: true });

// Yup schema
const schema = object({
    startAt: string().required("تاريخ البدء مطلوب"),
    gameSettings: object({
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
const updateRoundREQ = useGroup().updateTournamentRound();

const handleSubmit = async () => {
    try {
        await form.value?.validate();
        
        // Convert datetime-local to ISO string
        const updateData: TournamentRoundUpdate = {
            startAt: convertToISO(formState.value.startAt),
            gameSettings: { ...formState.value.gameSettings }
        };
        
        if (!props.round) {
            toast.add({
                title: 'خطأ',
                description: 'الروند غير موجود',
                color: 'error'
            });
            return;
        }
        
        await updateRoundREQ.fetchREQ(
            props.tourId,
            props.round.id,
            props.groupId,
            updateData
        );
        
        if (updateRoundREQ.result.status.value === 'success') {
            toast.add({
                title: 'نجح التحديث',
                description: 'تم تحديث الروند بنجاح',
                color: 'success'
            });
            open.value = false;
        } else if (updateRoundREQ.result.error.value) {
            toast.add({
                title: 'خطأ في التحديث',
                description: updateRoundREQ.result.error.value.message || 'حدث خطأ أثناء تحديث الروند',
                color: 'error'
            });
        }
    } catch (error) {
        console.error("Validation error:", error);
        toast.add({
            title: 'خطأ في التحقق',
            description: 'يرجى التحقق من البيانات المدخلة',
            color: 'error'
        });
    }
};

defineExpose({
    open
});
</script>