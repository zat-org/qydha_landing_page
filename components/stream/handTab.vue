<template>
      <UCard>
        <div v-if="!handBoardlink" class="flex items-center justify-center p-8">
            <div class="text-center">
                <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p class="text-gray-500">جاري تحميل بيانات المستخدم...</p>
            </div>
        </div>
        <UTable v-else :data="rows" :columns="columns">
            <template #link-cell="{ row }">
                <div class="flex items-center gap-2">
                    <UButton :to="row.original.link" target="_blank" variant="ghost" size="lg" color="primary"
                        icon="i-heroicons-arrow-top-right-on-square" />
                    <UButton @click="copyLink(row.original.link)" variant="ghost" size="lg" color="neutral"
                        icon="i-heroicons-clipboard-document">
                    </UButton>
                </div>
            </template>

            <template #edit-cell="{ row }">
                <UButton v-if="row.original.edit" @click="openEditModal()" variant="soft" color="warning" size="lg"
                    icon="i-heroicons-adjustments-horizontal">
                </UButton>
            </template>

        </UTable>
    </UCard>

</template>
<script lang="ts" setup>



import { useMyAuthStore } from "~/store/Auth";
import StreamEditModal from "./StreamEditModal/index.vue";



const toast = useToast();
const authstore = useMyAuthStore();
const handBoardlink = computed(() => {
  if (authstore.user?.boardsLinks?.hand){
    const link = authstore.user.boardsLinks.hand || '';
    return link;
  }
  return null
});

const rows = computed(() => {
    if (!handBoardlink.value) {
        return [];
    }

    const baseRows = [
        {
            name: "قيدها",
            link: `${handBoardlink.value}/?theme=qydha&orienation=landscape&showPlayers=false`,
            notes: "الطول = 1080 , العرض = 1920",
        },
        {
            name: "قيدها للهاتف بدون صور الاعبين",
            link: `${handBoardlink.value}/?theme=qydha&orienation=portrait&showPlayers=false`,
            notes: "الطول = 1920 , العرض = 1080",
        },
        {
            name: "قيدها للهاتف بصور الاعبين",
            link: `${handBoardlink.value}/?theme=qydha&orienation=portrait&showPlayers=true`,
            notes: "الطول = 1920 , العرض = 1080",
            edit: true,
        },
    ];
    // Add admin-only rows
    if (authstore.user?.user?.username &&
        (authstore.user.user.username.toLowerCase() === "admin" ||
            authstore.user.user.username.toLowerCase() === "sam")
    ) {
        baseRows.push(
            {
                name: "زات",
                link: `${handBoardlink.value}/?theme=zat&orienation=landscape&showPlayers=false`,
                notes: "الطول = 1080 , العرض = 1920",
            },
            {
                name: "صور الاعبين TOP",
                link: `${handBoardlink.value}/cam/top`,
                notes: "الطول = 1080 , العرض = 1920",
            },
            {
                name: "صور الاعبين BOTTOM",
                link: `${handBoardlink.value}/cam/bottom`,
                notes: "الطول = 1080 , العرض = 1920",
            },
            {
                name: "صور الاعبين RIGHT",
                link: `${handBoardlink.value}/cam/right`,
                notes: "الطول = 1080 , العرض = 1920",
            },
            {
                name: "صور الاعبين LEFT",
                link: `${handBoardlink.value}/cam/left`,
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

</style>