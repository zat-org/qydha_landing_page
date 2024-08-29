<template>

    <div class=" flex justify-start">
        <span class="flex justify-center items-center bg-slate-100 rounded-r-full px-3 text-sm">
            <UIcon name="mdi:key" class="me-1" /> رقم الفريق
        </span>
        <p class=" text-center bg-slate-200 grow  rounded-l-full ">{{ teamData.id }}</p>
    </div>
    <div class=" flex justify-start">
        <span class="flex justify-center items-center bg-slate-100 rounded-r-full px-3 text-sm">
            <UIcon name="ri:team-fill" class="me-1" /> اللاعبين
        </span>
        <p class="text-center bg-slate-200 grow h-full p-0 m-0 rounded-l-full text-sm">{{ teamData.name }}</p>
    </div>

    <div class=" flex justify-start">
        <span class="flex justify-center items-center bg-slate-100 rounded-r-full px-3 text-sm">
            <UIcon name="clarity:group-line" class="me-1" />المجموعة
        </span>
        <p class="text-center bg-slate-200 grow h-full p-0 m-0 rounded-l-full text-sm">{{ teamData.group.name }}</p>
    </div>
    <div class=" flex justify-start">
        <span class="flex justify-center items-center bg-slate-100 rounded-r-full px-3 text-sm">
            <UIcon name="mdi:bracket" class="me-1" /> المستوي
        </span>
        <p 
        :class="{
            'bg-emerald-400': level == 1,
            'bg-amber-400': level == 2,
            'bg-indigo-400': level == 3,
            'bg-cyan-400': level == 4,
          }"
        class="text-center grow h-full p-0 m-0 rounded-l-full text-sm">  المستوي {{level }}</p>
    </div>

    <div class=" flex justify-start">
        <span class="flex justify-center items-center bg-slate-100 rounded-r-full px-3 text-sm">
            <UIcon name="mdi:clock-time-ten" class="me-1" /> موعد الوصول
        </span>
        <p class="text-center bg-slate-200 grow h-full p-0 m-0 rounded-l-full text-sm">
            {{ new Date(teamData.group.checkInAt).toISOString().split('T')[0] }} -
            {{ new Date(teamData.group.checkInAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
            }) }}
        </p>
    </div>
    <UAlert class="mt-2" icon="hugeicons:alert-02" color="red" variant="soft">
        <template #icon="{ icon }">
            <UIcon :name="icon" class="text-2xl" />
        </template>
        <template #description>
            <div class="text-red-600">
                <p class="text-right">
                    فى حالة تأخرك عن موعد الوصول المحدد بـ 40 دقيقة سيتم استبعادك من البطولة
                </p>
            </div>
        </template>
    </UAlert>
</template>

<script lang="ts" setup>
import { PlayerState, type TeamData } from "~/models/Player";
const props = defineProps<{ teamData: TeamData ,level :number }>();
const teamState = computed(() => {
    switch (props.teamData.state) {
        case PlayerState.Approved:
            return "مقبول"
        case PlayerState.Rejected:
            return "مرفوض"
        case PlayerState.Pending:
            return "معلق ( برجاء تحديث البيانات )"
        default:
            return "غير معروف"
    }
})
</script>

<style></style>
