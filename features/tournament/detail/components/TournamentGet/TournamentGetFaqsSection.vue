<template>
  <UAccordion
    type="multiple"
    dir="rtl"
    :items="accordionItems"
    class="w-full"
    :ui="{
      root: 'space-y-2',
      item: 'rounded-xl border border-gray-200/90 dark:border-gray-700/90 overflow-hidden bg-white dark:bg-gray-900/50',
      trigger: 'px-4 py-3 text-start text-sm font-medium',
      content: 'px-4 pb-3',
    }"
  >
    <template v-for="faq in faqs" :key="faq.id" #[`faq-${faq.id}`]>
      <p
        class="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-gray-200"
      >
        {{ faq.answer }}
      </p>
    </template>
  </UAccordion>
</template>

<script lang="ts" setup>
import type { TournamentFaq } from "~/features/tournament/models/faq";

const props = defineProps<{
  faqs: TournamentFaq[];
}>();

const accordionItems = computed(() =>
  props.faqs.map((faq) => ({
    label: faq.question,
    value: faq.id,
    slot: `faq-${faq.id}`,
  })),
);
</script>
