<template>
    <UCard :ui="{ body: 'px-3 py-1 sm:p-1', header: 'px-2 py-1 sm:p-1 ', footer: 'px-2 py-1 sm:p-1' }" class="max-w-7xl mx-auto  bg-gray-50 dark:bg-gray-900">
        <UForm :schema="localSchema" :state="model" class="flex flex-col space-y-2" ref="form">
            <UFormField name="isAddPlayersByQydha" size="xl">
                <div class="flex  gap-4"><USwitch v-model="modelValue.isAddPlayersByQydha" size="xl" /><label> التسجيل من خلال قيدها </label></div>
            </UFormField>
            <div class="space-y-3">
                <div class="text-sm font-medium">المخطط الزمني لاختيار التواريخ</div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div v-if="modelValue.isAddPlayersByQydha" class="p-3 rounded-lg border bg-white/60 dark:bg-gray-800/60">
                        <UFormField label="بداية طلبات الانضمام" name="joinRequestStartAt"><AsyncDatePicker v-model="model.joinRequestStartAt" :min-date="new Date()" :max-date="model.startAt || undefined" @update:model-value="onDateChange('joinRequestStartAt')" /></UFormField>
                    </div>
                    <div v-if="modelValue.isAddPlayersByQydha" class="p-3 rounded-lg border bg-white/60 dark:bg-gray-800/60">
                        <UFormField label="نهاية طلبات الانضمام" name="joinRequestEndAt"><AsyncDatePicker v-model="model.joinRequestEndAt" :min-date="model.joinRequestStartAt" :max-date="model.startAt || undefined" @update:model-value="onDateChange('joinRequestEndAt')" /></UFormField>
                    </div>
                    <div class="p-3 rounded-lg border bg-white/60 dark:bg-gray-800/60">
                        <UFormField label="بداية البطولة" name="startAt"><AsyncDatePicker v-model="model.startAt" :min-date="minstartDate" @update:model-value="onDateChange('startAt')" /></UFormField>
                    </div>
                    <div class="p-3 rounded-lg border bg-white/60 dark:bg-gray-800/60">
                        <UFormField label="نهاية البطولة" name="endAt"><AsyncDatePicker v-model="model.endAt" :min-date="model.startAt" @update:model-value="onDateChange('endAt')" /></UFormField>
                    </div>
                </div>
            </div>
            <template v-if="modelValue.isAddPlayersByQydha">
                <UFormField label=" اقصي عدد طلبات الانضمام  " name="joinRequestMaxCount"><UInput type="number" v-model="model.joinRequestMaxCount" /></UFormField>
                <UFormField label="نوع طلبات الانضمام" name="allowedJoinRequestType"><USelect v-model="model.allowedJoinRequestType" :items="TournamentPlayerJoinRequestTypeOptions" /></UFormField>
                <UFormField label="عدد الأيام الأدني للاشتراك" name="minimumSubscriptionDays"><UInput type="number" v-model="model.minimumSubscriptionDays" min="1" placeholder="0" /></UFormField>
            </template>
            <TournamentRequestFormTourDetailFormPrizeManagement v-model="model" />
            <div class="grid grid-cols-3 gap-4">
                <UFormField label=" عدد الفرق" name="teamsCount"><div class="flex flex-col items-center gap-2"><USelect v-model="TeamsCount" :items=TeamsCountOptions /><UInput v-if="TeamsCount === 'custom'" v-model="model.teamsCount" type="number" min="1" placeholder="0" @input="validatePositiveNumber" /></div></UFormField>
                <UFormField label=" عدد الطاولات" name="tablesCount"><UInput v-model="model.tablesCount" type="number" placeholder="0" /></UFormField>
                <UFormField label="عدد الأيام" name="dayNumber"><UInput v-model="dayNumber" type="number" min="1" placeholder="أدخل عدد الأيام" size="xs" /></UFormField>
                <UFormField label="وقت صكة واحدة (دقيقة)" name="sakkTime"><UInput v-model="sakkTime" type="number" min="1" placeholder="وقت صكة واحدة" size="xs" /></UFormField>
                <UFormField label="وقت 3 صكات (دقيقة)" name="sakkTime3"><UInput v-model="sakkTime3" type="number" min="1" placeholder="وقت 3 صكات" size="xs" /></UFormField>
                <UFormField label="وقت 5 صكات (دقيقة)" name="sakkTime5"><UInput v-model="sakkTime5" type="number" min="1" placeholder="وقت 5 صكات" size="xs" /></UFormField>
            </div>
            <TournamentRequestCalculatorRounds :rounds="rounds" :sakka-options="sakkaOptions" :format-time="formatTime" />
            <TournamentRequestCalculatorSummary :rounds="rounds" :total-time="totalTime" :time-per-day="timePerDay" :total-matches="totalMatches" :day-number="dayNumber" :format-time="formatTime" />
        </UForm>
    </UCard>
</template>

<script lang="ts" setup>
import { object, string, number, boolean, array } from "yup";
import type { TournamentPrizeType } from "~/features/tournament/models/tournamentPrize";
import { TournamentPlayerJoinRequestType } from "~/features/tournament/models/tournamentRequest";
import TournamentRequestCalculatorRounds from "~/features/tournament/request/components/CalculatorRounds.vue";
import TournamentRequestCalculatorSummary from "~/features/tournament/request/components/CalculatorSummary.vue";
const model = defineModel<any>({ required: true })
const TournamentPlayerJoinRequestTypeOptions = [{ label: "كل الطلبات", value: TournamentPlayerJoinRequestType.All },{ label: "طلبات فردية", value: TournamentPlayerJoinRequestType.Single },{ label: "طلبات الفرق", value: TournamentPlayerJoinRequestType.Team }]
const isValid = ref(false); const errors = ref<Record<string, string>>({}); const isValidating = ref(false);
const minstartDate = computed(() => { const joinRequestEndDate = new Date(model.value.joinRequestEndAt as string ?? undefined); const today = new Date(); return joinRequestEndDate > today ? joinRequestEndDate : today; });
const form = useTemplateRef("form");
provide('formRef', form);
const localSchema = object({
    startAt: string().required("تاريخ بداية  البطولة مطلوب"),
    endAt: string().required("تاريخ نهاية  البطولة مطلوب"),
    joinRequestStartAt: string().when('isAddPlayersByQydha', { is: true, then: (schema) => schema.required("تاريخ بداية تقديم طلبات الانضمام مطلوب"), otherwise: (schema) => schema.notRequired() }),
    joinRequestEndAt: string().when('isAddPlayersByQydha', { is: true, then: (schema) => schema.required("تاريخ نهاية تقديم طلبات الانضمام مطلوب"), otherwise: (schema) => schema.notRequired() }),
    joinRequestMaxCount: number().when('isAddPlayersByQydha', { is: true, then: (schema) => schema.required("عدد طلبات الانضمام المطلوب مطلوب"), otherwise: (schema) => schema.notRequired() }),
    prizes: array().min(1, "يجب إضافة جائزة واحدة على الأقل"),
    teamsCount: number().typeError("عدد الفرق مطلوب").required("عدد الفرق مطلوب").min(2, "يجب أن يكون عدد الفرق على الأقل 2"),
    tablesCount: number().typeError("عدد الطاولات مطلوب").required("عدد الطاولات مطلوب").min(1, "يجب ادخال عدد الطاولات"),
    isAddPlayersByQydha: boolean()
});
const onDateChange = async (fieldName: string) => { await nextTick(); form.value?.clear(fieldName); await nextTick(); try { await form.value?.validate(); } catch {} };
const validate = async (): Promise<boolean> => { isValidating.value = true; errors.value = {}; try { await form.value?.validate(); isValid.value = true; return true; } catch { return false; } finally { isValidating.value = false; } };
defineExpose({ validate, isValid: readonly(isValid), errors: readonly(errors), isValidating: readonly(isValidating) });
const TeamsCount = ref<number | string>(model.value.teamsCount);
watch(TeamsCount, (newVal) => { if (newVal !== "custom") model.value.teamsCount = newVal as number; });
const TeamsCountOptions = [{ label: "16 فريق", value: 16 },{ label: "32 فريق", value: 32 },{ label: "64 فريق", value: 64 },{ label: "128 فريق", value: 128 },{ label: "عدد اخر", value: "custom" }]
const { rounds, teamsCount, tablesCount, sakkTime, sakkTime3, sakkTime5, totalTime, timePerDay, totalMatches, dayNumber } = useTourCalc();
teamsCount.value = model.value.teamsCount; tablesCount.value = model.value.tablesCount;
const sakkaOptions = [{ label: '1', value: 1 },{ label: '3', value: 3 },{ label: '5', value: 5 }];
const formatTime = (minutes: number): string => { if (minutes < 60) return `${minutes.toFixed(0)} دقيقة`; const hours = Math.floor(minutes / 60); const mins = minutes % 60; if (mins === 0) return `${hours.toFixed(0)} ساعة`; return `${hours.toFixed(0)} ساعة و ${mins.toFixed(0)} دقيقة`; };
const validatePositiveNumber = (event: Event) => { const input = event.target as HTMLInputElement; const value = parseInt(input.value); if (value < 1) input.value = '1'; }
</script>
