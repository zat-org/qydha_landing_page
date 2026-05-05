<template>
  <UCard :ui="{ root: 'w-full space-y-2 p-1  ' }">
    <UForm :state="state" :schema="schema" ref="teamForm" @submit="onSubmit">
      <div v-if="state.players.length > 0" class="space-y-2 mt-1">
        <UFormField name="players" label="لاعبين">
          <div class="space-y-2 ">
            <div v-for="(player, index) in state.players" :key="index" class="relative">
              <UCard :ui="{ root: ' p-1', body: 'p-1', header: 'p-1 ' }">
                <template #header><div class="flex items-center justify-between"><h4 class="font-medium">لاعب {{ index + 1 }}</h4></div></template>
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-1">
                  <UFormField label="اسم اللاعب" :name="'players[' + index + '].name'" :required="true"><UInput v-model="player.name" :disabled="pending" /></UFormField>
                  <UFormField label="البريد الإلكتروني" :name="'players[' + index + '].email'"><UInput v-model="player.email" type="email" :disabled="pending" /></UFormField>
                  <UFormField label="رقم الهاتف" :name="'players[' + index + '].phone'"><AsyncPhoneInput v-model="player.phone" :disabled="pending" dir="ltr" /></UFormField>
                  <UFormField label="اسم المستخدم على قيدها" :name="'players[' + index + '].qydhaUsername'" hint="اختياري"><UInput v-model="player.qydhaUsername" :disabled="pending" /></UFormField>
                </div>
              </UCard>
            </div>
          </div>
        </UFormField>
      </div>
      <UFormField name="name" label="اسم الفريق" class="mt-1"><UInput v-model="state.name" :disabled="pending" class="w-full" /></UFormField>
    </UForm>
    <template #footer>
      <div class="flex justify-between">
        <UButton label="إضافة الفريق" color="primary" :loading="pending" :disabled="pending" @click="teamForm?.submit()" />
        <UButton label="إلغاء" color="error" variant="ghost" :disabled="pending" @click="emit('close')" />
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { array, object, string } from 'yup';
import type { ITeamCreate } from '~/features/tournament/models/tournamentTeam';
const teamForm = useTemplateRef('teamForm')
const route = useRoute()
const tour_id = route.params.id.toString()
const emit = defineEmits(['close'])
const toast = useToast()
const state = reactive<ITeamCreate>({ name: "", players: [{ name: '', phone: '', email: '', qydhaUsername: '' },{ name: '', phone: '', email: '', qydhaUsername: '' }] })
const schema = object({ name: string().required("برجاء ادخال اسم الفريق").min(4, "يجب ان يكون الاسم اكبر من 4 احرف"), players: array().of(object({ name: string().required("برجاء ادخال اسم اللاعب"), phone: string().nullable(), email: string().nullable(), qydhaUsername: string() })).min(2, "يجب ادخال بيانات لاعبين على الأقل").test('complete-player-data',"برجاء التأكد من اكتمال بيانات جميع اللاعبين",function (players) { return players!.every(player => !!player.name); }) })
watch(() => state.players.map(p => p.name), (newNames) => { const processedNames = newNames.map(name => { if (!name) return ''; const words = name.trim().split(/\s+/).filter(word => word.length > 0); if (words.length >= 3) return `${words[0]} ${words[words.length - 1]}`; return name.trim(); }).filter(name => name.length > 0); state.name = processedNames.join(" | "); })
const addTeamREQ = await useTourrnamentTeam().addTourTeam()
const pending = computed(() => addTeamREQ.status.value == "pending")
const onSubmit = async () => {
  await addTeamREQ.fetchREQ(tour_id, state)
  if (addTeamREQ.status.value == "success") {
    Object.assign(state, { name: "", players: [{ name: '', phone: '', email: '', qydhaUsername: '' },{ name: '', phone: '', email: '', qydhaUsername: '' }] })
    toast.add({ title: "تم اضافة الفريق بنجاح", color: "success" })
  }
}
</script>
