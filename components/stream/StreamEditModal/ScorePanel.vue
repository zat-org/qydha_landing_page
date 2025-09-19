<template>
    <div class="flex gap-5">
        <UFormField label="النتيجة">
            <UButtonGroup class="control-panel direction-controls" size="xs">
                <StreamHoldButton icon="heroicons:arrow-small-up-20-solid" :step="1"
                    class="control-btn hover:bg-blue-100 active:bg-blue-200" :action="(step: number) => (topMargin -= step)
                        "></StreamHoldButton>
                <StreamHoldButton icon="heroicons:arrow-small-down-20-solid"
                    class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (topMargin += step)
                        "></StreamHoldButton>
            </UButtonGroup>
        </UFormField>

        <UFormField label="اللوجو">
            <UButtonGroup size="xs" class="control-panel direction-controls">
                <StreamHoldButton icon="heroicons:arrow-right-16-solid" :step="1"
                    class="control-btn hover:bg-blue-100 active:bg-blue-200" :action="(step: number) => (positionLeft += step)
                        "></StreamHoldButton>

                <UButtonGroup orientation="vertical" size="xs" class="vertical-controls">
                    <StreamHoldButton icon="heroicons:arrow-up-16-solid" :step="1"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :action="(step: number) =>
                            (positionTop -= step)
                            "></StreamHoldButton>
                    <StreamHoldButton icon="heroicons:arrow-down-16-solid" :step="1"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :action="(step: number) =>
                            (positionTop += step)
                            "></StreamHoldButton>
                </UButtonGroup>

                <StreamHoldButton icon="heroicons:arrow-left-16-solid" :step="1"
                    class="control-btn hover:bg-blue-100 active:bg-blue-200" :action="(step: number) => (positionLeft -= step)
                        "></StreamHoldButton>

                <StreamHoldButton icon="lucide:expand" :step="0.01"
                    class="control-btn hover:bg-green-100 active:bg-green-200" :action="(step: number) =>
                        (positionScale += step)
                        "></StreamHoldButton>
                <StreamHoldButton icon="lucide:shrink" :step="0.01"
                    class="control-btn hover:bg-green-100 active:bg-green-200" :action="(step: number) =>
                        (positionScale -= step)
                        "></StreamHoldButton>
            </UButtonGroup>
        </UFormField>
    </div>
</template>
<script setup lang="ts">
const topMargin = defineModel<number>('topMargin',{default:0});
const positionLeft = defineModel<number>('positionLeft',{default:0});
const positionTop = defineModel<number>('positionTop',{default:0});
const positionScale = defineModel<number>('positionScale',{default:0});

</script>
<style scoped></style>