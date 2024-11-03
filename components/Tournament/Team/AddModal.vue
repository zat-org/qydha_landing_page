<template>
  <UModal  prevent-close>
    <UCard>
      <template #header>
       اضافة فريق جديد
      </template>
      <UForm :state="state" :schema="schema" ref="teamForm" @submit="onSubmit">
        <UFormGroup name="name" label="اسم الفريق">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UButton label="اضافة لاعب " type="button" @click.prevent.stop="addPlayer">
        </UButton>
        <div v-if="state.players.length>1">
          <UFormGroup name="players" label="لاعبين">
          <UTabs :items="items" v-model="selected" orientation="vertical"
            :ui="{ wrapper: 'flex items-center gap-4', list: { width: 'w-48 h-[200px] overflow-auto' } }">
            <template #item="{ item, index }">

              <UFormGroup label="اسم الاعب" :name="'players[' + index + '].name'">
                <UInput v-model="item.player.name"></UInput>
              </UFormGroup>
              <UFormGroup label="الايميل" :name="'players[' + index + '].email'">
                <UInput v-model="item.player.email"></UInput>
              </UFormGroup>
              <UFormGroup label="رقم الهاتف" :name="'players[' + index + '].phone'">
                <vue-tel-input mode="auto" :autoFormat="true"  dir="ltr"
         :validCharactersOnly="true" :autoDefaultCountry="true"
          :inputOptions="{ showDialCode: true ,showFlags:true }" invalidMsg="this phone is invalid "
          :dropdownOptions="{ showDialCodeInSelection: true ,showFlags:true,showSearchBox:true }" 
          v-model="item.player.phone"></vue-tel-input>
              </UFormGroup>
              <UFormGroup label="اسم المستخدم علي قيدها" :name="'players[' + index + '].qydhaUsername'">
                <UInput v-model="item.player.qydhaUsername"></UInput>
              </UFormGroup>
              <UButton label="حذف اللاعب" @click="deleteplayer(index) " v-if="index>1"/>
            </template>
          </UTabs>
        </UFormGroup>

        </div>
      </UForm>
      <template #footer>
        <div class="flex justify-between items-center ">
          <UButton label="اضافة" @click="teamForm?.submit()" />
          <UButton label="عودة"  color="red"  @click="modal.close()"/>
        </div>

      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { array, object, string } from 'yup';
import type { ITeamCreate } from '~/models/tournamentTeam';
import type{Form} from"#ui/types"
import "vue-tel-input/vue-tel-input.css";
import { VueTelInput } from "vue-tel-input";
const teamForm = ref<Form<ITeamCreate>>()
const route =useRoute()
const tour_id =route.params.id.toString()
const modal= useModal()
const state = reactive<ITeamCreate>({
  name: "", players: [
  { name: '', phone: '', email: '', qydhaUsername: '' },
  { name: '', phone: '', email: '', qydhaUsername: '' }
  ]
})
const schema = object({
  name: string().required("برجاء ادخال اسم الفريق").min(4,"يجب ان يكون الاسم اكبر من 4 احرف"),
  players: array().of(
    object({
      name: string().required( "برجاء ادخال اسم اللاعب"),
      phone: string().required("برجاء ادخال رقم الهاتف").min(11,'يجب ان يكون رقم الهاتف صحيح'),
      email: string().email(" برجاء ادخال البريد الالكتروني بشكل صحيح ").required(" برجاء ادخال البريد الالكتروني   "),
      qydhaUsername: string()
    })).min(2,"يجب ادخال بيانات لاعبين على الأقل") .test(
    'complete-player-data',
    "برجاء التأكد من اكتمال بيانات جميع اللاعبين",
    function (players) {
      return players!.every(
        player =>
          player.name &&
          player.phone &&
          player.email
      );
    }
  )
})


const addPlayer = () => {
  let player = { name: '', phone: '', email: '', qydhaUsername: '' }
  state.players.push(player)

}
const deleteplayer=(index:number)=>{
  state.players.splice(index,1)
  items.value.splice(index,1)
  selected .value=index-1

}

const selected =ref()
const items = computed(()=>{
  return  state.players.map((p,index)=>{
    return { label: `الاعب  ${index+1}`, key: `p-${index+1}`, player: p }
  })
}) 

const addTeamREQ =await useTourrnamentTeam().addTourTeam()
const onSubmit = async() => {
 await  addTeamREQ.fetchREQ(tour_id,state)
 if (addTeamREQ.status.value=="error" &&  addTeamREQ.error.value && addTeamREQ.error.value.statusCode == 404)
 {
  let errorPlayer =   state.players.find(p=>{

    return p.qydhaUsername.toLowerCase() == addTeamREQ.error.value?.data?.message.split(":")[1].trim().toLowerCase()
  })
  console.log(errorPlayer)
  teamForm.value?.setErrors([{path:'players' ,message:`برجاء التاكد من اسم الاعب فيدها الخاص ب الاعب ${errorPlayer?.name} `}])

 }
}

</script>


<style></style>