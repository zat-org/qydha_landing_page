<template>
  <UCard :ui="{ base: 'flex flex-col h-full ', body: { base: 'grow  flex flex-col ' } }">

    <UTable :rows="serviceAccounts" :columns="cols" :ui="{ td: { padding: 'py-1' } }">
      <template #actions-data="{ row }">
        <UButtonGroup>
          <UButton icon="material-symbols:info" color="green" @click="openInfo(row)" />
          <UButton icon="material-symbols:edit" color="yellow" @click="updateAccout(row)" />
          <UButton icon="material-symbols:delete" color="red" @click="delteAccount(row)" />

        </UButtonGroup>
      </template>
    </UTable>
    <UPagination v-model="page" :page-count="10" :total="items" class="mx-auto mt-auto" />
    <!-- add pagination  -->
    <template #footer>
      <div class="flex items-center">
        <UButton label="add" color="green" @click="onAdd" />
      </div>
    </template>


  </UCard>
</template>

<script lang="ts" setup>
import type { IServiceAccount } from '~/models/serviceAccount';
import InfoModal from './InfoModal .vue';
import ConfirmationModal from '../ConfirmationModal.vue';
import AddModal from './AddModal.vue';
import UpdateModal from './updateModal.vue';

const modal = useModal()
const page = ref(0)
const items = ref(0)

const serviceAccountGetREQ = await useServiceAccount().getServiceAccounts()
await serviceAccountGetREQ.fetchREQ()
const serviceAccounts = computed(() => {
  if (serviceAccountGetREQ.data.value)
    return serviceAccountGetREQ.data.value.data.accounts.items
})

if (serviceAccountGetREQ.data.value) {
  page.value = serviceAccountGetREQ.data.value.data.accounts.currentPage
  items.value = serviceAccountGetREQ.data.value.data.accounts.totalCount

}
watch(page, async (newValue, oldValue) => {
  await serviceAccountGetREQ.fetchREQ(newValue)
})
const cols = [
  { label: 'الاسم', key: 'name' },
  { label: 'الوصف', key: 'description' },
  { label: '#', key: 'actions' },

  // {label:'الاذونات',key:'permissions'},
]

const openInfo = (row: IServiceAccount) => {
  modal.open(InfoModal, {
    serviceAccount: row
  })
}
const deletREQ = await useServiceAccount().deleteServiceAccount()
const delteAccount = (row: IServiceAccount) => {
  modal.open(ConfirmationModal, {
    message: 'you want to delete that Access Acount ? ',
    onSuccess: async () => {
      await deletREQ.fetchREQ(row.id)
      if (deletREQ.status.value == 'success') {
        refreshNuxtData('getServiceAccounts')
        modal.close()
      }
    }
  })
}
const onAdd = () => {
  modal.open(AddModal)
}

const updateAccout = (row: IServiceAccount) => {
  modal.open(UpdateModal, { serviceAccount: row })
}
</script>

<style></style>