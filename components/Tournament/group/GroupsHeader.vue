<template>
    <div class="flex flex-col gap-6 w-full">
        <div class="flex items-center gap-4">
            <UButton :to="`/tournament/${tournamentId}`" icon="i-heroicons-arrow-right" variant="ghost">
                عودة
            </UButton>
            <div>
                <h1 class="text-xl font-bold">مجموعات البطولة</h1>
                <p class="text-gray-500 mt-1 text-sm">عرض المجموعات والجولات والمباريات</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    tournamentId: string;
}

defineProps<Props>();
</script>

