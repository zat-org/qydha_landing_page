<template>
  <TournamentPhaseContent
    :alert="{
      color: 'warning',
      title: 'حالة غير معروفة أو محدثة',
      description:
        'تأكد من تحديث الصفحة. يمكنك متابعة إدارة البطولة من الروابط أدناه.',
    }"
  >
    <UButton
      :to="links.team.value"
      label="الفرق واللاعبين"
      icon="i-mdi-account-group"
      size="lg"
      variant="soft"
      class="w-full min-h-12 justify-center sm:flex-1"
      block
    />
    <UButton
      :to="links.group.value"
      label="المجموعات"
      icon="i-mdi-user-group"
      size="lg"
      variant="soft"
      class="w-full min-h-12 justify-center sm:flex-1"
      block
    />
  </TournamentPhaseContent>
</template>

<script lang="ts" setup>
import TournamentPhaseContent from "./TournamentPhaseContent.vue";
import type { TournamentPhaseContext } from "./types";
import { useTournamentPhaseLinks } from "./useTournamentPhaseLinks";

const props = defineProps<{ context: TournamentPhaseContext }>();
const links = useTournamentPhaseLinks(() => props.context.tournamentId);
</script>
