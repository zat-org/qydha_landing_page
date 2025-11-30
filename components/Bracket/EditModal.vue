<template>
  <UModal class="h-[80vh]" title="تعديل المباراة" description="تعديل المباراة">
    <template #body>
      <div class="p-4">
        <!-- Loading State -->
        <div v-if="choicesREQ && (choicesREQ.pending as any).value" class="flex justify-center items-center py-12">
          <loading />
        </div>

        <!-- Error State -->
        <div v-else-if="choicesREQ && (choicesREQ.error as any)?.value" class="p-4">
          <UAlert 
            color="error" 
            variant="soft" 
            icon="i-heroicons-exclamation-triangle"
            title="خطأ في تحميل البيانات" 
            :description="((choicesREQ.error as any)?.value as any)?.message || 'حدث خطأ أثناء تحميل البيانات'" 
          />
        </div>

        <!-- Form -->
        <UForm 
          v-else-if="matchChoices" 
          :state="state" 
          :schema="schema" 
          @submit="onSubmit" 
          class="flex flex-col gap-5"
          ref="form"
        >
          <UFormField label="الحكم" name="refereeId" :ui="{ error: 'm-0' }" class="w-full">
            <div class="flex flex-col gap-2">
              <div class="flex gap-2 items-center ">
                <USelectMenu 
                  v-model="state.refereeId" 
                  :items="refereeItems" 
                  label-key="username" 
                  value-key="id"
                  :search-attributes="['username']" 
                  class="flex-1" 
                  :placeholder="selectedRefereeDisplay || 'اختر الحكم'"
                />
                <UButton 
                  v-if="state.refereeId" 
                  icon="i-heroicons-x-mark" 
                  color="neutral" 
                  variant="soft" 
                  size="sm"
                  @click="state.refereeId = undefined"
                  :title="'إزالة الحكم'"
                />
              </div>
              <!-- <UAlert 
                v-if="selectedRefereeNotInAvailable" 
                color="warning" 
                variant="soft" 
                size="xs"
                :title="`الحكم المحدد (${selectedRefereeDisplay}) غير متاح حالياً`"
              /> -->
            </div>
          </UFormField>

          <UFormField label="الطاولة" name="tableId" class="w-full">
            <div class="flex flex-col gap-2">
              <div class="flex gap-2 items-center ">
                <USelectMenu 
                  v-model="state.tableId" 
                  :items="tableItems" 
                  label-key="name" 
                  value-key="id"
                  :search-attributes="['name']" 
                  :popper="{ placement: 'left-end' }" 
                  class="flex-1"
                  :placeholder="selectedTableDisplay || 'اختر الطاولة'"
                />
                <UButton 
                  v-if="state.tableId" 
                  icon="i-heroicons-x-mark" 
                  color="neutral" 
                  variant="soft" 
                  size="sm"
                  @click="state.tableId = undefined"
                  :title="'إزالة الطاولة'"
                />
              </div>
              <!-- <UAlert 
                v-if="selectedTableNotInAvailable" 
                color="warning" 
                variant="soft" 
                size="xs"
                :title="`الطاولة المحددة (${selectedTableDisplay}) غير متاحة حالياً`"
              /> -->
            </div>
          </UFormField>

          <UFormField label="مميز" name="isMarked" class="w-full">
            <UCheckbox v-model="state.isMarked" />
          </UFormField>
        </UForm>

        <!-- Empty State -->
        <div v-else class="text-center py-12 text-gray-400">
          <UIcon name="i-heroicons-information-circle" class="text-4xl mb-2" />
          <p>لا توجد بيانات متاحة</p>
        </div>
      </div>
    </template>
    
    <template #footer>
      <div class="flex justify-between items-center w-full" v-if="matchChoices ">
        <UButton 
          label="حفظ" 
          color="primary" 
          variant="soft" 
          @click="form?.submit()" 
          :loading="updateREQ.status.value === 'pending'" 
          :disabled="updateREQ.status.value === 'pending'"
        />

        <UDropdownMenu 
          :items="withdrawItems" 
          :popper="{ placement: 'bottom-end' }"
          v-if="match.state.toLowerCase() == 'created'" 
          :ui="{ content: 'w-[300px]' }"
        >
          <UButton v-if="match.usTeamId &&match.themTeamId" color="error" label="انسحاب" trailing-icon="i-heroicons-chevron-down-20-solid" />
        </UDropdownMenu>
        <UButton 
          v-else 
          color="error"
          label="اعادة الضبط" 
          @click="onReset" 
        />
      </div>
    </template>
  </UModal>
</template>
<script lang="ts" setup>
import { object, string, boolean } from "yup";
import type { IMatchUpdate, IUpdateChoicesForMatch } from "~/models/match";
import type { Match } from "~/models/group";
import { Privilege } from "~/models/user";
import { useMyAuthStore } from "~/store/Auth";
import loading from "~/components/loading.vue";

const form = useTemplateRef('form');
const props = defineProps<{ match: Match }>();
const userStore = useMyAuthStore();
const { permissions, privilege } = storeToRefs(userStore);
const { updateMatch, updateMatchState, getUpdateChoicesForMatch } = useMatch();
const route = useRoute();
const emit = defineEmits(['close']);
const toast = useToast();
const tour_id = route.params.id.toString();

// Schema for validation
const schema = object({
  refereeId: string().nullable(),
  tableId: string().nullable(),
  isMarked: boolean()
});

// Form state
const state = reactive<IMatchUpdate>({
  refereeId: undefined,
  tableId: undefined,
  isMarked: false
});

// Fetch choices for the match
const choicesREQ = await getUpdateChoicesForMatch(tour_id, props.match.id);

// Initialize form state from fetched choices
if (choicesREQ.status.value === "success" && choicesREQ.data?.value?.data) {
  state.refereeId = choicesREQ.data.value.data.selectedReferee?.id || undefined;
  state.tableId = choicesREQ.data.value.data.selectedTable?.id || undefined;
  state.isMarked = props.match.isMarked || false;
}

// Match choices data
const matchChoices = computed<IUpdateChoicesForMatch | null>(() => {
  if (choicesREQ.status.value === "success" && choicesREQ.data?.value?.data) {
    return choicesREQ.data.value.data || null;
  }
  return null;
});

// Computed items that include selected items even if not in available
const refereeItems = computed(() => {
  if (!matchChoices.value) return [];
  const available = matchChoices.value.availableReferee || [];
  const selected = matchChoices.value.selectedReferee;
  
  // If selected referee exists, add it to the list (even if not in available)
  if (selected) {
    return [selected, ...available];
  }
  return available;
});

const tableItems = computed(() => {
  if (!matchChoices.value) return [];
  const available = matchChoices.value.availableTable || [];
  const selected = matchChoices.value.selectedTable;
  
  // If selected table exists, add it to the list (even if not in available)
  if (selected) {
    return [selected, ...available];
  }
  return available;
});

// Check if selected items are not in available (for warning display)
// Only show warning if the form value matches the originally selected value AND it's not in available
const selectedRefereeNotInAvailable = computed(() => {
  if (!matchChoices.value || !state.refereeId) return false;
  const selected = matchChoices.value.selectedReferee;
  const available = matchChoices.value.availableReferee || [];
  // Only show warning if state matches the originally selected referee and it's not in available
  return selected && selected.id === state.refereeId && !available.find(r => r.id === selected.id);
});

const selectedTableNotInAvailable = computed(() => {
  if (!matchChoices.value || !state.tableId) return false;
  const selected = matchChoices.value.selectedTable;
  const available = matchChoices.value.availableTable || [];
  // Only show warning if state matches the originally selected table and it's not in available
  return selected && selected.id === state.tableId && !available.find(t => t.id === selected.id);
});

// Display names for selected items
const selectedRefereeDisplay = computed(() => {
  if (!matchChoices.value || !state.refereeId) return null;
  const selected = matchChoices.value.selectedReferee;
  if (selected && selected.id === state.refereeId) {
    return selected.username || selected.name || selected.id;
  }
  // Find in available or items
  const found = refereeItems.value.find(r => r.id === state.refereeId);
  return found?.username || found?.name || state.refereeId;
});

const selectedTableDisplay = computed(() => {
  if (!matchChoices.value || !state.tableId) return null;
  const selected = matchChoices.value.selectedTable;
  if (selected && selected.id === state.tableId) {
    return selected.name;
  }
  // Find in available or items
  const found = tableItems.value.find(t => t.id === state.tableId);
  return found?.name || state.tableId;
});

// Update match function
const updateREQ = await updateMatch();

const onSubmit = async () => {
  if (!props.match.id) {
    toast.add({ title: "خطأ", description: "معرف المباراة غير موجود", color: "error" });
    return;
  }

  await updateREQ.fetchREQ(tour_id, props.match.id, state);
  
  if (updateREQ.status.value === "success") {
    toast.add({ title: "تم التحديث بنجاح", color: "success" });
    emit('close');
  } else if (updateREQ.error.value) {
    toast.add({ 
      title: "خطأ في التحديث", 
      description: updateREQ.error.value.message || "حدث خطأ أثناء التحديث",
      color: "error" 
    });
  }
};

// withdraw dropdown 
const MatchStateREQ = await updateMatchState()
const withdrawUS = async () => {
  console.log(props.match.qydhaGameId)
  await MatchStateREQ.fetchWithdrawREQ(props.match.qydhaGameId, "Us")
  if (MatchStateREQ.status.value == "success") {
    emit('close')
  }
}
const withdrawThem = async () => {
  await MatchStateREQ.fetchWithdrawREQ(props.match.qydhaGameId, "Them")
  if (MatchStateREQ.status.value == "success") {
    emit('close')
  }
}
const withdrawBoth = async () => {
  await MatchStateREQ.fetchWithdrawREQ(props.match.qydhaGameId, "All")
  if (MatchStateREQ.status.value == "success") {
    emit('close')
  }
}
const onReset = async () => {
  await MatchStateREQ.fetchRestREQ(props.match.qydhaGameId)
  if (MatchStateREQ.status.value == "success") {
    emit('close')
  }
}
const withdrawItems = [[
  { label: ` انسحاب  ${props.match.usTeamName}`, onSelect: () => withdrawUS() },
  { label: ` انسحاب  ${props.match.themTeamName}`, onSelect: () => withdrawThem() },
  { label: 'انسحاب كلا الفريقين', onSelect: () => withdrawBoth() }
]]


</script>

<style></style>