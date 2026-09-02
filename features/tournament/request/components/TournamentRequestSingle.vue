<template>
  <div class="mx-auto flex w-full flex-1 flex-col p-4">
    <div v-if="pending" class="flex h-64 items-center justify-center">
      <Loading />
    </div>

    <UAlert
      v-else-if="status === 'error'"
      color="error"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
    >
      <template #title>خطأ في تحميل البيانات</template>
      <template #description>حدث خطأ أثناء تحميل بيانات طلب البطولة</template>
    </UAlert>

    <UCard
      v-else-if="data"
      :ui="{ root: 'flex flex-col max-h-[calc(100vh-100px)]', body: 'flex-1 overflow-y-auto' }"
    >
      <template #header>
        <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div class="flex items-center gap-4">
            <UButton
              to="/tournament/request"
              icon="i-heroicons-arrow-left"
              variant="ghost"
              size="sm"
              class="mr-2 flex-shrink-0"
            >
              العودة
            </UButton>
            <UAvatar
              size="3xl"
              :src="data.logoUrl"
              :text="data.title[0]"
              class="ring-2 ring-primary-200 dark:ring-primary-800"
            />
            <div>
              <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ data.title }}</h1>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {{ formatDateTime(data.createdAt) }}
              </p>
            </div>
          </div>

          <div class="flex flex-col gap-2 sm:flex-row">
            <UBadge
              v-if="currentState"
              :color="getStateColor(currentState)"
              variant="subtle"
              size="lg"
              class="text-sm font-medium"
            >
              {{ getStateLabel().find((op) => op.value == currentState)?.label }}
            </UBadge>
            <UBadge
              :color="data.type === 'Public' ? 'info' : 'success'"
              variant="outline"
              size="xl"
              class="text-sm font-medium"
            >
              {{ data.type === "Public" ? "عامة" : "خاصة" }}
            </UBadge>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <TournamentRequestDetailGeneralInfoSection :data="data" />
        <TournamentRequestDetailJoinRequestSection :data="data" />
        <TournamentRequestDetailQualificationsSection :data="data" />
        <TournamentRequestDetailFinalSection :data="data" />
        <TournamentRequestDetailRulesSection :data="data" />
      </div>

      <template #footer>
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            <span>تم الإنشاء في: {{ formatDateTime(data.createdAt) }}</span>
          </div>

          <UFieldGroup
            v-if="(userStore.isStaffAdmin || userStore.isSuperAdmin) && currentState === TournamentRequestState.Pending"
          >
            <UButton
              color="success"
              icon="i-heroicons-check"
              :loading="approveStatus == 'pending'"
              @click="handleApprove"
            >
              موافقة
            </UButton>
            <UButton
              color="error"
              icon="i-heroicons-x-mark"
              :loading="rejectStatus == 'pending'"
              @click="handleReject"
            >
              رفض
            </UButton>
            <UButton color="primary" icon="i-heroicons-pencil" variant="outline" @click="handleEdit">
              تعديل
            </UButton>
          </UFieldGroup>
          <UFieldGroup v-if="userStore.isOrganizer && currentState === TournamentRequestState.Pending">
            <UButton
              color="error"
              icon="i-heroicons-x-mark"
              :loading="cancelStatus == 'pending'"
              @click="handleCancel"
            >
              الغاء
            </UButton>
            <UButton color="primary" icon="i-heroicons-pencil" variant="outline" @click="handleEdit">
              تعديل
            </UButton>
          </UFieldGroup>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { useMyAuthStore } from "~/store/Auth";
import { TournamentRequestState } from "~/features/tournament/models/tournamentRequest";
import { formatDateTime } from "~/utils/formatDate";
import { useTournamentRequest } from "~/features/tournament/request/composables/TournamentRequest";
import TournamentRequestDetailFinalSection from "~/features/tournament/request/components/Detail/FinalSection.vue";
import TournamentRequestDetailGeneralInfoSection from "~/features/tournament/request/components/Detail/GeneralInfoSection.vue";
import TournamentRequestDetailJoinRequestSection from "~/features/tournament/request/components/Detail/JoinRequestSection.vue";
import TournamentRequestDetailQualificationsSection from "~/features/tournament/request/components/Detail/QualificationsSection.vue";
import TournamentRequestDetailRulesSection from "~/features/tournament/request/components/Detail/RulesSection.vue";

const props = defineProps<{ id: string }>();

const {
  AdminGetSingleTournamentRequest,
  OrganizerCancelRequest,
  AdminApproveRequest,
  AdminRejectRequest,
  getTournamnetStateOptions: getStateLabel,
  getStateColor,
} = useTournamentRequest();

const userStore = useMyAuthStore();
const apiFetch = computed(() => AdminGetSingleTournamentRequest);
const { data: res, status, pending } = apiFetch.value(props.id);
const data = computed(() => (res.value ? res.value : undefined));

const currentState = computed(() => {
  if (!data.value) return undefined;
  // @ts-ignore
  return (data.value.status ?? data.value.state) as TournamentRequestState;
});

const { fetchREQ: approveRequest, status: approveStatus } = AdminApproveRequest();
const { fetchREQ: rejectRequest, status: rejectStatus } = AdminRejectRequest();
const { fetchREQ: cancelRequest, status: cancelStatus } = OrganizerCancelRequest();

const handleApprove = async () => {
  if (!data.value) return;
  await approveRequest(data.value.id);
  if (status.value === "success") {
    await refreshAppData(appKeys.adminSingleTourRequest(data.value.id));
  }
};

const handleReject = async () => {
  if (!data.value) return;
  await rejectRequest(data.value.id);
  if (status.value === "success") {
    await refreshAppData(appKeys.adminSingleTourRequest(data.value.id));
  }
};

const handleCancel = async () => {
  if (!data.value) return;
  await cancelRequest(data.value.id);
  if (status.value === "success") {
    await refreshAppData(appKeys.adminSingleTourRequest(data.value.id));
  }
};

const handleEdit = () => {
  navigateTo(`/tournament/request/${props.id}/update/`);
};
</script>

<style scoped></style>
