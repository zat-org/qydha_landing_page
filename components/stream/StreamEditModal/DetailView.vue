<template>
    <UFormField label="Detail Score Color" name="detailScore.color">
        <UInput v-model="detailScoreColor" type="color" />
    </UFormField>
    <UFormField label="Detail Font size" name="detailScore.fontSize">
        <UInput v-model="detailScoreFontSize" type="number" />
    </UFormField>
</template>
<script lang="ts" setup>
const detailScoreColor = defineModel<string>('detailScoreColor');
const detailScoreFontSize = defineModel<number>('detailScoreFontSize');
</script>
<style scoped></style>