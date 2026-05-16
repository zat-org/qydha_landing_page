<template>
  <UCard :ui="{ body: 'px-3 py-1 sm:p-1', header: 'px-2 py-1 sm:p-1 ', footer: 'px-2 py-1 sm:p-1' }" class="max-w-7xl mx-auto bg-gray-50 dark:bg-gray-900">
    <UForm :state="model" class="flex flex-col space-y-2">
<!-- 
      <UFormField label="" name="showInQydha" :error="errors?.showInQydha">
      <div class="flex gap-4">
        <USwitch v-model="model.showInQydha" :disabled="disabledFields?.showInQydha" size="lg" @update:model-value="onFieldBlur?.('showInQydha')" />
        <label>عرض البطولة في منصة قيدها</label>
      </div>
      </UFormField> -->

      <!-- <UFormField name="isAddPlayersByQydha" size="xl">
        <div class="flex gap-4">
          <USwitch v-model="model.isAddPlayersByQydha" :disabled="disabledFields?.isAddPlayersByQydha" size="xl" />
          <label> التسجيل من خلال قيدها </label>
        </div>
      </UFormField> -->

      <div class="rounded-lg border border-gray-200/80 bg-white/60 p-3 dark:border-gray-700 dark:bg-gray-800/60">
        <UFormField label="منظم البطولة" name="ownerId" :error="errors?.ownerId">
          <UInput
            v-if="disabledFields?.ownerId"
            class="w-full"
            :model-value="tournamentOwnerDisplay || model.ownerId"
            disabled
            readonly
          />
          <Suspense v-else>
            <UserSelectMenu
              v-model="model.ownerId"
              class="w-full"
              remote-search
              role-filter="Organizer"
              value-key="id"
              label-key="username"
              placeholder="ابحث عن منظم (اسم المستخدم) واختر من النتائج"
              :extra-items="ownerExtraUsers"
              @update:model-value="onFieldBlur?.('ownerId')"
            />
            <template #fallback>
              <UInput class="w-full" disabled loading placeholder="جاري تهيئة البحث..." />
            </template>
          </Suspense>
        </UFormField>
        <p v-if="tournamentOwner && !disabledFields?.ownerId" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
          مرجع: {{ tournamentOwnerDisplay }}
        </p>
      </div>

      <div class="space-y-3">
        <div class="text-sm font-medium">المخطط الزمني لاختيار التواريخ</div>
        <div class="grid grid-cols-2 md:grid-cols-2 gap-3">
          <!-- <div v-if="model.isAddPlayersByQydha" class="p-3 rounded-lg border bg-white/60 dark:bg-gray-800/60">
            <UFormField label="بداية طلبات الانضمام" name="joinRequestStartAt" :error="errors?.joinRequestStartAt">
              <AsyncDatePicker v-model="model.joinRequestStartAt" :disabled="disabledFields?.joinRequestStartAt" :min-date="new Date()" :max-date="model.startAt || undefined" @update:model-value="onFieldBlur?.('joinRequestStartAt')" />
            </UFormField>
          </div>

          <div v-if="model.isAddPlayersByQydha" class="p-3 rounded-lg border bg-white/60 dark:bg-gray-800/60">
            <UFormField label="نهاية طلبات الانضمام" name="joinRequestEndAt" :error="errors?.joinRequestEndAt">
              <AsyncDatePicker v-model="model.joinRequestEndAt" :disabled="disabledFields?.joinRequestEndAt" :min-date="model.joinRequestStartAt" :max-date="model.startAt || undefined" @update:model-value="onFieldBlur?.('joinRequestEndAt')" />
            </UFormField>
          </div> -->
          <div class="p-3 rounded-lg border bg-white/60 dark:bg-gray-800/60">
            <UFormField label="بداية البطولة" name="startAt" :error="errors?.startAt">
              <AsyncDatePicker v-model="model.startAt" :disabled="disabledFields?.startAt" :min-date="minstartDate" @update:model-value="onFieldBlur?.('startAt')" />
            </UFormField>
          </div>
          <div class="p-3 rounded-lg border bg-white/60 dark:bg-gray-800/60">
            <UFormField label="نهاية البطولة" name="endAt" :error="errors?.endAt">
              <AsyncDatePicker v-model="model.endAt" :disabled="disabledFields?.endAt" :min-date="model.startAt" @update:model-value="onFieldBlur?.('endAt')" />
            </UFormField>
          </div>
        </div>
      </div>
      <!-- <template v-if="model.isAddPlayersByQydha">
        <UFormField label=" اقصي عدد طلبات الانضمام  " name="joinRequestMaxCount" :error="errors?.joinRequestMaxCount">
          <UInput v-model="model.joinRequestMaxCount" type="number" :disabled="disabledFields?.joinRequestMaxCount" @blur="onFieldBlur?.('joinRequestMaxCount')" />
        </UFormField>
        <UFormField label="نوع طلبات الانضمام" name="allowedJoinRequestType" :error="errors?.allowedJoinRequestType">
          <USelect v-model="model.allowedJoinRequestType" :disabled="disabledFields?.allowedJoinRequestType" :items="TournamentPlayerJoinRequestTypeOptions" @update:model-value="onFieldBlur?.('allowedJoinRequestType')" />
        </UFormField>
        <UFormField label="عدد الأيام الأدني للاشتراك" name="minimumSubscriptionDays" :error="errors?.minimumSubscriptionDays">
          <UInput v-model="model.minimumSubscriptionDays" type="number" min="1" placeholder="0" :disabled="disabledFields?.minimumSubscriptionDays" @blur="onFieldBlur?.('minimumSubscriptionDays')" />
        </UFormField>
      </template> -->
      <TournamentTourDetailFormPrizeManagement v-model="model" />
      <div class="grid grid-cols-3 gap-4">
        <UFormField label=" عدد الفرق" name="teamsCount" :error="errors?.teamsCount">
          <div class="flex flex-col items-center gap-2">
            <USelect v-model="TeamsCount" :disabled="disabledFields?.teamsCount" :items="TeamsCountOptions" @update:model-value="onFieldBlur?.('teamsCount')" />
            <UInput v-if="TeamsCount === 'custom'" v-model="model.teamsCount" type="number" min="1" placeholder="0" :disabled="disabledFields?.teamsCount" @input="validatePositiveNumber" @blur="onFieldBlur?.('teamsCount')" />
          </div>
        </UFormField>
        <UFormField label=" عدد الطاولات" name="tablesCount" :error="errors?.tablesCount">
          <UInput v-model="model.tablesCount" type="number" placeholder="0" :disabled="disabledFields?.tablesCount" @blur="onFieldBlur?.('tablesCount')" />
        </UFormField>
        <UFormField label="عدد الأيام" name="dayNumber">
          <UInput v-model="dayNumber" type="number" min="1" placeholder="أدخل عدد الأيام" size="xs" />
        </UFormField>
        <UFormField label="وقت صكة واحدة (دقيقة)" name="sakkTime">
          <UInput v-model="sakkTime" type="number" min="1" placeholder="وقت صكة واحدة" size="xs" />
        </UFormField>
        <UFormField label="وقت 3 صكات (دقيقة)" name="sakkTime3">
          <UInput v-model="sakkTime3" type="number" min="1" placeholder="وقت 3 صكات" size="xs" />
        </UFormField>
        <UFormField label="وقت 5 صكات (دقيقة)" name="sakkTime5">
          <UInput v-model="sakkTime5" type="number" min="1" placeholder="وقت 5 صكات" size="xs" />
        </UFormField>
      </div>
      <TournamentRequestCalculatorRounds :rounds="rounds" :sakka-options="sakkaOptions" :format-time="formatTime" />
      <TournamentRequestCalculatorSummary :rounds="rounds" :total-time="totalTime" :time-per-day="timePerDay" :total-matches="totalMatches" :day-number="dayNumber" :format-time="formatTime" />
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
import type { User } from "~/models/user";
import type { TournamentOwner } from "~/features/tournament/models/tournamentOwner";
import { TournamentPlayerJoinRequestType } from "~/features/tournament/models/tournamentRequest";
import UserSelectMenu from "~/components/User/UserSelectMenu.vue";
import TournamentTourDetailFormPrizeManagement from "~/features/tournament/request/components/Form/TourDetailForm/PrizeManagement.vue";
import TournamentRequestCalculatorRounds from "~/features/tournament/request/components/CalculatorRounds.vue";
import TournamentRequestCalculatorSummary from "~/features/tournament/request/components/CalculatorSummary.vue";

const props = defineProps<{
  errors?: Record<string, string | undefined>;
  onFieldBlur?: (field: string) => void;
  disabledFields?: Record<string, boolean>;
  tournamentOwner?: TournamentOwner | null;
}>();
const { errors, onFieldBlur, disabledFields } = toRefs(props);
const tournamentOwner = toRef(props, "tournamentOwner");
const model = defineModel<any>({ required: true });

const tournamentOwnerDisplay = computed(() => {
  const o = tournamentOwner.value;
  if (!o) return "";
  const n = o.name;
  const nameStr =
    typeof n === "string" ? n : n && typeof n === "object" ? String(Object.values(n as Record<string, string>).find(Boolean) ?? "") : "";
  const parts = [nameStr || null, o.username || null, o.phone || null].filter(Boolean);
  return parts.join(" · ");
});

const ownerExtraUsers = computed((): User[] => {
  const o = tournamentOwner.value;
  if (!o?.id) return [];
  const row = {
    id: o.id,
    username: o.username ?? "",
    name: o.name,
    phone: o.phone ?? "",
    avatarUrl: o.avatarUrl,
    email: null,
    birthDate: null,
    createdOn: "",
    lastLogin: "",
    expireDate: "",
    roles: [] as string[],
  };
  return [row as User];
});
const TournamentPlayerJoinRequestTypeOptions = [
  { label: "كل الطلبات", value: TournamentPlayerJoinRequestType.All  ,disabled: true},
  { label: "طلبات فردية", value: TournamentPlayerJoinRequestType.Single ,disabled: true},
  { label: "طلبات الفرق", value: TournamentPlayerJoinRequestType.Team },
];
const minstartDate = computed(() => {
  const endAt = model.value.joinRequestEndAt as string | undefined;
  if (!endAt) return new Date();
  const joinRequestEndDate = new Date(endAt);
  const today = new Date();
  return joinRequestEndDate > today ? joinRequestEndDate : today;
});
const TeamsCount = ref<number | string>(model.value.teamsCount);
watch(TeamsCount, (newVal) => {
  if (newVal !== "custom") model.value.teamsCount = newVal as number;
});
watch(
  () => model.value.teamsCount,
  (n) => {
    if (typeof n === "number" && TeamsCount.value !== "custom") TeamsCount.value = n;
  },
);
const TeamsCountOptions = [
  { label: "16 فريق", value: 16 },
  { label: "32 فريق", value: 32 },
  { label: "64 فريق", value: 64 },
  { label: "128 فريق", value: 128 },
  { label: "عدد اخر", value: "custom" },
];

const { rounds, teamsCount, tablesCount, sakkTime, sakkTime3, sakkTime5, totalTime, timePerDay, totalMatches, dayNumber } = useTourCalc();
teamsCount.value = model.value.teamsCount;
tablesCount.value = model.value.tablesCount;

const sakkaOptions = [
  { label: "1", value: 1 },
  { label: "3", value: 3 },
  { label: "5", value: 5 },
];

const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes.toFixed(0)} دقيقة`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) return `${hours.toFixed(0)} ساعة`;
  return `${hours.toFixed(0)} ساعة و ${mins.toFixed(0)} دقيقة`;
};

const validatePositiveNumber = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = parseInt(input.value, 10);
  if (value < 1) input.value = "1";
};
</script>
