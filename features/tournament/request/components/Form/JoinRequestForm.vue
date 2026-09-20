<template>
  <UCard
    :ui="{
      root: 'h-auto flex-none overflow-visible',
      body: 'flex-none overflow-visible px-3 py-3 sm:p-4',
      header: 'px-3 py-2 sm:px-4 sm:py-3',
    }"
    class="mx-auto w-full max-w-7xl bg-gray-50 dark:bg-gray-900"
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
          label="أقصى عدد طلبات تم الموافقة عليها من الطرفين يتم استقبالها"
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
          name="minimumSubscriptionDays"
          :error="errors?.minimumSubscriptionDays"
        >
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-4">
              <USwitch
                v-model="isPaidSubscription"
                :disabled="disabledFields?.minimumSubscriptionDays"
                size="xl"
              />
              <label>
                {{ isPaidSubscription ? "مدفوع — يتطلب أيام اشتراك" : "مجاني" }}
              </label>
            </div>
            <AppNumberInput
              v-if="isPaidSubscription"
              v-model="model.minimumSubscriptionDays"
              integer
              :min="1"
              placeholder="عدد أيام الاشتراك"
              :disabled="disabledFields?.minimumSubscriptionDays"
              @blur="onFieldBlur?.('minimumSubscriptionDays')"
            />
          </div>
        </UFormField>
      </template>
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
const props = defineProps<{
  errors?: Record<string, string | undefined>;
  onFieldBlur?: (field: string) => void;
  disabledFields?: Record<string, boolean>;
}>();

const { errors, onFieldBlur, disabledFields } = toRefs(props);
const model = defineModel<any>({ required: true });

const isPaidSubscription = ref((model.value.minimumSubscriptionDays ?? 0) > 0);

watch(isPaidSubscription, (paid) => {
  if (!paid) {
    model.value.minimumSubscriptionDays = 0;
    onFieldBlur.value?.("minimumSubscriptionDays");
    return;
  }
  if ((model.value.minimumSubscriptionDays ?? 0) < 1) {
    model.value.minimumSubscriptionDays = 1;
  }
  onFieldBlur.value?.("minimumSubscriptionDays");
});

watch(
  () => model.value.minimumSubscriptionDays,
  (days) => {
    const paid = (days ?? 0) > 0;
    if (isPaidSubscription.value !== paid) {
      isPaidSubscription.value = paid;
    }
  },
);
</script>
