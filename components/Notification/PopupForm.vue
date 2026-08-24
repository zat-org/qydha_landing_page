<template>
  <UForm
    ref="notificationForm"
    :state="state"
    :schema="schema"
    class="flex flex-col gap-4"
    @submit="onSubmit"
  >
    <UFieldGroup class="mx-auto">
      <UButton
        v-for="item in notificationTargetOptions"
        :key="item.value"
        :color="target === item.value ? 'primary' : 'neutral'"
        :label="item.label"
        @click="onSelectTarget(item.value)"
      />
    </UFieldGroup>

    <UFormField v-if="target === 'User'" label="المستخدم" name="user" required>
      <UInputMenu
        v-model="state.user"
        v-model:search-term="search_user"
        :loading="usergetREQ.status.value === 'pending'"
        :items="users"
        placeholder="ابحث عن مستخدم"
        option-key="username"
        value-key="id"
        class="w-full"
      />
    </UFormField>

    <UFormField label="العنوان" name="title" required>
      <UInput v-model="state.title" placeholder="عنوان الإشعار المنبثق" />
    </UFormField>

    <UFormField label="الوصف" name="description">
      <UTextarea
        v-model="state.description"
        :rows="4"
        placeholder="نص الإشعار المنبثق"
      />
    </UFormField>

    <UFormField label="النوع" name="actionType" required>
      <USelect
        v-model="state.actionType"
        :items="notificationActionsArray"
        class="w-full"
      />
    </UFormField>

    <UFormField
      v-if="state.actionType !== popUpActionType.PopUpWithNoAction"
      :label="actionPathLabel(state.actionType)"
      name="actionPath"
      required
    >
      <UInput
        v-if="state.actionType === popUpActionType.PopUpWithGoToURL"
        v-model="state.actionPath"
        dir="ltr"
        placeholder="https://..."
      />
      <USelect
        v-else
        v-model="state.actionPath"
        :items="pathOptions"
        class="w-full"
        placeholder="اختر الوجهة"
      />
    </UFormField>

    <UFormField label="الصورة المرفقة" name="popUpImage" required>
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept=".png,.jpg,.jpeg,.webp"
        @change="onImageChange"
      />
      <div class="flex items-center gap-4">
        <div
          class="relative h-28 w-28 overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 group dark:border-gray-600 dark:bg-gray-800"
        >
          <template v-if="!imageUrl">
            <div class="absolute inset-0 flex items-center justify-center">
              <UButton
                color="primary"
                variant="ghost"
                class="flex flex-col items-center gap-1"
                @click="fileInput?.click()"
              >
                <UIcon name="i-heroicons-photo" class="h-8 w-8" />
                <span class="text-xs">إضافة صورة</span>
              </UButton>
            </div>
          </template>
          <template v-else>
            <img :src="imageUrl" class="h-full w-full object-cover" alt="صورة الإشعار" />
            <div
              class="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <UButton color="error" variant="solid" size="xs" @click.stop="removeImage">
                <UIcon name="i-heroicons-trash" class="h-4 w-4" />
              </UButton>
              <UButton color="primary" variant="solid" size="xs" @click.stop="fileInput?.click()">
                <UIcon name="i-heroicons-pencil" class="h-4 w-4" />
              </UButton>
            </div>
          </template>
        </div>
        <p class="text-xs text-gray-500">PNG أو JPG أو WEBP</p>
      </div>
    </UFormField>
  </UForm>
</template>

<script lang="ts" setup>
import { mixed, object, string } from "yup";
import { refDebounced } from "@vueuse/core";
import {
  popUpActionType,
  type INotificationPopupCreate,
} from "~/models/notification";
import {
  actionPathLabel,
  notificationScreenOptions,
  notificationTabOptions,
  notificationTargetOptions,
} from "~/components/Notification/notificationTargets";

const notificationForm = ref<{ submit: () => Promise<void> } | null>(null);
const fileInput = ref<HTMLInputElement>();
const toast = useToast();
const emit = defineEmits<{ close: [] }>();
const imageUrl = ref("");
const target = ref<"All" | "User" | "Anonymos">("All");
const search_user = ref("");
const search_userDebounced = refDebounced(search_user, 500);
const addREQ = useNotification().sendNotificationToAllUsers();

const onSelectTarget = (value: "All" | "User" | "Anonymos") => {
  target.value = value;
};

defineExpose({
  AddNotificatoion: () => notificationForm.value?.submit(),
  pending: addREQ.pending,
});

const usergetREQ = await useUsers().getAllUsers();
await usergetREQ.fetchREQ("");

const usergetREQ = await useUsers().getAllUsers();
await usergetREQ.fetchREQ("");
const users = computed(() =>
  usergetREQ.data.value?.items.map((ele) => ({
    ...ele,
    label: ele.username,
    value: ele.id,
  })),
);

watch(search_userDebounced, async (q) => {
  await usergetREQ.fetchREQ(q);
});

const state = reactive<INotificationPopupCreate>({
  title: "",
  description: "",
  actionPath: "_",
  actionType: popUpActionType.PopUpWithNoAction,
  popUpImage: null,
  user: "",
});

const schema = computed(() =>
  object({
    title: string().required("العنوان مطلوب").min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
    description: string().min(5, "الوصف يجب أن يكون 5 أحرف على الأقل").required("الوصف مطلوب"),
    actionType: string().required("النوع مطلوب"),
    user:
      target.value === "User"
        ? string().required("يجب اختيار مستخدم")
        : string(),
    actionPath:
      state.actionType === popUpActionType.PopUpWithNoAction
        ? string()
        : state.actionType === popUpActionType.PopUpWithGoToURL
          ? string().url("أدخل رابطاً صحيحاً").required("الرابط مطلوب")
          : string().required("الوجهة مطلوبة"),
    popUpImage: mixed().required("الصورة مطلوبة"),
  }),
);

const pathOptions = computed(() =>
  state.actionType === popUpActionType.PopUpWithGoToScreen
    ? notificationScreenOptions
    : notificationTabOptions,
);

const notificationActionsArray = [
  { value: popUpActionType.PopUpWithNoAction, label: "إشعار فقط" },
  { value: popUpActionType.PopUpWithGoToURL, label: "التوجه لرابط" },
  { value: popUpActionType.PopUpWithGoToScreen, label: "التوجه لشاشة في التطبيق" },
  { value: popUpActionType.PopUpWithGoToTab, label: "التوجه لواجهة في التطبيق" },
];

watch(
  () => state.actionType,
  (newValue) => {
    if (newValue === popUpActionType.PopUpWithNoAction) {
      state.actionPath = "_";
    } else {
      state.actionPath = "";
    }
  },
);

const onImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  state.popUpImage = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    imageUrl.value = String(e.target?.result ?? "");
  };
  reader.readAsDataURL(file);
  if (fileInput.value) fileInput.value.value = "";
};

const removeImage = () => {
  state.popUpImage = null;
  imageUrl.value = "";
  if (fileInput.value) fileInput.value.value = "";
};

const onSubmit = async () => {
  await addREQ.fetchREQ(state, target.value, state.user);
  if (addREQ.status.value === "success") {
    toast.add({ title: "تم إرسال الإشعار المنبثق", color: "success" });
    emit("close");
    return;
  }
  toast.add({ title: "تعذر إرسال الإشعار المنبثق", color: "error" });
};
</script>
