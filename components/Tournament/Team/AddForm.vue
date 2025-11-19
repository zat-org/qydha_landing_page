<template>

    <UCard :ui="{ root: 'w-full space-y-2 p-1  ' }">
        <UForm :state="state" :schema="schema" ref="teamForm" @submit="onSubmit" class="">


            <div v-if="state.players.length > 0" class="space-y-2 sm:space-y-3 md:space-y-4 mt-1 sm:mt-2">
                <UFormField name="players" label="لاعبين">
                    <div class="space-y-2 ">
                        <div v-for="(player, index) in state.players" :key="index" class="relative">
                            <UCard :ui="{
                                root: ' p-1',
                                body: 'p-1',
                                header: 'p-1 '
                            }" :class="{
                                'border-primary-200 dark:border-primary-800': index < 2,
                                'border-gray-200 dark:border-gray-700': index >= 2
                            }">
                                <template #header>
                                    <div class="flex items-center justify-between gap-1.5 sm:gap-2">
                                        <div class="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                                            <div
                                                class="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 font-semibold text-xs sm:text-sm md:text-base flex-shrink-0">
                                                {{ index + 1 }}
                                            </div>
                                            <h4
                                                class="font-medium text-gray-900 dark:text-gray-100 text-xs sm:text-sm md:text-base truncate">
                                                لاعب {{ index + 1 }}
                                                <span v-if="index < 2"
                                                    class="text-[10px] sm:text-xs text-primary-600 dark:text-primary-400">(مطلوب)</span>
                                            </h4>
                                        </div>
                                    </div>
                                </template>

                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mt-1 sm:mt-2">
                                    <UFormField label="اسم اللاعب" :name="'players[' + index + '].name'"
                                        :required="true" class="text-xs sm:text-sm">
                                        <UInput v-model="player.name" placeholder="أدخل اسم اللاعب" :disabled="pending"
                                            trailing-icon="i-heroicons-user" size="md" class="text-sm" />
                                    </UFormField>

                                    <UFormField label="البريد الإلكتروني" :name="'players[' + index + '].email'"
                                        :required="true" class="text-xs sm:text-sm">
                                        <UInput v-model="player.email" type="email" placeholder="example@email.com"
                                            :disabled="pending" trailing-icon="i-heroicons-envelope" size="md"
                                            class="text-sm" />
                                    </UFormField>

                                    <UFormField label="رقم الهاتف" :name="'players[' + index + '].phone'"
                                        :required="true" class="text-xs sm:text-sm">
                                        <AsyncPhoneInput v-model="player.phone" :disabled="pending" dir="ltr" />
                                    </UFormField>

                                    <UFormField label="اسم المستخدم على قيدها"
                                        :name="'players[' + index + '].qydhaUsername'" hint="اختياري"
                                        class="text-xs sm:text-sm">
                                        <UInput v-model="player.qydhaUsername" placeholder="اسم المستخدم على قيدها"
                                            :disabled="pending" trailing-icon="i-heroicons-at-symbol" size="md"
                                            class="text-sm" />
                                    </UFormField>
                                </div>
                            </UCard>
                        </div>
                    </div>
                </UFormField>
            </div>
            <UFormField name="name" label="اسم الفريق" class="mt-1 sm:mt-2">
                <UInput v-model="state.name" placeholder="أدخل اسم الفريق" :size="'md'" :disabled="pending"
                    class="w-full" />
            </UFormField>


            <!-- <UAlert 
          v-else
          color="warning"
          variant="soft"
          icon="i-heroicons-information-circle"
          title="لا يوجد لاعبين"
          description="يرجى إضافة لاعبين على الأقل"
          /> -->

        </UForm>
        <!-- Action Buttons -->
        <template #footer>
            <div class="flex justify-between">
                <UButton label="إضافة الفريق" icon="i-heroicons-check" color="primary" :size="'md'" :loading="pending"
                    :disabled="pending" @click="teamForm?.submit()"
                    class="w-full sm:w-auto order-2 sm:order-1 text-xs sm:text-sm md:text-base py-2 sm:py-2.5" />
                <UButton label="إلغاء" icon="i-heroicons-x-mark" color="error" variant="ghost" :size="'md'"
                    :disabled="pending" @click="emit('close')"
                    class="w-full sm:w-auto order-1 sm:order-2 text-xs sm:text-sm md:text-base py-2 sm:py-2.5" />
            </div>
        </template>
    </UCard>
</template>

<script lang="ts" setup>
import { array, object, string } from 'yup';
import type { ITeamCreate } from '~/models/tournamentTeam';
const teamForm = ref<any>()
const route = useRoute()
const tour_id = route.params.id.toString()
const emit = defineEmits(['close'])
const state = reactive<ITeamCreate>({
    name: "", players: [
        { name: '', phone: '', email: '', qydhaUsername: '' },
        { name: '', phone: '', email: '', qydhaUsername: '' }
    ]
})
const schema = object({
    name: string().required("برجاء ادخال اسم الفريق").min(4, "يجب ان يكون الاسم اكبر من 4 احرف"),
    players: array().of(
        object({
            name: string().required("برجاء ادخال اسم اللاعب"),
            phone: string().required("برجاء ادخال رقم الهاتف").min(11, 'يجب ان يكون رقم الهاتف صحيح'),
            email: string().email(" برجاء ادخال البريد الالكتروني بشكل صحيح ").required(" برجاء ادخال البريد الالكتروني   "),
            qydhaUsername: string()
        })).min(2, "يجب ادخال بيانات لاعبين على الأقل").test(
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

watch(
    () => state.players.map(p => p.name), 
    (newNames) => {
        state.name = newNames.join(" | ");
    }
)


//   const addPlayer = () => {
//     const player = { name: '', phone: '', email: '', qydhaUsername: '' }
//     state.players.push(player)
//   }

//   const deleteplayer = (index: number) => {
//     if (state.players.length > 2 && index >= 1) {
//       state.players.splice(index, 1)
//     }
//   }


const addTeamREQ = await useTourrnamentTeam().addTourTeam()
const pending = computed(() => addTeamREQ.status.value == "pending")
const onSubmit = async () => {
    await addTeamREQ.fetchREQ(tour_id, state)
    if (addTeamREQ.status.value == "success") {
        emit('close')
    }
    if (addTeamREQ.status.value == "error" && addTeamREQ.error.value) {
        if (addTeamREQ.error.value.statusCode == 404) {
            let errorPlayerIndex = state.players.findIndex(p => {
                console.log(p.qydhaUsername.toLowerCase())
                console.log((addTeamREQ.error.value?.data as any)?.data?.message.split(":")[1].trim().toLowerCase())
                // console.log((addTeamREQ.error.value?.data as any)?.data?.message)
                const result = p.qydhaUsername.toLowerCase() == (addTeamREQ.error.value?.data as any)?.data?.message.split(":")[1].trim().toLowerCase()
                console.log(result)
                return result
            })
            teamForm.value?.setErrors([{ name: 'players[' + errorPlayerIndex + '].qydhaUsername', message: `برجاء التاكد من اسم الاعب فيدها الخاص ب الاعب` }])
        }
        else if (addTeamREQ.error.value.statusCode == 400) {
            if (addTeamREQ.error.value.data?.code == "CannotConnectSameUserToManyPlayers") {

                teamForm.value?.setErrors([{ name: 'players', message: `لا يمكن استخدام نفس المستخدم من قيدها في اكثر من لاعب` }])
            } else if (addTeamREQ.error.value.data?.code == "UserAlreadyExistInTournamentAsPlayerError") {
                teamForm.value?.setErrors([{ name: 'players', message: `احد الاعبين موجود بالفعل في البطولة` }])

            }
        }
    }
}

</script>


<style scoped>
/* Reduce spacing in form fields on mobile */
:deep(.form-field) {
    margin-bottom: 0.25rem;
}

@media (min-width: 640px) {
    :deep(.form-field) {
        margin-bottom: 0.5rem;
    }
}

/* Compact form field labels */
:deep([data-label]) {
    margin-bottom: 0.25rem;
    font-size: 0.75rem;
}

@media (min-width: 640px) {
    :deep([data-label]) {
        margin-bottom: 0.375rem;
        font-size: 0.875rem;
    }
}

/* Reduce input padding on mobile */
:deep(input) {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
}

@media (min-width: 640px) {
    :deep(input) {
        padding-top: 0.625rem;
        padding-bottom: 0.625rem;
    }
}
</style>