<template>
  <UModal class="w-[500px]">
    <UTabs :items="items" class="w-full p-5">
      <template #status="{ item }">
        <table
          class="w-full rounded-xl text-center table-fixed table-pin-rows my-3 shadow-lg">
          <thead>
            <tr class="h-12 bg-gray-200 dark:bg-slate-700 text-xs">
              <th class="text-gray-900 dark:text-white text-sm">
                {{ m.usTeam?.name }}
              </th>
              <th style="width:20%">
                <UIcon name="fxemoji:squaredvs" class="text-2xl" />
              </th>
              <th class="text-gray-900 dark:text-white text-sm">
                {{ m.themTeam.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.ekak }}
              </td>
              <td class="px-0">عدد الأكك</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.ekak }}
              </td>
            </tr>
            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.aklat }}
              </td>
              <td class="px-0">الأكلات</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.aklat }}
              </td>
            </tr>

            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.moshtaraSunCount }}
              </td>
              <td class="px-0">مشترى صن</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.moshtaraSunCount }}
              </td>
            </tr>

            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.moshtaraHokmCount }}
              </td>
              <td class="px-0">مشترى حكم</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.moshtaraHokmCount }}
              </td>
            </tr>

            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.wonMoshtaraCount }}
              </td>
              <td class="px-0">مشتريات ناجحة</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.wonMoshtaraCount }}
              </td>
            </tr>

            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.lostMoshtaraCount }}
              </td>
              <td class="px-0">مشتريات خسرانة</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.lostMoshtaraCount }}
              </td>
            </tr>

            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.sra }}
              </td>
              <td class="px-0">سرا</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.sra }}
              </td>
            </tr>

            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.baloot }}
              </td>
              <td class="px-0">بلوت</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.baloot }}
              </td>
            </tr>

            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.khamsen }}
              </td>
              <td class="px-0">خمسين</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.khamsen }}
              </td>
            </tr>

            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.me2a }}
              </td>
              <td class="px-0">مية</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.me2a }}
              </td>
            </tr>

            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.rob3ome2a }}
              </td>
              <td class="px-0">أربعمية</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.rob3ome2a }}
              </td>
            </tr>

            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.sunKaboot }}
              </td>
              <td class="px-0">عدد الكبابيت صن</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.sunKaboot }}
              </td>
            </tr>

            <tr
              class="h-8 even:dark:bg-slate-500 odd:dark:bg-slate-600 even:bg-slate-50 odd:bg-slate-100">
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusUs?.hokmKaboot }}
              </td>
              <td class="px-0">عدد الكبابيت حكم</td>
              <td
                class="font-semibold text-md text-blue-950 dark:text-slate-50">
                {{ statusThem?.hokmKaboot }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>

      <template #news="{ item }">
        <div class="flex flex-col gap-2 w-full overflow-y-scroll h-[500px] ">
          <div class="flex justify-between font-bold">
            <div class="flex flex-col gap-1 justify-center items-center " >
              <p  >{{ m.usTeam?.name }}</p>
              <p>{{ game.usGameScore }}</p>
            </div>
            <div class="flex flex-col gap-1 justify-center items-center ">
              <UIcon name="fxemoji:squaredvs" class="text-2xl" />
              <p>:</p>
            </div>
            <div class="flex flex-col gap-1 justify-center items-center ">
              <p>
                {{ m.themTeam?.name }}
              </p>
              <p>
                {{ game.themGameScore }}
              </p>
            </div>
          </div>
          {{  m.winner&&m.winner!== null? m.winner?.toLowerCase():'ss'}}
          <p> winner :{{ m.winner&& m.winner.toLowerCase() == 'us'? m.usTeam.name : m.themTeam.name }}</p>

          <p>{{ new Date(game.endedAt).toLocaleString() }}</p>
          <p>{{ new Date(game.startedAt).toLocaleString() }}</p>
          <p>{{ new Date(game.endedAt).toLocaleString() }}</p>
          <div v-for="sakka in game.sakkas">
            <p> sakka winner :{{ sakka.winner&& sakka.winner.toLowerCase() == 'us'? m.usTeam.name : m.themTeam.name }}</p>
            
          </div>
          
        </div>
      </template>
    </UTabs>
  </UModal>
</template>

<script lang="ts" setup>
import type { Match } from "~/models/group";

const props = defineProps<{ m: Match }>();
const emit = defineEmits(["success"]);
const matchaapi = useMatch();
const DataREQ = await matchaapi.getMatchData();
const modal = useModal();
const statusREQ = await matchaapi.getMatchStatstics();
if (props.m.qydhaGameId) {
  await DataREQ.fetchREQ(props.m.qydhaGameId);
  if (DataREQ.status.value == "error") {
    modal.close();
  }
  await statusREQ.fetchREQ(props.m.qydhaGameId);
  if (statusREQ.status.value == "error") {
    modal.close();
  }
} else {
  modal.close();
}
const statusUs = computed(() => {
  return statusREQ.data.value?.data.statistics.usStatistics;
});
const statusThem = computed(() => {
  return statusREQ.data.value?.data.statistics.themStatistics;
});
const game = computed(() => {
  return DataREQ.data.value?.data!;
});

function onSuccess() {
  emit("success");
}

const items = [
  {
    slot: "status",
    label: "الاحصائيات",
  },
  {
    slot: "news",
    label: "النشرة",
  },
];
</script>

<style></style>
