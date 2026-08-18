<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center gap-4">
        <div class="flex items-center gap-4">
          <UButton
            icon="i-heroicons-arrow-right"
            label="عوده"
            variant="ghost"
            color="neutral"
            @click="
              () => {
                navigateTo('/stream');
              }
            "
          />
          <h1 class="text-2xl font-bold">اللاعبين ({{ players.length }})</h1>
        </div>
        <UButton
          label="إضافة لاعب"
          color="primary"
          icon="i-heroicons-plus-circle"
          @click="openAddModal"
        />
      </div>
    </template>

    <div
      v-if="getREQ.pending.value || getREQ.status.value === 'idle'"
      class="flex justify-center items-center py-12"
    >
      <div class="flex flex-col items-center gap-4">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-8 h-8 animate-spin text-primary"
        />
        <p class="text-gray-500 dark:text-gray-400">جاري تحميل اللاعبين...</p>
      </div>
    </div>

    <UAlert
      v-else-if="getREQ.error.value"
      color="error"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      title="خطأ في تحميل اللاعبين"
      :description="
        getREQ.error.value?.message || 'حدث خطأ أثناء تحميل البيانات'
      "
      class="mb-4"
    >
      <template #actions>
        <UButton
          color="error"
          variant="soft"
          label="إعادة المحاولة"
          @click="getREQ.refresh()"
        />
      </template>
    </UAlert>

    <div v-else class="flex flex-col gap-4">
      <UInput
        v-model="query"
        icon="i-heroicons-magnifying-glass"
        placeholder="بحث باسم اللاعب"
        class="max-w-md"
      />
      <UTable :data="filteredPlayers" :columns="cols" hover class="flex-1">
        <template #empty>
          <div class="flex flex-col items-center justify-center py-12 px-4">
            <UIcon
              name="i-heroicons-user-group"
              class="mb-3 text-5xl text-gray-400"
            />
            <p class="mb-4 text-gray-500 dark:text-gray-400">لا يوجد لاعبون</p>
            <UButton
              label="إضافة لاعب"
              color="primary"
              icon="i-heroicons-plus-circle"
              @click="openAddModal"
            />
          </div>
        </template>
        <template #name-cell="{ row }">
          <div class="flex items-center gap-3">
            <UAvatar
              :src="row.original.url || undefined"
              :alt="row.original.name"
              size="lg"
              icon="i-heroicons-user"
            />
            <p class="font-medium text-gray-900 dark:text-gray-100">
              {{ row.original.name }}
            </p>
          </div>
        </template>
        <template #actions-cell="{ row }">
          <UFieldGroup>
            <UButton
              color="warning"
              icon="i-heroicons-pencil-square"
              :disabled="!row.original.playerId"
              @click="openUpdateNameModal(row.original)"
            >
              تعديل الاسم
            </UButton>
            <UButton
              color="neutral"
              variant="soft"
              icon="i-heroicons-photo"
              :disabled="!row.original.playerId"
              @click="openUpdateImageModal(row.original)"
            >
              الصورة
            </UButton>
            <UButton
              color="error"
              icon="i-heroicons-trash"
              :disabled="!row.original.playerId"
              :loading="
                deleteREQ.status.value === 'pending' &&
                deletingId === row.original.playerId
              "
              @click="confirmDelete(row.original)"
            >
              حذف
            </UButton>
          </UFieldGroup>
        </template>
      </UTable>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import type { UserPlayer } from "~/models/user";
import ConfirmModal from "~/components/ConfirmationModal.vue";
import AddPlayerModal from "./AddPlayerModal.vue";
import UpdatePlayerNameModal from "./UpdatePlayerNameModal.vue";
import UpdatePlayerImageModal from "./UpdatePlayerImageModal.vue";
import { useUserPlayersApi } from "../composables/useUserPlayersApi";

const overlay = useOverlay();
const toast = useToast();
const getREQ = useUserPlayersApi().getMe();
const deleteREQ = useUserPlayersApi().deletePlayer();
const query = ref("");
const deletingId = ref<string | null>(null);

const players = computed(() => getREQ.data.value?.players ?? []);

const filteredPlayers = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return players.value;
  return players.value.filter((p) => p.name.toLowerCase().includes(q));
});

const existingNames = computed(() => players.value.map((p) => p.name));

const cols = [
  { accessorKey: "name", header: "اللاعب" },
  { accessorKey: "actions", header: "إجراءات" },
];

function openAddModal() {
  overlay
    .create(AddPlayerModal, {
      props: { existingNames: existingNames.value },
    })
    .open();
}

function openUpdateNameModal(player: UserPlayer) {
  overlay.create(UpdatePlayerNameModal, { props: { player } }).open();
}

function openUpdateImageModal(player: UserPlayer) {
  overlay.create(UpdatePlayerImageModal, { props: { player } }).open();
}

const confirmModal = overlay.create(ConfirmModal);
const confirmDelete = async (player: UserPlayer) => {
  if (!player.playerId) return;

  const instance = confirmModal.open({
    message: `هل أنت متأكد من حذف اللاعب "${player.name}"؟`,
  });
  const confirmed = await instance.result;
  if (!confirmed) return;

  deletingId.value = player.playerId;
  await deleteREQ.fetchREQ(player.playerId);
  deletingId.value = null;

  if (deleteREQ.status.value === "success") {
    toast.add({
      title: "تم الحذف بنجاح",
      description: `تم حذف اللاعب "${player.name}"`,
      color: "success",
      icon: "i-heroicons-check-circle",
    });
  } else if (deleteREQ.status.value === "error") {
    toast.add({
      title: "خطأ في الحذف",
      description: deleteREQ.error.value?.message || "حدث خطأ أثناء حذف اللاعب",
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  }
};
</script>
