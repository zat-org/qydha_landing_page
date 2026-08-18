<template>
  <UModal
    title="تغيير صورة اللاعب"
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
        <div class="flex items-center gap-4">
          <img
            v-if="previewUrl || props.player.url"
            :src="previewUrl || props.player.url || undefined"
            alt=""
            class="h-24 w-24 rounded-full object-cover"
          />
          <UFormField label="الصورة" name="image" required>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,image/*"
              class="block w-full text-sm"
              @change="onImageChange"
            />
          </UFormField>
        </div>
        <UAlert
          v-if="UpdateREQ.error.value"
          color="error"
          variant="soft"
          icon="i-heroicons-exclamation-triangle"
          :description="UpdateREQ.error.value?.message || 'حدث خطأ أثناء تحديث الصورة'"
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
import { mixed, object } from "yup";
import type { UserPlayer } from "~/models/user";
import { useUserPlayersApi } from "../composables/useUserPlayersApi";

const props = defineProps<{
  player: UserPlayer;
}>();

const emit = defineEmits(["close"]);
const toast = useToast();
const formRef = ref<{ submit: () => void }>();
const previewUrl = ref("");

const state = reactive({ image: null as File | null });

const schema = object({
  image: mixed<File>()
    .required("برجاء اختيار صورة")
    .test("is-file", "برجاء اختيار صورة", (value) => value instanceof File),
});

const UpdateREQ = useUserPlayersApi().updatePlayerImage();

function onImageChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.item(0) ?? null;
  state.image = file;
  previewUrl.value = "";
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

const onSubmit = async () => {
  const playerId = props.player.playerId;
  if (!playerId || !state.image) return;

  await UpdateREQ.fetchREQ(playerId, state.image);
  if (UpdateREQ.status.value === "success") {
    toast.add({
      title: "تم تحديث الصورة",
      color: "success",
      icon: "i-heroicons-check-circle",
    });
    emit("close");
  } else if (UpdateREQ.status.value === "error") {
    toast.add({
      title: "خطأ في التحديث",
      description:
        UpdateREQ.error.value?.message || "حدث خطأ أثناء تحديث الصورة",
      color: "error",
      icon: "i-heroicons-exclamation-triangle",
    });
  }
};
</script>
