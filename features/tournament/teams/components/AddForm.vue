<template>
  <UCard :ui="{ root: 'w-full space-y-2 p-1' }">
    <UForm
      :state="state"
      :schema="schema"
      ref="teamForm"
      @submit="onSubmit"
      @keydown.enter.prevent="teamForm?.submit()"
    >
      <!-- Place Selector -->
      <UFormField name="placeId" label="المكان المخصص للفريق" required class="mb-3">
        <USelect
          v-model="state.placeId"
          :items="placeOptions"
          value-key="value"
          label-key="label"
          placeholder="اختر المكان..."
          class="w-full"
          :disabled="pending || placeOptions.length === 1"
        />
      </UFormField>

      <div v-if="state.players.length > 0" class="space-y-2 mt-1">
        <UFormField name="players" label="اللاعبين (لاعبين اثنين فقط)">
          <div class="space-y-2">
            <div
              v-for="(player, index) in state.players"
              :key="index"
              class="relative"
            >
              <UCard :ui="{ root: 'p-1', body: 'p-1', header: 'p-1' }">
                <template #header>
                  <div class="flex items-center justify-between">
                    <h4 class="font-medium">لاعب {{ index + 1 }}</h4>
                  </div>
                </template>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-1">
                  <UFormField
                    label="اسم اللاعب"
                    :name="`players.${index}.name`"
                    :required="true"
                  >
                    <UInput v-model="player.name" :disabled="pending" />
                  </UFormField>
                  <UFormField
                    label="البريد الإلكتروني"
                    :name="`players.${index}.email`"
                  >
                    <UInput
                      v-model="player.email"
                      type="email"
                      :disabled="pending"
                    />
                  </UFormField>
                  <UFormField
                    label="رقم الهاتف"
                    :name="`players.${index}.phone`"
                  >
                    <AsyncPhoneInput
                      v-model="player.phone"
                      :disabled="pending"
                      dir="ltr"
                    />
                  </UFormField>
                  <UFormField
                    label="اسم المستخدم على قيدها"
                    :name="`players.${index}.qydhaUsername`"
                    hint="اختياري"
                  >
                    <UInput
                      v-model="player.qydhaUsername"
                      :disabled="pending"
                    />
                  </UFormField>
                </div>
              </UCard>
            </div>
          </div>
        </UFormField>
      </div>

      <UFormField name="name" label="اسم الفريق" class="mt-1" required>
        <UInput v-model="state.name" :disabled="pending" class="w-full" />
      </UFormField>
    </UForm>

    <template #footer>
      <div class="flex justify-between">
        <UButton
          label="إضافة الفريق"
          color="primary"
          :loading="pending"
          :disabled="pending"
          @click="teamForm?.submit()"
        />
        <UButton
          label="إلغاء"
          color="error"
          variant="ghost"
          :disabled="pending"
          @click="emit('close')"
        />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { array, object, string } from "yup";
import type { ITeamCreate } from "~/features/tournament/models/tournamentTeam";
import { TournamentDetailedState } from "~/features/tournament/models/tournament";
import { useTourrnamentTeam } from "~/features/tournament/teams/composables/tourrnamentTeam";
import { useTournamentPlacesApi } from "~/features/tournament/places/composables/useTournamentPlacesApi";
import { useSingleTournament } from "~/features/tournament/detail/composables/api/useSingleTournament";

const teamForm = useTemplateRef("teamForm");
const route = useRoute();
const tour_id = route.params.id.toString();
const emit = defineEmits(["close"]);
const toast = useToast();

const tourReq = await useSingleTournament().getSingelTournament(tour_id);
const placesReq = useTournamentPlacesApi().getPlaces(tour_id);

const availablePlaces = computed(() => {
  const list = placesReq.data.value ?? [];
  const detailedState = tourReq.data.value?.tournament?.detailedState;

  if (detailedState === TournamentDetailedState.ManagingFinalStageQualifiedTeams) {
    return list.filter((p) => p.stageType === "Final");
  }

  // During ManagingTeams: prefer Qualification places if exist, otherwise Final
  const qualPlaces = list.filter((p) => p.stageType === "Qualification");
  if (qualPlaces.length > 0) {
    return qualPlaces;
  }
  return list.filter((p) => p.stageType === "Final");
});

const placeOptions = computed(() => {
  return availablePlaces.value.map((p) => ({
    label: p.locationDescription
      ? `${p.locationDescription} (${p.stageType === "Final" ? "النهائي" : "تصفيات"})`
      : p.stageType === "Final"
        ? "مكان النهائي"
        : "مكان التصفيات",
    value: p.id,
  }));
});

const state = reactive<ITeamCreate>({
  name: "",
  placeId: "",
  additionalData: {},
  players: [
    { name: "", phone: null, email: null, qydhaUsername: null, additionalData: {} },
    { name: "", phone: null, email: null, qydhaUsername: null, additionalData: {} },
  ],
});

// Auto-select first place if available
watchEffect(() => {
  if (!state.placeId && availablePlaces.value.length > 0) {
    state.placeId = availablePlaces.value[0]?.id ?? "";
  }
});

const schema = object({
  placeId: string().required("برجاء اختيار المكان المخصص للفريق"),
  name: string()
    .required("برجاء ادخال اسم الفريق")
    .min(4, "يجب ان يكون اسم الفريق 4 أحرف على الأقل"),
  players: array()
    .of(
      object({
        name: string()
          .required("برجاء ادخال اسم اللاعب")
          .min(4, "يجب ان يكون اسم اللاعب 4 أحرف على الأقل"),
        phone: string().nullable(),
        email: string().nullable(),
        qydhaUsername: string().nullable(),
      }),
    )
    .min(2, "يجب أن يتكون الفريق من لاعبين اثنين")
    .max(2, "يجب أن يتكون الفريق من لاعبين اثنين فقط"),
});

watch(
  () => state.players.map((p) => p.name),
  (newNames) => {
    const processedNames = newNames
      .map((name) => {
        if (!name) return "";
        const words = name
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);
        if (words.length >= 3) return `${words[0]} ${words[words.length - 1]}`;
        return name.trim();
      })
      .filter((name) => name.length > 0);
    state.name = processedNames.join(" | ");
  },
);

const addTeamREQ = await useTourrnamentTeam().addTourTeam();
const pending = computed(() => addTeamREQ.status.value === "pending");

const onSubmit = async () => {
  const payload: ITeamCreate = {
    name: state.name.trim(),
    placeId: state.placeId,
    additionalData: {},
    players: state.players.map((p) => ({
      name: p.name.trim(),
      phone: p.phone || null,
      email: p.email || null,
      qydhaUsername: p.qydhaUsername || null,
      additionalData: {},
    })),
  };

  await addTeamREQ.fetchREQ(tour_id, payload);
  if (addTeamREQ.status.value === "success") {
    Object.assign(state, {
      name: "",
      placeId: availablePlaces.value[0]?.id ?? "",
      additionalData: {},
      players: [
        { name: "", phone: null, email: null, qydhaUsername: null, additionalData: {} },
        { name: "", phone: null, email: null, qydhaUsername: null, additionalData: {} },
      ],
    });
    toast.add({ title: "تم اضافة الفريق بنجاح", color: "success" });
  } else {
    const err = addTeamREQ.error.value as { message?: string } | null;
    toast.add({
      title: "تعذّر إضافة الفريق",
      description: err?.message,
      color: "error",
    });
  }
};
</script>
