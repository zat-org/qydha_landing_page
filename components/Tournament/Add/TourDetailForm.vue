<template>

  <!-- Tournament Prize Section -->
  <div class="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
    <UFormGroup :ui="{
      label: {
        base: 'text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2'
      },
      error: 'text-xs text-red-500 mt-1'
    }" label=" جائزة البطولة" name="TournametPrizeOption">

      <USelect :ui="{
        base: 'form-input w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
      }" v-model="modelValue.TournametPrizeOption" :options="prizeOptions" @change="onPrizeOptionChange()" />
    </UFormGroup>

    <h4 class="text-md font-medium text-gray-700 dark:text-gray-200 mb-3">تفاصيل الجوائز</h4>

    <div v-for="(prize, index) in modelValue.TournametPrize" :key="index"
      class="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-200 shadow-sm">

      <!-- Prize Header -->
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
            <span class="text-white font-bold text-xs">{{ index + 1 }}</span>
          </div>
          <span class="text-sm font-semibold text-gray-800 dark:text-gray-200">الجائزة {{ index + 1 }}</span>
        </div>
        <UIcon name="i-heroicons-trophy" class="w-4 h-4 text-primary-600 dark:text-primary-400" />
      </div>

      <!-- Prize Content -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <!-- Money Prize Section -->
        <UFormGroup :ui="{
          label: {
            base: 'text-xs font-medium text-gray-700 dark:text-gray-200 mb-1'
          },
          error: 'text-xs text-red-500 mt-1'
        }" :label="` قيمة الجائزة`" :name="`TournametPrize[${index}].money`">
          <UInput :ui="{
            base: 'form-input w-full px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
          }" v-model="prize.money" type="number" placeholder="قيمة الجائزة" icon="i-heroicons-currency-dollar"
            class="hover:border-primary-300 dark:hover:border-primary-400" />
        </UFormGroup>

        <!-- Items Prize Section -->
        <UFormGroup :ui="{
          label: {
            base: 'text-xs font-medium text-gray-700 dark:text-gray-200 mb-1'
          },
          error: 'text-xs text-red-500 mt-1'
        }" :label="` الجوائز العينية`" :name="`TournametPrize[${index}].items`">
          <div class="space-y-2">
            <!-- Add Item Input -->
            <div class="flex gap-2">
              <UInput :ui="{
                base: 'form-input flex-1 px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
              }" v-model="PrizenewItem[index]" placeholder="جائزة عينية" icon="i-heroicons-gift"
                @keyup.enter="addItem(index, PrizenewItem[index])" class="hover:border-primary-300 dark:hover:border-primary-400" />
              <UButton @click="addItem(index, PrizenewItem[index])" color="primary" variant="solid" size="sm"
                icon="i-heroicons-plus"
                class="px-3 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-200"
                :disabled="!PrizenewItem[index]?.trim()" />
            </div>

            <!-- Items Tags -->
            <div v-if="prize.items.length > 0" class="flex flex-wrap gap-1.5">
              <span v-for="(item, itemIndex) in prize.items" :key="itemIndex"
                class="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs font-medium border border-primary-200 dark:border-primary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200">
                <UIcon name="i-heroicons-gift" class="w-3 h-3" />
                {{ item }}
                <button @click="removeItem(index, itemIndex)"
                  class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 hover:scale-110 transition-all duration-200">
                  <UIcon name="i-heroicons-x-mark" class="w-3 h-3" />
                </button>
              </span>
            </div>
          </div>
        </UFormGroup>
      </div>
    </div>

  </div>


  <!-- Tournament Statistics Section -->
  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
    <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
      <UIcon name="i-heroicons-chart-bar" class="text-primary-500 dark:text-primary-400" />
      إحصائيات البطولة
    </h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UFormGroup :ui="{
        label: {
          base: 'text-sm font-medium text-gray-700 dark:text-gray-200'
        },
        error: 'text-xs text-red-500 mt-1'
      }" label=" عدد الفرق" name="TeamsCount">
        <UInput :ui="{
          base: 'form-input w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
        }" v-model="modelValue.TeamsCount" type="number" placeholder="0" icon="i-heroicons-users" />
      </UFormGroup>

      <UFormGroup :ui="{
        wrapper: 'space-y-2',
        label: {
          base: 'text-sm font-medium text-gray-700 dark:text-gray-200'
        },
        error: 'text-xs text-red-500 mt-1'
      }" label=" عدد الحكام" name="RefreeCount">
        <UInput :ui="{
          base: 'form-input w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
        }" v-model="modelValue.RefreeCount" type="number" placeholder="0" icon="i-heroicons-user-group" />
      </UFormGroup>

      <UFormGroup :ui="{
        wrapper: 'space-y-2',
        label: {
          base: 'text-sm font-medium text-gray-700 dark:text-gray-200'
        },
        error: 'text-xs text-red-500 mt-1'
      }" label=" عدد الطاولات" name="TablesCount">
        <UInput :ui="{
          base: 'form-input w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
        }" v-model="modelValue.TablesCount" type="number" placeholder="0" icon="i-heroicons-rectangle-stack" />
      </UFormGroup>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: {
    TournametPrizeOption: number;
    TournametPrize: { money: number, items: string[], position: number }[];
    TeamsCount: number;
    RefreeCount: number;
    TablesCount: number;
  
    // Stage32Option: string;
    // Stage16Option: string;
    // Stage8Option: string;
    // SemiFinalOption: string;
    // FinalOption: string;
    TeamSelectionMode: string;
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
const refreeeOptions = [
  {
    label: "اللاعبين ",
    value: 1,
  },
  {
    label: "الحكام",
    value: 2,
  }
]
</script>

<style></style>
