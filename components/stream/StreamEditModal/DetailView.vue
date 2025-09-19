<template>
    <UFormField label="Detail Score Color" name="DetailScore.Color">
        <UInput v-model="DetailScoreColor" type="color" />
    </UFormField>
    <UFormField label="Detail Font size" name="DetailScore.FontSize">
        <UInput v-model="DetailScoreFontSize" type="number" />
    </UFormField>
</template>
<script lang="ts" setup>
const DetailScoreColor = defineModel<string>('DetailScoreColor', { default: '#000000' });
const DetailScoreFontSize = defineModel<number>('DetailScoreFontSize', { default: 70 });
</script>
<style scoped></style>