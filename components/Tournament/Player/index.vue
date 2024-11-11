<template>
    <UCard :ui="{ base: 'flex flex-col h-full ', body: { base: 'grow' } }">
        <template #header>
            players
        </template>
        <UTable :rows="players" :columns="cols" :ui="{ td: { padding: 'p-1' }, th: { padding: 'p-1' } }">
            <template #action-data="{ row }">
                <UButtonGroup>
                    <UButton color="yellow" @click="openUpdateModal(row)">
                        <IconSetting class="text-lg" />
                    </UButton>
                    <UButton color="red" @click="onDeletePlayer(row)">
                        <IconDelete class="text-lg" />
                    </UButton>

                </UButtonGroup>
            </template>
            <template #qydha-data="{ row }">
                <p v-if="row.qydhaUserData">{{ row.qydhaUserData.username }}</p>
            </template>
        </UTable>
        <template #footer>
            <div class="flex justify-between items-center">
                <UButton label="add" @click="openCreateModal" />
                <UButton label="back " color="red" @click="navigateTo('/tournament/' + tour_id)" />

            </div>
        </template>
    </UCard>
</template>

<script lang="ts" setup>
import type { IPlayer } from '~/models/tournamentTeam';
import CreatePlayerModal from './CreatePlayerModal.vue';
import UpdatePlayerModal from './updatePlayerModal.vue';

const route = useRoute()
const modal = useModal()
const toast = useToast()
const tour_id = route.params.id.toString()
const getplayerREQ = await useTournamentPlayer().getPlayer()
await getplayerREQ.fetchREQ(tour_id)
const cols = [
    { key: 'name', label: 'الاسم' },
    { key: 'phone', label: 'الهاتف' },
    { key: 'email', label: 'الميل' },
    { key: 'qydha', label: 'قيدها' },

    { key: 'action', label: '#' },

]

const players = computed(() => getplayerREQ.data.value?.data)
const openCreateModal = () => {
    modal.open(CreatePlayerModal)
}
const deleteREQ = await useTournamentPlayer().deletePlayer()
const onDeletePlayer = async (row: IPlayer) => {
    await deleteREQ.fetchREQ(row.tournamentId, row.id)
    if (deleteREQ.status.value == "success") {
        toast.add({ title: "delete done successfuly" })
    }   
}
const openUpdateModal = (row: IPlayer) => {
    modal.open(UpdatePlayerModal, { player: row })
}
</script>

<style></style>