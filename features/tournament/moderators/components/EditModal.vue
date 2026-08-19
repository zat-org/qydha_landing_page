<template>
  <UModal
    title="تعديل صلاحيات مدير"
    prevent-close
    :description="moderator.user.username"
  >
    <template #body>
      <UForm
        :state="state"
        :schema="schema"
        ref="moderatorForm"
        class="space-y-4"
        @submit="onSubmit"
      >
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
          label="حفظ"
          color="primary"
          :loading="updateModeratorREQ.status.value === 'pending'"
          @click="moderatorForm?.submit()"
        />
        <UButton
          label="اغلاق"
          color="error"
          variant="soft"
          :disabled="updateModeratorREQ.status.value === 'pending'"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { array, object, string } from "yup";
import type {
  IModerator,
  IModeratorUpdate,
} from "~/features/tournament/models/tournamentModeratorr";

const props = defineProps<{ moderator: IModerator }>();

const emit = defineEmits(["close"]);
const route = useRoute();
const toast = useToast();
const tour_id = route.params.id.toString();

const permissionGetREQ = await useTournamentModerator().getModeratorpermissions();

const permissionItems = computed(
  () => permissionGetREQ.data.value?.permissions ?? [],
);

const moderatorForm = ref();
const state = reactive<IModeratorUpdate>({
  permissions: [...props.moderator.permissions],
});

const schema = object({
  permissions: array()
    .of(string())
    .min(1, "برجاء اختيار صلاحية واحدة علي الاقل"),
});

const updateModeratorREQ = await useTournamentModerator().updateModerator();

async function onSubmit() {
  await updateModeratorREQ.fetchREQ(
    tour_id,
    props.moderator.user.id,
    state,
  );
  if (updateModeratorREQ.status.value == "success") {
    toast.add({
      title: "تم تحديث صلاحيات المدير",
      color: "success",
      icon: "material-symbols:check",
    });
    emit("close");
  }
}
</script>
