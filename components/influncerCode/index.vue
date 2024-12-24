<!-- <template>
  <UCard
    :ui="{
      base: 'h-full  flex flex-col  ',
      body: { base: 'grow flex flex-col justifiy-between h-full ' },
    }"
  >
    <UTabs
      :items="items"
      :ui="{
        base: 'h-full flex flex-col justify-between ',
        height: 'h-full',
        container: 'h-full',
        wrapper: 'h-full',
      }"
      @change="onChange"
    >
      <template #infCode>
        <UTable
          :ui="{ td: { padding: 'p-1' }, th: { padding: 'p-1' } }"
          :rows="codes"
          :columns="cols"
        ></UTable>
        <UPagination
          class="mx-auto mb-[50px]"
          v-model="page"
          :page-count="10"
          :total="total"
        />
      </template>
      <template #category>
        <InfluncerCodeCat />
      </template>
      <template #code>
        <PromoCode />
      </template>
      <template #cardcode>
        <CardCode />
      </template>
    </UTabs>

    <template #header>
      <UButton @click="openModal()" color="green" label="add" />
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import AddCodeModal from "./addCodeModal.vue";
import AddCatModal from "./Cat/addCatModal.vue";
import AddUserCodeModal from "../PromoCode/AddModal.vue";
import CreateModal from "../CardCode/CreateModal.vue";
const tabIndex = ref(0);

const items = [
  { slot: "infCode", label: "اكواد المؤثرين" },
  { slot: "category", label: "الفئات" },
  { slot: "code", label: "الاكواد المستخدمين" },
  { slot: "cardcode", label: "اكواد الكروت" },
];

const modal = useModal();
const onChange = (index: number) => {
  tabIndex.value = index;
};
const openModal = () => {
  // in the infcode
  if (tabIndex.value == 0) {
    modal.open(AddCodeModal);
  }

  //in cat
  else if (tabIndex.value == 1) {
    modal.open(AddCatModal);
  } else if (tabIndex.value == 2) {
    modal.open(AddUserCodeModal);
  } else if (tabIndex.value == 3) {
    modal.open(CreateModal);
  }
};

const getcodesREQ = await useInfluncerCode().getinfluncerCodes();
await getcodesREQ.fetchREQ();
const codes = computed(() => {
  return getcodesREQ.data.value?.data.items;
});

const page = ref(getcodesREQ.data.value?.data.currentPage!);
const total = ref(getcodesREQ.data.value?.data.totalCount!);

watch(page, async (newValue, oldValue) => {
  await getcodesREQ.fetchREQ(newValue);
});

const cols = [
  { key: "code", label: "الاسم" },
  { key: "numberOfDays", label: "عدد الايام" },
  { key: "usedCount", label: "مرات الاستخدام" },
  { key: "categoryName", label: "الفئة" },
];
</script>
<style></style> -->
<!-- ------------------ -->
<template>
  <UCard
    :ui="{
      base: 'h-full  flex flex-col  ',
      body: { base: ' flex-1 flex grow  ' },
    }"
  >
    <template #header>
      <div class="flex justify-between items-center p-4">
        <UButton @click="openModal()" color="green" label="add" />
      </div>
    </template>

      <!-- :ui="{
        base: ' flex flex-col',

        wrapper: 'flex-1 flex flex-col overflow-auto',
        container: 'flex-1 flex flex-col min-h-0',
      }" -->
    <UTabs
      :items="items"
      :ui="{
        base: ' h-full   flex flex-col justify-between flex-1 ',
        container: '  flex-1',
        wrapper: 'flex flex-col flex-1',
      }"
      @change="onChange"
    >
      <template #infCode>
        <div class="h-full flex flex-col  ">
          <div class="flex-1 overflow-auto">
            <UTable
              :ui="{ td: { padding: 'p-1' }, th: { padding: 'p-1' } }"
              :rows="codes"
              :columns="cols"
            />
          </div>
          <UPagination
            class="mt-auto mx-auto p-4"
            v-model="page"
            :page-count="10"
            :total="total"
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
import AddCodeModal from "./addCodeModal.vue";
import AddCatModal from "./Cat/addCatModal.vue";
import AddUserCodeModal from "../PromoCode/AddModal.vue";
import CreateModal from "../CardCode/CreateModal.vue";
import type { _height } from "#tailwind-config/theme";

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
  { key: "categoryName", label: "الفئة" },
];
</script>

<style >
.rtl {
  direction: rtl;
}

</style>
