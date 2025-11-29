<template>
    <UDrawer v-model:open="open" direction="left" :handle="false">
        <template #header>
            <h1>انشاء مباراة</h1>
        </template>
        <template #body> 
            <div class="w-[500px]"></div>
        </template>
    </UDrawer>
</template>

<script lang="ts" setup>
const open = ref(false)
defineExpose({
    open
})
</script>