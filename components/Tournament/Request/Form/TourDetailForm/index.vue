<template>
    <UCard :ui="{
        body: 'px-3 py-1 sm:p-1',
        header: 'px-2 py-1 sm:p-1',
        footer: 'px-2 py-1 sm:p-1',
    }" class="max-w-7xl mx-auto  bg-gray-50 dark:bg-gray-900  ">
        <!-- Tournament Prize Section -->
        <UForm 
            :schema="localSchema" 
            :state="model" 
            class="flex flex-col space-y-6" 
            ref="form"
            :validate-on="['blur', 'change']"
        >
            <!-- Timeline representation for key dates -->
            <div class="space-y-3">
                <div class="text-sm text-gray-700 dark:text-gray-200 font-medium">المخطط الزمني لاختيار التواريخ</div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <!-- Join Request Start -->
                    <div v-if="modelValue.isAddPlayersByQydha" class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60">
                        <UFormField label="بداية طلبات الانضمام" name="joinRequestStartAt">
                        <AsyncDatePicker 
                            v-model="model.joinRequestStartAt" 
                            :min-date="new Date()"
                            :max-date="model.startAt"
                            @update:model-value="onDateChange('joinRequestStartAt')"
                        />
                        </UFormField>
                    </div>
                    <!-- Join Request End -->
                    <div v-if="modelValue.isAddPlayersByQydha" class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60">
                      <UFormField label="نهاية طلبات الانضمام" name="joinRequestEndAt">
                        <AsyncDatePicker 
                            v-model="model.joinRequestEndAt" 
                            :min-date="model.joinRequestStartAt" 
                            :max-date="model.startAt"
                            @update:model-value="onDateChange('joinRequestEndAt')"
                        />
                      </UFormField>
                    </div>
                    <!-- Tournament Start -->
                    <div class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60">
                        <UFormField label="بداية البطولة" name="startAt">
                            <AsyncDatePicker 
                                v-model="model.startAt" 
                                :min-date="minstartDate"
                                @update:model-value="onDateChange('startAt')"
                            />
                        </UFormField>
                    </div>
                    <!-- Tournament End -->
                    <div class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60">
                        <UFormField label="نهاية البطولة" name="endAt">
                            <AsyncDatePicker 
                                v-model="model.endAt" 
                                :min-date="model.startAt"
                                @update:model-value="onDateChange('endAt')"
                            />
                        </UFormField>
                    </div>
                </div>
            </div>

            <!-- <TournamentRequestFormTourDetailFormEnrollmentDates v-model="model" /> -->
            <!-- <UFormField label="بداية  البطولة" name="startAt">
                <AsyncDatePicker v-model="model.startAt" :min-date="new Date()" />
            </UFormField>
            <UFormField label="نهاية البطولة" name="endAt">
                <AsyncDatePicker v-model="model.endAt" :min-date="model.startAt" />
            </UFormField> -->
            <UFormField  name="isAddPlayersByQydha" size="xl">
                <div class="flex  gap-4">
                    <USwitch v-model="modelValue.isAddPlayersByQydha" size="xl" />
                    <label> قبول الطلبات النضمام من قيدها </label>
                </div>
            </UFormField>
            <template v-if="modelValue.isAddPlayersByQydha">
                <!-- <UFormField label="بداية تقديم طلبات الانضمام" name="joinRequestStartAt">
                    <AsyncDatePicker v-model="model.joinRequestStartAt" :max-date="model.startAt" />
                </UFormField>
                <UFormField label="انتهاء تقديم طلبات الانضمام" name="joinRequestEndAt">
                    <AsyncDatePicker v-model="model.joinRequestEndAt" :min-date="model.joinRequestStartAt"
                        :max-date="model.startAt" />
                </UFormField> -->
                <UFormField label=" اقصي عدد طلبات الانضمام  " name="joinRequestMaxCount">
                    <UInput type="number" v-model="model.joinRequestMaxCount" />
                </UFormField>
            </template>

            <TournamentRequestFormTourDetailFormPrizeManagement v-model="model" />


            <!-- show data depend on qydha  -->

            <UFormField label=" عدد الفرق" name="teamsCount">
                <div class="flex items-center gap-2">
                    <USelect v-model="TeamsCount" :items=TeamsCountOptions />
                    <UInput v-if="TeamsCount === 'custom'" v-model="model.teamsCount" type="number" min="1"
                        placeholder="0" @input="validatePositiveNumber" />
                </div>
            </UFormField>

            <UFormField label=" عدد الطاولات" name="tablesCount"
               >
                <UInput v-model="model.tablesCount" type="number" placeholder="0" />
            </UFormField>




            <!-- <TournamentAddTourDetailFormTournamentSchedule v-model="model" :best-time="timeNeeded"
                :time-available="timeAvailable" :teams-count="model.TeamsCount" :tables-count="model.TablesCount"
                :sakka-options="model.SakkaOptions" /> -->

            <!-- <div class="flex items-center gap-2">
                <UFormField label=" مين يسجل النشرة " name="TeamSelectionMode" class=" flex-1">
                    <USelect v-model="selectedRfreeOption" :items="refreeeOptions" placeholder="اختر مين يسجل النشرة"
                        @update:model-value="onSelectionModeChange()" />
                </UFormField>
                <UFormField v-if="selectedRfreeOption === 'refree'"
                    :hint="` افضل عدد حكام لادارة الفرق  ${BestNumberofTables} حكام `" label=" عدد الحكام"
                    name="RefreeCount" class=" flex-1">
                    <UInput v-model="model.RefreeCount" type="number" placeholder="0" />
                </UFormField>
            </div> -->
            <!-- 
            <UFormField label="  نوع توزيع الفرق" name="TeamSelectionMode" class=" flex-1">
                <USelect v-model="model.TeamSelectionMode" :items="TeamSelectionModeOptions"
                    placeholder="اختر نوع توزيع الفرق" />
            </UFormField> -->

            <!-- <UFormField label="  هل تحتاج البطولة الاحصائيات عن طريق التسجيل المتقدم " name="StatisticsNeed">
                <USwitch size="xl" v-model="model.StatisticsNeed" color="primary" class="w-[200px]" />
                <template #label>
                    <span class="text-sm font-medium text-gray-700 dark:text-gray-200">
                        هل تحتاج البطولة الاحصائيات عن طريق التسجيل المتقدم
                    </span>
                    <UPopover>
                        <UButton icon="i-heroicons-question-mark-circle" variant="ghost" color="neutral" />
                        <template #content>
                            <img src="~assets/images/staticsExample.jpeg" alt="مثال على الاحصائيات"
                                class="w-32 md:w-64 h-auto rounded-lg" />
                        </template>
</UPopover>
</template>
</UFormField> -->



            <!-- <div v-if="model.SakkaOptions.length > 0" class="space-y-4 mt-6">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-md font-medium text-gray-700 dark:text-gray-200">اختيارات الصكات لكل دور</h4>
                    <div
                        class="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                        التوقيت: 1 صكة = 30د، 3 صكات = 60د، 5 صكات = 90د
                    </div>
                </div>
                <div v-for="(sakka, index) in model.SakkaOptions" :key="index"
                    class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex-1">
                            <UFormField :label="sakka.group" :name="`SakkaOptions[${index}].sakka`"
                                :hint="`${calculateMatchTimeDisplay(parseInt(sakka.sakka))} لكل مباراة`">
                                <USelect v-model="sakka.sakka" value-key="value" :items="SelectSakkaOptions" />
                            </UFormField>
                        </div>
                    </div>
                </div>
            </div> -->
            <!-- <pre dir="ltr">
                {{ rounds }}
            </pre> -->
        </UForm>
    </UCard>
</template>

<script lang="ts" setup>
import { object, string, number, boolean, array, mixed } from "yup";
import type { TournamentPrizeType } from "~/models/tournamentPrize";

const model = defineModel<{
    startAt: string;
    endAt: string;
    prizes: {
        isFinancial: boolean,
        isNonFinancial: boolean,
        type: TournamentPrizeType,
        financialPrizeAmount: number,
        financialPrizeCurrency: string,
        nonFinancialPrizes: string[],
    }[]
    teamsCount: number;
    tablesCount: number;
    isAddPlayersByQydha: boolean;
    joinRequestEndAt?: string;
    joinRequestStartAt?: string;
    joinRequestMaxCount?: number;

    // TournametPrizeOption: number;
    // TournametPrize: { money: number, items: string[], position: number, isMoney: boolean, isItem: boolean, currency: string }[];
    // RefreeNeed: boolean;
    // RefreeCount: number;
    // StatisticsNeed: boolean;
    // SakkaOptions: { group: string, sakka: string }[],
    // TournamentDaysNumber: number;
    // TournamentDates: { date: string, startTime: string, endTime: string }[];
    // TeamSelectionMode: string;
}>({ required: true })


const { getNumberOfRounds,rounds } = useTourCalc();
watchEffect( () => {
    console.log(getNumberOfRounds(model.value.teamsCount, model.value.tablesCount));
});


// Computed min/max bounds for timeline pickers (same rules as form fields)

// Enhanced validation state management
const isValid = ref(false);
const errors = ref<Record<string, string>>({});
const isValidating = ref(false);

const minstartDate = computed(() => {
    // console.log(new Date(model.value.joinRequestEndAt as string  ))
    // console.log()
   const joinRequestEndDate = new Date(model.value.joinRequestEndAt as string ?? undefined);
   const today = new Date();
   // Take the max between joinRequestEndDate and today
   const date = joinRequestEndDate > today ? joinRequestEndDate : today;
    return date;
});
// Add form ref for Nuxt UI validation
const form = useTemplateRef("form");

// Provide form ref to child components
provide('formRef', form);


const localSchema = object({
    startAt: string()
        .required("تاريخ بداية  البطولة مطلوب")
        .test('start-date-valid', 'تاريخ بداية  البطولة  غير صحيح', function (value) {
            if (!value) return true; // Let required validation handle empty values
            const date = new Date(value);
            return !isNaN(date.getTime());
        })
        .test('start-after-today', 'تاريخ بداية البطولة يجب أن يكون بعد تاريخ اليوم', function (value) {
            if (!value) return true;
            const date = new Date(value);
            const today = new Date();
            // Set time portion of both to zero for date-only comparison
            date.setHours(0,0,0,0);
            today.setHours(0,0,0,0);
            return date >= today;
        }),

    endAt: string()
        .required("تاريخ نهاية  البطولة مطلوب")
        .test('end-date-valid', 'تاريخ نهايةالبطولة  غير صحيح', function (value) {
            if (!value) return true; // Let required validation handle empty values
            const date = new Date(value);
            return !isNaN(date.getTime());
        })
        .test('end-after-start', 'يجب أن يكون تاريخ نهاية البطولة بعد تاريخ بداية البطولة', function (value) {
            const start = this.parent.startAt;
            if (!start || !value) return true;

            const startDate = new Date(start);
            const endDate = new Date(value);

            // Check if dates are valid
            // if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            //     return true; // Let other validations handle invalid dates
            // }
            return endDate > startDate;
        }),

    joinRequestStartAt: string()
        .when('isAddPlayersByQydha', {
            is: true,
            then: (schema) => schema
                .required("تاريخ بداية تقديم طلبات الانضمام مطلوب")
                .test('start-date-valid', 'تاريخ بداية تقديم طلبات الانضمام غير صحيح', function (value) {
                    if (!value) return true;
                    const date = new Date(value);
                    return !isNaN(date.getTime());
                })
                .test('before-tournament-start', 'تاريخ بداية تقديم طلبات الانضمام يجب أن يكون قبل تاريخ بداية البطولة', function (value) {
                    const tournamentStart = this.parent.startAt;
                    if (!tournamentStart || !value) return true;
                    const requestStartDate = new Date(value);
                    const tournamentStartDate = new Date(tournamentStart);
                    return requestStartDate < tournamentStartDate;
                }),
            otherwise: (schema) => schema.notRequired()
        }),

    joinRequestEndAt: string()
        .when('isAddPlayersByQydha', {
            is: true,
            then: (schema) => schema
                .required("تاريخ نهاية تقديم طلبات الانضمام مطلوب")
                .test('end-date-valid', 'تاريخ نهاية تقديم طلبات الانضمام غير صحيح', function (value) {
                    if (!value) return true;
                    const date = new Date(value);
                    return !isNaN(date.getTime());
                })
                .test('before-tournament-start', 'تاريخ نهاية تقديم طلبات الانضمام يجب أن يكون قبل تاريخ بداية البطولة', function (value) {
                    const tournamentStart = this.parent.startAt;
                    if (!tournamentStart || !value) return true;
                    const requestEndDate = new Date(value);
                    const tournamentStartDate = new Date(tournamentStart);
                    return requestEndDate < tournamentStartDate;
                })
                .test('after-request-start', 'تاريخ نهاية تقديم طلبات الانضمام يجب أن يكون بعد تاريخ بداية تقديم طلبات الانضمام', function (value) {
                    const requestStart = this.parent.joinRequestStartAt;
                    if (!requestStart || !value) return true;
                    const requestStartDate = new Date(requestStart);
                    const requestEndDate = new Date(value);
                    return requestEndDate > requestStartDate;
                }),
            otherwise: (schema) => schema.notRequired()
        }),

    joinRequestMaxCount: number()
        .when('isAddPlayersByQydha', {
            is: true,
            then: (schema) => schema
                .required("عدد طلبات الانضمام المطلوب مطلوب")
                .typeError("عدد طلبات الانضمام المطلوب يجب أن يكون رقماً")
                .min(1, "عدد طلبات الانضمام المطلوب يجب أن يكون أكثر من 0")
                .integer("عدد طلبات الانضمام المطلوب يجب أن يكون رقماً صحيحاً"),
            otherwise: (schema) => schema.notRequired()
        }),

    prizes: array()
        .min(1, "يجب إضافة جائزة واحدة على الأقل")
        .of(
            object({
                financialPrizeAmount: number().nullable().min(0, "قيمة الجائزة لا يمكن أن تكون سالبة"),
                nonFinancialPrizes: array().of(string()),
                isFinancial: boolean(),
                isNonFinancial: boolean(),
            }).test('money-or-items', 'يجب تحديد قيمة الجائزة أو إضافة جوائز عينية', function (value) {
                const { financialPrizeAmount, nonFinancialPrizes, isFinancial, isNonFinancial } = value;

                // If money prize is selected, money must be > 0
                if (isFinancial && (!financialPrizeAmount || financialPrizeAmount <= 0)) {
                    return this.createError({
                        path: `${this.path}.financialPrizeAmount`,
                        message: 'يجب إدخال قيمة جائزة أكبر من صفر'
                    });
                }

                // If item prize is selected, items array must not be empty
                if (isNonFinancial && (!nonFinancialPrizes || nonFinancialPrizes.length === 0)) {
                    return this.createError({
                        path: `${this.path}.nonFinancialPrizes`,
                        message: 'يجب إضافة جوائز عينية'
                    });
                }

                // At least one type must be selected
                if (!isFinancial && !isNonFinancial) {
                    return this.createError({
                        message: 'يجب اختيار نوع جائزة واحد على الأقل (مالية أو عينية)'
                    });
                }

                return true;
            })
        ),
    teamsCount: number()
        .typeError("عدد الفرق مطلوب")
        .required("عدد الفرق مطلوب")
        .min(2, "يجب أن يكون عدد الفرق على الأقل 2")
        .integer("عدد الفرق يجب أن يكون رقماً صحيحاً"),
    tablesCount: number().typeError("عدد الطاولات مطلوب").required("عدد الطاولات مطلوب").min(1, "يجب ادخال عدد الطاولات"),
    isAddPlayersByQydha: boolean()
    // RefreeNeed: boolean().required("احصائيات البطولة مطلوبة"),
    // RefreeCount: number().when('RefreeNeed', {
    //     is: true,
    //     then: (schema) => schema.required("عدد الحكام مطلوبة"),
    //     otherwise: (schema) => schema.optional()
    // }),
    // TournamentDates: array()
    //     .of(object({
    //         date: string().required("تاريخ اليوم مطلوب"),
    //         startTime: string().required("وقت البداية مطلوب"),
    //         endTime: string().required("وقت النهاية مطلوب")
    //     }))
    //     .test('dates-in-order', 'يجب أن تكون التواريخ مرتبة تصاعدياً', function (dates) {
    //         if (!dates || dates.length <= 1) return true;

    //         for (let i = 1; i < dates.length; i++) {
    //             const prevDate = new Date(dates[i - 1].date);
    //             const currDate = new Date(dates[i].date);

    //             if (currDate <= prevDate) {
    //                 return this.createError({
    //                     path: `TournamentDates[${i}].date`,
    //                     message: `التاريخ في اليوم ${i + 1} يجب أن يكون بعد التاريخ في اليوم ${i}`
    //                 });
    //             }
    //         }
    //         return true;
    //     })
    //     .test('valid-time-ranges', 'وقت البداية يجب أن يكون قبل وقت النهاية', function (dates) {
    //         if (!dates) return true;

    //         for (let i = 0; i < dates.length; i++) {
    //             const { startTime, endTime } = dates[i];
    //             if (!startTime || !endTime) continue;

    //             if (!isValidTimeRange(startTime, endTime)) {
    //                 return this.createError({
    //                     path: `TournamentDates[${i}].startTime`,
    //                     message: `في اليوم ${i + 1}: وقت البداية يجب أن يكون قبل وقت النهاية`
    //                 });
    //             }
    //         }
    //         return true;
    //     })
    //     .min(1, "يجب تحديد تاريخ واحد على الاقل")
    //     .required("يجب ادخال تاريخ البطولة"),
    // TournamentDaysNumber: number().required().min(1, "يجب ادخال عدد الايام"),
    // StatisticsNeed: boolean().required("احصائيات البطولة مطلوبة"),
    // SakkaOptions: array().of(object({
    //     group: string().required("الدور مطلوب"),
    //     sakka: string().required("اختيارات الصكات مطلوبة"),
    // })),
});


// Handler to validate date fields when they change
const onDateChange = async (fieldName: string) => {
    // Wait for reactivity to update
    await nextTick();
    
    // Clear the error for this field if it exists, then re-validate
    // This will trigger validation which will clear errors if the field is now valid
    form.value?.clear(fieldName);
    
    // Wait a bit more for the clear to take effect, then validate
    await nextTick();
    
    // The form will automatically re-validate due to validate-on="['blur', 'change']"
    // But we can also manually trigger validation for the entire form
    try {
        await form.value?.validate();
    } catch (error) {
        // Some fields are invalid, errors will be shown
    }
};

const validate = async (): Promise<boolean> => {
    isValidating.value = true;
    errors.value = {};
    try {
        // Use Nuxt UI form validation
        await form.value?.validate();

        // If validation passes, update state
        isValid.value = true;
        return true;
    } catch (error: any) {
        console.log(form.value?.getErrors());
        return false;
    } finally {
        isValidating.value = false;
    }
};

defineExpose({
    validate,
    isValid: readonly(isValid),
    errors: readonly(errors),
    isValidating: readonly(isValidating)
});


// Use the tournament calculations composable
const {
    calculateSakkaOptions,
    calculateTournamentTime,
    calculateAvailableTime,
    calculateOptimalTables,
    calculateMatchTime,
    isValidTimeRange,
    formatTime
} = useTournamentCalculations();

// Helper functions for sakka display
const calculateMatchTimeDisplay = (sakkaCount: number): string => {
    const minutes = calculateMatchTime(sakkaCount);
    return formatTime(minutes);
};



const TeamsCount = ref<number | string>(model.value.teamsCount);

watch(TeamsCount, (newVal) => {
    if (newVal === "custom") {
        // props.modelValue.TeamsCount = 0;
    } else {
        model.value.teamsCount = newVal as number;
    }
});

const TeamsCountOptions = [
    {
        label: "16 فريق",
        value: 16,
    },
    {
        label: "32 فريق",
        value: 32,
    },
    {
        label: "64 فريق",
        value: 64,
    },
    {
        label: "128 فريق",
        value: 128,
    }
    , {
        label: "عدد اخر",
        value: "custom"
    }
]

const SelectSakkaOptions = [
    {
        label: " صكة",
        value: "1",
    },
    {
        label: "3 صكات",
        value: "3",
    },
    {
        label: "5 صكات",
        value: "5",
    },
]
const TeamSelectionModeOptions = [
    { label: "اوتوماتيكي", value: "auto" },
    { label: " يدوي", value: "manual" },
];

// refreee detail 
const selectedRfreeOption = ref<string>("players");
const refreeeOptions = [
    {
        label: "اللاعبين ",
        value: "players",
    },
    {
        label: "الحكام",
        value: "refree",
    }
]
// const onSelectionModeChange = () => {
//     if (selectedRfreeOption.value === 'players') {
//         model.value.RefreeNeed = false;
//     } else if (selectedRfreeOption.value === 'refree') {
//         model.value.RefreeNeed = true;
//     }
// }

const validatePositiveNumber = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);
    if (value < 1) {
        input.value = '1';
    }
}

// Helper function to revalidate a field

// Watch for changes to endAt and revalidate dependent fields

// Enhanced sakka options using the composable
// const updateSakkaOptions = () => {
//     model.value.SakkaOptions = calculateSakkaOptions(model.value.TeamsCount);
// }

// Computed values using the composable
const BestNumberofTables = computed(() => {
    return calculateOptimalTables(model.value.teamsCount);
});

// const timeAvailable = computed(() => {
//     return calculateAvailableTime(model.value.TournamentDates);
// })

// const timeNeeded = computed(() => {
//     return calculateTournamentTime(model.value.TeamsCount, model.value.TablesCount, model.value.SakkaOptions);
// })

// Watch effects
// watchEffect(() => {
//     updateSakkaOptions();
// })

// watchEffect(() => {
//     form.value?.clear("TournamentDaysNumber")
//     console.log("timeNeeded", timeNeeded.value)
//     if (timeNeeded.value > timeAvailable.value) {
//         form.value?.setErrors([{
//             name: "TournamentDaysNumber",
//             message: ` الوقت المحدد للبطولة ${Math.ceil(timeNeeded.value / 60)} ساعة  والوقت المتاح للبطولة ${Math.ceil(timeAvailable.value / 60)} ساعة  برجاء اضافة المزيد من الوقت `
//         }])
//     }
// })



</script>

<style></style>