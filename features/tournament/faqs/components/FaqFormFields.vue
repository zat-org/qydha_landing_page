<template>
  <div class="space-y-4">
    <UFormField name="question" label="السؤال" required>
      <UTextarea
        v-model="model.question"
        class="w-full"
        :rows="3"
        placeholder="اكتب السؤال"
        maxlength="1000"
      />
    </UFormField>
    <UFormField name="answer" label="الإجابة" required>
      <UTextarea
        v-model="model.answer"
        class="w-full"
        :rows="5"
        placeholder="اكتب الإجابة"
        maxlength="4000"
      />
    </UFormField>
    <UFormField name="appearOrder" label="ترتيب الظهور" required>
      <UInput
        v-model.number="model.appearOrder"
        type="number"
        min="0"
        step="1"
        class="w-full"
      />
    </UFormField>
  </div>
</template>

<script lang="ts" setup>
import type { TournamentFaqInput } from "~/features/tournament/models/faq";

const model = defineModel<TournamentFaqInput>({ required: true });
</script>
