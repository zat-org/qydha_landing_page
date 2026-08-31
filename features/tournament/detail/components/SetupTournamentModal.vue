<template>
  <UModal
    title="بدء تنظيم مراحل ومجموعات البطولة"
    prevent-close
    description="هل أنت متأكد من بدء تنظيم البطولة؟"
  >
    <template #body>
      <div class="space-y-3">
        <p class="text-sm text-gray-700 dark:text-gray-300">
          سيقوم النظام تلقائياً بتوزيع الفرق وإنشاء المجموعات:
        </p>
        <UAlert
          v-if="hasPlaces"
          color="info"
          variant="soft"
          title="مرحلة التصفيات مفعلة"
          description="تم العثور على أماكن تصفيات. سيتم توزيع الفرق المخصصة لأماكن التصفيات عبر أيام ومجموعات التصفيات تلقائياً."
        />
        <UAlert
          v-else
          color="info"
          variant="soft"
          title="نهائيات مباشرة"
          description="لا توجد أماكن تصفيات. سيتم ربط الفرق المؤهلة بالنهائي مباشرة."
        />
      </div>
    </template>
    <template #footer>
      <div class="flex w-full items-center justify-between">
        <UButton
          label="تأكيد والبدء"
          color="primary"
          size="lg"
          variant="solid"
          @click="confirm"
        />
        <UButton
          label="إلغاء"
          color="neutral"
          size="lg"
          variant="ghost"
          @click="cancel"
        />
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import { useTournamentPlaces } from "~/features/tournament/composables/useTournamentPlaces";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";

const props = defineProps<{
  tournamentId: string;
}>();

const tourREQ = await useSingleTournament().getSingelTournament(
  props.tournamentId,
);
const { hasPlaces } = useTournamentPlaces(() => tourREQ.data.value);

const emit = defineEmits<{
  close: [boolean];
}>();

const cancel = () => {
  emit("close", false);
};

const confirm = () => {
  emit("close", true);
};
</script>
