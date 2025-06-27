<template>
  <section class="space-y-4">

    <!-- Tournament Prize Section -->
      <UFormField label=" جائزة البطولة" name="TournametPrizeOption">

        <USelect v-model="modelValue.TournametPrizeOption" :items="prizeOptions" @change="onPrizeOptionChange()" />
      </UFormField>

      <h4 class="text-md font-medium text-gray-700 dark:text-gray-200 mb-3">تفاصيل الجوائز</h4>

      <div v-for="(prize, index) in modelValue.TournametPrize" :key="index"
        class=" p-5 bg-gray-50 dark:bg-gray-800  rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-200 shadow-sm">

        <!-- Prize Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <div class=" bg-primary-500 rounded-full flex items-center justify-center p-2">
              <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">المركز {{ index + 1 }}</span>
            </div>
          </div>
        </div>

        <!-- Prize Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <!-- Money Prize Section -->
          <UFormField :label="` قيمة الجائزة`" :name="`TournametPrize[${index}].money`">
            <UInput v-model="prize.money" type="number" placeholder="قيمة الجائزة"
              class="hover:border-primary-300 dark:hover:border-primary-400" />
          </UFormField>

          <!-- Items Prize Section -->
          <UFormField :label="` الجوائز العينية`" :name="`TournametPrize[${index}].items`">
            <div class="space-y-2">
              <!-- Add Item Input -->
              <div class="flex gap-2">
                <UInput v-model="PrizenewItem[index]" placeholder="جائزة عينية"
                  @keyup.enter="addItem(index, PrizenewItem[index])"
                  class="hover:border-primary-300 dark:hover:border-primary-400" />
                <UButton @click="addItem(index, PrizenewItem[index])" color="primary" variant="solid" size="sm"
                  class="px-3 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-200"
                  :disabled="!PrizenewItem[index]?.trim()" icon="i-heroicons-plus" />
              </div>

              <!-- Items Tags -->
              <div v-if="prize.items.length > 0" class="flex flex-wrap gap-1.5">
                <span v-for="(item, itemIndex) in prize.items" :key="itemIndex"
                  class="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs font-medium border border-primary-200 dark:border-primary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200">
                  {{ item }}
                  <button @click="removeItem(index, itemIndex)" icon="i-heroicons-x-mark"
                    class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 hover:scale-110 transition-all duration-200">
                  </button>
                </span>
              </div>
            </div>
          </UFormField>
        </div>
      </div>



    <!-- Tournament Statistics Section -->

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
      <UFormField label=" عدد الفرق" name="TeamsCount">

        <UInput v-model="modelValue.TeamsCount" type="number" min="1" placeholder="0" @input="validatePositiveNumber" />
      </UFormField>

      <UFormField label=" عدد الطاولات" name="TablesCount">
        <UInput v-model="modelValue.TablesCount" type="number" placeholder="0" />
      </UFormField>


      <UFormField label=" مين يسجل النشرة " name="TeamSelectionMode">
        <USelect v-model="selectedRfreeOption" :items="refreeeOptions" placeholder="اختر مين يسجل النشرة"
          @update:model-value="onSelectionModeChange()" />


      </UFormField>
      <UFormField v-if="selectedRfreeOption === 'refree'" label=" عدد الحكام" name="RefreeCount">
        <UInput v-model="modelValue.RefreeCount" type="number" placeholder="0" />
      </UFormField>
      <UFormField label="هل تحتاج البطولة الاحصائيات" name="StatisticsNeed">
          <USwitch size="xl" v-model="modelValue.StatisticsNeed" color="primary" class="w-[200px]" />
          <template #hint>
            <UPopover>
              <UButton icon="i-heroicons-question-mark-circle" variant="ghost" color="neutral" />
              <template #content>
                <img src="~assets/images/staticsExample.jpeg" alt="مثال على الاحصائيات"
                  class="w-32 md:w-64 h-auto rounded-lg" />
              </template>
            </UPopover>
          </template>
      </UFormField>

      <UFormField label="عدد الصكات في المباريات العادية " name="SakkaNormalOption">
        <USelect v-model="modelValue.SakkaNormalOption" :items="SakkaOptions" placeholder="اختر عدد الصكات في المباريات العادية" />
      </UFormField>
      <UFormField label="عدد الصكات في المباريات النهائية" name="SakkaFinalMatchOption">
        <USelect v-model="modelValue.SakkaFinalMatchOption" :items="SakkaOptions" placeholder="اختر عدد الصكات في المباريات النهائية" />
      </UFormField>
    </div>
  </section>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: {
    TournametPrizeOption: number;
    TournametPrize: { money: number, items: string[], position: number }[];
    TeamsCount: number;
    RefreeCount: number;
    RefreeNeed: boolean;
    TablesCount: number;
    StatisticsNeed: boolean;
    SakkaNormalOption:string,
    SakkaFinalMatchOption:string,
    // TeamSelectionMode: string;
  };
}>();

const emit = defineEmits(["update:modelValue"]);
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
const PrizenewItem = ref<string[]>([]);
const onPrizeOptionChange = () => {
  const selectedValue = props.modelValue.TournametPrizeOption;
  props.modelValue.TournametPrize = Array.from({ length: selectedValue }, (_, index) => ({
    money: 0,
    items: [],
    position: index + 1
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

const SakkaOptions = [
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
</script>

<style></style>
