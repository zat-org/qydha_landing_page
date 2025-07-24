<template>
    <UCard class="max-w-7xl mx-auto  bg-gray-50 dark:bg-gray-900  ">
        <!-- Tournament Prize Section -->
        <UForm :schema="localSchema" :state="model" class="flex flex-col space-y-6 " ref="form">
            <TournamentAddTourDetailFormEnrollmentDates v-model="model" />
            <TournamentAddTourDetailFormPrizeManagement v-model="model" />




                <!-- Tournament Statistics Section -->

            <UFormField label=" عدد الفرق" name="TeamsCount">
                <div class="flex items-center gap-2">
                    <USelect v-model="TeamsCount" :items=TeamsCountOptions />
                    <UInput v-if="TeamsCount === 'custom'" v-model="model.TeamsCount" type="number" min="1"
                        placeholder="0" @input="validatePositiveNumber" />
                </div>
            </UFormField>

            <UFormField label=" عدد الطاولات" name="TablesCount"
                :hint="`افضل عدد طاولات لادارة الفرق  ${BestNumberofTables} طاولات `">
                <UInput v-model="model.TablesCount" type="number" placeholder="0" />
            </UFormField>


            <TournamentAddTourDetailFormTournamentSchedule v-model="model" :best-time="timeNeeded"
                :time-available="timeAvailable" :teams-count="model.TeamsCount" :tables-count="model.TablesCount" />



            <div class="flex items-center gap-2">
                <UFormField label=" مين يسجل النشرة " name="TeamSelectionMode" class=" flex-1">
                    <USelect v-model="selectedRfreeOption" :items="refreeeOptions" placeholder="اختر مين يسجل النشرة"
                        @update:model-value="onSelectionModeChange()" />
                </UFormField>
                <UFormField v-if="selectedRfreeOption === 'refree'"
                    :hint="` افضل عدد حكام لادارة الفرق  ${BestNumberofTables} حكام `" label=" عدد الحكام"
                    name="RefreeCount" class=" flex-1">
                    <UInput v-model="model.RefreeCount" type="number" placeholder="0" />
                </UFormField>
            </div>

            <UFormField label="  نوع توزيع الفرق" name="TeamSelectionMode" class=" flex-1">
                <USelect v-model="model.TeamSelectionMode" :items="TeamSelectionModeOptions"
                    placeholder="اختر نوع توزيع الفرق" />
            </UFormField>

            <UFormField label="  هل تحتاج البطولة الاحصائيات عن طريق التسجيل المتقدم " name="StatisticsNeed">
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
            </UFormField>



            <div v-if="model.SakkaOptions.length > 0" class="space-y-4 mt-6">
                <h4 class="text-md font-medium text-gray-700 dark:text-gray-200 mb-3">اختيارات الصكات لكل دور</h4>
                <div v-for="(sakka, index) in model.SakkaOptions" :key="index"
                    class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600">
                    <UFormField :label="sakka.group" :name="`SakkaOptions[${index}].sakka`">
                        <USelect v-model="sakka.sakka" value-key="value" :items="SelectSakkaOptions" />
                    </UFormField>
                </div>
            </div>

        </UForm>
    </UCard>
</template>

<script lang="ts" setup>
import { object, string, number, boolean, array } from "yup";

const model = defineModel<{
    TournamentStartEnrolmmentDate: string;
    TournamentEndEnrolmmentDate: string;
    TournametPrizeOption: number;
    TournametPrize: { money: number, items: string[], position: number, isMoney: boolean, isItem: boolean, currency: string }[];
    TeamsCount: number;
    RefreeCount: number;
    RefreeNeed: boolean;
    TablesCount: number;
    StatisticsNeed: boolean;
    SakkaOptions: { group: string, sakka: string }[],
    TournamentDaysNumber: number;
    TournamentDates: { date: string, startTime: string, endTime: string }[];
    TeamSelectionMode: string;
}>({ required: true })



// Enhanced validation state management
const isValid = ref(false);
const errors = ref<Record<string, string>>({});
const isValidating = ref(false);

// Add form ref for Nuxt UI validation
const form = useTemplateRef("form");


const localSchema = object({

    TournamentStartEnrolmmentDate: string()
        .required("تاريخ بداية تسجيل اللاعبين في البطولة مطلوب")
        .test('start-date-valid', 'تاريخ بداية التسجيل غير صحيح', function (value) {
            if (!value) return true; // Let required validation handle empty values
            const date = new Date(value);
            return !isNaN(date.getTime());
        }),

    TournamentEndEnrolmmentDate: string()
        .required("تاريخ نهاية تسجيل اللاعبين في البطولة مطلوب")
        .test('end-date-valid', 'تاريخ نهاية التسجيل غير صحيح', function (value) {
            if (!value) return true; // Let required validation handle empty values
            const date = new Date(value);
            return !isNaN(date.getTime());
        })
        .test('end-after-start', 'يجب أن يكون تاريخ نهاية التسجيل بعد تاريخ بداية التسجيل', function (value) {
            const start = this.parent.TournamentStartEnrolmmentDate;
            if (!start || !value) return true;

            const startDate = new Date(start);
            const endDate = new Date(value);

            // Check if dates are valid
            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return true; // Let other validations handle invalid dates
            }

            return endDate > startDate;
        }),
    TournametPrize: array()
        .min(1, "يجب إضافة جائزة واحدة على الأقل")
        .of(
            object({
                money: number().nullable().min(0, "قيمة الجائزة لا يمكن أن تكون سالبة"),
                items: array().of(string()),
                isMoney: boolean(),
                isItem: boolean(),
            }).test('money-or-items', 'يجب تحديد قيمة الجائزة أو إضافة جوائز عينية', function (value) {
                const { money, items, isMoney, isItem } = value;

                // If money prize is selected, money must be > 0
                if (isMoney && (!money || money <= 0)) {
                    return this.createError({
                        path: `${this.path}.money`,
                        message: 'يجب إدخال قيمة جائزة أكبر من صفر'
                    });
                }

                // If item prize is selected, items array must not be empty
                if (isItem && (!items || items.length === 0)) {
                    return this.createError({
                        path: `${this.path}.items`,
                        message: 'يجب إضافة جوائز عينية'
                    });
                }

                // At least one type must be selected
                if (!isMoney && !isItem) {
                    return this.createError({
                        message: 'يجب اختيار نوع جائزة واحد على الأقل (مالية أو عينية)'
                    });
                }

                return true;
            })
        ),
    TeamsCount: number()
        .typeError("عدد الفرق مطلوب")
        .required("عدد الفرق مطلوب")
        .min(2, "يجب أن يكون عدد الفرق على الأقل 2")
        .integer("عدد الفرق يجب أن يكون رقماً صحيحاً"),
    TablesCount: number().typeError("عدد الطاولات مطلوب").required("عدد الطاولات مطلوب").min(1, "يجب ادخال عدد الطاولات"),
    RefreeNeed: boolean().required("احصائيات البطولة مطلوبة"),
    RefreeCount: number().when('RefreeNeed', {
        is: true,
        then: (schema) => schema.required("عدد الحكام مطلوبة"),
        otherwise: (schema) => schema.optional()
    }),
    TournamentDates: array()
        .of(object({
            date: string().required("تاريخ اليوم مطلوب"),
            startTime: string().required("وقت البداية مطلوب"),
            endTime: string().required("وقت النهاية مطلوب")
        }))
        .test('dates-in-order', 'يجب أن تكون التواريخ مرتبة تصاعدياً', function (dates) {
            if (!dates || dates.length <= 1) return true;

            for (let i = 1; i < dates.length; i++) {
                const prevDate = new Date(dates[i - 1].date);
                const currDate = new Date(dates[i].date);

                if (currDate <= prevDate) {
                    return this.createError({
                        path: `TournamentDates[${i}].date`,
                        message: `التاريخ في اليوم ${i + 1} يجب أن يكون بعد التاريخ في اليوم ${i}`
                    });
                }
            }
            return true;
        })
        .test('valid-time-ranges', 'وقت البداية يجب أن يكون قبل وقت النهاية', function (dates) {
            if (!dates) return true;

            for (let i = 0; i < dates.length; i++) {
                const { startTime, endTime } = dates[i];
                if (!startTime || !endTime) continue;

                const start = new Date(`1970-01-01T${startTime}`);
                const end = new Date(`1970-01-01T${endTime}`);

                if (start >= end) {
                    return this.createError({
                        path: `TournamentDates[${i}].startTime`,
                        message: `في اليوم ${i + 1}: وقت البداية يجب أن يكون قبل وقت النهاية`
                    });
                }
            }
            return true;
        })
        .min(1, "يجب تحديد تاريخ واحد على الاقل")
        .required("يجب ادخال تاريخ البطولة"),
    TournamentDaysNumber: number().required().min(1, "يجب ادخال عدد الايام"),
    StatisticsNeed: boolean().required("احصائيات البطولة مطلوبة"),
    SakkaOptions: array().of(object({
        group: string().required("الدور مطلوب"),
        sakka: string().required("اختيارات الصكات مطلوبة"),
    })),
});


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
        // console.log(form.value?.getErrors());
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
    formatTime 
} = useTournamentCalculations();

const TeamsCount = ref<number | string>(model.value.TeamsCount);

watch(TeamsCount, (newVal) => {
    if (newVal === "custom") {
        // props.modelValue.TeamsCount = 0;
    } else {
        model.value.TeamsCount = newVal as number;
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
const onSelectionModeChange = () => {
    if (selectedRfreeOption.value === 'players') {
        model.value.RefreeNeed = false;
    } else if (selectedRfreeOption.value === 'refree') {
        model.value.RefreeNeed = true;
    }
}

const validatePositiveNumber = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);
    if (value < 1) {
        input.value = '1';
    }
}

// Enhanced sakka options using the composable
const updateSakkaOptions = () => {
    const teamsCount = model.value.TeamsCount;
    model.value.SakkaOptions = calculateSakkaOptions(teamsCount);
}

// Computed values using the composable
const BestNumberofTables = computed(() => {
    return calculateOptimalTables(model.value.TeamsCount);
});

const timeAvailable = computed(() => {
    return calculateAvailableTime(model.value.TournamentDates);
})

const timeNeeded = computed(() => {
    return calculateTournamentTime(model.value.TeamsCount, model.value.TablesCount);
})

// Watch effects
watchEffect(() => {
    updateSakkaOptions();
})

watchEffect(() => {
    form.value?.clear("TournamentDaysNumber")
    console.log("timeNeeded", timeNeeded.value)
    if (timeNeeded.value > timeAvailable.value) {
        form.value?.setErrors([{
            name: "TournamentDaysNumber",
            message: ` الوقت المحدد للبطولة ${Math.ceil(timeNeeded.value / 60)} ساعة  والوقت المتاح للبطولة ${Math.ceil(timeAvailable.value / 60)} ساعة  برجاء اضافة المزيد من الوقت `
        }])
    }
})



</script>

<style></style>