<template>
    <UModal title="تعديل إعدادات الطاولة" description="تعديل إعدادات الطاولة">
        <!-- <template #header>
            <h3 class="text-xl font-bold">تعديل إعدادات الطاولة</h3>
          </template> -->
        <template #body>

            <UForm :schema="schema" :state="state" @submit="onSubmit" ref="updateForm">
                <UAccordion :items="items">
                    <template #dimension>
                        <Dimension v-model:width="state.dimension.width" v-model:height="state.dimension.height" />
                    </template>

                    <template #scorePanel>
                        <ScorePanel v-model:topMargin="state.scorePanel.topMargin"
                            v-model:positionLeft="state.scorePanel.position.left"
                            v-model:positionTop="state.scorePanel.position.top"
                            v-model:positionScale="state.scorePanel.position.scale" />
                    </template>

                    <template #Teams>
                        <Teams v-model:leftTeamNameTop="state.scorePanel.leftTeam.name.top"
                            v-model:leftTeamNameLeft="state.scorePanel.leftTeam.name.left"
                            v-model:leftTeamNameSize="state.scorePanel.leftTeam.name.size"
                            v-model:leftTeamScoreTop="state.scorePanel.leftTeam.score.top"
                            v-model:leftTeamScoreLeft="state.scorePanel.leftTeam.score.left"
                            v-model:leftTeamScoreSize="state.scorePanel.leftTeam.score.size"
                            v-model:rightTeamNameTop="state.scorePanel.rightTeam.name.top"
                            v-model:rightTeamNameLeft="state.scorePanel.rightTeam.name.left"
                            v-model:rightTeamNameSize="state.scorePanel.rightTeam.name.size"
                            v-model:rightTeamScoreTop="state.scorePanel.rightTeam.score.top"
                            v-model:rightTeamScoreLeft="state.scorePanel.rightTeam.score.left"
                            v-model:rightTeamScoreSize="state.scorePanel.rightTeam.score.size" />
                    </template>

                    <template #playerImages>
                        <PlayerImage v-model:RightPlayerRight="state.RightPlayer.right"
                            v-model:RightPlayerTop="state.RightPlayer.top"
                            v-model:LeftPlayerLeft="state.LeftPlayer.left" v-model:LeftPlayerTop="state.LeftPlayer.top"
                            v-model:BottomPlayerBottom="state.BottomPlayer.bottom"
                            v-model:BottomPlayerLeft="state.BottomPlayer.left"
                            v-model:PlayerImageWidth="state.PlayerImageWidth" />
                    </template>

                    <template #detailView>
                        <DetailView v-model:DetailScoreColor="state.DetailScore.Color"
                            v-model:DetailScoreFontSize="state.DetailScore.FontSize" />
                    </template>

                </UAccordion>
            </UForm>

        </template>

        <template #footer>
            <div class="flex justify-between items-center">
                <UButton @click="closeModal()" color="error"> غلق </UButton>
                <UButton @click="resetBoard()">اعادة الضبط </UButton>
                <UButton @click="updateBoard()">حفظ </UButton>
            </div>
        </template>

    </UModal>
</template>

<script lang="ts" setup>
import ScorePanel from "./ScorePanel.vue";
import Dimension from "./Dimension.vue";
import Teams from "./Teams.vue";
import PlayerImage from "./playerImage.vue";
import DetailView from "./DetailView.vue";
import { object, string, number } from "yup";
import type { TableData, TableUpdate } from "~/composables/BoardFB";
import { useMyAuthStore } from "~/store/Auth";
const updateForm = ref<HTMLFormElement>();
const authstore = useMyAuthStore();
const boardID = computed(() => {
    console.log(authstore.user)
    if (authstore.user?.boardLink) {
        const linkParts = authstore.user.boardLink.split("/");
        return linkParts[linkParts.length - 1];
    }
    return undefined;
});

let data: TableData | null = null;

// Wait for boardID to be available before fetching data
if (boardID.value) {
    data = await useBoardFB().getOrCreateTable(boardID.value);
}
const schema = object({
    dimension: object({
        width: number().required(),
        height: number().required(),
    }),
    scorePanel: object({
        topMargin: number().required(),
        height: number().required(),
        leftTeam: object({
            name: object({
                size: number().required(),
                top: number().required(),
                left: number().required(),
            }),
            score: object({
                size: number().required(),
                top: number().required(),
                left: number().required(),
            }),
        }),
        rightTeam: object({
            name: object({
                size: number().required(),
                top: number().required(),
                left: number().required(),
            }),
            score: object({
                size: number().required(),
                top: number().required(),
                left: number().required(),
            }),
        }),
    }),
    LeftPlayer: object({
        left: number().required(),
    }),
    RightPlayer: object({
        right: number().required(),
    }),
    BottomPlayer: object({
        bottom: number().required(),
    }),
    PlayerImageWidth: number().required(),
    DetailScore: object({
        Color: string().required(),
        FontSize: number().required(),
    }),

});

let state = reactive<TableUpdate>({
    dimension: {
        width: data ? +data.dimension.width.replace("px", "") : 0,
        height: data ? +data.dimension.height.replace("px", "") : 0,
    },
    scorePanel: {
        topMargin: data ? +data.scorePanel.topMargin.replace("px", "") : 0,
        height: data ? +data.scorePanel.height.replace("px", "") : 0,
        position: {
            scale: data ? data.scorePanel.position.scale : 1,
            top: data ? +data.scorePanel.position.top.replace("px", "") : 0,
            left: data ? +data.scorePanel.position.left.replace("px", "") : 0,
        },
        leftTeam: {
            name: {
                size: data ? +data.scorePanel.leftTeam.name.size.replace("px", "") : 0,
                top: data ? +data.scorePanel.leftTeam.name.top.replace("px", "") : 0,
                left: data ? +data.scorePanel.leftTeam.name.left.replace("px", "") : 0,
            },

            score: {
                size: data ? +data.scorePanel.leftTeam.score.size.replace("px", "") : 0,
                top: data ? +data.scorePanel.leftTeam.score.top.replace("px", "") : 0,
                left: data ? +data.scorePanel.leftTeam.score.left.replace("px", "") : 0,
            },
        },
        rightTeam: {
            name: {
                size: data ? +data.scorePanel.rightTeam.name.size.replace("px", "") : 0,
                top: data ? +data.scorePanel.rightTeam.name.top.replace("px", "") : 0,
                left: data ? +data.scorePanel.rightTeam.name.left.replace("px", "") : 0,
            },

            score: {
                size: data ? +data.scorePanel.rightTeam.score.size.replace("px", "") : 0,
                top: data ? +data.scorePanel.rightTeam.score.top.replace("px", "") : 0,
                left: data ? +data.scorePanel.rightTeam.score.left.replace("px", "") : 0,
            },
        },
    },
    LeftPlayer: {
        top: data ? +data.LeftPlayer.top.replace("px", "") : 0,
        left: data ? +data.LeftPlayer.left.replace("px", "") : 0,
    },
    RightPlayer: {
        top: data ? +data.RightPlayer.top.replace("px", "") : 0,
        right: data ? +data.RightPlayer.right.replace("px", "") : 0,
    },
    BottomPlayer: {
        bottom: data ? +data.BottomPlayer.bottom.replace("px", "") : 0,
        left: data ? +data.BottomPlayer.left.replace("px", "") : 0,
    },
    PlayerImageWidth: data ? data.PlayerImageWidth : 0,
    DetailScore: {
        Color: data ? data.DetailScore.Color : "#000000",
        FontSize: data ? +data.DetailScore.FontSize.replace("px", "") : 0,
    }
});
const updateBoard = () => {
    updateForm.value?.submit();
};
const emit = defineEmits(['close']);
// Modal will be closed by th e parent component
const closeModal = () => {
    emit('close');
    // This will be handled by the modal's built-in close functionality
};
const onSubmit = async (event: any) => {
    if (!boardID.value) {
        useToast().add({ title: "Board ID not available", color: "error" });
        return;
    }
    try {
        await useBoardFB().updateTable(boardID.value, state);
        useToast().add({ title: "update Done" });
    } catch (error: any) {
        console.log(error.message);
        useToast().add({ title: "update error", color: "error" });
    }
};

const resetBoard = async () => {
    const defaultTableData: TableUpdate = {
        PlayerImageWidth: 200,
        dimension: { width: 1080, height: 1920 },
        scorePanel: {
            topMargin: 0,
            position: {
                scale: 0.9,
                left: -14,
                top: 0,
            },
            height: 300,
            // svgViewBox: { width: "1180", height: "400" },
            leftTeam: {
                name: { size: 30, top: 0, left: 0 },
                score: { size: 50, top: 0, left: 0 },
            },
            rightTeam: {
                name: { size: 30, top: 0, left: 0 },
                score: { size: 50, top: 0, left: 0 },
            },
        },
        LeftPlayer: { top: 100, left: 0 },
        RightPlayer: { top: 100, right: 0 },
        BottomPlayer: { bottom: 0, left: 100 },
        DetailScore: {
            Color: "#000000",
            FontSize: 70
        }
    };

    if (!boardID.value) {
        useToast().add({ title: "Board ID not available", color: "error" });
        return;
    }
    try {
        await useBoardFB().updateTable(boardID.value, defaultTableData);
        Object.assign(state, defaultTableData);
        // state = defaultTableData;
        useToast().add({ title: "update Done" });
    } catch (error: any) {
        console.log(error.message);
        useToast().add({ title: "update error", color: "error" });
    }
};

watch(
    state,
    async (n, o) => {
        console.log(state)
        if (!boardID.value) return;
        try {
            await useBoardFB().updateTable(boardID.value, n);
            // useToast().add({ title: "update Done" });
        } catch (error: any) {
            console.log(error.message);
            // useToast().add({ title: "update error", color: "red" });
        }
    },
    { deep: true }
);

const items = [
    {
        label: "الابعاد الاساسية",
        slot: "dimension",
    },
    {
        label: "لوحة النتيجة",
        slot: "scorePanel",
    },
    {
        label: "الفرق ",
        slot: "Teams",
    },

    {
        label: "صور الاعبين",
        slot: "playerImages",
    },
    {
        label: "النشرة التفصيلية",
        slot: "detailView",
    },
];

</script>

<style scoped>
/* Component specific custom styles */
</style>