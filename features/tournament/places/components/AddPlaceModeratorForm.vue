<template>
  <UCard>
    <template #header>
      اضافة مشرف مكان
    </template>
    <UForm ref="formRef" :state="state" :schema="schema" @submit="onSubmit">
      <UFormField label="اسم المستخدم" name="username">
        <UserSelectMenu
          v-model="state.username"
          :remote-search="canPickUserFromList"
          placeholder="ابحث عن مشرف..."
        />
      </UFormField>
    </UForm>
    <template #footer>
      <div class="flex justify-between">
        <UButton label="اضافة" @click="formRef?.submit()" />
        <UButton label="اغلاق" color="error" @click="emit('close')" />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { object, string } from "yup";
import { useMyAuthStore } from "~/store/Auth";
import { usePlaceModeratorsApi } from "~/features/tournament/places/composables/usePlaceModeratorsApi";

const props = defineProps<{
  tourId: string;
  placeId: string;
}>();

const emit = defineEmits(["close"]);
const toast = useToast();
const addREQ = usePlaceModeratorsApi().addPlaceModerator();
const formRef = ref();
const authStore = useMyAuthStore();

const canPickUserFromList = computed(
  () =>
    !!authStore.user?.user.roles?.includes("SuperAdmin") ||
    !!authStore.user?.user.roles?.includes("StaffAdmin"),
);

const schema = object({
  username: string().required("برجاء ادخال اسم المستخدم"),
});

const state = reactive({ username: "" });

const onSubmit = async () => {
  await addREQ.fetchREQ(props.tourId, props.placeId, state);

  if (addREQ.status.value == "success") {
    emit("close");
    toast.add({
      title: "تم اضافة مشرف المكان بنجاح",
      color: "success",
      icon: "material-symbols:check",
    });
  } else if (addREQ.status.value == "error") {
    if (addREQ.error.value?.statusCode == 404) {
      formRef.value!.setErrors([
        { message: "هذا المستخدم غير موجود", name: "username" },
      ]);
    } else if (addREQ.error.value?.statusCode == 400) {
      formRef.value!.setErrors([
        {
          message: "هذا المستخدم مشرف بالفعل لهذا المكان",
          name: "username",
        },
      ]);
    } else if (addREQ.error.value?.statusCode == 403) {
      formRef.value!.setErrors([
        { message: "ليس لديك صلاحية لاضافة مشرف المكان", name: "username" },
      ]);
    }
  }
};
</script>
