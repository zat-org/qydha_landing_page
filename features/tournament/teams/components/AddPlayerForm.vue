<template>
  <UCard :ui="{ root: 'w-full space-y-2 p-1' }">
    <UForm :schema="schema" :state="state" ref="addPlayerForm" @submit="onSubmit">
      <UFormField name="playerId" label="اختر لاعب">
        <USelectMenu v-model="state.playerId" v-model:search-term="searchTerm" :items="players" value-key="id" label-key="name" :loading="getAllPlayers.pending.value" placeholder="اختر لاعب من القائمة" searchable />
      </UFormField>
    </UForm>
    <template #footer>
      <div class="flex justify-between">
        <UButton label="إضافة" color="primary" :loading="pending" :disabled="pending" @click="addPlayerForm?.submit()" />
        <UButton label="إلغاء" color="error" variant="ghost" :disabled="pending" @click="emit('close')" />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { object, string } from 'yup'
import { refDebounced } from '@vueuse/core'
const addPlayerForm = ref()
const emit = defineEmits(['close'])
const route = useRoute()
const tour_id = route.params.id.toString()
const props = defineProps<{ teamId: string }>()
const getAllPlayers = await useTournamentPlayer().getPlayer()
await getAllPlayers.fetchREQ(tour_id, false, 1, "")
const players = computed(() => getAllPlayers.data.value?.data.items)
const searchTerm = ref("")
const searchTermDebounced = refDebounced(searchTerm, 500)
watch(searchTermDebounced, async (newSearchTerm) => { await getAllPlayers.fetchREQ(tour_id, false, 1, newSearchTerm || "") })
const state = reactive({ playerId: "" })
const schema = object({ playerId: string().required("برجاء اختيار لاعب") })
const addREQ = await useTourrnamentTeam().addPlayerToTeam()
const pending = computed(() => addREQ.status.value === "pending")
const onSubmit = async () => { await addREQ.fetchREQ(tour_id, props.teamId, state.playerId); if (addREQ.status.value == "success") emit('close') }
</script>
