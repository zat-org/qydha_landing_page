<template>

    <div class="space-y-2">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
            <UIcon name="mdi:user" class="me-1" /> الاسم
        </span>
        <p class="text-center">{{ playerState.player.name }}</p>
    </div>
    <div class="space-y-2">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
            <UIcon name="ic:baseline-phone" class="me-1" /> رقم الهاتف
        </span>
        <p class="text-center">{{ playerState.player.phone }}</p>
    </div>

    <div class="space-y-2">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
            <UIcon name="ic:baseline-email" class="me-1" /> الايميل
        </span>
        <p class="text-center">{{ playerState.player.email }}</p>
    </div>

    <div class="space-y-2">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
            <UIcon name="mdi:key" class="me-1" /> الرقم المرجعي
        </span>
        <p class="text-center">{{ playerState.player.id }}</p>
    </div>
    <div class="space-y-2" v-if="playerState.player.comment">
        <span class="flex justify-center items-center bg-slate-100 rounded-full">
            <UIcon name="mdi:comment" class="me-1" /> المتطلبات
        </span>
        <p class="text-center">{{ playerState.player.comment }}</p>
    </div>

</template>

<script lang="ts" setup>
import { type State } from "~/models/Player";
defineProps<{ playerState: State }>();

</script>

<style></style>
