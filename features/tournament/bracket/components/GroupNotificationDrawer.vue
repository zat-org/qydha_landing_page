<template>
  <UDrawer
    v-model:open="open"
    direction="left"
    :handle="false"
    :ui="{
      content:
        'max-w-[min(100vw-1rem,100rem)] w-full border-gray-200/90 dark:border-gray-800 sm:max-w-3xl',
      body: 'flex flex-col min-h-0 overflow-y-auto p-0',
      header:
        'border-b border-gray-200/90 bg-gray-50/50 dark:border-gray-800 dark:bg-gray-950/40',
      footer:
        'border-t border-gray-200/90 bg-gray-50/95 dark:border-gray-800 dark:bg-gray-950/50',
    }"
  >
    <template #header>
      <div class="space-y-3 p-3 text-start">
        <div class="flex items-start gap-3">
          <div
            class="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20"
          >
            <UIcon name="i-heroicons-bell" class="size-5" />
          </div>
          <div class="min-w-0">
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              إشعار لاعبي البطولة
            </h2>
            <p class="text-sm font-semibold text-primary">
              المستلمون: {{ audienceFooter }}
            </p>
          </div>
        </div>

        <UFieldGroup class="w-full">
          <UButton
            class="flex-1 justify-center"
            :color="targetMode === 'all' ? 'primary' : 'neutral'"
            :variant="targetMode === 'all' ? 'solid' : 'outline'"
            icon="i-heroicons-globe-alt"
            label="كل اللاعبين"
            @click="targetMode = 'all'"
          />
          <UButton
            class="flex-1 justify-center"
            :color="targetMode === 'selected' ? 'primary' : 'neutral'"
            :variant="targetMode === 'selected' ? 'solid' : 'outline'"
            icon="i-heroicons-squares-2x2"
            label="مجموعات محددة"
            @click="useSelectedGroups()"
          />
        </UFieldGroup>
      </div>
    </template>

    <template #body>
      <div class="flex min-h-0 flex-col gap-5 px-4 py-4">
        <section
          class="overflow-hidden rounded-2xl border-2 border-primary/30 bg-white shadow-sm dark:border-primary/40 dark:bg-gray-900/50"
        >
          <div
            class="flex items-center justify-between gap-2 border-b border-primary/15 bg-primary/10 px-4 py-3 dark:bg-primary/15"
          >
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-users" class="size-5 text-primary" />
              <div>
                <p class="text-sm font-bold text-gray-900 dark:text-white">
                  إلى من يُرسل؟
                </p>
                <p class="text-[11px] text-gray-500">اختر خياراً واحداً أولاً</p>
              </div>
            </div>
            <UBadge color="primary" variant="subtle" size="sm">
              {{ audienceFooter }}
            </UBadge>
          </div>

          <div class="grid gap-3 p-4 sm:grid-cols-2">
            <button
              type="button"
              class="rounded-2xl border-2 p-4 text-start transition"
              :class="
                targetMode === 'all'
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                  : 'border-gray-200 bg-gray-50/80 hover:border-primary/40 dark:border-gray-700 dark:bg-gray-950/40'
              "
              @click="targetMode = 'all'"
            >
              <UIcon
                name="i-heroicons-globe-alt"
                class="mb-2 size-7"
                :class="targetMode === 'all' ? 'text-primary' : 'text-gray-400'"
              />
              <p class="text-base font-bold text-gray-900 dark:text-white">
                كل اللاعبين
              </p>
              <p class="mt-1 text-xs leading-5 text-gray-500">
                كل المجموعات في المرحلة الحالية — {{ groups.length }} مجموعة
              </p>
            </button>

            <button
              type="button"
              class="rounded-2xl border-2 p-4 text-start transition"
              :class="
                targetMode === 'selected'
                  ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                  : 'border-gray-200 bg-gray-50/80 hover:border-primary/40 dark:border-gray-700 dark:bg-gray-950/40'
              "
              @click="useSelectedGroups()"
            >
              <UIcon
                name="i-heroicons-squares-2x2"
                class="mb-2 size-7"
                :class="
                  targetMode === 'selected' ? 'text-primary' : 'text-gray-400'
                "
              />
              <p class="text-base font-bold text-gray-900 dark:text-white">
                مجموعات محددة
              </p>
              <p class="mt-1 text-xs leading-5 text-gray-500">
                اختر مجموعة أو أكثر من القائمة
              </p>
            </button>
          </div>

          <div
            v-if="targetMode === 'selected'"
            class="border-t border-gray-200/80 px-4 py-3 dark:border-gray-800"
          >
            <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p class="text-xs font-semibold text-gray-700 dark:text-gray-200">
                حدد المجموعات ({{ selectedGroupIds.length }}/{{ groups.length }})
              </p>
              <div class="flex gap-1">
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  label="الكل"
                  @click="selectAllGroups"
                />
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  label="مسح"
                  @click="selectedGroupIds = []"
                />
              </div>
            </div>
            <div
              class="flex max-h-56 flex-col gap-1.5 overflow-y-auto rounded-xl border border-gray-200/80 p-2 dark:border-gray-800"
            >
              <button
                v-for="item in groups"
                :key="item.id"
                type="button"
                class="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-start transition"
                :class="
                  selectedGroupIds.includes(item.id)
                    ? 'bg-primary/10 ring-1 ring-primary/30'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/60'
                "
                @click="
                  toggleGroup(item.id, !selectedGroupIds.includes(item.id))
                "
              >
                <span
                  class="flex size-5 shrink-0 items-center justify-center rounded-md border"
                  :class="
                    selectedGroupIds.includes(item.id)
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300 dark:border-gray-600'
                  "
                >
                  <UIcon
                    v-if="selectedGroupIds.includes(item.id)"
                    name="i-heroicons-check"
                    class="size-3.5"
                  />
                </span>
                <span class="min-w-0 flex-1">
                  <span
                    class="flex items-center gap-2 font-medium text-gray-900 dark:text-white"
                  >
                    {{ item.name }}
                    <UBadge
                      v-if="item.id === group?.id"
                      color="primary"
                      variant="subtle"
                      size="xs"
                    >
                      المعروضة
                    </UBadge>
                  </span>
                  <span class="mt-0.5 block text-[11px] text-gray-500">
                    {{ groupStageLabel(item) }}
                    <template v-if="groupPlaceLabel(item)">
                      · {{ groupPlaceLabel(item) }}
                    </template>
                  </span>
                </span>
              </button>
              <p v-if="!groups.length" class="px-2 py-3 text-xs text-gray-500">
                لا توجد مجموعات محملة
              </p>
            </div>
          </div>
        </section>

        <section
          class="rounded-2xl border border-primary/20 bg-linear-to-b from-primary/10 to-transparent p-4 dark:from-primary/15"
        >
          <div class="mb-3 flex items-center justify-between gap-2">
            <p class="text-xs font-semibold text-gray-600 dark:text-gray-300">
              معاينة كما يراها اللاعب
            </p>
            <span class="text-[11px] text-gray-400">أسماء تجريبية للعرض فقط</span>
          </div>
          <div
            class="mx-auto max-w-sm rounded-2xl border border-gray-200/90 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-950"
          >
            <div class="flex items-start gap-3">
              <div
                class="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10"
              >
                <img
                  v-if="formState.isPopup && imageUrl"
                  :src="imageUrl"
                  alt=""
                  class="size-10 object-cover"
                />
                <UIcon
                  v-else
                  name="i-heroicons-bell"
                  class="size-5 text-primary"
                />
              </div>
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-bold text-gray-900 dark:text-white">
                  {{ previewTitle || "العنوان" }}
                </p>
                <p class="mt-1 line-clamp-4 text-xs leading-5 text-gray-600 dark:text-gray-300">
                  {{ previewDescription || "نص الإشعار" }}
                </p>
                <p class="mt-2 text-[11px] text-primary">
                  {{ actionPreviewLabel }}
                </p>
              </div>
            </div>
          </div>
        </section>

        <UForm
          ref="form"
          :schema="schema"
          :state="formState"
          class="flex flex-col gap-5"
        >
          <section class="space-y-3">
            <div>
              <h3 class="text-sm font-bold text-gray-900 dark:text-white">
                اختر قالباً ثم عدّل النص
              </h3>
              <p class="mt-0.5 text-xs text-gray-500">
                القيم بين أقواس مثل اسم اللاعب تُعبَّأ تلقائياً لكل مستلم
              </p>
            </div>
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                v-for="item in GROUP_NOTIFICATION_TEMPLATES"
                :key="item.id"
                type="button"
                class="rounded-2xl border px-3 py-3 text-start transition"
                :class="
                  selectedTemplateId === item.id
                    ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                    : 'border-gray-200/90 bg-white/70 hover:border-primary/40 dark:border-gray-800 dark:bg-gray-900/40'
                "
                @click="applyTemplate(item.id)"
              >
                <UIcon
                  :name="item.icon"
                  class="mb-2 size-5"
                  :class="
                    selectedTemplateId === item.id
                      ? 'text-primary'
                      : 'text-gray-400'
                  "
                />
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ item.label }}
                </p>
                <p class="mt-0.5 text-[11px] text-gray-500">{{ item.hint }}</p>
              </button>
            </div>
          </section>

          <section
            class="space-y-4 rounded-2xl border border-gray-200/90 bg-white/70 p-4 dark:border-gray-800 dark:bg-gray-900/35"
          >
            <UFormField name="title" required>
              <template #label>
                <span class="flex w-full items-center justify-between gap-2">
                  <span>العنوان</span>
                  <span
                    class="text-[11px] font-normal"
                    :class="titleCountClass"
                  >
                    {{ formState.title.length }}/255
                  </span>
                </span>
              </template>
              <UInput
                v-model="formState.title"
                maxlength="255"
                placeholder="عنوان يصل لكل لاعب"
                :ui="{
                  base:
                    activeField === 'title'
                      ? 'ring-2 ring-primary/40'
                      : undefined,
                }"
                @focus="activeField = 'title'"
                @click="captureCaret($event, 'title')"
                @keyup="captureCaret($event, 'title')"
              />
            </UFormField>

            <UFormField name="description" required>
              <template #label>
                <span class="flex w-full items-center justify-between gap-2">
                  <span>نص الإشعار</span>
                  <span
                    class="text-[11px] font-normal"
                    :class="descriptionCountClass"
                  >
                    {{ formState.description.length }}/512
                  </span>
                </span>
              </template>
              <UTextarea
                v-model="formState.description"
                :rows="5"
                maxlength="512"
                placeholder="اكتب الرسالة. اضغط على حقل ثم أضف متغيراً من الأسفل"
                :ui="{
                  base:
                    activeField === 'description'
                      ? 'ring-2 ring-primary/40'
                      : undefined,
                }"
                @focus="activeField = 'description'"
                @click="captureCaret($event, 'description')"
                @keyup="captureCaret($event, 'description')"
              />
            </UFormField>

            <div class="space-y-2">
              <p class="text-xs font-semibold text-gray-600 dark:text-gray-300">
                إضافة للمتغير في
                <span class="text-primary">
                  {{ activeField === "title" ? "العنوان" : "النص" }}
                </span>
              </p>
              <div
                v-for="group in PLACEHOLDER_GROUPS"
                :key="group"
                class="flex flex-wrap items-center gap-1.5"
              >
                <span class="w-12 shrink-0 text-[11px] text-gray-400">
                  {{ group }}
                </span>
                <UButton
                  v-for="item in placeholdersByGroup(group)"
                  :key="item.key"
                  size="xs"
                  color="neutral"
                  variant="soft"
                  :label="item.label"
                  @click="insertPlaceholder(item.key)"
                />
              </div>
            </div>
          </section>

          <section
            class="rounded-2xl border border-gray-200/90 bg-white/70 dark:border-gray-800 dark:bg-gray-900/35"
          >
            <button
              type="button"
              class="flex w-full items-center justify-between gap-2 px-4 py-3 text-start"
              @click="showAdvanced = !showAdvanced"
            >
              <span>
                <span class="text-sm font-bold text-gray-900 dark:text-white">
                  عند الضغط على الإشعار
                </span>
                <span class="mt-0.5 block text-xs text-gray-500">
                  {{ actionSummary }}
                </span>
              </span>
              <UIcon
                name="i-heroicons-chevron-down"
                class="size-4 text-gray-400 transition"
                :class="{ 'rotate-180': showAdvanced }"
              />
            </button>

            <div v-if="showAdvanced" class="space-y-4 border-t border-gray-200/80 px-4 py-4 dark:border-gray-800">
              <UFormField>
                <UCheckbox
                  v-model="formState.isPopup"
                  label="إشعار منبثق مع صورة"
                />
              </UFormField>

              <UFormField
                v-if="formState.isPopup"
                label="صورة الإشعار المنبثق"
                name="popUpImage"
                required
              >
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
                      <img
                        :src="imageUrl"
                        class="h-full w-full object-cover"
                        alt="صورة الإشعار"
                      />
                      <div
                        class="absolute inset-0 z-10 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100"
                      >
                        <UButton
                          color="error"
                          variant="solid"
                          size="xs"
                          @click.stop="removeImage"
                        >
                          <UIcon name="i-heroicons-trash" class="h-4 w-4" />
                        </UButton>
                        <UButton
                          color="primary"
                          variant="solid"
                          size="xs"
                          @click.stop="fileInput?.click()"
                        >
                          <UIcon name="i-heroicons-pencil" class="h-4 w-4" />
                        </UButton>
                      </div>
                    </template>
                  </div>
                  <p class="text-xs text-gray-500">PNG أو JPG أو WEBP</p>
                </div>
              </UFormField>

              <UFormField label="الإجراء" name="actionKind" required>
                <USelect
                  v-model="formState.actionKind"
                  :items="actionKindItems"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                v-if="
                  formState.actionKind !==
                  GROUP_NOTIFICATION_ACTION_KIND.NoAction
                "
                :label="actionPathFieldLabel"
                name="actionPath"
                required
              >
                <UInput
                  v-if="
                    formState.actionKind ===
                    GROUP_NOTIFICATION_ACTION_KIND.GoToURL
                  "
                  v-model="formState.actionPath"
                  dir="ltr"
                  placeholder="https://..."
                />
                <USelect
                  v-else
                  v-model="formState.actionPath"
                  :items="pathOptions"
                  class="w-full"
                  placeholder="اختر الوجهة"
                />
              </UFormField>
            </div>
          </section>
        </UForm>
      </div>
    </template>

    <template #footer>
      <div class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <UButton
          color="neutral"
          variant="soft"
          label="إلغاء"
          class="min-h-10"
          :disabled="isPending"
          @click="open = false"
        />
        <UButton
          color="primary"
          icon="i-heroicons-paper-airplane"
          :label="sendButtonLabel"
          class="min-h-10"
          :loading="isPending"
          :disabled="isPending || !canSubmit"
          @click="handleSubmit"
        />
      </div>
    </template>
  </UDrawer>
</template>

<script lang="ts" setup>
import { mixed, object, string } from "yup";
import {
  actionPathLabel,
  notificationScreenOptions,
  notificationTabOptions,
} from "~/components/Notification/notificationTargets";
import {
  GROUP_NOTIFICATION_ACTION_KIND,
  GROUP_NOTIFICATION_PLACEHOLDERS,
  GROUP_NOTIFICATION_TEMPLATES,
  PLACEHOLDER_GROUPS,
  TOURNAMENT_GROUP_SCREEN_PATH,
  fillNotificationPreview,
  resolveGroupNotificationActionType,
  type GroupNotificationActionKind,
  type GroupNotificationTemplateId,
} from "~/features/tournament/bracket/constants/groupNotification";
import { useSendTournamentGroupNotification } from "~/features/tournament/bracket/composables/useSendTournamentGroupNotification";
import { useTournamentPlaces } from "~/features/tournament/composables/useTournamentPlaces";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";
import type { Group } from "~/features/tournament/models/group";

const props = defineProps<{
  tournamentId: string;
  group: Group | null;
  groups?: Group[];
}>();

const open = ref(false);
const toast = useToast();
const form = useTemplateRef("form");
const fileInput = ref<HTMLInputElement>();
const imageUrl = ref("");
const activeField = ref<"title" | "description">("description");
const titleCaret = ref(0);
const descriptionCaret = ref(0);
const selectedTemplateId = ref<GroupNotificationTemplateId>("upcomingMatch");
const showAdvanced = ref(false);
const targetMode = ref<"all" | "selected">("selected");
const selectedGroupIds = ref<string[]>([]);
const sendReq = useSendTournamentGroupNotification();
const isPending = computed(() => sendReq.pending.value);

const tourReq = await useSingleTournament().getSingelTournament(
  props.tournamentId,
);
const { placeLabel: resolvePlaceLabel } = useTournamentPlaces(
  () => tourReq.data.value?.tournament,
);

const tournamentTitle = computed(
  () => tourReq.data.value?.tournament?.title ?? "",
);
const groups = computed(() => props.groups ?? []);

function groupStageLabel(item: Group) {
  return item.stageType === "Final" || item.type === "Final" ? "نهائي" : "تصفيات";
}

function groupPlaceLabel(item: Group | null | undefined) {
  if (!item) return "";
  const label = resolvePlaceLabel(item.placeId);
  if (!label || label === "أي مكان") return "";
  return label;
}

const audienceFooter = computed(() =>
  targetMode.value === "all"
    ? "كل مجموعات المرحلة الحالية"
    : selectedGroupIds.value.length
      ? `${selectedGroupIds.value.length} مجموعة`
      : "لا توجد مجموعات محددة",
);

const sendButtonLabel = computed(() =>
  targetMode.value === "all"
    ? "إرسال لكل اللاعبين"
    : `إرسال إلى ${selectedGroupIds.value.length} مجموعة`,
);

const actionKindItems = [
  { value: GROUP_NOTIFICATION_ACTION_KIND.NoAction, label: "إشعار فقط" },
  { value: GROUP_NOTIFICATION_ACTION_KIND.GoToURL, label: "فتح رابط" },
  {
    value: GROUP_NOTIFICATION_ACTION_KIND.GoToScreen,
    label: "فتح شاشة في التطبيق",
  },
  {
    value: GROUP_NOTIFICATION_ACTION_KIND.GoToTab,
    label: "فتح تبويب في التطبيق",
  },
];

const formState = reactive({
  title: GROUP_NOTIFICATION_TEMPLATES[0]!.title,
  description: GROUP_NOTIFICATION_TEMPLATES[0]!.description,
  isPopup: false,
  actionKind:
    GROUP_NOTIFICATION_ACTION_KIND.GoToScreen as GroupNotificationActionKind,
  actionPath: TOURNAMENT_GROUP_SCREEN_PATH,
  popUpImage: null as File | null,
});

const screenPathOptions = [
  { label: "صفحة البطولة", value: TOURNAMENT_GROUP_SCREEN_PATH },
  ...notificationScreenOptions,
];

const pathOptions = computed(() =>
  formState.actionKind === GROUP_NOTIFICATION_ACTION_KIND.GoToScreen
    ? screenPathOptions
    : notificationTabOptions,
);

const actionPathFieldLabel = computed(() =>
  actionPathLabel(formState.actionKind),
);

const previewSamples = computed<Record<string, string>>(() => ({
  TournamentTitle: tournamentTitle.value || "اسم البطولة",
  GroupName: props.group?.name || "المجموعة",
  PlayerName: "أحمد",
  TeamName: "فريق النور",
  OpponentTeamName: "فريق الأمل",
  MatchDate: "07/09/2026",
  MatchTime: "21:30",
  TableName: "طاولة 3",
  LocationDescription:
    groupPlaceLabel(props.group ?? groups.value[0]) || "قاعة البطولة",
  RoundName: "دور الـ 16",
}));

const previewTitle = computed(() =>
  fillNotificationPreview(formState.title, previewSamples.value),
);
const previewDescription = computed(() =>
  fillNotificationPreview(formState.description, previewSamples.value),
);

const actionPreviewLabel = computed(() => {
  if (formState.actionKind === GROUP_NOTIFICATION_ACTION_KIND.NoAction) {
    return formState.isPopup ? "منبثق بدون انتقال" : "إشعار فقط";
  }
  if (formState.actionKind === GROUP_NOTIFICATION_ACTION_KIND.GoToURL) {
    return "يفتح رابطاً";
  }
  if (formState.actionKind === GROUP_NOTIFICATION_ACTION_KIND.GoToTab) {
    return "يفتح تبويباً في التطبيق";
  }
  return "يفتح صفحة البطولة";
});

const actionSummary = computed(() => {
  const popup = formState.isPopup ? "منبثق + " : "";
  return `${popup}${actionPreviewLabel.value}`;
});

const titleCountClass = computed(() =>
  formState.title.length < 5 || formState.title.length > 255
    ? "text-error-500"
    : "text-gray-400",
);
const descriptionCountClass = computed(() =>
  formState.description.length < 5 || formState.description.length > 512
    ? "text-error-500"
    : "text-gray-400",
);

const canSubmit = computed(() => {
  if (formState.title.trim().length < 5) return false;
  if (formState.description.trim().length < 5) return false;
  if (formState.isPopup && !(formState.popUpImage instanceof File)) return false;
  if (
    formState.actionKind === GROUP_NOTIFICATION_ACTION_KIND.GoToURL &&
    !formState.actionPath
  ) {
    return false;
  }
  if (targetMode.value === "selected" && selectedGroupIds.value.length === 0) {
    return false;
  }
  return true;
});

const schema = computed(() =>
  object({
    title: string()
      .required("العنوان مطلوب")
      .min(5, "العنوان يجب أن يكون 5 أحرف على الأقل")
      .max(255, "العنوان طويل جداً"),
    description: string()
      .required("النص مطلوب")
      .min(5, "النص يجب أن يكون 5 أحرف على الأقل")
      .max(512, "النص طويل جداً"),
    actionKind: string().required("النوع مطلوب"),
    actionPath:
      formState.actionKind === GROUP_NOTIFICATION_ACTION_KIND.NoAction
        ? string()
        : formState.actionKind === GROUP_NOTIFICATION_ACTION_KIND.GoToURL
          ? string().url("أدخل رابطاً صحيحاً").required("الرابط مطلوب")
          : string().required("الوجهة مطلوبة"),
    popUpImage: formState.isPopup
      ? mixed().required("صورة الإشعار المنبثق مطلوبة")
      : mixed().nullable(),
  }),
);

watch(
  () => formState.actionKind,
  (kind) => {
    if (kind === GROUP_NOTIFICATION_ACTION_KIND.NoAction) {
      formState.actionPath = TOURNAMENT_GROUP_SCREEN_PATH;
    } else if (kind === GROUP_NOTIFICATION_ACTION_KIND.GoToScreen) {
      formState.actionPath = TOURNAMENT_GROUP_SCREEN_PATH;
    } else if (kind === GROUP_NOTIFICATION_ACTION_KIND.GoToTab) {
      formState.actionPath = "tournaments";
    } else {
      formState.actionPath = "";
    }
  },
);

watch(
  () => formState.isPopup,
  (isPopup) => {
    if (isPopup) showAdvanced.value = true;
  },
);

watch(open, (isOpen) => {
  if (!isOpen) return;
  applyTemplate("upcomingMatch");
  formState.isPopup = false;
  formState.actionKind = GROUP_NOTIFICATION_ACTION_KIND.GoToScreen;
  formState.actionPath = TOURNAMENT_GROUP_SCREEN_PATH;
  showAdvanced.value = false;
  activeField.value = "description";
  targetMode.value = "selected";
  selectedGroupIds.value = props.group?.id ? [props.group.id] : [];
  removeImage();
});

function selectAllGroups() {
  selectedGroupIds.value = groups.value.map((item) => item.id);
}

function useSelectedGroups() {
  targetMode.value = "selected";
  if (!selectedGroupIds.value.length && props.group?.id) {
    selectedGroupIds.value = [props.group.id];
  }
}

function toggleGroup(id: string, checked: boolean) {
  if (checked) {
    if (!selectedGroupIds.value.includes(id)) {
      selectedGroupIds.value = [...selectedGroupIds.value, id];
    }
    return;
  }
  selectedGroupIds.value = selectedGroupIds.value.filter((item) => item !== id);
}

function placeholdersByGroup(group: string) {
  return GROUP_NOTIFICATION_PLACEHOLDERS.filter((item) => item.group === group);
}

function applyTemplate(id: GroupNotificationTemplateId) {
  const template = GROUP_NOTIFICATION_TEMPLATES.find((item) => item.id === id);
  if (!template) return;
  selectedTemplateId.value = id;
  formState.title = template.title;
  formState.description = template.description;
  titleCaret.value = formState.title.length;
  descriptionCaret.value = formState.description.length;
}

function nativeInputFromEvent(event: Event): HTMLInputElement | HTMLTextAreaElement | null {
  const target = event.target;
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement
  ) {
    return target;
  }
  if (target instanceof HTMLElement) {
    const nested = target.querySelector("input, textarea");
    if (
      nested instanceof HTMLInputElement ||
      nested instanceof HTMLTextAreaElement
    ) {
      return nested;
    }
  }
  return null;
}

function captureCaret(
  event: Event,
  field: "title" | "description",
) {
  activeField.value = field;
  const el = nativeInputFromEvent(event);
  const pos = el?.selectionStart ?? (field === "title"
    ? formState.title.length
    : formState.description.length);
  if (field === "title") titleCaret.value = pos;
  else descriptionCaret.value = pos;
}

function insertAt(text: string, index: number, token: string) {
  const safeIndex = Math.min(Math.max(index, 0), text.length);
  return {
    next: `${text.slice(0, safeIndex)}${token}${text.slice(safeIndex)}`,
    caret: safeIndex + token.length,
  };
}

function insertPlaceholder(key: string) {
  const token = `{${key}}`;
  if (activeField.value === "title") {
    const { next, caret } = insertAt(
      formState.title,
      titleCaret.value,
      token,
    );
    formState.title = next.slice(0, 255);
    titleCaret.value = Math.min(caret, formState.title.length);
    return;
  }
  const { next, caret } = insertAt(
    formState.description,
    descriptionCaret.value,
    token,
  );
  formState.description = next.slice(0, 512);
  descriptionCaret.value = Math.min(caret, formState.description.length);
}

function onImageChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  formState.popUpImage = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    imageUrl.value = String(e.target?.result ?? "");
  };
  reader.readAsDataURL(file);
  if (fileInput.value) fileInput.value.value = "";
}

function removeImage() {
  formState.popUpImage = null;
  imageUrl.value = "";
  if (fileInput.value) fileInput.value.value = "";
}

async function handleSubmit() {
  try {
    await form.value?.validate();
  } catch {
    toast.add({
      title: "تحقق من البيانات",
      description: "أكمل العنوان والنص قبل الإرسال",
      color: "error",
    });
    return;
  }

  if (targetMode.value === "selected" && selectedGroupIds.value.length === 0) {
    toast.add({
      title: "اختر مجموعة واحدة على الأقل",
      color: "error",
    });
    return;
  }

  const actionType = resolveGroupNotificationActionType(
    formState.isPopup,
    formState.actionKind,
  );
  const actionPath =
    formState.actionKind === GROUP_NOTIFICATION_ACTION_KIND.NoAction
      ? TOURNAMENT_GROUP_SCREEN_PATH
      : formState.actionPath;

  await sendReq.fetchREQ(props.tournamentId, {
    title: formState.title,
    description: formState.description,
    actionPath,
    actionType,
    targetedGroupIds:
      targetMode.value === "selected" ? selectedGroupIds.value : undefined,
    popUpImage: formState.isPopup ? formState.popUpImage : null,
  });

  if (sendReq.status.value === "success") {
    const count = sendReq.recipientCount.value ?? 0;
    toast.add({
      title: count === 0 ? "لا يوجد مستلمون" : "تم إرسال الإشعار",
      description:
        count === 0
          ? "لا توجد فرق ظاهرة أو لاعبون مسجّلون في المجموعات المستهدفة"
          : `تم الإرسال إلى ${count} لاعب`,
      color: count === 0 ? "warning" : "success",
    });
    open.value = false;
    return;
  }

  toast.add({
    title: "تعذر إرسال الإشعار",
    description: sendReq.error.value?.message ?? "حاول مرة أخرى",
    color: "error",
  });
}

defineExpose({ open });
</script>
