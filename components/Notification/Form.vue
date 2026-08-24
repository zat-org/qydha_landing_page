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
      <UInput v-model="state.title" placeholder="عنوان الإشعار (5 أحرف على الأقل)" />
    </UFormField>

    <UFormField label="الوصف" name="description">
      <UTextarea
        v-model="state.description"
        :rows="4"
        placeholder="نص الإشعار"
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
      v-if="state.actionType !== NotificationActionType.NoAction"
      :label="actionPathLabel(state.actionType)"
      name="actionPath"
      required
    >
      <UInput
        v-if="state.actionType === NotificationActionType.GoToURL"
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
  </UForm>
</template>

<script lang="ts" setup>
import { object, string } from "yup";
import { refDebounced } from "@vueuse/core";
import {
  NotificationActionType,
  type INotificationCreate,
} from "~/models/notification";
import {
  actionPathLabel,
  notificationScreenOptions,
  notificationTabOptions,
  notificationTargetOptions,
} from "~/components/Notification/notificationTargets";

const notificationForm = ref<{ submit: () => Promise<void> } | null>(null);
const toast = useToast();
const emit = defineEmits<{ close: [] }>();
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

const state = reactive<INotificationCreate>({
  title: "",
  description: "",
  actionPath: "_",
  actionType: NotificationActionType.NoAction,
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
      state.actionType === NotificationActionType.NoAction
        ? string()
        : state.actionType === NotificationActionType.GoToURL
          ? string().url("أدخل رابطاً صحيحاً").required("الرابط مطلوب")
          : string().required("الوجهة مطلوبة"),
  }),
);

const pathOptions = computed(() =>
  state.actionType === NotificationActionType.GoToScreen
    ? notificationScreenOptions
    : notificationTabOptions,
);

const notificationActionsArray = [
  { value: NotificationActionType.NoAction, label: "إشعار فقط" },
  { value: NotificationActionType.GoToURL, label: "التوجه لرابط" },
  { value: NotificationActionType.GoToScreen, label: "التوجه لشاشة في التطبيق" },
  { value: NotificationActionType.GoToTab, label: "التوجه لواجهة في التطبيق" },
];

watch(
  () => state.actionType,
  (newValue) => {
    if (newValue === NotificationActionType.NoAction) {
      state.actionPath = "_";
    } else {
      state.actionPath = "";
    }
  },
);

const onSubmit = async () => {
  await addREQ.fetchREQ(state, target.value, state.user);
  if (addREQ.status.value === "success") {
    toast.add({ title: "تم إرسال الإشعار", color: "success" });
    emit("close");
    return;
  }
  toast.add({ title: "تعذر إرسال الإشعار", color: "error" });
};
</script>
