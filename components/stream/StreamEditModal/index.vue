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
                        <PlayerImage v-model:rightPlayerRight="state.rightPlayer.right"
                            v-model:rightPlayerTop="state.rightPlayer.top"
                            v-model:leftPlayerLeft="state.leftPlayer.left" v-model:leftPlayerTop="state.leftPlayer.top"
                            v-model:bottomPlayerBottom="state.bottomPlayer.bottom"
                            v-model:bottomPlayerLeft="state.bottomPlayer.left"
                            v-model:playerImageWidth="state.playerImageWidth" />
                    </template>

                    <template #detailView>
                        <DetailView v-model:detailScoreColor="state.detailScore.color"
                            v-model:detailScoreFontSize="state.detailScore.fontSize" />
                    </template>

                </UAccordion>
            </UForm>

        </template>

        <template #footer>
            <div class="flex justify-between items-center">
                <UButton @click="emit('close')" color="error"> غلق </UButton>
                <UButton @click="resetBoard()">اعادة الضبط </UButton>
                <UButton @click="updateBoard()">حفظ </UButton>
            </div>
        </template>

    </UModal>
</template>

<script lang="ts" setup>
const props = defineProps<{
    boardID: string;
    type:"baloot" | "hand";
}>();
import ScorePanel from "./ScorePanel.vue";
import Dimension from "./Dimension.vue";
import Teams from "./Teams.vue";
import PlayerImage from "./playerImage.vue";
import DetailView from "./DetailView.vue";
import { object, string, number } from "yup";
import { useMyAuthStore } from "~/store/Auth";
const updateForm = useTemplateRef("updateForm");
const authstore = useMyAuthStore();
const {BalootBoardSettings} = storeToRefs(authstore)
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
    leftPlayer: object({
        left: number().required(),
    }),
    rightPlayer: object({
        right: number().required(),
    }),
    bottomPlayer: object({
        bottom: number().required(),
    }),
    playerImageWidth: number().required(),
    detailScore: object({
        color: string().required(),
        fontSize: number().required(),
    }),

});

let state = reactive<any>({
 
    
        dimension: {
        width: props.type === "baloot" ? BalootBoardSettings.value?.portrait.dimension.width!: 0,
        height: props.type === "baloot" ? BalootBoardSettings.value?.portrait.dimension.height!: 0,
    },
    scorePanel: {
        topMargin: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.topMargin!: 0,
        height: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.height!: 0,
        position: {
            scale: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.position.scale!: 0,
            top: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.position.top!: 0,
            left: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.position.left!: 0,
        },
        leftTeam: {
            name: {
                size: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.leftTeam.name.size!: 0,
                top: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.leftTeam.name.top!: 0,
                left: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.leftTeam.name.left!: 0,
            },

            score: {
                size: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.leftTeam.score.size!: 0,
                top: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.leftTeam.score.top!: 0,
                left: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.leftTeam.score.left!: 0,
            },
        },
        rightTeam: {
            name: {
                size: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.rightTeam.name.size!: 0,
                top: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.rightTeam.name.top!: 0,
                left: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.rightTeam.name.left!: 0,
            },

            score: {
                size: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.rightTeam.score.size!: 0,
                top: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.rightTeam.score.top!: 0,
                left: props.type === "baloot" ? BalootBoardSettings.value?.portrait.scorePanel.rightTeam.score.left!: 0,
            },
        },
        },
        leftPlayer: {
        top: props.type === "baloot" ? BalootBoardSettings.value?.portrait.leftPlayer.top!: 0,
        left: props.type === "baloot" ? BalootBoardSettings.value?.portrait.leftPlayer.left!: 0,
    },
    rightPlayer: {
        top: props.type === "baloot" ? BalootBoardSettings.value?.portrait.rightPlayer.top!:    0,
        right: props.type === "baloot" ? BalootBoardSettings.value?.portrait.rightPlayer.right!: 0,
    },
    bottomPlayer: {
        bottom: props.type === "baloot" ? BalootBoardSettings.value?.portrait.bottomPlayer.bottom!: 0,
        left: props.type === "baloot" ? BalootBoardSettings.value?.portrait.bottomPlayer.left!: 0,
    },
            playerImageWidth: props.type === "baloot" ? BalootBoardSettings.value?.portrait.playerImageWidth!: 0,
    detailScore: {
        color: props.type === "baloot" ? BalootBoardSettings.value?.portrait.detailScore.color!: 0,
        fontSize: props.type === "baloot" ? BalootBoardSettings.value?.portrait.detailScore.fontSize!: 0,
    }
});
const updateBoard = () => {
    try {        
        updateForm.value?.submit();
    } catch (error) {
        console.log(error)
    }

};
const {updateBalootBoardSettings} = useBoardSettings()
const updateREQ = await updateBalootBoardSettings()
const emit = defineEmits(['close']);


const onSubmit = async (event: any) => {
    console.log("onSubmit")
   const body={
    boardId: props.boardID,
    portrait: state
   }
   await updateREQ.fetchREQ(body)
   if (updateREQ.status.value == "success") {
    useToast().add({ title: "update done" })
    // emit('close')
   }
  
};

const resetBoard = async () => {
    const defaultTableData: any = {
        playerImageWidth: 200,
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
        leftPlayer: { top: 100, left: 0 },
        rightPlayer: { top: 100, right: 0 },
        bottomPlayer: { bottom: 0, left: 0 },
        detailScore: {
            color: "#000000",
            fontSize: 70
        }
    };
    const body={
    boardId: props.boardID,
    portrait: defaultTableData
   }
   await updateREQ.fetchREQ(body)
   if (updateREQ.status.value == "success") {
    useToast().add({ title: "update done" })
    emit('close')
   }
   
};

watch(
    state,
    async (n, o) => {
        try {
            const body = {
                boardId: props.boardID,
                portrait: n      
            }
           await  updateREQ.fetchREQ(body)
        } catch (error: any) {
            console.log(error.message);
            useToast().add({ title: "update error", color: "error" });
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