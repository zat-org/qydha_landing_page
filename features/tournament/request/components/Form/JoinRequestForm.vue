<template>
  <UCard
    :ui="{
      root: 'min-h-full overflow-visible',
      body: 'px-3 py-3 sm:p-4',
      header: 'px-3 py-2 sm:px-4 sm:py-3',
    }"
    class="mx-auto min-h-full max-w-7xl bg-gray-50 dark:bg-gray-900"
  >
    <template #header>
      <div>
        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 md:text-2xl">
          طلبات الانضمام
        </h2>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          حدّد نافذة طلبات الانضمام أولاً — يجب أن تنتهي قبل بداية التصفيات والنهائي
        </p>
      </div>
    </template>

    <UForm :state="model" class="flex flex-col space-y-4">
      <UFormField name="addPlayersByQydha" size="xl">
        <div class="flex gap-4">
          <USwitch
            v-model="model.addPlayersByQydha"
            :disabled="disabledFields?.addPlayersByQydha"
            size="xl"
          />
          <label>التسجيل من خلال قيدها</label>
        </div>
      </UFormField>

      <template v-if="model.addPlayersByQydha">
        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <UFormField
            label="بداية طلبات الانضمام"
            name="joinRequestStartAt"
            :error="errors?.joinRequestStartAt"
          >
            <AsyncDatePicker
              v-model="model.joinRequestStartAt"
              :disabled="disabledFields?.joinRequestStartAt"
              :min-date="new Date()"
              @update:model-value="onFieldBlur?.('joinRequestStartAt')"
            />
          </UFormField>
          <UFormField
            label="نهاية طلبات الانضمام"
            name="joinRequestEndAt"
            :error="errors?.joinRequestEndAt"
          >
            <AsyncDatePicker
              v-model="model.joinRequestEndAt"
              :disabled="disabledFields?.joinRequestEndAt"
              :min-date="model.joinRequestStartAt || new Date()"
              @update:model-value="onFieldBlur?.('joinRequestEndAt')"
            />
          </UFormField>
        </div>

        <UFormField
          label="أقصى عدد طلبات الانضمام"
          name="joinRequestMaxCount"
          :error="errors?.joinRequestMaxCount"
        >
          <AppNumberInput
            v-model="model.joinRequestMaxCount"
            integer
            :min="0"
            :disabled="disabledFields?.joinRequestMaxCount"
            @blur="onFieldBlur?.('joinRequestMaxCount')"
          />
        </UFormField>

        <UFormField
          label="نوع طلبات الانضمام"
          name="allowedJoinRequestType"
          :error="errors?.allowedJoinRequestType"
        >
          <USelect
            v-model="model.allowedJoinRequestType"
            :disabled="disabledFields?.allowedJoinRequestType"
            :items="TournamentPlayerJoinRequestTypeOptions"
            @update:model-value="onFieldBlur?.('allowedJoinRequestType')"
          />
        </UFormField>

        <UFormField
          label="عدد الأيام الأدنى للاشتراك"
          name="minimumSubscriptionDays"
          :error="errors?.minimumSubscriptionDays"
        >
          <AppNumberInput
            v-model="model.minimumSubscriptionDays"
            integer
            :min="0"
            placeholder="0"
            :disabled="disabledFields?.minimumSubscriptionDays"
            @blur="onFieldBlur?.('minimumSubscriptionDays')"
          />
        </UFormField>
      </template>
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
import { TournamentPlayerJoinRequestType } from "~/features/tournament/models/tournamentRequest";

const props = defineProps<{
  errors?: Record<string, string | undefined>;
  onFieldBlur?: (field: string) => void;
  disabledFields?: Record<string, boolean>;
}>();

const { errors, onFieldBlur, disabledFields } = toRefs(props);
const model = defineModel<any>({ required: true });

const TournamentPlayerJoinRequestTypeOptions = [
  { label: "كل الطلبات", value: TournamentPlayerJoinRequestType.All },
  { label: "طلبات فردية", value: TournamentPlayerJoinRequestType.Single },
  { label: "طلبات الفرق", value: TournamentPlayerJoinRequestType.Team },
];
</script>
