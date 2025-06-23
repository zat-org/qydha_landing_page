<template>
  <UCard :ui="{
    base: 'flex-1 flex flex-col',
    body: { base: 'flex-1 flex grow' },
  }">
  <template #header>
    <div
      class="flex justify-between items-center ">
      <h2 class="text-lg font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">الاكواد</h2>
      <UButton icon="i-heroicons-plus" color="primary" @click="openModal">
        إضافة
      </UButton>
    </div>
  </template>
    <UTabs :items="items" @change="onChange">
      <template #infCode>
        <div class="h-full flex flex-col">
          <KeepAlive>
            <InfluncerCode v-if="activeTab === 'infCode'" />
          </KeepAlive>
        </div>
      </template>
      <template #category>
        <div class="h-full">
          <KeepAlive>
            <InfluncerCodeCat v-if="activeTab === 'category'" />
          </KeepAlive>
        </div>
      </template>

      <template #code>
        <div class="h-full">
          <KeepAlive>
            <PromoCode v-if="activeTab === 'code'" />
          </KeepAlive>
        </div>
      </template>

      <template #cardcode>
        <div class="h-full">
          <KeepAlive>
            <CardCode v-if="activeTab === 'cardcode'" />
          </KeepAlive>
        </div>
      </template>
    </UTabs>
  </UCard>
</template>

<script lang="ts" setup>
import AddCodeModal from "../influncerCode/addCodeModal.vue";
import AddCatModal from "../influncerCode/Cat/addCatModal.vue";
import AddUserCodeModal from "../PromoCode/AddModal.vue";
import CreateModal from "../CardCode/CreateModal.vue";

const tabIndex = ref(0);
const activeTab = ref('infCode');

const items = [
  { slot: "infCode", label: "أكواد المؤثرين" },
  { slot: "category", label: "الفئات" },
  { slot: "code", label: "أكواد المستخدمين" },
  { slot: "cardcode", label: "أكواد البطاقات" },
];

const modal = useModal();
const onChange = (index: number) => {
  tabIndex.value = index; 
  activeTab.value = items[index].slot;
};

const openModal = () => {
  const modals = [AddCodeModal, AddCatModal, AddUserCodeModal, CreateModal];
  modal.open(modals[tabIndex.value]);
};

const getcodesREQ = await useInfluncerCode().getinfluncerCodes();
await getcodesREQ.fetchREQ();

const codes = computed(() => getcodesREQ.data.value?.data.items);
const page = ref(getcodesREQ.data.value?.data.currentPage!);
const total = ref(getcodesREQ.data.value?.data.totalCount!);

watch(page, async (newValue) => {
  await getcodesREQ.fetchREQ(newValue);
});

const cols = [
  { key: "code", label: "الكود" },
  { key: "numberOfDays", label: "عدد الأيام" },
  { key: "usedCount", label: "عدد مرات الاستخدام" },
  { key: "status", label: "الحالة" },
  { key: "categoryName", label: "الفئة" },
];
</script>

<style>
.rtl {
  direction: rtl;
}
</style>