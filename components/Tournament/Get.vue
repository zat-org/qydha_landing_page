<template>
  <UCard class="max-w-4xl mx-auto">
    <div class="flex flex-col space-y-8">
      <div class="flex flex-col md:flex-row items-center gap-8 px-5">
        <div class="relative w-[150px] h-[150px] rounded-lg overflow-hidden shadow-2xl">
          <img 
            :src="tour.logoUrl || 'https://th.bing.com/th/id/OIP.PAlqgKSssv6ig-bjh9KEtwHaO8?rs=1&pid=ImgDetMain'"
            class="w-full h-full object-cover rounded-lg shadow-lg"
            alt="Tournament Logo"
          />
        </div>

        <div class="flex-1 space-y-3">
          <h1 class="text-2xl font-bold">{{ tour.name }}</h1>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center gap-2">
              <UIcon name="i-mdi-information" class="text-gray-500"/>
              <p>{{ tour.description }}</p>
            </div>

            <div class="flex items-center gap-2">
              <UIcon name="i-mdi-map-marker" class="text-gray-500"/>
              <p>{{ tour.city }}</p>
            </div>

            <div class="flex items-center gap-2">
              <UIcon name="i-mdi-calendar" class="text-gray-500"/>
              <p>
                {{ new Date(tour.startAt).toLocaleDateString() }} - 
                {{ new Date(tour.endAt).toLocaleDateString() }}
              </p>
            </div>
          </div>

          <div class="border-t pt-3 mt-3">
            <h3 class="font-semibold mb-2">الجوائز:</h3>
            <div v-if="tour.prizes?.length" class="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div v-for="(prize, index) in tour.prizes" :key="index"
                class="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-800">
                <UIcon :name="index === 0 ? 'i-mdi-trophy' : 'i-mdi-medal'" 
                  :class="index === 0 ? 'text-amber-500' : 'text-gray-500'"/>
                <span>المركز {{ index + 1 }}: {{ prize }} {{ tour.prizesCurrency }}</span>
              </div>
            </div>
            <p v-else class="text-gray-500 italic">لا توجد جوائز</p>
          </div>
        </div>
      </div>

      <div v-if="isAdmin" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        <UButton
          v-for="(button, index) in adminButtons" 
          :key="index"
          :to="button.to"
          :label="button.label"
          :icon="button.icon"
          size="lg"
          class="w-full"
          variant="soft"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex flex-wrap gap-4 justify-between items-center">
        <UButton 
          label="عودة" 
          color="neutral" 
          variant="soft"
          icon="i-mdi-arrow-left"
          @click="navigateTo('/tournament')" 
        />
        
        <div class="flex gap-3">
          <UButton 
            v-if="isAdmin && canEdit"
            color="warning" 
            label="تعديل" 
            icon="i-mdi-pencil"
            :to="'/tournament/' + id + '/edit'" 
          />
          
          <UButton 
            label="خريطة البطولة" 
            :to="'/tournament/' + id + '/bracket'" 
            icon="i-mdi-tournament"
            target="_blank"
            color="primary"
          />
        </div>
      </div>
    </template>
  </UCard>
</template>

<script lang="ts" setup>
import { useMyAuthStore } from "~/store/Auth";

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
  { label: 'ادارة المديرين', to: `/tournament/${props.id}/moderator`, icon: 'i-mdi-account-cog' },
  { label: 'ادارة الفرق', to: `/tournament/${props.id}/team`, icon: 'i-mdi-account-group' },
  { label: 'ادارة اللاعبين', to: `/tournament/${props.id}/player`, icon: 'i-mdi-account' },
  { label: 'ادارة الطاولات ', to: `/tournament/${props.id}/table`, icon: 'i-mdi-table' },
  { label: 'ادارة المجموعات', to: '', icon: 'i-mdi-group' }
]);

const props = defineProps<{ id: number }>();
const tourApi = useTournament();
const getREQ = await tourApi.getTourById();
const qydhaToggle = await tourApi.updatTourQydhaAndOwner();

const tour = computed(() => {
  return getREQ.data.value?.data ?? {
    name: "test",
    description: "test", 
    city: "test",
    startAt: "2025-01-01",
    endAt: "2025-01-01",
    logoUrl: "https://th.bing.com/th/id/OIP.PAlqgKSssv6ig-bjh9KEtwHaO8?rs=1&pid=ImgDetMain",
    prizes: [],
    prizesCurrency: "SAR",
    ownerId: "1",
    state: "Upcoming",
    showInQydha: true,
  };
});
</script>

<style></style>
