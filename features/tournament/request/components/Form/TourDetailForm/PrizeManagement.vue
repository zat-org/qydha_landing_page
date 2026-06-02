<template>
  <div class="space-y-6">
    <h3 class="text-lg font-medium text-gray-700 dark:text-gray-200">إدارة الجوائز</h3>
    <UFormField label="جائزة البطولة" name="prizes">
      <USelect v-model="selectedprizeOptions" :items="prizeOptions" @change="onPrizeOptionChange" />
    </UFormField>
    <div v-for="(prize, index) in model.prizes" :key="index" class="p-5 bg-gray-50 dark:bg-gray-800 rounded-lg border">
      <UFormField :label="`المركز ${index + 1}`" :name="`prizes[${index}]`">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-sm font-semibold rounded-full p-2">المركز {{ index + 1 }}</span>
        <UCheckbox size="xl" v-model="prize.isFinancial" label="جائزة مالية" />
        <UCheckbox size="xl" v-model="prize.isNonFinancial" label="جائزة عينية" />
      </div>
      </UFormField>
      <div class="flex flex-col gap-3">
        <UFormField v-show="prize.isFinancial" :label="`قيمة الجائزة`" :name="`prizes[${index}].financialPrizeAmount`">
          <UInput dir="ltr" v-model.number="prize.financialPrizeAmount" type="number" @update:model-value="updatePrizeMoney(index, $event)" />
        </UFormField>
        <UFormField v-show="prize.isFinancial" :label="`العملة`" :name="`prizes[${index}].financialPrizeCurrency`">
          <CurrencyInput v-model="prize.financialPrizeCurrency as any" />
        </UFormField>
        <UFormField v-show="prize.isNonFinancial" :label="`الجوائز العينية`" :name="`prizes[${index}].nonFinancialPrizes`">
          <div class="space-y-2">
            <div class="flex gap-2">
              <UInput v-model="newItems[index]" placeholder="جائزة عينية" @keyup.enter="addItem(index, newItems[index])" @focus="onInputFocus(index)" />
              <UButton @click="addItem(index, newItems[index])" color="primary" :disabled="!newItems[index]?.trim()" icon="i-heroicons-plus" />
            </div>
            <div v-if="prize.nonFinancialPrizes.length > 0" class="flex flex-wrap gap-1.5">
              <span v-for="(item, itemIndex) in prize.nonFinancialPrizes" :key="itemIndex" class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border">
                {{ item }}
                <UButton @click="removeItem(index, itemIndex)" icon="i-heroicons-x-mark" variant="ghost" size="xs" />
              </span>
            </div>
          </div>
        </UFormField>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TournamentPrizeType } from '~/features/tournament/models/tournamentPrize';
interface PrizeData { prizes: any[] }
const model = defineModel<PrizeData>({ required: true })
const parentForm = inject('formRef', null) as any;
const newItems = ref<string[]>([]);
const selectedprizeOptions = ref(1)
const prizeOptions = [
  { label: "مركز الاول فقط", value: 1, pos: [TournamentPrizeType.one] },
  { label: "مركز الاول والثاني فقط", value: 2, pos: [TournamentPrizeType.one, TournamentPrizeType.two] },
  { label: "مركز الاول والثاني والثالث فقط", value: 3, pos: [TournamentPrizeType.one, TournamentPrizeType.two, TournamentPrizeType.three] },
  { label: "مركز الاول والثاني والثالث والرابع فقط", value: 4, pos: [TournamentPrizeType.one, TournamentPrizeType.two, TournamentPrizeType.three,TournamentPrizeType.four] }
];
const onPrizeOptionChange = () => {
  let selectedprizeOptionsObject  = prizeOptions.find(op=>op.value == unref(selectedprizeOptions))
  if(!selectedprizeOptionsObject) selectedprizeOptionsObject =prizeOptions[0]
  model.value.prizes = Array.from({ length: unref(selectedprizeOptions) }, (_, index) => ({
    isFinancial: true, isNonFinancial: false, type:selectedprizeOptionsObject?.pos[index], financialPrizeAmount: 1000, financialPrizeCurrency: "SAR", nonFinancialPrizes: [],
  }));
};
const updatePrizeMoney = (index: number, value: string | number) => {
  const n = typeof value === 'string' ? Number(value) : value;
  model.value.prizes[index].financialPrizeAmount = Number.isFinite(n) ? n : 0;
};
const onInputFocus = (index: number) => { if (parentForm?.value) parentForm.value.clear?.(`prizes[${index}].nonFinancialPrizes`); };
const addItem = async (index: number, value: string) => {
  if (!value?.trim()) return;
  model.value.prizes[index].nonFinancialPrizes.push(value.trim()); newItems.value[index] = "";
  await nextTick();
};
const removeItem = async (index: number, itemIndex: number | string) => {
  const i = typeof itemIndex === 'string' ? Number(itemIndex) : itemIndex;
  model.value.prizes[index].nonFinancialPrizes.splice(i, 1);
  await nextTick();
};
</script>
