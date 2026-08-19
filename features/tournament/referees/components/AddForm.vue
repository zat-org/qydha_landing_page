<template>
  <UCard>
    <template #header>
      اضافة حكم جديد
    </template>
    <UForm :state="state" :schema="schema" ref="refreeForm" @submit="onSubmit">
      <UFormField label="اسم الحكم " name="username">
        <UserSelectMenu
          v-model="state.username"
          :remote-search="canPickUserFromList"
          placeholder="ابحث عن حكم..."
        />
      </UFormField>
    </UForm>
    <template #footer>
      <div class="flex justify-between">
        <UButton label="اضافة" @click="refreeForm?.submit()" />
        <UButton label="اغلاق" color="error" @click="emit('close')" />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { object, string } from "yup";
import { useMyAuthStore } from "~/store/Auth";

const props = defineProps<{
  tourId: string;
  placeId: string;
}>();

const emit = defineEmits(["close"]);
const toast = useToast();
const refreeAddREQ = useTournamentRefree().addTourRefree();
const refreeForm = ref();
const authStore = useMyAuthStore();

const canPickUserFromList = computed(
  () =>
    !!authStore.user?.user.roles?.includes("SuperAdmin") ||
    !!authStore.user?.user.roles?.includes("StaffAdmin"),
);

const schema = object({
  username: string().required("برجاء ادخال اسم الحكم"),
});

const state = reactive({ username: "" });

const onSubmit = async () => {
  await refreeAddREQ.fetchREQ(props.tourId, props.placeId, state);

  if (refreeAddREQ.status.value == "success") {
    emit("close");
    toast.add({
      title: "تم اضافة الحكم بنجاح",
      color: "success",
      icon: "material-symbols:check",
    });
  } else if (refreeAddREQ.status.value == "error") {
    if (refreeAddREQ.error.value?.statusCode == 404) {
      refreeForm.value!.setErrors([
        { message: "هذا المستخدم غير موجود ", name: "username" },
      ]);
    } else if (refreeAddREQ.error.value?.statusCode == 400) {
      refreeForm.value!.setErrors([
        { message: "هذا المستخدم موجود بالفعل في هذا المكان ", name: "username" },
      ]);
    } else if (refreeAddREQ.error.value?.statusCode == 403) {
      refreeForm.value!.setErrors([
        { message: "ليس لديك صلاحية لاضافة الحكم ", name: "username" },
      ]);
    }
  }
};
</script>
