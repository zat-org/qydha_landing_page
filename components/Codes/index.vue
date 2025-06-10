<template>
  <UCard
    :ui="{
      base: 'h-full flex flex-col',
      body: { base: 'flex-1 flex grow' },
    }"
  >
    <UTabs
      :items="items"
      :ui="{
        base: 'h-full flex flex-col justify-between flex-1',
        container: 'flex-1',
        wrapper: 'flex flex-col flex-1',
        list: 'border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)]',
        item: {
          base: 'flex items-center gap-2 px-4 py-2 text-[var(--color-text)] dark:text-[var(--color-text-dark)] hover:bg-[var(--color-hover)] dark:hover:bg-[var(--color-hover-dark)]',
          active: 'border-b-2 border-[var(--color-primary)] dark:border-[var(--color-primary-dark)] font-medium'
        }
      }"
      @change="onChange"
    >
      <template #infCode>
        <div class="h-full flex flex-col">
          <div class="flex justify-between items-center p-4 border-b border-[var(--color-border)] dark:border-[var(--color-border-dark)]">
            <h2 class="text-lg font-medium text-[var(--color-text)] dark:text-[var(--color-text-dark)]">أكواد المؤثرين</h2>
            <UButton 
              @click="openModal()" 
              color="green" 
              icon="i-heroicons-plus"
              label="إضافة كود"
              class="hover:bg-[var(--color-primary-light)]/10 dark:hover:bg-[var(--color-primary)]/20"
            />
          </div>
          <div class="flex-1 overflow-auto p-4">
            <UTable
              :ui="{ 
                td: { padding: 'py-3 px-4' }, 
                th: { 
                  padding: 'py-3 px-4',
                  base: 'bg-[var(--color-table-header)] dark:bg-[var(--color-table-header-dark)] text-[var(--color-text)] dark:text-[var(--color-text-dark)]'
                },
                tr: {
                  base: 'hover:bg-[var(--color-hover)] dark:hover:bg-[var(--color-hover-dark)]',
                  td: 'text-[var(--color-text)] dark:text-[var(--color-text-dark)]'
                }
              }"
              :rows="codes"
              :columns="cols"
            >
              <template #status-data="{row}">
                <UBadge 
                  variant="outline"
                  :color="new Date(row.expireAt) > new Date() ? 'green' : 'red'"
                  :label="new Date(row.expireAt) > new Date() ? 'فعال' : 'منتهي'"
                  class="font-medium"
                />
              </template>
            </UTable>
          </div>
          <UPagination
            class="mt-auto mx-auto p-4 border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)]"
            v-model="page"
            :page-count="10"
            :total="total"
            :ui="{
              button: {
                base: 'text-[var(--color-text)] dark:text-[var(--color-text-dark)] hover:bg-[var(--color-hover)] dark:hover:bg-[var(--color-hover-dark)]',
                active: 'bg-[var(--color-primary)] dark:bg-[var(--color-primary-dark)] text-white'
              }
            }"
          />
        </div>
      </template>

      <template #category>
        <div class="h-full">
          <InfluncerCodeCat />
        </div>
      </template>

      <template #code>
        <div class="h-full">
          <PromoCode />
        </div>
      </template>

      <template #cardcode>
        <div class="h-full">
          <CardCode />
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

const items = [
  { slot: "infCode", label: "أكواد المؤثرين" },
  { slot: "category", label: "الفئات" },
  { slot: "code", label: "أكواد المستخدمين" },
  { slot: "cardcode", label: "أكواد البطاقات" },
];

const modal = useModal();
const onChange = (index: number) => {
  tabIndex.value = index;
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