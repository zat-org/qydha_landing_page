<template>
  <UCard>
    <template #header>
      <div class="flex flex-col gap-6 w-full">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold">البطولات</h1>
            <!-- <p class="text-gray-500 mt-1">عرض وإدارة جميع البطولات</p> -->
          </div>
          <!-- <div class="flex gap-3">
            <UButton v-if="isAdmin" variant="outline" color="primary" icon="i-heroicons-information-circle" to="/tournament/request/info"
              label="دليل انشاء البطولة" class="px-6" />
            <UButton v-if="isAdmin" variant="solid" color="primary" icon="ic:baseline-plus" to="/tournament/request/add"
              label="إضافة بطولة جديدة" class="px-6" />
          </div> -->
        </div>
        <div class="flex flex-col md:flex-row gap-4 items-center w-full">
          <UFormField label="الحالة " class="flex-1">
            <USelect
              v-model="filters.States"
              :items="stateOptions"
              class="w-full"
              value-key="value"
              label-key="label"
              placeholder="تصفية حسب الحالة"
              multiple
            />
          </UFormField>
          <UFormField label="ترتيب بتاريخ  البطولة " class="flex-1">
            <USelect
              v-model="filters.OrderByStartAtDirection"
              :items="OrderStartAtOptions"
              class="w-full"
              value-key="value"
              label-key="label"
              placeholder="ترتيب بتاريخ  البطولة "
            />
          </UFormField>
        </div>
      </div>
    </template>

    <div class="flex flex-col flex-1">
      <Loading v-if="getReq.status.value == 'pending'" />

      <div
        v-else-if="
          getReq.status.value == 'success' && (!data || data.length === 0)
        "
        class="flex flex-col items-center justify-center py-12 px-4 min-h-[400px]"
      >
        <UIcon name="i-heroicons-inbox" class="text-6xl text-gray-400 mb-4" />
        <h3
          class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2"
        >
          لا توجد بطولات متاحة
        </h3>
        <p class="text-gray-500 dark:text-gray-400 mb-6">
          ابدأ بإنشاء بطولة جديدة
        </p>
        <UButton
          to="/tournament/request/add"
          icon="i-heroicons-plus"
          size="lg"
          color="primary"
          class="px-6"
        >
          إضافة طلب بطولة جديدة
        </UButton>
      </div>

      <UTable
        v-else-if="getReq.status.value == 'success' && data && data.length > 0"
        :data="data"
        class="flex-1"
        :columns="cols"
        @select="(e, row) => onSelect(row)"
      >
        <template #title-cell="{ row }">
          <div class="flex gap-2 items-center">
            <ClientOnly>
              <UAvatar
                size="2xl"
                :src="row.original.logoUrl"
                :text="row.original.title"
              />
            </ClientOnly>
            <span>{{ row.original.title }} </span>
          </div>
        </template>
        <template #startAt-cell="{ row }">
          <span>
            {{ formatDate(row.original.startAt) }}
          </span>
          :
          <span>
            {{ formatDate(row.original.endAt) }}
          </span>
        </template>
        <template #contactPhone-cell="{ row }">
          <span dir="ltr">
            {{ row.original.contactPhone }}
          </span>
        </template>
        <template #state-cell="{ row }">
          <UBadge
            :label="getState(row.original.state)?.label"
            :color="getState(row.original.state)?.color"
            variant="outline"
            size="xl"
          />
        </template>
        <template #showInQydha-cell="{ row }">
          <UBadge
            :label="row.original.showInQydha ? 'ظاهر' : 'غير ظاهر'"
            :color="row.original.showInQydha ? 'success' : 'neutral'"
            variant="outline"
            size="xl"
          />
        </template>
        <template #actions-cell="{ row }">
          <UFieldGroup>
            <UButton
              v-if="isAdmin"
              icon="i-lucide-edit-2"
              :to="`/tournament/${row.original.id}/edit`"
              variant="outline"
            />
            <UButton
              v-if="isAdmin"
              icon="i-lucide-trash-2"
              color="error"
              variant="outline"
              :loading="deletingId === row.original.id"
              :disabled="!!deletingId"
              @click.stop="onDeleteTournament(row.original)"
            />
          </UFieldGroup>
        </template>
      </UTable>
      <UPagination
        v-if="getReq.status.value == 'success' && data && data.length > 0"
        v-model:page="filters.PageNumber"
        :page-count="getReq.data.value?.data.totalPages"
        :total="getReq.data.value?.data.totalCount"
        class="mx-auto"
      />
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/Auth";
import Loading from "~/components/loading.vue";
import ConfirmModal from "~/components/ConfirmationModal.vue";
import { formatDate } from "~/utils/formatDate";
import type { TableRow } from "@nuxt/ui";
import {
  OrderByStartAtDirection,
  TournamentState,
  type GetTournamentParams,
  type Tournament,
} from "~/features/tournament/models/tournament";
const {
  getAllTournament,
  getTournamnetStateOptions,
  getTournamnetOrderStartAtOptions,
  deleteTournament,
} = useTournament();

const toast = useToast();
const overlay = useOverlay();
const confirmModal = overlay.create(ConfirmModal);
const deleteREQ = deleteTournament();
const deletingId = ref<string | null>(null);

const filters = ref<GetTournamentParams>({
  PageNumber: 1,
  PageSize: 10,
  OrderByStartAtDirection: OrderByStartAtDirection.ASC,
  States: [
    TournamentState.Upcoming,
    TournamentState.Running,
    TournamentState.Finished,
  ],
});

function onSelect(row: TableRow<Tournament>) {
  navigateTo(`/tournament/${row.original.id}`);
}

async function onDeleteTournament(tournament: Tournament) {
  const instance = confirmModal.open({
    message: `هل أنت متأكد من حذف البطولة "${tournament.title}"؟`,
  });
  const confirmed = await instance.result;
  if (!confirmed) return;

  deletingId.value = tournament.id;
  try {
    await deleteREQ.fetchREQ(tournament.id);
    if (deleteREQ.status.value === "success") {
      toast.add({
        title: "تم الحذف بنجاح",
        description: `تم حذف البطولة "${tournament.title}" بنجاح`,
        color: "success",
      });
        await getReq.refresh();
    } else if (deleteREQ.status.value === "error") {
      toast.add({
        title: "خطأ في الحذف",
        description:
          deleteREQ.error.value?.message || "حدث خطأ أثناء حذف البطولة",
        color: "error",
      });
    }
  } finally {
    deletingId.value = null;
  }
}

const userStore = useMyAuthStore();
const { isAdmin } = storeToRefs(userStore);

const getReq = await getAllTournament(filters);
const stateOptions = getTournamnetStateOptions();
const OrderStartAtOptions = getTournamnetOrderStartAtOptions();
const data = computed(() => {
  if (unref(getReq.status) == "success" && getReq.data.value) {
    return getReq.data.value.data.items;
  }
  if (unref(getReq.status) == "error") {
    toast.add({ title: " حدث خطاء في جلب بينات البطولات ", color: "error" });
    return [];
  }
  return [];
});
const cols = [
  {
    accessorKey: "title",
    header: "الاسم",
  },
  {
    accessorKey: "startAt",
    header: "التاريخ",
  },
  {
    accessorKey: "state",
    header: "الحالة ",
  },
  {
    accessorKey: "showInQydha",
    header: "الظهور علي قيدها  ",
  },
  {
    id: "actions",
    header: "#",
  },
];
const getState = (
  state: TournamentState,
):
  | {
      label: string;
      color: "warning" | "success" | "neutral";
      value: TournamentState;
    }
  | undefined => {
  return stateOptions.find((op) => op.value == state);
};
</script>

<style></style>
