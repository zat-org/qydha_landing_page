<template>
  <UModal  prevent-close>
    
    
<UButtonGroup>
  <UButton v-for="item in items" :key="item.slot" :label="item.label" @click="select=item.id"></UButton>
</UButtonGroup>
      
        <template v-if="select==0">
          <UForm :state="QState" :schema="QSchema" ref="qForm" @submit="onSubmit">
            <UFormField name="owner_id" label="المالك">
              <UInputMenu :options="users" :search="search" :loading="allUsersREQ.status.value == 'pending'"
                v-model="QState.owner_id" option-attribute="username" value-attribute="id" />
            </UFormField>

            <UFormField name="showInQydha" label="قيدها">
              <UToggle v-model="QState.showInQydha" size="xl" />
            </UFormField>
          </UForm>
        </template>
        <template v-if="select==1">
          <UForm :state="LState" :schema="LSchema" ref="logoForm" @submit="onLogoSubmit">
            <div class="flex flex-col gap-2  justify-center items-center ">
              <UFormField label="image" name="image">
                <UInput v-model="LState.image" accept=".jpeg , .jpg , .png" type="file" @change="changeFile"></UInput>
              </UFormField>

              <img v-if="imageUrl" :src="imageUrl" alt="new Logo image" class="w-[200px] h-[200px]" />
            </div>

          </UForm>
        </template>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton label="اغلاق" color="error" @click="emit('close')" />
          <UButton label="حفظ" color="primary" @click="onClickSave" />

        </div>
      </template>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string, boolean } from 'yup'
import type { ITournament, ITournamentDetailed } from '~/models/tournament';
import { Privilege } from '~/models/user';
import { useMyAuthStore } from '~/store/Auth';
const props = defineProps<{ tour: ITournament }>()
const emit = defineEmits(['close'])
const toast = useToast()
const select = ref(0)
const qForm = ref<HTMLFormElement>()
const logoForm = ref<HTMLFormElement>()
const imageUrl = ref("")
const ImageFile = ref<File>()
const userStore = useMyAuthStore()
const { permissions, privilege } = storeToRefs(userStore)
const items = computed(() => {
  let result: { slot: string, label: string, id: number }[] = []
  if (privilege.value == Privilege.Admin) {
    result = [{ slot: "Qydha_Owner", label: "المالك والظهور في قيدها",id:0 }, { slot: "Logo", label: "لوجو",id:1 }]
  } else if (privilege.value == Privilege.Owner || (privilege.value == Privilege.Moderatore && permissions.value.includes("ModifyTournamentData"))) {
    result = [{ slot: "Logo", label: "لوجو",id:1 }]
  }
  return result
})
const QState = reactive<{ owner_id: string, showInQydha: boolean }>({ owner_id: props.tour.owner.id, showInQydha: props.tour.showInQydha })
const QSchema = object({ owner_id: string().required(), showInQydha: boolean().required() })

const LState = reactive<{ image: string }>({ image: "" })
const LSchema = object({ image: string().nullable() })


const route = useRoute()
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
const onClickSave = () => {
  if (select.value == 0) {
    qForm.value?.submit()
  } else if (select.value == 1) {
    logoForm.value?.submit()
  }
}

const onSubmit = async () => {

  await qydhaToggle.fetchREQ(QState.showInQydha, QState.owner_id, +tour_id)
  if (qydhaToggle.status.value == "success") {
    refreshNuxtData('getTourById')
    emit('close')
  }

}
const updateTourLogo = await useTournament().updateTourLogo()
const onLogoSubmit = async () => {
  await updateTourLogo.fetchREQ(props.tour.id.toString(), ImageFile.value!)
  if (updateTourLogo.status.value =="success"){
    toast.add({title:'update image done '})
  }

}

const changeFile = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.item(0)
  if (file) {
    ImageFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imageUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)

  }
}


</script>

<style></style>