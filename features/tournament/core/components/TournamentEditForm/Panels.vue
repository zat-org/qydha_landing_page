<template>
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
    <TournamentEditRulesForm
      v-show="currentStep === 2"
      v-model="form"
      :errors="errors"
      :on-field-blur="onFieldBlur"
      :disabled-fields="disabledFields"
    />
  </KeepAlive>
</template>

<script lang="ts" setup>
import type { TournamentOwner } from '~/features/tournament/models/tournamentOwner';
import TournamentEditGeneralForm from './General.vue';
import TournamentEditDetailForm from './Detail.vue';
import TournamentEditRulesForm from './Rules.vue';

defineProps<{
  currentStep: number;
  errors?: Record<string, string | undefined>;
  onFieldBlur?: (field: string) => void;
  disabledFields?: Record<string, boolean>;
  initialLogoUrl?: string;
  owner?: TournamentOwner | null;
}>();

const form = defineModel<any>({ required: true });
</script>
