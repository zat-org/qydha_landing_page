<template>
  <div class="space-y-6">
    <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">إدارة الجوائز</h3>

    <UFormField label="جائزة البطولة" name="prizes">
      <USelect v-model="selectedprizeOptions" :items="prizeOptions" @change="onPrizeOptionChange" />
    </UFormField>

    <h4 class="text-md font-medium text-gray-700 dark:text-gray-200 mb-3">تفاصيل الجوائز</h4>

    <div v-for="(prize, index) in model.prizes" :key="index"
      class="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-400 transition-all duration-200 shadow-sm">
      <!-- Prize Header -->
      <div class="flex items-center gap-2 mb-3">
        <span
          class="text-sm font-semibold text-gray-800 dark:text-gray-200 bg-primary-500 rounded-full flex items-center justify-center p-2 w-fit">
          المركز {{ index + 1 }}
        </span>
        <UCheckbox size="xl" v-model="prize.isFinancial" label="جائزة مالية" />
        <UCheckbox size="xl" v-model="prize.isNonFinancial" label="جائزة عينية" />
      </div>

      <!-- Prize Content -->
      <div class="flex flex-col gap-3">
        <!-- Money Prize Section -->
        <UFormField v-show="prize.isFinancial" :label="`قيمة الجائزة`" :name="`prizes[${index}].financialPrizeAmount`">
          <UInput v-model.number="prize.financialPrizeAmount" type="number" placeholder="قيمة الجائزة"
            class="hover:border-primary-300 dark:hover:border-primary-400"
            @update:model-value="updatePrizeMoney(index, $event)" />
        </UFormField>
        <UFormField v-show="prize.isFinancial" :label="`العملة`" :name="`prizes[${index}].financialPrizeCurrency`">
          <CurrencyInput v-model="prize.financialPrizeCurrency" />
        </UFormField>
        <!-- Items Prize Section -->
        <UFormField v-show="prize.isNonFinancial" :label="`الجوائز العينية`" :name="`prizes[${index}].nonFinancialPrizes`">
          <div class="space-y-2">
            <!-- Add Item Input -->
            <div class="flex gap-2">
              <UInput v-model="newItems[index]" placeholder="جائزة عينية" @keyup.enter="addItem(index, newItems[index])"
                class="hover:border-primary-300 dark:hover:border-primary-400" />
              <UButton @click="addItem(index, newItems[index])" color="primary" variant="solid" size="sm"
                class="px-3 py-2 rounded-lg font-medium hover:scale-105 transition-all duration-200"
                :disabled="!newItems[index]?.trim()" icon="i-heroicons-plus" />
            </div>

            <!-- Items Tags -->
            <div v-if="prize.nonFinancialPrizes.length > 0" class="flex flex-wrap gap-1.5">
              <span v-for="(item, itemIndex) in prize.nonFinancialPrizes" :key="itemIndex"
                class="inline-flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-md text-xs font-medium border border-primary-200 dark:border-primary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200">
                {{ item }}
                <UButton @click="removeItem(index, itemIndex)" icon="i-heroicons-x-mark" variant="ghost"
                  class="text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-200 hover:scale-110 transition-all duration-200"
                  size="xs" />
              </span>
            </div>
          </div>
        </UFormField>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TournamentPrizeType } from '~/models/tournamentRequest';

interface Prize {
  isFinancial: boolean,
  isNonFinancial: boolean,
  type: TournamentPrizeType,
  financialPrizeAmount: number,
  financialPrizeCurrency: string,
  nonFinancialPrizes: string[],
}

interface PrizeData {
  prizes: Prize[];
}

const model = defineModel<PrizeData>({ required: true })


// Local state for new items input
const newItems = ref<string[]>([]);
const selectedprizeOptions = ref(1)
const prizeOptions = [
  {
    label: "مركز الاول فقط",
    value: 1,
    pos: [TournamentPrizeType.one]
  },
  {
    label: "مركز الاول والثاني فقط",
    value: 2,
    pos: [TournamentPrizeType.one, TournamentPrizeType.two]
  },
  {
    label: "مركز الاول والثاني والثالث فقط",
    value: 3,
    pos: [TournamentPrizeType.one, TournamentPrizeType.two, TournamentPrizeType.three]

  },
  {
    label: "مركز الاول والثاني والثالث والرابع فقط",
    value: 4,
    pos: [TournamentPrizeType.one, TournamentPrizeType.two, TournamentPrizeType.three,TournamentPrizeType.four]

  }
];

const onPrizeOptionChange = () => {
  let selectedprizeOptionsObject  = prizeOptions.find(op=>op.value == unref(selectedprizeOptions))
  if(!selectedprizeOptionsObject) selectedprizeOptionsObject =prizeOptions[0]
 
  model.value.prizes = Array.from({ length: unref(selectedprizeOptions) }, (_, index) => ({
    isFinancial: true,
    isNonFinancial: false,
    type:selectedprizeOptionsObject?.pos[index] ,
    financialPrizeAmount: 1000,
    financialPrizeCurrency: "SAR",
    nonFinancialPrizes: [],
  }));
};

const updatePrizeMoney = (index: number, value: number) => {
  model.value.prizes[index].financialPrizeAmount = value || 0;

};

const addItem = (index: number, value: string) => {
  if (!value?.trim()) return;
  model.value.prizes[index].nonFinancialPrizes.push(value.trim());
  newItems.value[index] = "";
};

const removeItem = (index: number, itemIndex: number) => {
  model.value.prizes[index].nonFinancialPrizes.splice(itemIndex, 1);
};

</script>