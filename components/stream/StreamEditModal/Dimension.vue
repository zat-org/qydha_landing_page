<template>
        <div class="grid grid-cols-2 gap-2">
            <UFormField label="العرض" name="dimension.width">
                <UInput v-model.number="width" type="number" />
            </UFormField>
            <UFormField label="الطول" name="dimension.height">
                <UInput v-model.number="height" type="number" />
            </UFormField>
        </div>
</template>
<script setup lang="ts">
const width = defineModel<number>('width');
const height = defineModel<number>('height');
</script>
<style scoped></style>
