<template>
  <div ref="scrollRoot" class="max-h-[calc(100vh-300px)] min-h-[69vh] overflow-y-auto">
    <div class="h-full">
      <KeepAlive>
        <TournamentEditGeneralForm
          v-show="currentStep === 0"
          v-model="form"
          :errors="errors"
          :on-field-blur="onFieldBlur"
          :disabled-fields="disabledFields"
          :initial-logo-url="initialLogoUrl"
          :owner="owner"
        />
      </KeepAlive>
      <KeepAlive>
        <TournamentEditDetailForm
          v-show="currentStep === 1"
          v-model="form"
          :errors="errors"
          :on-field-blur="onFieldBlur"
          :disabled-fields="disabledFields"
          :tournament-owner="owner ?? null"
        />
      </KeepAlive>
      <KeepAlive>
        <TournamentEditRulesForm v-show="currentStep === 2" v-model="form" :errors="errors" :on-field-blur="onFieldBlur" :disabled-fields="disabledFields" />
      </KeepAlive>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { TournamentOwner } from "~/features/tournament/models/tournamentOwner";
import TournamentEditGeneralForm from "./General.vue";
import TournamentEditDetailForm from "./Detail.vue";
import TournamentEditRulesForm from "./Rules.vue";

const props = defineProps<{
  currentStep: number;
  errors?: Record<string, string | undefined>;
  onFieldBlur?: (field: string) => void;
  disabledFields?: Record<string, boolean>;
  initialLogoUrl?: string;
  owner?: TournamentOwner | null;
}>();

const form = defineModel<any>({ required: true });

const scrollRoot = useTemplateRef<HTMLDivElement>("scrollRoot");

watch(
  () => props.currentStep,
  () => {
    scrollRoot.value?.scrollTo({ top: 0, behavior: "smooth" });
  },
);
</script>
