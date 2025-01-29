<template>
  <div class="flex flex-col gap-5">
    <div class="flex items-center justify-between mt-[5px]">
      <h2 class="text-primary font-semibold text-[15px] md:text-xl">
        لمعرفة قوانين البطولة
      </h2>
      <UButton size="xs" variant="ghost">اضغط هنا </UButton>
    </div>
  </div>
  <div class="flex gap-3">
    <UInput v-model="newRule" class="grow" placeholder="اضاف قوانين اخري">
    </UInput>
    <UButton @click="AddRule()"> اضافة</UButton>
  </div>
  <ul class="flex flex-col gap-2 justify-between list-disc list-inside">
    <li class="text-sm" v-for="role in modelValue.Roles">
      {{ role }}
    </li>
  </ul>
</template>

<script lang="ts" setup>
const props = defineProps<{
  modelValue: {
    Roles: string[];
  };
}>();
const emit = defineEmits(["update:modelValue"]);
const newRule = ref();
const AddRule = () => {
  if (newRule.value) {
    props.modelValue.Roles.push(newRule.value);
  }
  newRule.value = "";
};
</script>

<style></style>
