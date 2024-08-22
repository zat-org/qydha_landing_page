<template>

    <div class="space-y-2">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
            <UIcon name="mdi:user" class="me-1" /> الاسم
        </span>
        <p class="text-center">{{ playerState.name }}</p>
    </div>
    <div class="space-y-2">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
            <UIcon name="ic:baseline-phone" class="me-1" /> رقم الهاتف
        </span>
        <p class="text-center">{{ playerState.phone }}</p>
    </div>

    <div class="space-y-2">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
            <UIcon name="ic:baseline-email" class="me-1" /> الايميل
        </span>
        <p class="text-center">{{ playerState.email }}</p>
    </div>

    <div class="space-y-2">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
            <UIcon name="mdi:key" class="me-1" /> الرقم المرجعي
        </span>
        <p class="text-center">{{ playerState.id }}</p>
    </div>
    <div class="space-y-2" v-if="playerState.comment">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
            <UIcon name="mdi:comment" class="me-1" /> التعليق
        </span>
        <p class="text-center">{{ playerState.comment }}</p>
    </div>
    <div class="space-y-2" v-if="playerState.teamId">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
            <UIcon name="ri:team-fill" class="me-1" /> الفريق الخاص بك
        </span>
        <p class="text-center">{{ playerState.teamId }}</p>
    </div>
</template>

<script lang="ts" setup>
import { type State } from "~/models/Player";
defineProps<{ playerState: State }>();

</script>

<style></style>
