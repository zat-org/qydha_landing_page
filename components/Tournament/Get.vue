<template>
  <UCard class="max-w-5xl mx-auto">
    <Loading v-if="pending" class="mt-10" />
    <div v-else-if="tour" class="flex flex-col space-y-8 mt-2">
      <div class="flex flex-col md:flex-row items-center gap-8 px-5">
        <div class="relative w-[150px] h-[150px] rounded-lg overflow-hidden shadow-2xl">
          <UAvatar :src="tour.tournament?.logoUrl" :text="tour.tournament.title"
            class="w-full h-full object-cover rounded-lg shadow-lg" alt="Tournament Logo" />
        </div>


        <div class="flex-1 space-y-4 w-full">
          <div class="flex flex-wrap items-center gap-3">
            <h1 class="text-2xl font-bold">{{ tour.tournament?.title }}</h1>
            <UBadge v-if="tour.tournament?.state" :color="getState(tour.tournament.state)!.color" variant="soft"
              size="xl">
              {{ getState(tour.tournament.state)?.label }}</UBadge>
            <UBadge v-if="tour.tournament?.tournamentType"
              :color="getType(tour.tournament.tournamentType)?.color ?? 'primary'" variant="soft" size="xl">
              {{ getType(tour.tournament.tournamentType)?.label }}</UBadge>
            <UBadge v-if="tour.tournament?.showInQydha" color="success" variant="soft" size="xl">ظاهر في قيدها </UBadge>
          </div>

          <p class="text-gray-600 dark:text-gray-300 leading-relaxed" v-if="tour.tournament?.description">
            {{ tour.tournament.description }}
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-2" v-if="tour.tournament?.locationDescription">
              <UIcon name="i-mdi-map-marker" class="text-gray-500" />
              <p>{{ tour.tournament.locationDescription }}</p>
            </div>

            <div class="flex items-center gap-2">
              <UIcon name="i-mdi-calendar" class="text-gray-500" />
              <p>
                {{ formatDate(tour.tournament?.startAt) }} - {{ formatDate(tour.tournament?.endAt) }}
              </p>
            </div>

            <div class="flex items-center gap-2"
              v-if="tour.tournament?.joinRequestStartAt || tour.tournament?.joinRequestEndAt">
              <UIcon name="i-mdi-account-arrow-right" class="text-gray-500" />
              <p>
                طلبات الانضمام:
                <span>{{ tour.tournament?.joinRequestStartAt ? formatDate(tour.tournament?.joinRequestStartAt) : 'غير محدد' }}</span>
                -
                <span>{{ tour.tournament?.joinRequestEndAt ? formatDate(tour.tournament?.joinRequestEndAt) : 'غير محدد'
                }}</span>
              </p>
            </div>

            <div class="flex items-center gap-2" v-if="tour.tournament?.joinRequestMaxCount">
              <UIcon name="i-mdi-counter" class="text-gray-500" />
              <p>الحد الأقصى لطلبات الانضمام: {{ tour.tournament?.joinRequestMaxCount }}</p>
            </div>

            <div class="flex items-center gap-2">
              <UIcon name="i-mdi-table" class="text-gray-500" />
              <p>عدد الطاولات : {{ tour.tournament?.expectedTablesCount }}</p>
            </div>
            <div class="flex items-center gap-2">
              <UIcon name="i-mdi-account-group" class="text-gray-500" />
              <p>عدد الفرق : {{ tour.tournament?.expectedTeamsCount }}</p>
            </div>

            <div class="flex items-center gap-2" v-if="tour.tournament?.contactPhone">
              <UIcon name="i-mdi-phone" class="text-gray-500" />
              <div class="flex items-center gap-2">
                <p>
                  {{ tour.tournament?.contactPhone }}
                </p>
                <UBadge v-if="tour.tournament?.isContactPhoneCall" variant="soft" size="xl">اتصال</UBadge>
                <UBadge v-if="tour.tournament?.isContactPhoneWhatsapp" color="success" variant="soft" size="xl">
                  واتساب
                </UBadge>
              </div>
            </div>

            <!-- <div class="flex items-center gap-2" v-if="tour.tournament?.bracketLink">
              <UIcon name="i-mdi-tournament" class="text-gray-500" />
              <a class="text-primary underline" :href="tour.tournament?.bracketLink" target="_blank">رابط الخريطة</a>
            </div> -->
          </div>

          <div v-if="tour.tournament?.sponsors?.length" class="pt-2">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 items-center">
              <a v-for="(logoUrl, i) in tour.tournament.sponsors" :key="i" :href="logoUrl" target="_blank"
                rel="noopener noreferrer"
                class="group block p-3 rounded-md border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md transition">
                <img :src="logoUrl" :alt="`sponsor-${i}`"
                  class="mx-auto h-12 object-contain opacity-90 group-hover:opacity-100 transition" loading="lazy"
                  @error="(e: Event) => ((e.target as HTMLImageElement).style.visibility = 'hidden')" />
              </a>
            </div>
          </div>

          <div v-if="tour.tournament?.owner" class="flex items-center gap-3 pt-2">
            <UAvatar :src="tour.tournament.owner.avatarUrl || undefined"
            class="w-[75px] h-[75px]"
              :alt="tour.tournament.owner.username || tour.tournament.owner.name || 'Owner'" size="xl" />
            <div >
              <p class="font-medium">مالك البطوله</p>
              <p class="text-gray-600 dark:text-gray-300">
                {{ tour.tournament.owner.name ||tour.tournament.owner.username }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- <UDivider label="الجوائز" /> -->
      <div class="px-5">
        <div v-if="tour.tournament?.prizes?.length" class="grid grid-cols-1  md:grid-cols-2 gap-3">
          <div v-for="(prize, index) in tour.tournament.prizes" :key="index"
            class="p-4 rounded-md bg-gray-50 dark:bg-gray-800 flex  items-start gap-3">
            <div class="space-y-1 w-full">
              <div class="flex justify-between w-full ">
                <p class="font-semibold">المركز {{ index + 1 }}</p>
                <p v-if="prize.isFinancial">
                  {{ prize.financialPrizeAmount.toLocaleString() }} {{ getCurrency(prize.financialPrizeCurrency)?.label ?? 'ريال' }}
                </p>
              </div>
              <div v-if="prize.isNonFinancial && prize.nonFinancialPrizes?.length" class="flex flex-wrap gap-2">
                <UBadge v-for="(nf, j) in prize.nonFinancialPrizes" :key="j" variant="soft">{{ nf }}</UBadge>
              </div>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 italic">لا توجد جوائز</p>
      </div>

      <div v-if="tour.tournament?.tournamentRules?.length" class="px-5">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 mt-6">قواعد البطولة</h3>
        <div class="space-y-2">
          <div v-for="(rule, index) in tour.tournament.tournamentRules" :key="index"
            class="flex items-start gap-3 p-3 rounded-md bg-gray-50 dark:bg-gray-800">
            <UIcon name="i-mdi-check-circle" class="text-primary mt-0.5 flex-shrink-0" />
            <p class="text-gray-700 dark:text-gray-300">{{ rule }}</p>
          </div>
        </div>
      </div>

      <div v-if="tour.tournament?.moderators?.length" class="px-5">
        <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 mt-6">المديرون</h3>
        <div class="flex flex-wrap gap-4 pt-2">
          <div v-for="(m, i) in tour.tournament.moderators" :key="i" class="flex items-center gap-2">
            <UAvatar :src="m.user.avatarUrl || undefined" :alt="m.user.username" size="sm" />
            <div class="text-sm">
              <p class="font-medium">{{ m.user.name || m.user.username }}</p>
              <div class="flex flex-wrap gap-1">
                <UBadge v-for="(perm, k) in m.permissions" :key="k" size="xs" variant="soft">{{ perm }}</UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- <div v-if="tour.requesterPrivilege" class="px-5">
        <UDivider label="صلاحياتي في هذه البطولة" />
        <div class="flex flex-wrap gap-2 pt-2">
          <UBadge color="primary" variant="soft">{{ tour.requesterPrivilege.privilege }}</UBadge>
          <UBadge v-for="(perm, i) in tour.requesterPrivilege.permissions" :key="i" variant="soft">{{ perm }}</UBadge>
        </div>
      </div> -->

      
      <!-- v-if="userStore.isOrganizer"  -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 px-5">
        <UButton v-for="(button, index) in adminButtons" :key="index" :to="button.to" :label="button.label"
          :icon="button.icon" size="lg" class="w-full" variant="soft" />
        

      </div>

    </div>

    <template #footer>
      <div class="flex flex-wrap gap-4 justify-between items-center">
        <UButton label="عودة" color="neutral" variant="soft" icon="i-mdi-arrow-left" @click="navigateTo('/tournament')" />

        <div class="flex gap-3">
          <UButton v-if="isAdmin && canEdit" color="warning" label="تعديل" icon="i-mdi-pencil"
            :to="'/tournament/' + id + '/edit'" />

          <UButton label="خريطة البطولة" :to="'/tournament/' + id + '/bracket'" icon="i-mdi-tournament" target="_blank"
            color="primary" />
        </div>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/Auth";
import Loading from "../loading.vue";
import type { TournamentState } from "~/models/tournament";
import type { TournamentType } from "~/models/tournamenetType";
import type { TournamentPrizeCurrency } from "~/models/tournamentPrize";

const userStore = useMyAuthStore();
const isAdmin = computed(() => {
  return userStore.user?.user.roles.includes("SuperAdmin") ||
    userStore.user?.user.roles.includes("StaffAdmin")
});

const { permissions, privilege } = storeToRefs(userStore);

const canEdit = computed(() => {
  return privilege.value?.toLowerCase() == 'admin' ||
    privilege.value?.toLowerCase() == 'owner' ||
    permissions.value.includes('ModifyTournamentData')
});

const adminButtons = computed(() => [
  // { label: 'ادارة الحكام', to: `/tournament/${props.id}/refree`, icon: 'i-mdi-gavel' },
  { label: 'ادارة طلبات الانضمام ', to: `/tournament/${props.id}/joinRequest`, icon: 'i-mdi-table' },
  // { label: 'ادارة المديرين', to: `/tournament/${props.id}/moderator`, icon: 'i-mdi-account-cog' },
  // { label: 'ادارة الفرق', to: `/tournament/${props.id}/team`, icon: 'i-mdi-account-group' },
  // { label: 'ادارة اللاعبين', to: `/tournament/${props.id}/player`, icon: 'i-mdi-account' },
  // { label: 'ادارة الطاولات ', to: `/tournament/${props.id}/table`, icon: 'i-mdi-table' },

  // { label: 'ادارة المجموعات', to: '', icon: 'i-mdi-group' }
]);

const props = defineProps<{ id: string }>();
const { getSingelTournament, getTournamnetStateOptions } = useTournament();
const { getTournamentTypeOptions , getTournamentPrizeCurrency } = useTournamentRequest()

const getREQ = await getSingelTournament(props.id);
// const qydhaToggle = await tourApi.updatTourQydhaAndOwner();

const pending = computed(() => getREQ.pending.value);
const tour = computed(() => getREQ.data.value?.data);
const states = getTournamnetStateOptions()
const getState = (value: TournamentState) => {
  const result = states.find(s => s.value == value)
  if (result) return result
}
const types = getTournamentTypeOptions()
const getType = (value: TournamentType) => {
  const result = types.find(s => s.value == value)
  if (result) return result
}
const currencies = getTournamentPrizeCurrency()
const getCurrency =(value:TournamentPrizeCurrency)=>{
 const result = currencies.find(cur=>cur.value==value)
 if (result) return result
}



</script>

<style></style>
