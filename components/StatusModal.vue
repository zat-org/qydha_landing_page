<template>
  <UModal class="w-[500px]">
    <UTabs :items="items" class="w-full">
      <template #status="{ item }" class="p-5">
       
        <table
          class="w-full rounded-t-lg text-center table-fixed table-pin-rows my-3 shadow-lg">
          <thead>
            <tr class="h-12 bg-gray-200 dark:bg-slate-700">
              <th class="text-lg text-gray-900 dark:text-white">
                {{ m.usTeam?.name }}
              </th>
              <th>
                <UIcon name="fxemoji:squaredvs" width="30" height="30" />
              </th>
              <th class="text-lg text-gray-900 dark:text-white">
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

      <template #news="{ item }"> label: 'النشرة' </template>
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
