<template>
    <UCard class="max-w-7xl mx-auto  bg-gray-50 dark:bg-gray-900  ">
        <!-- Tournament Prize Section -->
        <UForm :schema="localSchema" :state="modelValue" class="flex flex-col space-y-6 " ref="form">
            <UFormField label="بداية تسجيل اللاعبين في البطولة" name="TournamentStartEnrolmmentDate">
                <UInput v-model="modelValue.TournamentStartEnrolmmentDate" placeholder="بداية تسجيل اللاعبين في البطولة"
                    type="date" />
            </UFormField>

            <UFormField label="نهاية تسجيل اللاعبين في البطولة" name="TournamentEndEnrolmmentDate">
                <UInput v-model="modelValue.TournamentEndEnrolmmentDate" placeholder="نهاية تسجيل اللاعبين في البطولة"
                    type="date" />
            </UFormField>


            <UFormField label=" جائزة البطولة" name="TournametPrize">
                <USelect v-model="modelValue.TournametPrizeOption" :items="prizeOptions"
                    @change="onPrizeOptionChange()" />
            </UFormField>

            <h4 class="text-md font-medium text-gray-700 dark:text-gray-200 mb-3">تفاصيل الجوائز</h4>

            <div v-for="(prize, index) in modelValue.TournametPrize" :key="index"
                class=" p-5 bg-gray-50 dark:bg-gray-800  rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-200 shadow-sm">

                <!-- Prize Header -->
                <div class="flex items-center gap-2">
                    <span
                        class="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-primary-500 rounded-full flex items-center justify-center p-2 w-fit">المركز
                        {{ index + 1 }}</span>
                    <UCheckbox size="xl" v-model="prize.isMoney" label="جائزة مالية " />
                    <UCheckbox size="xl" v-model="prize.isItem" label="جائزة عينية " />
                </div>
                <!-- Prize Content -->
                <div class="flex flex-col gap-3">
                    <!-- Money Prize Section -->
                    <UFormField :label="` قيمة الجائزة`" :name="`TournametPrize[${index}].money`"
                        v-show="prize.isMoney">
                        <UInput v-model.number="prize.money" type="number" placeholder="قيمة الجائزة"
                            class="hover:border-primary-300 dark:hover:border-primary-400"
                            @update:model-value="prize.money = $event || $event === 0 ? $event : 0" />
                    </UFormField>

                    <!-- Items Prize Section -->
                    <UFormField :label="` الجوائز العينية`" :name="`TournametPrize[${index}].items`"
                        v-show="prize.isItem">
                        <div class="space-y-2">
                            <!-- Add Item Input -->
                            <div class="flex gap-2">
                                <UInput v-model="PrizenewItem[index]" placeholder="جائزة عينية"
                                    @keyup.enter=" addItem(index, PrizenewItem[index])"
                                    class="hover:border-primary-300 dark:hover:border-primary-400" />
                                <UButton @click="addItem(index, PrizenewItem[index])" color="primary" variant="solid"
                                    size="sm"
                                    class="px-3 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-200"
                                    :disabled="!PrizenewItem[index]?.trim()" icon="i-heroicons-plus" />
                            </div>

                            <!-- Items Tags -->
                            <div v-if="prize.items.length > 0" class="flex flex-wrap gap-1.5">
                                <span v-for="(item, itemIndex) in prize.items" :key="itemIndex"
                                    class="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs font-medium border border-primary-200 dark:border-primary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200">
                                    {{ item }}

                                    <UButton @click="removeItem(index, itemIndex)" icon="i-heroicons-x-mark"
                                        variant="ghost"
                                        class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 hover:scale-110 transition-all duration-200"
                                        size="xs">
                                    </UButton>
                                </span>
                            </div>
                        </div>
                    </UFormField>
                </div>
            </div>
            <UFormField name="TournamentDays" label="عدد أيام البطولة">
            </UFormField   >
            <UFormField label="عدد أيام البطولة" name="TournamentDaysNumber"
                :hint="` افضل عدد ساعات  لادارة البطولة ${Math.ceil(BestTime / 60)} ساعة `" required>
                <div class="relative flex items-center gap-2">
                    <UInput type="number" v-model="modelValue.TournamentDaysNumber" min="1"
                        @input="updateTournamentDates" class="hover:border-primary-300 text-center w-20" />
                    <span class="text-gray-600 dark:text-gray-400">يوم</span>
                </div>
            </UFormField>

            <div v-if="modelValue.TournamentDaysNumber > 0" class="space-y-4 mt-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <div v-for="(date, index) in modelValue.TournamentDates" :key="index"
                        class="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-300 transition-colors duration-200">
                        <UFormField :label="` اليوم ${index + 1}`" :name="`TournamentDates[${index}]`">
                            <div class="space-y-2">
                                <div class="relative">
                                    <UFormField label="التاريخ " :name="`TournamentDates[${index}].date`">
                                        <UInput type="date" v-model="date.date" class="hover:border-primary-300" />
                                    </UFormField>
                                </div>
                                <div class="flex gap-2">
                                    <UFormField label="وقت البداية" class="flex-1"
                                        :name="`TournamentDates[${index}].startTime`">
                                        <UInput type="time" v-model="date.startTime" class="hover:border-primary-300" />
                                    </UFormField>
                                    <UFormField label="وقت النهاية" class="flex-1"
                                        :name="`TournamentDates[${index}].endTime`">
                                        <UInput type="time" v-model="date.endTime" class="hover:border-primary-300" />
                                    </UFormField>
                                </div>
                            </div>
                        </UFormField>
                    </div>
                </div>
            </div>

            <!-- Tournament Statistics Section -->

            <UFormField label=" عدد الفرق" name="TeamsCount">
                <div class="flex items-center gap-2">
                    <USelect v-model="TeamsCount" :items=TeamsCountOptions />
                    <UInput v-if="TeamsCount === 'custom'" v-model="modelValue.TeamsCount" type="number" min="1"
                        placeholder="0" @input="validatePositiveNumber" />
                </div>
            </UFormField>

            <UFormField label=" عدد الطاولات" name="TablesCount"
                :hint="`افضل عدد طاولات لادارة الفرق  ${BestNumberofTables} طاولات `">
                <UInput v-model="modelValue.TablesCount" type="number" placeholder="0" />
            </UFormField>

            <div class="flex items-center gap-2">
                <UFormField label=" مين يسجل النشرة " name="TeamSelectionMode" class=" flex-1">
                    <USelect v-model="selectedRfreeOption" :items="refreeeOptions" placeholder="اختر مين يسجل النشرة"
                        @update:model-value="onSelectionModeChange()" />
                </UFormField>
                <UFormField v-if="selectedRfreeOption === 'refree'"
                    :hint="` افضل عدد حكام لادارة الفرق  ${BestNumberofTables} حكام `" label=" عدد الحكام"
                    name="RefreeCount" class=" flex-1">
                    <UInput v-model="modelValue.RefreeCount" type="number" placeholder="0" />
                </UFormField>
            </div>

            <UFormField label="  نوع توزيع الفرق" name="TeamSelectionMode" class=" flex-1">
                <USelect v-model="modelValue.TeamSelectionMode" :items="TeamSelectionModeOptions"
                    placeholder="اختر نوع توزيع الفرق" />
            </UFormField>

            <UFormField label="  هل تحتاج البطولة الاحصائيات عن طريق التسجيل المتقدم " name="StatisticsNeed">
                <USwitch size="xl" v-model="modelValue.StatisticsNeed" color="primary" class="w-[200px]" />
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



            <div v-if="modelValue.SakkaOptions.length > 0" class="space-y-4 mt-6">
                <h4 class="text-md font-medium text-gray-700 dark:text-gray-200 mb-3">اختيارات الصكات لكل دور</h4>
                <div v-for="(sakka, index) in modelValue.SakkaOptions" :key="index"
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

const props = defineProps<{
    modelValue: {
        TournamentStartEnrolmmentDate: string;
        TournamentEndEnrolmmentDate: string;
        TournametPrizeOption: number;
        TournametPrize: { money: number, items: string[], position: number, isMoney: boolean, isItem: boolean }[];
        TeamsCount: number;
        RefreeCount: number;
        RefreeNeed: boolean;
        TablesCount: number;
        StatisticsNeed: boolean;
        SakkaOptions: { group: string, sakka: string }[],
        TournamentDaysNumber: number;
        TournamentDates: { date: string, startTime: string, endTime: string }[];
        TeamSelectionMode: string;
    };

}>();

const emit = defineEmits(["update:modelValue"]);

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
        .test('dates-in-order', 'يجب أن تكون التواريخ مرتبة تصاعدياً', function(dates) {
            if (!dates || dates.length <= 1) return true;
            
            for (let i = 1; i < dates.length; i++) {
                const prevDate = new Date(dates[i-1].date);
                const currDate = new Date(dates[i].date);
                
                if (currDate <= prevDate) {
                    return this.createError({
                        path: `TournamentDates[${i}].date`,
                        message: `التاريخ في اليوم ${i+1} يجب أن يكون بعد التاريخ في اليوم ${i}`
                    });
                }
            }
            return true;
        })
        .test('valid-time-ranges', 'وقت البداية يجب أن يكون قبل وقت النهاية', function(dates) {
            if (!dates) return true;
            
            for (let i = 0; i < dates.length; i++) {
                const { startTime, endTime } = dates[i];
                if (!startTime || !endTime) continue;
                
                const start = new Date(`1970-01-01T${startTime}`);
                const end = new Date(`1970-01-01T${endTime}`);
                
                if (start >= end) {
                    return this.createError({
                        path: `TournamentDates[${i}].startTime`,
                        message: `في اليوم ${i+1}: وقت البداية يجب أن يكون قبل وقت النهاية`
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


const timeOfMatch = 30;
const TeamsCount = ref<number | string>(props.modelValue.TeamsCount);

watch(TeamsCount, (newVal) => {
    if (newVal === "custom") {
        // props.modelValue.TeamsCount = 0;
    } else {
        props.modelValue.TeamsCount = newVal as number;
    }
});



// prize detail 
const prizeOptions = [
    {
        label: "مركز الاول  فقط ",
        value: 1,
    },
    {
        label: "مركز الاول والثاني فقط ",
        value: 2,
    },
    {
        label: "مركز الاول والثاني والثالث فقط ",
        value: 3,
    },
    {
        label: "مركز الاول والثاني والثالث والرابع فقط ",
        value: 4,
    }
]
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
const updateTournamentDates = (event: Event) => {
    const target = event.target as HTMLInputElement
    const value = Number(target.value)
    props.modelValue.TournamentDates =
        Array.from({ length: value || 1 },
            (_, i) => {
                return {
                    date: "",
                    startTime: "",
                    endTime: "",
                };
                // new Date (new Date().setDate( new Date().getDate() + i)).toISOString().split('T')[0]
            })
}

const PrizenewItem = ref<string[]>([]);
const onPrizeOptionChange = () => {
    const selectedValue = props.modelValue.TournametPrizeOption;
    props.modelValue.TournametPrize = Array.from({ length: selectedValue }, (_, index) => ({
        money: 0,
        items: [] as string[],
        position: index + 1,
        isMoney: true,
        isItem: false,
    }));
    PrizenewItem.value = Array.from({ length: selectedValue }, () => "");
}

const addItem = (index: number, value: string) => {
    props.modelValue.TournametPrize[index].items.push(value);
    PrizenewItem.value[index] = "";
}

const removeItem = (index: number, itemIndex: number) => {
    props.modelValue.TournametPrize[index].items.splice(itemIndex, 1);
}

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
        props.modelValue.RefreeNeed = false;
    } else if (selectedRfreeOption.value === 'refree') {
        props.modelValue.RefreeNeed = true;
    }
}

const validatePositiveNumber = (event: Event) => {
    const input = event.target as HTMLInputElement;
    const value = parseInt(input.value);
    if (value < 1) {
        input.value = '1';
    }
}
//  Enhanced sakka options based on proper tournament structure
const calcSakkaOptions = () => {
    const teamsCount = props.modelValue.TeamsCount;

    if (teamsCount <= 1) {
        props.modelValue.SakkaOptions = [];
        return;
    }

    // Find the next lower power of 2
    const nextPowerOf2 = Math.pow(2, Math.floor(Math.log2(teamsCount)));

    props.modelValue.SakkaOptions = [];
    let remainingTeams = teamsCount;

    // First round: Play-in games if needed
    if (teamsCount > nextPowerOf2) {
        props.modelValue.SakkaOptions.push({
            group: "دور التأهل",
            sakka: "1"
        });
        remainingTeams = nextPowerOf2;
    }

    // Regular knockout rounds (perfect power of 2 structure)
    while (remainingTeams > 1) {
        let roundName = "";
        if (remainingTeams === 2) roundName = "النهائي";
        else if (remainingTeams === 4) roundName = "نصف النهائي";
        else if (remainingTeams === 8) roundName = "ربع النهائي";
        else if (remainingTeams === 16) roundName = "دور الـ16";
        else if (remainingTeams === 32) roundName = "دور الـ32";
        else if (remainingTeams === 64) roundName = "دور الـ64";
        else if (remainingTeams === 128) roundName = "دور الـ128";
        else roundName = `دور الـ${remainingTeams}`;

        props.modelValue.SakkaOptions.push({
            group: roundName,
            sakka: "1"
        });

        remainingTeams = remainingTeams / 2;
    }

}
// time avilabel  for tournament
const clacNumberOfHorsOfTournament = () => {
    let totalMinutes = 0;

    // Loop through each tournament date
    props.modelValue.TournamentDates.forEach(date => {
        if (date.startTime && date.endTime) {
            // Create Date objects for start and end times
            const startTime = new Date(`1970-01-01T${date.startTime}`);
            const endTime = new Date(`1970-01-01T${date.endTime}`);

            // Calculate difference in milliseconds and convert to hours
            const diffMs = Math.abs(endTime.getTime() - startTime.getTime());

            const diffMinutes = diffMs / (1000 * 60);

            totalMinutes += diffMinutes;
        }
    });
    // console.log(totalMinutes);

    // Calculate number of possible matches based on 30 min per match
    return totalMinutes;


}

// time needed for tournament
const CalcTournamentTime = () => {
    const teamsCount = props.modelValue.TeamsCount;
    const tablesCount = props.modelValue.TablesCount;

    if (teamsCount <= 1 || tablesCount <= 0) {
        return 0;
    }

    // Find the next lower power of 2
    const nextPowerOf2 = Math.pow(2, Math.floor(Math.log2(teamsCount)));

    let remainingTeams = teamsCount;
    let totalTimeSlots = 0;

    // First round: Play-in games if needed (byes only in first round)
    if (teamsCount > nextPowerOf2) {
        // ✅ CORRECT: Only teams that need to play in play-in round
        const playInMatches = teamsCount - nextPowerOf2;
        const playInTimeSlots = Math.ceil(playInMatches / tablesCount);

        totalTimeSlots += playInTimeSlots;
        remainingTeams = nextPowerOf2;

    }

    // Regular knockout rounds (perfect power of 2 structure)
    while (remainingTeams > 1) {
        // ✅ CORRECT: Only half of remaining teams play (matches = teams/2)
        const matchesThisRound = remainingTeams / 2;
        const timeSlotsThisRound = Math.ceil(matchesThisRound / tablesCount);
        totalTimeSlots += timeSlotsThisRound;
        remainingTeams = remainingTeams / 2;
    }

    return totalTimeSlots * timeOfMatch;
}
// Optimal number of tables based on tournament structure
const BestNumberofTables = computed(() => {
    const teamsCount = props.modelValue.TeamsCount;

    if (teamsCount <= 1) return 0;

    const nextPowerOf2 = Math.pow(2, Math.floor(Math.log2(teamsCount)));
    let maxMatches = 0;
    let remainingTeams = teamsCount;

    // Play-in round if needed
    if (teamsCount > nextPowerOf2) {
        maxMatches = Math.max(maxMatches, teamsCount - nextPowerOf2);
        remainingTeams = nextPowerOf2;
    }

    // Regular rounds
    while (remainingTeams > 1) {
        maxMatches = Math.max(maxMatches, remainingTeams / 2);
        remainingTeams = remainingTeams / 2;
    }

    return maxMatches;
});
const BestTime = ref()
watchEffect(() => {
    calcSakkaOptions();
})

watchEffect(() => {
    const timeAvailable = clacNumberOfHorsOfTournament();
    const timeNeeded = CalcTournamentTime();
    BestTime.value = timeNeeded;
    form.value?.clear("TournamentDaysNumber")
    if (timeNeeded > timeAvailable) {
        form.value?.setErrors([{
            name: "TournamentDaysNumber",
            message: ` الوقت المحدد للبطولة ${Math.ceil(timeNeeded / 60)} ساعة  والوقت المتاح للبطولة ${Math.ceil(timeAvailable / 60)} ساعة  برجاء اضافة المزيد من الوقت `
        }])
    }
})


</script>

<style></style>