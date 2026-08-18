<template>
  <UModal
    title="تعديل اسم اللاعب"
    prevent-close
    :description="props.player.name"
  >
    <template #body>
      <UForm
        :state="state"
        :schema="schema"
        ref="formRef"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="اسم اللاعب" name="name" required>
          <UInput v-model="state.name" />
        </UFormField>
        <UAlert
          v-if="UpdateREQ.error.value"
          color="error"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :description="UpdateREQ.error.value?.message || 'حدث خطأ أثناء تحديث الاسم'"
        />
      </UForm>
    </template>
    <template #footer>
      <div class="flex gap-2 justify-between items-center">
        <UButton
          label="حفظ"
          color="primary"
          icon="i-heroicons-check-circle"
          :loading="UpdateREQ.status.value === 'pending'"
          @click="formRef?.submit()"
        />
        <UButton
          label="إلغاء"
          color="error"
          variant="soft"
          :disabled="UpdateREQ.status.value === 'pending'"
          @click="emit('close')"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string } from "yup";
import type { UserPlayer } from "~/models/user";
import { useUserPlayersApi } from "../composables/useUserPlayersApi";

const props = defineProps<{
  player: UserPlayer;
}>();

const emit = defineEmits(["close"]);
const toast = useToast();
const formRef = ref<{ submit: () => void }>();

const state = reactive({ name: props.player.name });

const schema = object({
  name: string().trim().required("برجاء إدخال اسم اللاعب"),
});

const UpdateREQ = useUserPlayersApi().updatePlayerName();

const onSubmit = async () => {
  const playerId = props.player.playerId;
  if (!playerId) {
    toast.add({
      title: "تعذر التحديث",
      description: "معرف اللاعب غير موجود",
      color: "error",
    });
    return;
  }
  await UpdateREQ.fetchREQ(playerId, state.name.trim());
  if (UpdateREQ.status.value === "success") {
    toast.add({
      title: "تم التحديث بنجاح",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    emit("close");
  } else if (UpdateREQ.status.value === "error") {
    toast.add({
      title: "خطأ في التحديث",
      description:
        UpdateREQ.error.value?.message || "حدث خطأ أثناء تحديث الاسم",
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  }
};
</script>
