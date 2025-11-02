<template>
  <UForm
    :state="state"
    :schema="schema"
    ref="notificationForm"
    @submit="onSubmit"
    class="flex flex-col gap-2"
  >
    <UButtonGroup class="mx-auto">
      <UButton
        :color="target == 'All' ? 'primary' : 'neutral'"
        @click="target = 'All'"
        label="الكل"

      />
      <UButton
        :color="target == 'Anonymos' ? 'primary' : 'neutral'"
        @click="target = 'Anonymos'"
        label="غير مسجلين"
      />
      <UButton
        :color="target == 'User' ? 'primary' : 'neutral'"
        @click="target = 'User'"
        label="مستخدم"
      />
    </UButtonGroup>
    <UFormField label="المستخدم" name="user" v-if="target == 'User'">
      <UInputMenu
        v-model="state.user"
        v-model:search-term="search_user"
        :loading="usergetREQ.status.value == 'pending'"
        :items="users"
   
        option-key="username"
        value-key="id"
      />
    </UFormField>
    <UFormField label="العنوان" name="title">
      <UInput v-model="state.title" />
    </UFormField>
    <UFormField label="الوصف" name="description">
      <UInput v-model="state.description" />
      </UFormField>
    <UFormField label="النوع" name="actionType">
      <USelect v-model="state.actionType" :items="notificationActionsArray" class="w-full"  />
    </UFormField>
    <UFormField
      label="الهدف"
      name="actionPath"
      v-if="state.actionType != NotificationActionType.NoAction"
    >
      <UInput
        v-model="state.actionPath"
        v-if="state.actionType == NotificationActionType.GoToURL"
      />
      <USelect
        class="w-full"
        v-model="state.actionPath"
        :items="
          state.actionType == NotificationActionType.GoToScreen
            ? screenOptions
            : tabOptions
        "
        v-if="
          state.actionType == NotificationActionType.GoToScreen ||
          state.actionType == NotificationActionType.GoToTab
        "
      />
    </UFormField>
  </UForm>
</template>

<script lang="ts" setup>
import { string, object } from "yup";
import { refDebounced } from '@vueuse/core'
const search_user = ref("")
const search_userDebounced = refDebounced(search_user, 500)

import {
  NotificationActionType,
  type INotificationCreate,
} from "~/models/notification";
const notificationForm = ref<HTMLFormElement>();
const AddNotificatoion = () => {
  notificationForm.value?.submit();
};

defineExpose({ AddNotificatoion });
const toast = useToast();
const emit = defineEmits(['close'])
const target = ref<"All" | "User" | "Anonymos">("All");
const usergetREQ = await useUsers().getAllUsers();
await usergetREQ.fetchREQ("");
const users = computed(() => {
  return usergetREQ.data.value?.data.items.map((ele) => ({ ...ele, label: ele.username, value: ele.id }));
});

watch(target, (newValue, oldValue) => {
  schema.fields.user = string();
  if (newValue == "User") {
    schema.fields.user = string().required();
  }
});

const search = async (q: string) => {
  console.log(q)
  await usergetREQ.fetchREQ(q);
  return users.value!;
};

// Watch for changes in the debounced search term and trigger search
watch(search_userDebounced, async (newSearchTerm) => {
    await search(newSearchTerm);
});

const state = reactive<INotificationCreate>({
  title: "",
  description: "",
  actionPath: "_",
  actionType: NotificationActionType.NoAction,
  user: "",
});

const schema = object({
  title: string().required().min(5),
  description: string().min(5),
  actionPath: string(),
  actionType: string().required(),
  user: string(),
});
// screen name options
// TournamentDetailsScreen -> /tournament-details/:id
// JoinTournamentScreen -> /join-tournament/:id
const screenOptions = [
  { label: "البلوت", value: "/baloot-game" },
  { label: "الهند", value: "/hand-game" },
  { label: "المكتبة", value: "/library" },
  { label: "كتاب البلوت", value: "/baloot-book" },
  { label: "المحادثات المباشرة", value: "/live-chat" },
  { label: " الاشعارات", value: "/notifications" },
  { label: " الاشعارات", value: "/notifications" },
  { label: "اشيف الالعاب", value: "/games-archive" },
  { label: "تعديل المستخدم ", value: "/edit-profile" },
  { label: "الاعدادات", value: "/app-settings" },
  { label: "اعدادات المستخدم", value: "/user-settings" },
  { label: "  الاعدادات اللاعبين", value: "/players-settings" },
  { label: "مسح المستخدم", value: "/delete-user" },
  { label: "تغيير كلمة المرور", value: "/change-password" },
  { label: "نسي  كلمة المرور", value: "/forget-password" },
  { label: "تعيين كلمة المرور جديدة ", value: "/set-new-password" },
  { label: "عنا", value: "/about-us" },
  { label: "قوانين الخصوصية", value: "/privacy-policy" },
  { label: "الشروط والاحكام", value: "/terms" },
  { label: "البطولات", value: "/tournaments-tab" },
  { label: " طلبات الانضمام للبطولات  ", value: "/tournament-user-requests" },
  { label: " دعوات الانضمام للبطولات  ", value: "/tournament-invitations" },
];
// tab names options
const tabOptions = [
  { label: "الصفحة الشخصية", value: "profile" },
  { label: "المتجر", value: "store" },
  { label: "الاحصائيات", value: "statistics" },
  { label: "الكتاب", value: "books" },
  { label: " الرئيسية", value: "home" },
];
// handel file input
// const filechange = (event: FileList) => {
//   if (event.item(0)) {
//     console.log(event.item(0))
//     state.popUpImage = event.item(0)
//   }
// }
// handel notification action type data
const notificationActionsArray: { value: NotificationActionType; label: string }[] = [
  {
    value: NotificationActionType.NoAction,
    label: "اشعار فقط",
  },
  {
    value: NotificationActionType.GoToURL,
    label: "التوجه للينك معين",
  },
  {
    value: NotificationActionType.GoToScreen,
    label: "التوجة لشاشة في التطبيق",
  },
  {
    value: NotificationActionType.GoToTab,
    label: "التوجة لواجهة  في التطبيق",
  },
]

watch(
  () => state.actionType,
  (newValue, oldValue) => {
    state.actionPath = "";
    if (newValue == NotificationActionType.NoAction) {
      schema.fields.actionPath = string();
      state.actionPath = "_";
    } else if (newValue == NotificationActionType.GoToURL) {
      schema.fields.actionPath = string().url().required();
    } else {
      schema.fields.actionPath = string().required();
    }
  },
  { immediate: true }
);

const onSubmit = async () => {
  console.log(state);
  await addREQ.fetchREQ(state, target.value, state.user);
  if (addREQ.status.value == "success")
    toast.add({ title: "add new notification doen " });
  emit("close");
};

const addREQ = await useNotification().sendNotificationToAllUsers();
</script>

<style></style>
