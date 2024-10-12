<template>
  <UModal class="z-[10]">
    <UCard :ui="{}">
      <template #header>

      </template>
     
      <UTabs :items="items" @change="onChange">
        <template #logo>
          
        </template>
        <template #Qydha_Owner>
          <UForm :state="QState" :schema="QSchema">

          </UForm>
        </template>
      </UTabs>
      <template #footer>

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

const select  =ref(0)
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
const QSchema = object({owner_id: string().required(), showInQydha: boolean().required()})

const LState = reactive<{ image: string | null }>({ image: props.tour.logoUrl })
const LSchema = object({ image: string().nullable() })

function onChange (index:number) {
select.value=index
}


</script>

<style></style>