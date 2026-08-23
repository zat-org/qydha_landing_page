<template>
  <UModal
    title="اضافة مدير جديد"
    prevent-close
    description="تعيين مستخدم كمدير لهذه البطولة مع صلاحياته"
  >
    <template #body>
      <UForm
        :state="state"
        :schema="schema"
        ref="moderatorForm"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField name="username" label="اسم المدير">
          <UserSelectMenu
            v-model="state.username"
            :remote-search="canPickUserFromList"
            placeholder="ابحث عن مدير..."
            class="w-full"
          />
        </UFormField>
        <UFormField name="permissions" label="الصلاحيات">
          <USelectMenu
            v-model="state.permissions"
            :items="permissionItems"
            multiple
            class="w-full"
            placeholder="اختر صلاحية واحدة على الأقل"
          />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-between items-center gap-2">
        <UButton
          label="اضافة"
          color="primary"
          :loading="addModeratorREQ.status.value === 'pending'"
          @click="moderatorForm?.submit()"
        />
        <UButton
          label="اغلاق"
          color="error"
          variant="soft"
          :disabled="addModeratorREQ.status.value === 'pending'"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { array, object, string } from "yup";
import type { IModeratorCreate } from "~/features/tournament/models/tournamentModeratorr";
import { useMyAuthStore } from "~/store/Auth";
import UserSelectMenu from "~/components/User/UserSelectMenu.vue";
import { useTournamentModerator } from "~/features/tournament/moderators/composables/tournamentModerator";

const emit = defineEmits(["close"]);
const route = useRoute();
const toast = useToast();
const tour_id = route.params.id.toString();
const authStore = useMyAuthStore();

const canPickUserFromList = computed(
  () => !!authStore.isAdmin,
);

const permissionGetREQ = await useTournamentModerator().getModeratorpermissions();

const permissionItems = computed(
  () => permissionGetREQ.data.value?.permissions ?? [],
);

const moderatorForm = ref();
const state = reactive<IModeratorCreate>({
  username: "",
  permissions: [],
});

const schema = object({
  username: string().required("برجاء ادخال اسم المدير"),
  permissions: array()
    .of(string())
    .min(1, "برجاء اختيار صلاحية واحدة علي الاقل"),
});

const addModeratorREQ = await useTournamentModerator().addModerator();

async function onSubmit() {
  await addModeratorREQ.fetchREQ(tour_id, state);
  if (addModeratorREQ.status.value == "success") {
    toast.add({
      title: "تم اضافة المدير بنجاح",
      color: "success",
      icon: "material-symbols:check",
    });
    emit("close");
    return;
  }

  if (addModeratorREQ.status.value == "error") {
    const statusCode = addModeratorREQ.error.value?.statusCode;
    if (statusCode == 404) {
      moderatorForm.value?.setErrors([
        { message: "هذا المستخدم غير موجود", name: "username" },
      ]);
    } else if (statusCode == 400) {
      moderatorForm.value?.setErrors([
        { message: "هذا المستخدم موجود بالفعل في البطولة", name: "username" },
      ]);
    } else if (statusCode == 403) {
      moderatorForm.value?.setErrors([
        { message: "ليس لديك صلاحية لاضافة مدير", name: "username" },
      ]);
    }
  }
}
</script>
