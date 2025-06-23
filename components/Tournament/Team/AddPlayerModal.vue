<template>
  <UModal prevent-close>
    <UCard>
      <template #header>
        Join Player
      </template>
      <UForm :schema="schema" :state="state" ref="AddPlayerForm" @submit="onSubmit">

        <UFormGroup name="playerId">
          <USelectMenu v-model="state.playerId" :options="players" value-attribute="id" option-attribute="name" />
        </UFormGroup>
      </UForm>
      <template #footer>
        <div class="flex justify-between items-center ">
          <UButton label="add" @click="AddPlayerForm?.submit()"> </UButton>
          <UButton label="close" color="red" @click="modal.close()"> </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string } from 'yup'

const AddPlayerForm = ref()
const modal = useModal()
const route = useRoute()
const tour_id = route.params.id.toString()
const props = defineProps<{ team_id: string }>()

const getAllPlayers = await useTournamentPlayer().getPlayer()
await getAllPlayers.fetchREQ(tour_id, false)
const players = computed(() => {
  return getAllPlayers.data.value?.data.items
})
const state = reactive({ playerId: "" })
const schema = object({ playerId: string().required() })

const addREQ = await useTourrnamentTeam().addPlayerToTeam()
const onSubmit = async () => {
  await addREQ.fetchREQ(tour_id, props.team_id, state.playerId)
  if (addREQ.status.value == "success") {
    modal.close()
  }
}
</script>

<style></style>