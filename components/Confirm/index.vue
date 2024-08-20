<template>
  <div
    class=" p-5 flex flex-col justify-center items-center ">
    <div class="flex gap-5 items-center">
      <UBadge :color="p1C ? 'green' : 'red'" size="lg"> الاعب الاول</UBadge>
      <UBadge :color="p2C ? 'green' : 'red'" size="lg">الاعب الثاني</UBadge>
    </div>
    <UTabs
      v-model="selected"
      orientation="vertical"
      class="w-full h-[50vh]"
      :items="items"
      :ui="{
        list: {
          width: 'w-48',
          base: 'hidden',
        },
        wrapper: 'flex items-center gap-4',
      }">
      <template #r1="{ item }">
        <div class="flex flex-col justify-center items-center">
          <h1>confirm first player datat</h1>
          <ConfirmRegisterPlayer @prD="onpr1D" />
        </div>
      </template>
      <template #c1="{ item }">
        <div class="flex flex-col justify-center items-center">
          <h1>confirm first player otp</h1>
          <ConfirmPlayer @done="onpc1D" />
        </div>
      </template>
      <template #r2="{ item }">
        <div class="flex flex-col justify-center items-center">
          <h1>confirm secound player otp</h1>
          <ConfirmRegisterPlayer @prD="onpr2D" />
        </div>
      </template>
      <template #c2="{ item }">
        <div class="flex flex-col justify-center items-center">
          <h1>confirm seound player otp</h1>
          <ConfirmPlayer @done="onpc2D" />
        </div>
      </template>
    </UTabs>
  </div>
</template>

<script lang="ts" setup>
import { useMyTabStore } from "~/store/tab";

const items = [
  {
    slot: "r1",
    label: "تسجيل اللاعب 1",
  },
  {
    slot: "c1",
    label: "تاكيد اللاعب 1",
    // disabled: true,
  },
  {
    slot: "r2",
    label: "تسجيل اللاعب 2",
    // disabled: true,
  },
  {
    slot: "c2",
    label: "تاكيد اللاعب 2",
    // disabled: true,
  },
];
const p1C = ref(false);
// const p1 data
const p2C = ref(false);
// const p2 data

const tabStore = useMyTabStore();

const selected = computed({
  get() {
    return tabStore.tabindex;
  },
  set(value) {
    tabStore.goto(value);
  },
});
const onpr1D = () => {
  console.log("pr1done");
  selected.value = 1;
};
const onpr2D = () => {
  console.log("pr2done");
  selected.value = 3;
};
const onpc1D = () => {
  console.log("pc1done");
  selected.value = 2;
  p1C.value = true;
};
const onpc2D = () => {
  console.log("pc2done");
  p2C.value = true;
};
</script>

<style></style>
