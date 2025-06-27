<template>
  <UCard>
    <UTable  :data="rows" :columns="columns" >
      
      <template #link-cell="{ row }">
        <div class="flex items-center gap-2">
          <UButton :to="row.original.link" target="_blank" variant="ghost" size="lg" color="primary" icon="i-heroicons-arrow-top-right-on-square" />
         
          <UButton @click="copyLink(row.original.link)" variant="ghost" size="lg" color="neutral" icon="i-heroicons-clipboard-document" >
    
          </UButton>
        </div>
      </template>

      <template #edit-cell="{ row }">
        <UButton v-if="row.original.edit" 
        @click="openEditModal()" 
        variant="soft" color="warning" size="lg" icon="i-heroicons-adjustments-horizontal" >
         
        </UButton>
      </template>

      <!-- <template #notes-cell="{ row }">
        <div
          class="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <div
            class="flex items-center justify-center w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-lg flex-shrink-0">
            <UIcon name="i-heroicons-rectangle-stack" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <div class="flex flex-col gap-2 min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-arrows-right-left"
                class="w-4 h-4 text-primary-500 dark:text-primary-400 flex-shrink-0" />
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                <span class="text-primary-600 dark:text-primary-400">العرض:</span>
                <span class="font-mono text-gray-700 dark:text-gray-300 mr-1">
                  {{ row.notes.split(",")[1].trim().split("=")[1] }}
                </span>
              </span>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-arrows-up-down"
                class="w-4 h-4 text-primary-500 dark:text-primary-400 flex-shrink-0" />
              <span class="text-sm font-medium text-gray-900 dark:text-gray-100">
                <span class="text-primary-600 dark:text-primary-400">الطول:</span>
                <span class="font-mono text-gray-700 dark:text-gray-300 mr-1">
                  {{ row.notes!.split(",")[0].split("=")[1]  ??  ""   }}
                </span>
              </span>
            </div>
          </div>
        </div>
      </template> -->
    </UTable>
  </UCard>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/Auth";
import StreamEditModal from "./StreamEditModal.vue";

const authstore = useMyAuthStore();
const toast = useToast();

const boardlink = computed(() => {
  if (authstore.user) return authstore.user.boardLink;
  return '';
});

const rows = computed(() => {
  const baseRows = [
    {
      name: "قيدها",
      link: `${boardlink.value}/?theme=qydha&orienation=landscape&showPlayers=false`,
      notes: "الطول = 1080 , العرض = 1920",
    },
    {
      name: "قيدها للهاتف بدون صور الاعبين",
      link: `${boardlink.value}/?theme=qydha&orienation=portrait&showPlayers=false`,
      notes: "الطول = 1920 , العرض = 1080",
    },
    {
      name: "قيدها للهاتف بصور الاعبين",
      link: `${boardlink.value}/?theme=qydha&orienation=portrait&showPlayers=true`,
      notes: "الطول = 1920 , العرض = 1080",
      edit: true,
    },
  ];

  // Add admin-only rows
  if (
    authstore.user?.user.username.toLowerCase() === "admin" ||
    authstore.user?.user.username.toLowerCase() === "sam"
  ) {
    baseRows.push(
      {
        name: "زات",
        link: `${boardlink.value}/?theme=zat&orienation=landscape&showPlayers=false`,
        notes: "الطول = 1080 , العرض = 1920",
      },
      {
        name: "صور الاعبين TOP",
        link: `${boardlink.value}/cam/top`,
        notes: "الطول = 1080 , العرض = 1920",
      },
      {
        name: "صور الاعبين BOTTOM",
        link: `${boardlink.value}/cam/bottom`,
        notes: "الطول = 1080 , العرض = 1920",
      },
      {
        name: "صور الاعبين RIGHT",
        link: `${boardlink.value}/cam/right`,
        notes: "الطول = 1080 , العرض = 1920",
      },
      {
        name: "صور الاعبين LEFT",
        link: `${boardlink.value}/cam/left`,
        notes: "الطول = 1080 , العرض = 1920",
      }
    );
  }

  return baseRows;
});

const columns = [
  {
    accessorKey: "name",
    header: "الاسم",
    sortable: false
  },
  {
    accessorKey: "edit",
    header: "تعديل الابعاد",
    sortable: false
  },
  {
    accessorKey: "notes",
    header: "لتجربة متميزة علي OBS",
    sortable: false
  },
  {
    id: "link",
    accessorKey: "link",
    header: "الرابط",
    sortable: false
  },
];

const copyLink = async (link: string) => {
  try {
    await navigator.clipboard.writeText(link);
    toast.add({
      title: "تم النسخ بنجاح",
      description: "تم نسخ الرابط إلى الحافظة",
      icon: "i-heroicons-check-circle",
      color: "success",
    });
  } catch (error) {
    toast.add({
      title: "خطأ في النسخ",
      description: "فشل في نسخ الرابط",
      icon: "i-heroicons-x-circle",
      color: "error",
    });
  }
};
const overlay = useOverlay();
const modal = overlay.create(StreamEditModal);
const openEditModal = () => {
  modal.open();

};
</script>

<style scoped>
/* Add any component-specific styles here */
</style>