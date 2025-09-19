<template>
    <div class="flex justify-center gap-5 w-[90%] mb-[10px]">
        <UFormField label="اسماء الفرق">
            <UButtonGroup size="xs" class="control-panel direction-controls">
                <UButtonGroup orientation="vertical" size="xs" class="vertical-controls">
                    <StreamHoldButton icon="heroicons:arrow-up-16-solid" :step="1"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :action="(step: number) => {
                            leftTeamNameTop -= step;
                            rightTeamNameTop -= step;
                        }
                            "></StreamHoldButton>
                    <StreamHoldButton icon="heroicons:arrow-down-16-solid" :step="1"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :action="(step: number) => {
                            leftTeamNameTop += step;
                            rightTeamNameTop += step;
                        }
                            "></StreamHoldButton>
                </UButtonGroup>
                <StreamHoldButton icon="lucide:expand" :step="1"
                    class="control-btn hover:bg-green-100 active:bg-green-200" :action="(step: number) => {
                        leftTeamNameSize += step;
                        rightTeamNameSize += step;
                    }
                        "></StreamHoldButton>
                <StreamHoldButton icon="lucide:shrink" :step="1"
                    class="control-btn hover:bg-green-100 active:bg-green-200" :action="(step: number) => {
                        leftTeamNameSize -= step;
                        rightTeamNameSize -= step;
                    }
                        "></StreamHoldButton>
            </UButtonGroup>
        </UFormField>
        <UFormField label="النتيجة">
            <UButtonGroup size="xs" class="control-panel direction-controls">
                <UButtonGroup orientation="vertical" size="xs" class="vertical-controls">
                    <StreamHoldButton icon="heroicons:arrow-up-16-solid" :step="1"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :action="(step: number) => {
                            leftTeamScoreTop -= step;
                            rightTeamScoreTop -= step;
                        }
                            "></StreamHoldButton>
                    <StreamHoldButton icon="heroicons:arrow-down-16-solid" :step="1"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200" :action="(step: number) => {
                            leftTeamScoreTop += step;
                            rightTeamScoreTop += step;
                        }
                            "></StreamHoldButton>
                </UButtonGroup>
                <StreamHoldButton icon="lucide:expand" :step="1"
                    class="control-btn hover:bg-green-100 active:bg-green-200" :action="(step: number) => {
                        leftTeamScoreSize += step;
                        rightTeamScoreSize += step;
                    }
                        "></StreamHoldButton>
                <StreamHoldButton icon="lucide:shrink" :step="1"
                    class="control-btn hover:bg-green-100 active:bg-green-200" :action="(step: number) => {
                        leftTeamScoreSize -= step;
                        rightTeamScoreSize -= step;
                    }
                        "></StreamHoldButton>
            </UButtonGroup>
        </UFormField>
    </div>
    <UAccordion :items="Teamsitems">
        <template #leftTeam>
            <div class="flex justify-between">
                <UFormField label="اسم الفريق">
                    <UButtonGroup size="xs" class="control-panel direction-controls">
                        <StreamHoldButton class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            icon="heroicons:arrow-right-16-solid" :step="1" :action="(step: number) =>
                                (leftTeamNameLeft += step)
                                "></StreamHoldButton>

                        <UButtonGroup class="vertical-controls" orientation="vertical" size="xs">
                            <StreamHoldButton class="control-btn hover:bg-blue-100 active:bg-blue-200"
                                icon="heroicons:arrow-up-16-solid" :step="1" :action="(step: number) =>
                                    (leftTeamNameTop -= step)
                                    "></StreamHoldButton>
                            <StreamHoldButton class="control-btn hover:bg-blue-100 active:bg-blue-200"
                                icon="heroicons:arrow-down-16-solid" :step="1" :action="(step: number) =>
                                    (leftTeamNameTop += step)
                                    "></StreamHoldButton>
                        </UButtonGroup>
                        <StreamHoldButton class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            icon="heroicons:arrow-left-16-solid" :step="1" :action="(step: number) =>
                                (leftTeamNameLeft -= step)
                                "></StreamHoldButton>

                        <StreamHoldButton class="control-btn hover:bg-blue-100 active:bg-blue-200" icon="ooui:bigger"
                            :step="1" :action="(step: number) =>
                                (leftTeamNameSize += step)
                                "></StreamHoldButton>
                        <StreamHoldButton class="control-btn hover:bg-blue-100 active:bg-blue-200" icon="ooui:smaller"
                            :step="1" :action="(step: number) =>
                                (leftTeamNameSize -= step)
                                "></StreamHoldButton>
                    </UButtonGroup>
                </UFormField>
                <UFormField label="النتيجة">
                    <UButtonGroup size="xs" class="control-panel direction-controls">
                        <StreamHoldButton icon="heroicons:arrow-right-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) =>
                                (leftTeamScoreLeft += step)
                                "></StreamHoldButton>

                        <UButtonGroup orientation="vertical" size="xs" class="vertical-controls">
                            <StreamHoldButton icon="heroicons:arrow-up-16-solid"
                                class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) =>
                                    (leftTeamScoreTop -= step)
                                    "></StreamHoldButton>
                            <StreamHoldButton icon="heroicons:arrow-down-16-solid"
                                class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) =>
                                    (leftTeamScoreTop += step)
                                    "></StreamHoldButton>
                        </UButtonGroup>
                        <StreamHoldButton icon="heroicons:arrow-left-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) =>
                                (leftTeamScoreLeft -= step)
                                "></StreamHoldButton>

                        <StreamHoldButton icon="ooui:bigger" class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            :step="1" :action="(step: number) =>
                                (leftTeamScoreSize += step)
                                "></StreamHoldButton>
                        <StreamHoldButton icon="ooui:smaller" class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            :step="1" :action="(step: number) =>
                                (leftTeamScoreSize -= step)
                                "></StreamHoldButton>
                    </UButtonGroup>
                </UFormField>
            </div>
        </template>
        <template #rightTeam>
            <div class="flex justify-between">
                <UFormField label="اسم الفريق">
                    <UButtonGroup size="xs" class="control-panel direction-controls">
                        <StreamHoldButton class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            icon="heroicons:arrow-right-16-solid" :step="1" :action="(step: number) =>
                                (rightTeamNameLeft += step)
                                "></StreamHoldButton>

                        <UButtonGroup class="vertical-controls" orientation="vertical" size="xs">
                            <StreamHoldButton class="control-btn hover:bg-blue-100 active:bg-blue-200"
                                icon="heroicons:arrow-up-16-solid" :step="1" :action="(step: number) =>
                                    (rightTeamNameTop -= step)
                                    "></StreamHoldButton>
                            <StreamHoldButton class="control-btn hover:bg-blue-100 active:bg-blue-200"
                                icon="heroicons:arrow-down-16-solid" :step="1" :action="(step: number) =>
                                    (rightTeamNameTop += step)
                                    "></StreamHoldButton>
                        </UButtonGroup>
                        <StreamHoldButton class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            icon="heroicons:arrow-left-16-solid" :step="1" :action="(step: number) =>
                                (rightTeamNameLeft -= step)
                                "></StreamHoldButton>

                        <StreamHoldButton class="control-btn hover:bg-blue-100 active:bg-blue-200" icon="ooui:bigger"
                            :step="1" :action="(step: number) =>
                                (rightTeamNameSize += step)
                                "></StreamHoldButton>
                        <StreamHoldButton class="control-btn hover:bg-blue-100 active:bg-blue-200" icon="ooui:smaller"
                            :step="1" :action="(step: number) =>
                                (rightTeamNameSize -= step)
                                "></StreamHoldButton>
                    </UButtonGroup>
                </UFormField>
                <UFormField label="النتيجة">
                    <UButtonGroup size="xs" class="control-panel direction-controls">
                        <StreamHoldButton icon="heroicons:arrow-right-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) =>
                                (rightTeamScoreLeft += step)
                                "></StreamHoldButton>

                        <UButtonGroup orientation="vertical" size="xs" class="vertical-controls">
                            <StreamHoldButton icon="heroicons:arrow-up-16-solid"
                                class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) =>
                                    (rightTeamScoreTop -= step)
                                    "></StreamHoldButton>
                            <StreamHoldButton icon="heroicons:arrow-down-16-solid"
                                class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) =>
                                    (rightTeamScoreTop += step)
                                    "></StreamHoldButton>
                        </UButtonGroup>
                        <StreamHoldButton icon="heroicons:arrow-left-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200" :step="1" :action="(step: number) =>
                                (rightTeamScoreLeft -= step)
                                "></StreamHoldButton>

                        <StreamHoldButton icon="ooui:bigger" class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            :step="1" :action="(step: number) =>
                                (rightTeamScoreSize += step)
                                "></StreamHoldButton>
                        <StreamHoldButton icon="ooui:smaller" class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            :step="1" :action="(step: number) =>
                                (rightTeamScoreSize -= step)
                                "></StreamHoldButton>
                    </UButtonGroup>
                </UFormField>
            </div>
        </template>
    </UAccordion>
</template>
<script setup lang="ts">

const leftTeamNameTop = defineModel<number>('leftTeamNameTop', { default: 0 });
const leftTeamNameLeft = defineModel<number>('leftTeamNameLeft', { default: 0 });
const leftTeamNameSize = defineModel<number>('leftTeamNameSize', { default: 0 });

const leftTeamScoreTop = defineModel<number>('leftTeamScoreTop', { default: 0 });
const leftTeamScoreLeft = defineModel<number>('leftTeamScoreLeft', { default: 0 });
const leftTeamScoreSize = defineModel<number>('leftTeamScoreSize', { default: 0 });


const rightTeamNameTop = defineModel<number>('rightTeamNameTop', { default: 0 });
const rightTeamNameLeft = defineModel<number>('rightTeamNameLeft', { default: 0 });
const rightTeamNameSize = defineModel<number>('rightTeamNameSize', { default: 0 });

const rightTeamScoreTop = defineModel<number>('rightTeamScoreTop', { default: 0 });
const rightTeamScoreLeft = defineModel<number>('rightTeamScoreLeft', { default: 0 });
const rightTeamScoreSize = defineModel<number>('rightTeamScoreSize', { default: 0 });


const Teamsitems = [
    {
        label: "الفريق الايسر",
        slot: "leftTeam",
    },
    {
        label: "الفريق الايمن",
        slot: "rightTeam",
    },
];
</script>
<style scoped></style>