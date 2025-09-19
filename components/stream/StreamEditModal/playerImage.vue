<template>
    <div class="flex flex-col gap-3">
        <div class="flex justify-between gap-3">
            <UFormField label=" اللاعب الايمن">
                <UButtonGroup size="xs" class="control-panel direction-controls">
                    <StreamHoldButton icon="heroicons:arrow-right-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (RightPlayerRight -= step)
                            "></StreamHoldButton>

                    <UButtonGroup orientation="vertical" size="xs" class="vertical-controls">
                        <StreamHoldButton icon="heroicons:arrow-up-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (RightPlayerTop += step)
                                "></StreamHoldButton>
                        <StreamHoldButton icon="heroicons:arrow-down-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (RightPlayerTop -= step)
                                "></StreamHoldButton>
                    </UButtonGroup>

                    <StreamHoldButton icon="heroicons:arrow-left-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (RightPlayerRight += step)
                            "></StreamHoldButton>
                </UButtonGroup>
            </UFormField>

            <div class="flex flex-col gap-2 items-center justify-end">
                <StreamHoldButton icon="mdi:arrow-expand-horizontal"
                    class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => {
                        LeftPlayerLeft -= step;
                        RightPlayerRight -= step;
                    }
                        " />
                <StreamHoldButton icon="uil:arrow-compress-h" class="control-btn hover:bg-blue-100 active:bg-blue-200"
                    :step="1" :action="(step: number) => {
                        LeftPlayerLeft += step;
                        RightPlayerRight += step;
                    }
                        " />
            </div>
            <UFormField label=" اللاعب الايسر">
                <UButtonGroup size="xs" class="control-panel direction-controls">
                    <StreamHoldButton icon="heroicons:arrow-right-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (LeftPlayerLeft += step)
                            "></StreamHoldButton>

                    <UButtonGroup orientation="vertical" size="xs" class="vertical-controls">
                        <StreamHoldButton icon="heroicons:arrow-up-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (LeftPlayerTop += step)
                                "></StreamHoldButton>
                        <StreamHoldButton icon="heroicons:arrow-down-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (LeftPlayerTop -= step)
                                "></StreamHoldButton>
                    </UButtonGroup>

                    <StreamHoldButton icon="heroicons:arrow-left-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (LeftPlayerLeft -= step)
                            "></StreamHoldButton>
                </UButtonGroup>
            </UFormField>

            <UFormField label=" اللاعب المنتصف">
                <UButtonGroup size="xs" class="control-panel direction-controls">
                    <StreamHoldButton icon="heroicons:arrow-right-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (BottomPlayerLeft -= step)
                            "></StreamHoldButton>
                    <UButtonGroup orientation="vertical" size="xs" class="vertical-controls">
                        <StreamHoldButton icon="heroicons:arrow-up-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (BottomPlayerBottom += step)
                                "></StreamHoldButton>
                        <StreamHoldButton icon="heroicons:arrow-down-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (BottomPlayerBottom -= step)
                                "></StreamHoldButton>
                    </UButtonGroup>

                    <StreamHoldButton icon="heroicons:arrow-left-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) => (BottomPlayerLeft += step)
                            "></StreamHoldButton>
                </UButtonGroup>
            </UFormField>
        </div>
        <UFormField label="حجم صور الاعبين" name="PlayerImageWidth">
            <UInput v-model.number="PlayerImageWidth" type="number" />
        </UFormField>
    </div>
</template>

<script lang="ts" setup>
const RightPlayerRight = defineModel<number>('RightPlayerRight', { default: 0 });
const RightPlayerTop = defineModel<number>('RightPlayerTop', { default: 0 });

const LeftPlayerLeft = defineModel<number>('LeftPlayerLeft', { default: 0 });
const LeftPlayerTop = defineModel<number>('LeftPlayerTop', { default: 0 });

const BottomPlayerBottom = defineModel<number>('BottomPlayerBottom', { default: 0 });
const BottomPlayerLeft = defineModel<number>('BottomPlayerLeft', { default: 0 });

const PlayerImageWidth = defineModel<number>('PlayerImageWidth', { default: 0 });

</script>

<style scoped></style>