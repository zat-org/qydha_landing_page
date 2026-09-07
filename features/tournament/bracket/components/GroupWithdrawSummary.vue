<template>
  <div
    class="inline-flex flex-wrap items-center gap-1.5 rounded-lg border border-error/20 bg-error/5 px-2 py-1"
    title="انسحابات هذه المجموعة"
  >
    <span class="text-[11px] font-semibold text-error/90">انسحاب</span>
    <UBadge color="neutral" variant="subtle" size="xs" class="rounded-full font-medium">
      انضمام {{ counts.joinRequest }}
    </UBadge>
    <UBadge color="warning" variant="subtle" size="xs" class="rounded-full font-medium">
      لم يحضر {{ counts.notAttend }}
    </UBadge>
    <UBadge color="error" variant="soft" size="xs" class="rounded-full font-semibold">
      الكل {{ counts.total }}
    </UBadge>
  </div>
</template>

<script lang="ts" setup>
import type { GroupWithdrawCounts } from "~/features/tournament/match/utils/matchWithdraw.utils";

defineProps<{
  counts: GroupWithdrawCounts;
}>();
</script>
