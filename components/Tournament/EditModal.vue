<template>
  <UModal prevent-close>
    <UCard :ui="{}">
      <template #header>

      </template>

      <UTabs :items="items" @change="onChange">
        <!-- <template #logo>
          
        </template> -->
        <template #Qydha_Owner>
          <UForm :state="QState" :schema="QSchema" ref="qForm" @submit="onSubmit">
            <UFormGroup name="owner_id" label="المالك">
              <UInputMenu :options="users" :search="search" :loading="allUsersREQ.status.value == 'pending'"
                v-model="QState.owner_id" option-attribute="username" value-attribute="id" />
            </UFormGroup>

            <UFormGroup name="showInQydha" label="قيدها">
              <UToggle v-model="QState.showInQydha" size="xl" />
            </UFormGroup>
          </UForm>
        </template>
      </UTabs>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton label="اغلاق" color="red" @click="modal.close" />
          <UButton label="حفظ" colo="green"  @click="qForm?.submit()"/>

        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string, boolean } from 'yup'
import type { ITournamentDetailed } from '~/models/tournament';
import { Privilege } from '~/models/user';
import { useMyAuthStore } from '~/store/Auth';
const props = defineProps<{ tour: ITournamentDetailed }>()
const modal = useModal()
const select = ref(0)
const qForm =ref<HTMLFormElement>()
const userStore = useMyAuthStore()
const { permissions, privilege } = storeToRefs(userStore)
const items = computed(() => {
  let result: { slot: string, label: string }[] = []
  if (privilege.value == Privilege.Admin) {
    result = [{ slot: "Qydha_Owner", label: "المالك والظهور في قيدها" }, { slot: "Logo", label: "لوجو" }]
  } else if (privilege.value == Privilege.Owner || (privilege.value == Privilege.Moderatore && permissions.value.includes("ModifyTournamentData"))) {
    result = [{ slot: "Logo", label: "لوجو" }]
  }
  return result
})
const QState = reactive<{ owner_id: string, showInQydha: boolean }>({ owner_id: props.tour.owner.id, showInQydha: props.tour.showInQydha })
const QSchema = object({ owner_id: string().required(), showInQydha: boolean().required() })

const LState = reactive<{ image: string | null }>({ image: props.tour.logoUrl })
const LSchema = object({ image: string().nullable() })

function onChange(index: number) {
  select.value = index
}
const route =useRoute()
const tour_id = route.params.id.toString()
const userApi = useUsers()
const allUsersREQ = await userApi.getAllUsers()
await allUsersREQ.fetchREQ("")
const tourApi = useTournament()
const qydhaToggle = await tourApi.updatTourQydhaAndOwner()
const search = async (q: string) => {
  await allUsersREQ.fetchREQ(q)
  return users.value!
}
const users = computed(() => {
  return allUsersREQ.data.value?.data.items
})

const onSubmit =async()=>{
  await qydhaToggle.fetchREQ(QState.showInQydha, QState.owner_id, +tour_id)
  if (qydhaToggle.status.value == "success") {
    refreshNuxtData('getTourById')
    modal.close()
  }
}




</script>

<style></style>