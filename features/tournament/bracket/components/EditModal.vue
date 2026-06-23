<template>
  <UModal class="h-[80vh]" title="تعديل المباراة" description="تعديل المباراة">
    <template #body>
      <div class="p-4">
        <div v-if="choicesREQ && (choicesREQ.pending as any).value" class="flex justify-center items-center py-12">
          <loading />
        </div>

        <div v-else-if="choicesREQ && (choicesREQ.error as any)?.value" class="p-4">
          <UAlert color="error" variant="soft" icon="i-heroicons-exclamation-triangle" title="خطأ في تحميل البيانات"
            :description="((choicesREQ.error as any)?.value as any)?.message || 'حدث خطأ أثناء تحميل البيانات'" />
        </div>

        <UForm v-else-if="matchChoices" :state="state" :schema="schema" @submit="onSubmit" class="flex flex-col gap-5"
          ref="form">
          <UFormField label="الحكم" name="refereeId" :ui="{ error: 'm-0' }" class="w-full">
            <div class="flex flex-col gap-2">
              <div class="flex gap-2 items-center">
                <USelectMenu v-model="state.refereeId" :items="refereeItems" label-key="username" value-key="id"
                  :search-attributes="['username']" class="flex-1"
                  :placeholder="selectedRefereeDisplay || 'اختر الحكم'" />
                <UButton v-if="state.refereeId" icon="i-heroicons-x-mark" color="neutral" variant="soft" size="sm"
                  @click="state.refereeId = undefined" :title="'إزالة الحكم'" />
              </div>
            </div>
          </UFormField>

          <UFormField label="الطاولة" name="tableId" class="w-full">
            <div class="flex flex-col gap-2">
              <div v-if="hasSingleTableChoice" class="flex min-h-9 items-center rounded-md border border-gray-200 bg-gray-50 px-3 text-sm dark:border-gray-800 dark:bg-gray-900/40">
                {{ singleTable?.name || "—" }}
              </div>
              <div v-else class="flex gap-2 items-center">
                <USelectMenu v-model="state.tableId" :items="tableItems" label-key="name" value-key="id"
                  :search-attributes="['name']" :popper="{ placement: 'left-end' }" class="flex-1"
                  :placeholder="selectedTableDisplay || 'اختر الطاولة'" />
                <UButton v-if="state.tableId" icon="i-heroicons-x-mark" color="neutral" variant="soft" size="sm"
                  @click="state.tableId = undefined" :title="'إزالة الطاولة'" />
              </div>
            </div>
          </UFormField>

          <UFormField label="مميز" name="isMarked" class="w-full">
            <UCheckbox v-model="state.isMarked" />
          </UFormField>
        </UForm>

        <div v-else class="text-center py-12 text-gray-400">
          <UIcon name="i-heroicons-information-circle" class="text-4xl mb-2" />
          <p>لا توجد بيانات متاحة</p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between items-center w-full" v-if="matchChoices">
        <UButton label="حفظ" color="primary" variant="soft" @click="form?.submit()"
          :loading="updateREQ.status.value === 'pending'" :disabled="updateREQ.status.value === 'pending'" />

        <UDropdownMenu :items="withdrawItems" :popper="{ placement: 'bottom-end' }"
          v-if="match.state.toLowerCase() == 'created'" :ui="{ content: 'w-[300px]' }">
          <UButton v-if="match.usTeamId && match.themTeamId" color="error" label="انسحاب"
            trailing-icon="i-heroicons-chevron-down-20-solid" />
        </UDropdownMenu>
        <UButton v-else color="error" label="اعادة الضبط" @click="onReset" />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string, boolean } from "yup";
import type { Match } from "~/features/tournament/models/group";
import { useMatchEditChoices } from "~/features/tournament/bracket/composables/useMatchEditChoices";
import loading from "~/components/loading.vue";

const form = useTemplateRef("form");
const props = defineProps<{ match: Match }>();

const { updateMatch, MatchWithdraw, MatchReset, MatchBack } = useMatch();
const route = useRoute();
const emit = defineEmits(["close"]);
const toast = useToast();
const tour_id = route.params.id?.toString() || '';

const schema = object({
  refereeId: string().nullable(),
  tableId: string().nullable(),
  isMarked: boolean(),
});

const { choicesREQ, state, matchChoices, refereeItems, tableItems, hasSingleTableChoice, singleTable, selectedRefereeDisplay, selectedTableDisplay } = useMatchEditChoices(tour_id, props.match.id, props.match);

const updateREQ = updateMatch();
const onSubmit = async () => {
  if (!props.match.id) {
    toast.add({ title: "خطأ", description: "معرف المباراة غير موجود", color: "error" });
    return;
  }
  
  await updateREQ.fetchREQ(tour_id, props.match.id, state);
  if (updateREQ.status.value === "success") {
    toast.add({ title: "تم التحديث بنجاح", color: "success" });
    emit("close");
  } else if (updateREQ.error.value) {
    toast.add({ title: "خطأ في التحديث", description: updateREQ.error.value.message || "حدث خطأ أثناء التحديث", color: "error" });
  }
};

const MatchResetREQ = MatchReset();
const onReset = async () => {
  await MatchResetREQ.fetchREQ(props.match.qydhaGameId);
  if (MatchResetREQ.status.value === "success") {
    toast.add({ title: "تم الضبط بنجاح", color: "success" });
    emit("close");
  }
};

const MatchWithdrawREQ = MatchWithdraw();

const withdrawItems = [[
  {
    label: ` انسحاب  ${props.match.usTeamName}`, onSelect:async () => {
      await MatchWithdrawREQ.fetchREQ(props.match.qydhaGameId, "Us")
      if (MatchWithdrawREQ.status.value === "success") {
        toast.add({ title: "تم الانسحاب بنجاح", color: "success" });
      } else {
        toast.add({ title: "تعذّر الانسحاب", description: MatchWithdrawREQ.error.value?.message || "حدث خطأ أثناء الانسحاب", color: "error" });
      }
      emit("close");
    }
  },
  {
    label: ` انسحاب  ${props.match.themTeamName}`, onSelect:async () => {
      await MatchWithdrawREQ.fetchREQ(props.match.qydhaGameId, "Them")
      if (MatchWithdrawREQ.status.value === "success") {
        toast.add({ title: "تم الانسحاب بنجاح", color: "success" });
      } else {
        toast.add({ title: "تعذّر الانسحاب", description: MatchWithdrawREQ.error.value?.message || "حدث خطأ أثناء الانسحاب", color: "error" });
      }
      emit("close");
    }
  },
  {
    label: "انسحاب كلا الفريقين", onSelect:async () => {
      await MatchWithdrawREQ.fetchREQ(props.match.qydhaGameId, "All")
      if (MatchWithdrawREQ.status.value === "success") {
        toast.add({ title: "تم الانسحاب بنجاح", color: "success" });
      } else {
        toast.add({ title: "تعذّر الانسحاب", description: MatchWithdrawREQ.error.value?.message || "حدث خطأ أثناء الانسحاب", color: "error" });
      }
      emit("close");
    }
  },
  // { label: "اعادة الضبط", onSelect: () => MatchResetREQ.fetchREQ(props.match.qydhaGameId) },
  // { label: "عودة المباراة", onSelect: () => MatchBackREQ.fetchREQ(props.match.qydhaGameId) },
]];
</script>

<style></style>
