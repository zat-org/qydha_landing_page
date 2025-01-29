<template>
  <UCard :ui="{ base: 'flex flex-col h-full ', body: { base: 'grow' } }">
    <UTable :rows="rows" :columns="cols" :ui="{ td: { padding: 'py-1' } }">
      <template #link-data="{ row }">
        <UButton :to="row.link" target="_blank">
          <IconOpen class="text-xl" />
        </UButton>
      </template>

      <template #notes-data="{ row }">
  <div class="flex items-center gap-3  bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
    <div class="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
      <UIcon name="i-heroicons-rectangle-stack" class="text-xl text-primary-500"/>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-arrows-right-left" class="text-primary-400"/>
        <span class="text-sm font-medium">
          <span class="text-primary-600">العرض:</span> 
          <span class="font-mono">{{ row.notes.split(',')[1].trim().split('=')[1] }}</span>
        </span>
      </div>
      <div class="flex items-center gap-2">
        <UIcon name="i-heroicons-arrows-up-down" class="text-primary-400"/>
        <span class="text-sm font-medium">
          <span class="text-primary-600">الطول:</span>
          <span class="font-mono">{{ row.notes.split(',')[0].split('=')[1] }}</span>
        </span>
      </div>
    </div>
  </div>
</template>


      <!-- <template #notes-data="{ row }">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-rectangle-stack" class="text-primary-500 text-2xl" />
          <div class="flex flex-col">
            <span class="text-sm font-medium">
              <span class="text-primary-600">العرض:</span>
              {{ row.notes.split(",")[1].trim().split("=")[1] }}
            </span>
            <span class="text-sm font-medium">
              <span class="text-primary-600">الطول:</span>
              {{ row.notes.split(",")[0].split("=")[1] }}
            </span>
          </div>
        </div>
      </template> -->
      <!--       
      <template #notes-data="{ row }">
        <span class="text-black">{{ row.notes }}</span>
      </template> -->
    </UTable>
  </UCard>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/Auth";

const authstore = useMyAuthStore();
const boardlink = computed(() => {
  if (authstore.user) return authstore.user.boardLink;
});
const rows = [
  {
    name: "ذات   ",
    link: `${boardlink.value}/?theme=zat&orienation=landscape&showPlayers=false`,
    notes: "الطول = 1080 , العرض  = 1920",
  },
  {
    name: "قيدها  ",
    link: `${boardlink.value}/?theme=qydha&orienation=landscape&showPlayers=false`,
    notes: "الطول = 1080 , العرض  = 1920",
  },
  {
    name: "قيدها للهاتف بدون صور الاعبين",
    link: `${boardlink.value}/?theme=qydha&orienation=portrait&showPlayers=false`,
    notes: "الطول = 667 , العرض  = 375",
  },
  {
    name: "قيدها للهاتف بصور الاعبين",
    link: `${boardlink.value}/?theme=qydha&orienation=portrait&showPlayers=true`,
    notes: "الطول = 667 , العرض  = 375",
  },
  {
    name: "صور الاعبين TOP ",
    link: `${boardlink.value}/cam/top`,
    notes: "الطول = 1080 , العرض  = 1920",
  },
  {
    name: "صور الاعبين BOTTOM",
    link: `${boardlink.value}/cam/bottom`,
    notes: "الطول = 1080 , العرض  = 1920",
  },
  {
    name: "صور الاعبين RIGHT ",
    link: `${boardlink.value}/cam/right`,
    notes: "الطول = 1080 , العرض  = 1920",
  },
  {
    name: "صور الاعبين LEFT",
    link: `${boardlink.value}/cam/left`,
    notes: "الطول = 1080 , العرض  = 1920",
  },
];

const cols = [
  { key: "name", label: "الاسم" },
  { key: "notes", label: "لتجربة متميزة علي OBS" },
  { key: "link", label: "الرابط" },
];
</script>

<style></style>
