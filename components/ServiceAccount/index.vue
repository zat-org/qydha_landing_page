<template>
  <UCard >

    <UTable :data="serviceAccounts" :columns="cols" >
      <template #actions-cell="{ row }">
        <UButtonGroup>
          <UButton icon="material-symbols:info" color="success" @click="openInfo(row.original)" />
          <UButton icon="material-symbols:edit" color="warning" @click="updateAccout(row.original)" />
          <UButton icon="material-symbols:delete" color="error" @click="delteAccount(row.original)" />

        </UButtonGroup>
      </template>
    </UTable>
    <UPagination v-model="page" :page-count="10" :total="items" class="mx-auto mt-auto" />
    <!-- add pagination  -->
    <template #footer>
      <div class="flex items-center">
        <UButton label="add" color="success" @click="onAdd" />
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

const overlay = useOverlay()

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
  { header: 'الاسم', accessorKey: 'name' },
  { header: 'الوصف', accessorKey: 'description' },
  { header: '#', accessorKey: 'actions' },

  // {label:'الاذونات',key:'permissions'},
]

const openInfo = (row: IServiceAccount) => {
  overlay.create(InfoModal, {
    props: {
      serviceAccount: row
    }
  }).open()
}
const deletREQ = await useServiceAccount().deleteServiceAccount()
const delteAccount = (row: IServiceAccount) => {
  overlay.create(ConfirmationModal, {
    props: {
      message: 'you want to delete that Access Acount ? ',
      onSuccess: async () => {
        await deletREQ.fetchREQ(row.id)
        if (deletREQ.status.value == 'success') {
          refreshNuxtData('getServiceAccounts')
        }
      }
    },
  }).open()
}
const onAdd = () => {
  overlay.create(AddModal).open()
}

const updateAccout = (row: IServiceAccount) => {
  overlay.create(UpdateModal, {
    props: {
      serviceAccount: row
    }
  }).open()
}
</script>

<style></style>