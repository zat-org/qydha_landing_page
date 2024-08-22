<template>

    <div class=" flex justify-start">
        <span class="flex justify-center items-center bg-slate-100 rounded-r-full px-3">
            <UIcon name="mdi:key" class="me-1" />
        </span>
        <p class=" text-center bg-slate-200 grow  rounded-l-full ">{{ teamData.id }}</p>
    </div>
    <div class=" flex justify-start">
        <span class="flex justify-center items-center bg-slate-100 rounded-r-full px-3">
            <UIcon name="ri:team-fill" class="me-1" />
        </span>
        <p class="text-center bg-slate-200 grow h-full p-0 m-0 rounded-l-full line-clamp-1">{{ teamData.name }}</p>
    </div>

    <div class=" flex justify-start">
        <span class="flex justify-center items-center bg-slate-100 rounded-r-full px-3">
            <UIcon name="mingcute:paper-line" class="me-1" />
        </span>
        <p class="text-center bg-slate-200 grow h-full p-0 m-0 rounded-l-full">{{ teamState }}</p>
    </div>

</template>

<script lang="ts" setup>
import { PlayerState, type TeamData } from "~/models/Player";
const props = defineProps<{ teamData: TeamData }>();
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
