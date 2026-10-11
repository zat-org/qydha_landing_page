<template>
  <UDrawer
    v-model:open="open"
    direction="left"
    :handle="false"
    :dismissible="false"
    :ui="{
      content:
        'max-w-[min(100vw-1rem,42rem)] w-full border-gray-200/90 dark:border-gray-800 sm:max-w-lg',
      body: 'flex flex-col min-h-0 overflow-y-auto p-0',
      header: 'border-b border-gray-200/90 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/40',
      footer: 'border-t border-gray-200/90 bg-gray-50/95 dark:border-gray-800 dark:bg-gray-950/50',
    }"
  >
    <template #header>
      <div class="flex items-start justify-between gap-3 p-2">
        <div class="space-y-1 text-start">
          <h2 class="text-lg font-bold text-gray-900 dark:text-white">
            إعدادات طلبات الانضمام
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            تعديل فترة الانضمام والحد الأقصى للطلبات ونوع المشاركة.
          </p>
        </div>
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          icon="i-heroicons-x-mark"
          aria-label="إغلاق"
          :disabled="isPending"
          @click="closeDrawer"
        />
      </div>
    </template>

    <template #body>
      <div class="px-4 py-4">
        <UForm ref="formRef" :schema="schema" :state="formState" class="flex flex-col gap-4">
          <UFormField label="بداية طلبات الانضمام" name="joinRequestStartAt">
            <AsyncDatePicker
              v-model="formState.joinRequestStartAt"
              disabled
              placement="bottom"
            />
          </UFormField>

          <UFormField label="نهاية طلبات الانضمام" name="joinRequestEndAt">
            <AsyncDatePicker
              v-model="formState.joinRequestEndAt"
              placement="bottom"
              :min-date="joinRequestMinAt"
              :max-date="joinRequestMaxAt"
            />
          </UFormField>

          <UFormField label="أقصى عدد طلبات الانضمام" name="joinRequestMaxCount">
            <UInput
              v-model.number="formState.joinRequestMaxCount"
              type="number"
              min="1"
              placeholder="0"
            />
          </UFormField>

          <UFormField label="نوع طلبات الانضمام" name="allowedJoinRequestType">
            <USelect
              v-model="formState.allowedJoinRequestType"
              :items="joinRequestTypeOptions"
            />
          </UFormField>

          <UFormField label="الحد الأدنى لأيام الاشتراك" name="minimumSubscriptionDays">
            <UInput
              v-model.number="formState.minimumSubscriptionDays"
              type="number"
              min="0"
              placeholder="0"
            />
          </UFormField>
        </UForm>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-wrap items-center justify-end gap-2 px-4 py-3">
        <UButton
          label="إغلاق"
          color="neutral"
          variant="soft"
          class="min-h-10"
          :disabled="isPending"
          @click="closeDrawer"
        />
        <UButton
          label="حفظ الإعدادات"
          icon="i-mdi-content-save-outline"
          color="primary"
          class="min-h-10"
          :loading="isPending"
          :disabled="isPending"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import { object, string, number } from "yup";
import type { DetailTournament } from "~/features/tournament/models/tournament";
import type { UpdateJoinRequestSeetingsBody } from "~/features/tournament/models/tournament";
import { TournamentPlayerJoinRequestType } from "~/features/tournament/models/tournamentRequest";
import { useUpdateJoinRequestSettings } from "~/features/tournament/detail/composables/api/useUpdateJoinRequestSettings";

const props = defineProps<{
  tournamentId: string;
  tournament: DetailTournament["tournament"];
}>();

const emit = defineEmits<{ success: [] }>();

const toast = useToast();
const open = ref(false);
const formRef = useTemplateRef("formRef");
const updateReq = useUpdateJoinRequestSettings();

const joinRequestTypeOptions = [
  { label: "كل الطلبات", value: TournamentPlayerJoinRequestType.All },
  { label: "طلبات فردية", value: TournamentPlayerJoinRequestType.Single },
  { label: "طلبات الفرق", value: TournamentPlayerJoinRequestType.Team },
];

const formState = ref<UpdateJoinRequestSeetingsBody>({
  addPlayersByQydha: true,
  joinRequestStartAt: "",
  joinRequestEndAt: "",
  joinRequestMaxCount: 0,
  allowedJoinRequestType: TournamentPlayerJoinRequestType.Team,
  minimumSubscriptionDays: 0,
});

const schema = object({
  joinRequestStartAt: string().required("تاريخ بداية طلبات الانضمام مطلوب"),
  joinRequestEndAt: string()
    .required("تاريخ نهاية طلبات الانضمام مطلوب")
    .test(
      "after-now",
      "يجب أن يكون تاريخ النهاية بعد الوقت الحالي",
      (value) => {
        if (!value) return false;
        const end = new Date(value);
        if (Number.isNaN(end.getTime())) return false;
        return end.getTime() > Date.now();
      },
    ),
  joinRequestMaxCount: number()
    .typeError("أقصى عدد الطلبات مطلوب")
    .required("أقصى عدد الطلبات مطلوب")
    .min(1, "يجب أن يكون العدد 1 على الأقل"),
  allowedJoinRequestType: string().required("نوع طلبات الانضمام مطلوب"),
  minimumSubscriptionDays: number()
    .typeError("عدد الأيام مطلوب")
    .required("عدد الأيام مطلوب")
    .min(0, "يجب أن يكون 0 أو أكثر"),
});

const isPending = computed(() => updateReq.pending.value);

/** Min join-request end: current date/time (must be after now). */
const joinRequestMinAt = ref(new Date());

/** Max join-request end: earliest qualification start, else final stage start. */
const joinRequestMaxAt = computed(() => {
  const qualStarts = (props.tournament.qualificationStagePlaces ?? [])
    .map((place) => place.startAt)
    .filter((value): value is string => !!value)
    .map((value) => new Date(value).getTime())
    .filter((time) => !Number.isNaN(time));

  if (qualStarts.length > 0) {
    return new Date(Math.min(...qualStarts));
  }

  const finalStart = props.tournament.startAt;
  return finalStart ? new Date(finalStart) : undefined;
});

function syncFormFromTournament() {
  const t = props.tournament;
  formState.value = {
    addPlayersByQydha: true,
    joinRequestStartAt: t.joinRequestStartAt ?? "",
    joinRequestEndAt: t.joinRequestEndAt ?? "",
    joinRequestMaxCount: t.joinRequestMaxCount ?? 0,
    allowedJoinRequestType:
      t.allowedJoinRequestType ?? TournamentPlayerJoinRequestType.Team,
    minimumSubscriptionDays: t.minimumSubscriptionDays ?? 1,
  };
}

watch(open, (isOpen) => {
  if (isOpen) {
    joinRequestMinAt.value = new Date();
    syncFormFromTournament();
  }
});

function closeDrawer() {
  if (isPending.value) return;
  open.value = false;
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
  } catch {
    return;
  }

  await updateReq.fetchREQ(props.tournamentId, { ...formState.value });

  if (updateReq.status.value === "success") {
    toast.add({
      title: "تم حفظ إعدادات طلبات الانضمام",
      color: "success",
    });
    closeDrawer();
    emit("success");
  } else {
    toast.add({
      title: "تعذّر حفظ الإعدادات",
      color: "error",
    });
  }
}

defineExpose({ open });
</script>
