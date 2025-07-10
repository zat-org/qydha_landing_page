<template>
  <UCard>
    <template #header>
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 class="text-lg font-medium text-gray-600 dark:text-gray-300">الاكواد</h2>
        <UButton icon="i-heroicons-plus" color="primary" @click="openModal" class="w-full sm:w-auto">
          إضافة
        </UButton>
      </div>
    </template>

    <div class="overflow-x-auto">
      <UButtonGroup class="flex flex-wrap sm:flex-nowrap gap-2">
        <UButton 
          v-for="item in items" 
          :key="item.id" 
          :label="item.label" 
          :value="item.id" 
          @click="tabIndex = item.id" 
          :color="tabIndex == item.id ? 'primary' : 'neutral'"
          class="flex-1 sm:flex-none text-sm sm:text-base"
        />
      </UButtonGroup>
    </div>

    <div class="mt-4">
      <template v-if="tabIndex == 0">
        <KeepAlive>
          <InfluncerCode v-if="tabIndex == 0" />
        </KeepAlive>
      </template>
      
      <template v-if="tabIndex == 1">
        <KeepAlive>
          <InfluncerCodeCat v-if="tabIndex == 1" />
        </KeepAlive>
      </template>

      <template v-if="tabIndex == 2">
        <KeepAlive>
          <PromoCode v-if="tabIndex == 2" />
        </KeepAlive>
      </template>

      <template v-if="tabIndex == 3">
        <KeepAlive>
          <CardCode v-if="tabIndex == 3" />
        </KeepAlive>
      </template>
    </div>

  </UCard>
</template>

<script lang="ts" setup>
import AddCodeModal from "../influncerCode/addCodeModal.vue";
import AddCatModal from "../influncerCode/Cat/addCatModal.vue";
import AddUserCodeModal from "../PromoCode/AddModal.vue";
import CreateModal from "../CardCode/CreateModal.vue";

const tabIndex = ref(0);

const items = [
  {id:0, slot: "infCode" , label: "أكواد المؤثرين" },
  {id:1, slot: "category", label: "الفئات" },
  {id:2, slot: "code" , label: "أكواد المستخدمين" },
  {id:3, slot: "cardcode", label: "أكواد البطاقات" },
];

const overlay = useOverlay();

const openModal = () => {
  const modals = [AddCodeModal, AddCatModal, AddUserCodeModal, CreateModal];
  overlay.create(modals[tabIndex.value]).open();
};

</script>

<style>
.rtl {
  direction: rtl;
}

@media (max-width: 640px) {
  .UButtonGroup {
    gap: 0.5rem;
  }
}
</style>