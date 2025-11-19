<template>
  <UCard dir="rtl">
    <template #header>
      <div class="flex  justify-between  gap-4">
        <div class="flex items-center gap-4">
          <UButton icon="i-heroicons-arrow-right" label="عوده" variant="ghost" color="neutral"
            @click="navigateTo('/tournament')" />
          <h1 class="text-2xl font-bold">طلبات الانضمام للبطولة</h1>
        </div>

        <UButton color="primary" icon="i-heroicons-sparkles" @click="onAutoComplete" :disabled="!canAction">
          إكمال تلقائي للفرق
        </UButton>
      </div>

    </template>

    <ClientOnly>
      <UAlert v-if="!canAction" class="mb-4" color="warning" variant="subtle"
        icon="i-heroicons-exclamation-triangle">
        <template #description>
          <p>لا يمكنك القيام بهذا الإجراء في هذا الوقت لان البطولة لم تبدأ بعد او لم ينتهي الوقت للانضمام</p>
        </template>
      </UAlert>
    </ClientOnly>


    <!-- <UAlert v-if="!canSubmit() && (acceptedTeams.length > 0 || acceptedSingles.length > 0)" 
      color="warning" variant="subtle" icon="i-heroicons-exclamation-triangle" class="mb-4">
      <template #description>
        <p>
          الفرق المقبولة: {{ acceptedTeams.length }} | 
          الطلبات الفردية المقبولة: {{ acceptedSingles.length }} | 
          العدد المطلوب: {{ expectedTeamsCount }}
        </p>
        <p class="mt-2">
          العدد الحالي: {{ currentCount }} / {{ expectedTeamsCount }}
        </p>
      </template>
    </UAlert> -->

    <UAlert v-if="canSubmit" color="success" variant="subtle" icon="i-heroicons-check-circle" class="mb-4">
      <template #description>
        <p>تم الوصول للعدد المطلوب من الفرق. يمكنك الآن الإرسال.</p>
      </template>
    </UAlert>

    <!-- Tabs Section -->
    <UTabs :items="tabItems" class="mb-6" dir="rtl" :unmount-on-hide="false">
      <!-- Tab 1: All Requests -->
      <template #all-requests>
        <Suspense>
          <TournamentJoiningRequestAll :canAction :canAcceptMore />
          <template #fallback>
            <Loading class="mt-10" />
          </template>
        </Suspense>
      </template>

      <!-- Tab 2: Accepted Singles -->
      <template #accepted-singles>
        <Suspense>
          <TournamentJoiningRequestAcceptedSingle :canAction />
          <template #fallback>
            <Loading class="mt-10" />
          </template>
        </Suspense>
      </template>

      <!-- Tab 3: Accepted Teams -->
      <template #accepted-teams>
        <Suspense>
          <TournamentJoiningRequestAcceptedTeams :canAction />
          <template #fallback>
            <Loading class="mt-10" />
          </template>
        </Suspense>
      </template>
    </UTabs>

    <!-- Submit Button -->
    <div class="mt-6 flex justify-end">
      <!-- :loading="isSubmitting" -->
      <UButton color="success" size="lg" :loading="submitAcceptedTeamsReq.result.status.value=='pending'" :disabled="!canSubmit" @click="onSubmit">
        إرسال الفرق المقبولة
      </UButton>
    </div>

    <!-- Merge Modal -->
    <!-- <UModal v-model:open="showMergeModal" title="دمج الطلبات الفردية">
      <template #body>
        <div class="space-y-4">
          <UFormField label="طريقة الدمج">
            <URadioGroup v-model="mergeMode" :options="mergeModeOptions" />
          </UFormField>
          
          <div v-if="mergeMode === 'manual'">
            <UFormField label="اختر الطلب الأول">
              <USelect v-model="selectedSingle1" :items="availableSinglesForMerge" 
                :value="selectedSingle1 ?? undefined" />
            </UFormField>
            <UFormField label="اختر الطلب الثاني" class="mt-4">
              <USelect v-model="selectedSingle2" 
                :items="availableSinglesForMerge.filter(s => s.value !== selectedSingle1)" 
                :value="selectedSingle2 ?? undefined" />
            </UFormField>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton variant="ghost" @click="showMergeModal = false">إلغاء</UButton>
          <UButton color="primary" @click="onMerge" :disabled="mergeMode === 'manual' && (!selectedSingle1 || !selectedSingle2)">
            دمج
          </UButton>
        </div>
      </template>
    </UModal> -->

  </UCard>
</template>

<script lang="ts" setup>
import { useTournamentJoinRequest } from '~/composables/TournamentJoinRequest';
import { TournamentState, type DetailTournament } from '~/models/tournament';
import {
  type GetTournamentJoinRequestParams,
  TournamentJoinRequestState,
  TournamentJoinRequestType,
  type TournamentJoinRequest,
  type SingleJoinRequest,
  type TeamJoinRequest,
  type AcceptedTeam,
} from '~/models/TournamentJoinRequest';
import { useTournamentJoinRequestStore } from '~/store/tournamentJoinRequest';
import { formatDate } from '~/utils/formatDate';
import Loading from '../../loading.vue';

const id = useRoute().params.id.toString()
const { getSingelTournament } = useTournament()
const getTournamentReq = await getSingelTournament(id)
const tournament = computed(() => getTournamentReq.data.value?.data.tournament ?? null)
const expectedTeamsCount = computed(() => tournament.value?.expectedTeamsCount ?? 0)
const tournamneState = computed(() => tournament.value?.state ?? null)
const tournamentEndJoinRequest = computed(() => tournament.value?.joinRequestEndAt ?? null)
const tournamentStart = computed(() => tournament.value?.startAt ?? null)


// Best practice: Use useNuxtData to access cached data
// Note: This only reads from cache, returns null if data hasn't been fetched yet
// Make sure child components have already fetched the data with the same keys
const { data: acceptedTeamsCache } = useNuxtData('getTournamnetAcceptedTeamsJoinRequest')
const { data: acceptedSinglesCache } = useNuxtData('getTournamnetAcceptedSingleJoinRequest')

// Safe computed properties with proper null checking
// useNuxtData returns a ref that may be null if cache doesn't exist
const acceptedteamsNumber = computed(() => acceptedTeamsCache.value?.data?.totalCount ?? 0)
const acceptedsinglesNumber = computed(() => acceptedSinglesCache.value?.data?.totalCount ?? 0)
// console.log("expected team count " , expectedTeamsCount.value, 'teamsnumber',acceptedteamsNumber.value, 'singlesnumber', acceptedsinglesNumber.value)
// console.log("tournament state " , tournamneState.value)
const canAction = computed(() => {
  if (tournamneState.value == TournamentState.Upcoming) {
    const isAfterEndJoin = new Date(tournamentEndJoinRequest.value as string).getTime() <= Date.now()
    const isBeforeStart = new Date(tournamentStart.value as string).getTime() >= Date.now()
    console.log("isAfterEndJoin", isAfterEndJoin)
    console.log("isBeforeStart", isBeforeStart)
    //  
    if (isAfterEndJoin ) {
      return true
    } else {
      return false
    }
  }
  return false
})  
const canAcceptMore = computed(() => {
  if (canAction.value) {
    return acceptedteamsNumber.value + Math.floor(acceptedsinglesNumber.value / 2) < expectedTeamsCount.value
  }
  return false
})

const canSubmit = computed(() => {
  if (canAction.value) {
    return acceptedteamsNumber.value + Math.floor(acceptedsinglesNumber.value / 2) === expectedTeamsCount.value
  }
  return false
})

// Composables
const toast = useToast()



const tabItems = [
  { label: 'جميع الطلبات', slot: 'all-requests' as const },
  { label: 'الطلبات الفردية المقبولة', slot: 'accepted-singles' as const },
  { label: 'الفرق المقبولة', slot: 'accepted-teams' as const },
]
const { AutoCompleteJoinRequest ,submitAcceptedTeams} = useTournamentJoinRequest()
const autoComplteReq = AutoCompleteJoinRequest()
const onAutoComplete = async () => {
  await autoComplteReq.fetchReq(id)
}

const submitAcceptedTeamsReq = await submitAcceptedTeams()
const onSubmit = async () => {
   await submitAcceptedTeamsReq.fetchREQ(id)
}

</script>

<style scoped></style>
