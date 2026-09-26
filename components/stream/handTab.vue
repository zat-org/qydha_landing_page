<template>
  <UCard>
    <div
      v-if="pending"
      class="flex items-center justify-center p-8"
    >
      <div class="text-center">
        <UIcon
          name="i-heroicons-arrow-path"
          class="mx-auto mb-4 h-8 w-8 animate-spin text-gray-400"
        />
        <p class="text-gray-500">جاري تحميل بيانات المستخدم...</p>
      </div>
    </div>

    <UAlert
      v-else-if="loadError"
      color="error"
      variant="soft"
      title="تعذر تحميل رابط لوحة الهند"
    />

    <UAlert
      v-else-if="!boardLink"
      color="warning"
      variant="soft"
      title="لا يوجد رابط لوحة هند"
      description="لم يتم العثور على رابط اللوحة في حسابك. جرّب تسجيل الدخول مرة أخرى."
    />

    <UTable
      v-else
      :data="rows"
      :columns="columns"
    >
      <template #link-cell="{ row }">
        <div class="flex items-center gap-2">
          <UButton
            :to="row.original.link"
            target="_blank"
            variant="ghost"
            size="lg"
            color="primary"
            icon="i-heroicons-arrow-top-right-on-square"
          />
          <UButton
            variant="ghost"
            size="lg"
            color="neutral"
            icon="i-heroicons-clipboard-document"
            @click="copyLink(row.original.link)"
          />
        </div>
      </template>

      <template #edit-cell="{ row }">
        <UButton
          v-if="row.original.edit"
          variant="soft"
          color="warning"
          size="lg"
          icon="i-heroicons-adjustments-horizontal"
          @click="openEditModal()"
        />
      </template>
    </UTable>
  </UCard>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/Auth";
import StreamEditModal from "./StreamEditModal/index.vue";

const props = defineProps<{
  boardLink: string | null;
  pending?: boolean;
  loadError?: boolean;
}>();

const toast = useToast();
const authstore = useMyAuthStore();

const rows = computed(() => {
  if (!props.boardLink) {
    return [];
  }

  const baseRows = [
    {
      name: "قيدها",
      link: `${props.boardLink}/?theme=qydha&orienation=landscape&showPlayers=false`,
      notes: "الطول = 1080 , العرض = 1920",
    },
    {
      name: "قيدها للهاتف بدون صور الاعبين",
      link: `${props.boardLink}/?theme=qydha&orienation=portrait&showPlayers=false`,
      notes: "الطول = 1920 , العرض = 1080",
    },
    {
      name: "قيدها للهاتف بصور الاعبين",
      link: `${props.boardLink}/?theme=qydha&orienation=portrait&showPlayers=true`,
      notes: "الطول = 1920 , العرض = 1080",
      edit: true,
    },
  ];

  if (
    authstore.user?.user?.username &&
    (authstore.user.user.username.toLowerCase() === "admin" ||
      authstore.user.user.username.toLowerCase() === "sam")
  ) {
    baseRows.push(
      {
        name: "زات",
        link: `${props.boardLink}/?theme=zat&orienation=landscape&showPlayers=false`,
        notes: "الطول = 1080 , العرض = 1920",
      },
      {
        name: "صور الاعبين TOP",
        link: `${props.boardLink}/cam/top`,
        notes: "الطول = 1080 , العرض = 1920",
      },
      {
        name: "صور الاعبين BOTTOM",
        link: `${props.boardLink}/cam/bottom`,
        notes: "الطول = 1080 , العرض = 1920",
      },
      {
        name: "صور الاعبين RIGHT",
        link: `${props.boardLink}/cam/right`,
        notes: "الطول = 1080 , العرض = 1920",
      },
      {
        name: "صور الاعبين LEFT",
        link: `${props.boardLink}/cam/left`,
        notes: "الطول = 1080 , العرض = 1920",
      },
    );
  }

  return baseRows;
});

const columns = [
  {
    accessorKey: "name",
    header: "الاسم",
    sortable: false,
  },
  {
    accessorKey: "edit",
    header: "تعديل الابعاد",
    sortable: false,
  },
  {
    accessorKey: "notes",
    header: "لتجربة متميزة علي OBS",
    sortable: false,
  },
  {
    id: "link",
    accessorKey: "link",
    header: "الرابط",
    sortable: false,
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
  } catch {
    toast.add({
      title: "خطأ في النسخ",
      description: "فشل في نسخ الرابط",
      icon: "i-heroicons-x-circle",
      color: "error",
    });
  }
};

const overlay = useOverlay();

const openEditModal = () => {
  overlay
    .create(StreamEditModal, {
      props: {
        boardID: props.boardLink || "",
        type: "hand",
      },
    })
    .open();
};
</script>
