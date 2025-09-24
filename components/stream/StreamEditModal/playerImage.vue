<template>
    <div class="flex flex-col gap-3">
        <div class="flex justify-between gap-3">
            <UFormField label=" اللاعب الايمن">
                <UButtonGroup size="xs" class="control-panel direction-controls"  >
                    <StreamHoldButton icon="heroicons:arrow-right-16-solid" 
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (rightPlayerRight! -= step)
                            "></StreamHoldButton>

                    <UButtonGroup orientation="vertical" size="xs" class="vertical-controls">
                        <StreamHoldButton icon="heroicons:arrow-up-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (rightPlayerTop! += step)
                                "></StreamHoldButton>
                        <StreamHoldButton icon="heroicons:arrow-down-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (rightPlayerTop! -= step)
                                "></StreamHoldButton>
                    </UButtonGroup>

                    <StreamHoldButton icon="heroicons:arrow-left-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (rightPlayerRight! += step)
                            "></StreamHoldButton>
                </UButtonGroup>
            </UFormField>

            <div class="flex flex-col gap-2 items-center justify-end">
                <StreamHoldButton icon="mdi:arrow-expand-horizontal"
                    class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => {
                        leftPlayerLeft! -= step;
                        rightPlayerRight! -= step;
                    }
                        " />
                <StreamHoldButton icon="uil:arrow-compress-h" class="control-btn hover:bg-blue-100 active:bg-blue-200"
                    :step="1" :action="(step: number) => {
                        leftPlayerLeft! += step;
                        rightPlayerRight! += step;
                    }
                        " />
            </div>
            <UFormField label=" اللاعب الايسر">
                <UButtonGroup size="xs" class="control-panel direction-controls">
                    <StreamHoldButton icon="heroicons:arrow-right-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (leftPlayerLeft! += step)
                            "></StreamHoldButton>

                    <UButtonGroup orientation="vertical" size="xs" class="vertical-controls">
                        <StreamHoldButton icon="heroicons:arrow-up-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (leftPlayerTop! += step)
                                "></StreamHoldButton>
                        <StreamHoldButton icon="heroicons:arrow-down-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (leftPlayerTop! -= step)
                                "></StreamHoldButton>
                    </UButtonGroup>

                    <StreamHoldButton icon="heroicons:arrow-left-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (leftPlayerLeft! -= step)
                            "></StreamHoldButton>
                </UButtonGroup>
            </UFormField>

            <UFormField label=" اللاعب المنتصف">
                <UButtonGroup size="xs" class="control-panel direction-controls">
                    <StreamHoldButton icon="heroicons:arrow-right-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (bottomPlayerLeft!         -= step)
                            "></StreamHoldButton>
                    <UButtonGroup orientation="vertical" size="xs" class="vertical-controls">
                        <StreamHoldButton icon="heroicons:arrow-up-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (bottomPlayerBottom! += step)
                                "></StreamHoldButton>
                        <StreamHoldButton icon="heroicons:arrow-down-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (bottomPlayerBottom! -= step)
                                "></StreamHoldButton>
                    </UButtonGroup>

                    <StreamHoldButton icon="heroicons:arrow-left-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (bottomPlayerLeft! += step)
                            "></StreamHoldButton>
                </UButtonGroup>
            </UFormField>
        </div>
        <UFormField label="حجم صور الاعبين" name="playerImageWidth">
            <UInput v-model.number="playerImageWidth" type="number" />
        </UFormField>
    </div>
</template>

<script lang="ts" setup>
const rightPlayerRight = defineModel<number>('rightPlayerRight');
const rightPlayerTop = defineModel<number>('rightPlayerTop');

const leftPlayerLeft = defineModel<number>('leftPlayerLeft');
const leftPlayerTop = defineModel<number>('leftPlayerTop');

const bottomPlayerBottom = defineModel<number>('bottomPlayerBottom');
const bottomPlayerLeft = defineModel<number>('bottomPlayerLeft');

const playerImageWidth = defineModel<number>('playerImageWidth');

</script>

<style scoped></style>