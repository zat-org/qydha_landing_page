<template>
  <UCard dir="rtl">
    <template #header>
      <div class="flex  justify-between  gap-4">
        <div class="flex items-center gap-4">
          <UButton icon="i-heroicons-arrow-right" label="عوده" variant="ghost" color="neutral"
            @click="router.back()" />
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

    <UAlert v-if="canSubmit" color="success" variant="subtle" icon="i-heroicons-check-circle" class="mb-4">
      <template #description>
        <p>تم الوصول للعدد المطلوب من الفرق. يمكنك الآن الإرسال.</p>
      </template>
    </UAlert>

    <UTabs :items="tabItems" class="mb-6" dir="rtl" :unmount-on-hide="false">
      <template #all-requests>
        <Suspense>
          <TournamentJoiningRequestAll :canAction :canAcceptMore />
          <template #fallback>
            <Loading class="mt-10" />
          </template>
        </Suspense>
      </template>

      <template #accepted-singles>
        <Suspense>
          <TournamentJoiningRequestAcceptedSingle :canAction />
          <template #fallback>
            <Loading class="mt-10" />
          </template>
        </Suspense>
      </template>

      <template #accepted-teams>
        <Suspense>
          <TournamentJoiningRequestAcceptedTeams :canAction />
          <template #fallback>
            <Loading class="mt-10" />
          </template>
        </Suspense>
      </template>
    </UTabs>

    <div class="mt-6 flex justify-end">
      <UButton color="success" size="lg" :loading="submitAcceptedTeamsReq.result.status.value=='pending'" :disabled="!canSubmit" @click="onSubmit">
        إرسال الفرق المقبولة
      </UButton>
    </div>
  </UCard>
</template>

<script lang="ts" setup>
import { useTournamentJoinRequest } from "~/features/tournament/join-request/composables/TournamentJoinRequest";
import { TournamentState } from '~/features/tournament/models/tournament';
import { useTournamentJoinRequestStore } from '~/store/tournamentJoinRequest';
import Loading from '~/components/loading.vue';
import TournamentJoiningRequestAll from '~/features/tournament/join-request/components/All.vue';
import TournamentJoiningRequestAcceptedSingle from '~/features/tournament/join-request/components/AcceptedSingle.vue';
import TournamentJoiningRequestAcceptedTeams from '~/features/tournament/join-request/components/AcceptedTeams.vue';

const router = useRouter()
const id = useRoute().params.id.toString()
const { getSingelTournament } = useTournament()
const getTournamentReq = await getSingelTournament(id)
const tournament = computed(() => getTournamentReq.data.value?.data.tournament ?? null)
const expectedTeamsCount = computed(() => tournament.value?.expectedTeamsCount ?? 0)
const tournamneState = computed(() => tournament.value?.state ?? null)
const tournamentEndJoinRequest = computed(() => tournament.value?.joinRequestEndAt ?? null)
const tournamentStart = computed(() => tournament.value?.startAt ?? null)

const { data: acceptedTeamsCache } = useNuxtData('getTournamnetAcceptedTeamsJoinRequest')
const { data: acceptedSinglesCache } = useNuxtData('getTournamnetAcceptedSingleJoinRequest')
const acceptedteamsNumber = computed(() => acceptedTeamsCache.value?.data?.totalCount ?? 0)
const acceptedsinglesNumber = computed(() => acceptedSinglesCache.value?.data?.totalCount ?? 0)

const canAction = computed(() => {
  if (tournamneState.value == TournamentState.Upcoming) {
    const isAfterEndJoin = new Date(tournamentEndJoinRequest.value as string).getTime() <= Date.now()
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
    return true
  }
  return false
})

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
