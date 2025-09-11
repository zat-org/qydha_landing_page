<template>
  <UModal
   title="تعديل إعدادات الطاولة"
    description="تعديل إعدادات الطاولة"
  >
    <!-- <template #header>
          <h3 class="text-xl font-bold">تعديل إعدادات الطاولة</h3>
        </template> -->
    <template #body>
        
        <UForm
          :schema="schema"
          :state="state"
          @submit="onSubmit"
          ref="updateForm"
        >
          <UAccordion :items="items">
            <template #dimension>
              <div class="grid grid-cols-2 gap-2">
                <UFormField label="العرض" name="dimension.width">
                  <UInput v-model.number="state.dimension.width" type="number" />
                </UFormField>
                <UFormField label="الطول" name="dimension.height">
                  <UInput v-model.number="state.dimension.height" type="number" />
                </UFormField>
              </div>
            </template>
            <template #scorePanel>
              <div class="flex gap-5">
                <UFormField label="النتيجة">
                  <UButtonGroup
                    class="control-panel direction-controls"
                    size="xs"
                  >
                    <StreamHoldButton
                      icon="heroicons:arrow-small-up-20-solid"
                      :step="1"
                      class="control-btn hover:bg-blue-100 active:bg-blue-200"
                      :action="
                        (step: number) => (state.scorePanel.topMargin -= step)
                      "
                    ></StreamHoldButton>
                    <StreamHoldButton
                      icon="heroicons:arrow-small-down-20-solid"
                      class="control-btn hover:bg-blue-100 active:bg-blue-200"
                      :step="1"
                      :action="
                        (step: number) => (state.scorePanel.topMargin += step)
                      "
                    ></StreamHoldButton>
                  </UButtonGroup>
                </UFormField>
  
                <UFormField label="اللوجو">
                  <UButtonGroup
                    size="xs"
                    class="control-panel direction-controls"
                  >
                    <StreamHoldButton
                      icon="heroicons:arrow-right-16-solid"
                      :step="1"
                      class="control-btn hover:bg-blue-100 active:bg-blue-200"
                      :action="
                        (step: number) => (state.scorePanel.position.left += step)
                      "
                    ></StreamHoldButton>
  
                    <UButtonGroup
                      orientation="vertical"
                      size="xs"
                      class="vertical-controls"
                    >
                      <StreamHoldButton
                        icon="heroicons:arrow-up-16-solid"
                        :step="1"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200"
                        :action="
                          (step: number) =>
                            (state.scorePanel.position.top -= step)
                        "
                      ></StreamHoldButton>
                      <StreamHoldButton
                        icon="heroicons:arrow-down-16-solid"
                        :step="1"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200"
                        :action="
                          (step: number) =>
                            (state.scorePanel.position.top += step)
                        "
                      ></StreamHoldButton>
                    </UButtonGroup>
  
                    <StreamHoldButton
                      icon="heroicons:arrow-left-16-solid"
                      :step="1"
                      class="control-btn hover:bg-blue-100 active:bg-blue-200"
                      :action="
                        (step: number) => (state.scorePanel.position.left -= step)
                      "
                    ></StreamHoldButton>
  
                    <StreamHoldButton
                      icon="lucide:expand"
                      :step="0.01"
                      class="control-btn hover:bg-green-100 active:bg-green-200"
                      :action="
                        (step: number) =>
                          (state.scorePanel.position.scale += step)
                      "
                    ></StreamHoldButton>
                    <StreamHoldButton
                      icon="lucide:shrink"
                      :step="0.01"
                      class="control-btn hover:bg-green-100 active:bg-green-200"
                      :action="
                        (step: number) =>
                          (state.scorePanel.position.scale -= step)
                      "
                    ></StreamHoldButton>
                  </UButtonGroup>
                </UFormField>
              </div>
            </template>
  
            <template #Teams>
              <div class="flex justify-center gap-5 w-[90%] mb-[10px]">
                <UFormField label="اسماء الفرق">
                  <UButtonGroup
                    size="xs"
                    class="control-panel direction-controls"
                  >
                    <UButtonGroup
                      orientation="vertical"
                      size="xs"
                      class="vertical-controls"
                    >
                      <StreamHoldButton
                        icon="heroicons:arrow-up-16-solid"
                        :step="1"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200"
                        :action="
                          (step: number) => {
                            state.scorePanel.leftTeam.name.top -= step;
                            state.scorePanel.rightTeam.name.top -= step;
                          }
                        "
                      ></StreamHoldButton>
                      <StreamHoldButton
                        icon="heroicons:arrow-down-16-solid"
                        :step="1"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200"
                        :action="
                          (step: number) =>
                          {
                            state.scorePanel.leftTeam.name.top += step;
                            state.scorePanel.rightTeam.name.top += step;
                          }
                        "
                      ></StreamHoldButton>
                    </UButtonGroup>
                    <StreamHoldButton
                      icon="lucide:expand"
                      :step="1"
                      class="control-btn hover:bg-green-100 active:bg-green-200"
                      :action="
                        (step: number) =>{
                          state.scorePanel.leftTeam.name.size += step;
                          state.scorePanel.rightTeam.name.size += step;}
                      "
                    ></StreamHoldButton>
                    <StreamHoldButton
                      icon="lucide:shrink"
                      :step="1"
                      class="control-btn hover:bg-green-100 active:bg-green-200"
                      :action="
                        (step: number) =>{
                          state.scorePanel.leftTeam.name.size -= step;
                          state.scorePanel.rightTeam.name.size -= step;
                        }
                      "
                    ></StreamHoldButton>
                  </UButtonGroup>
                </UFormField>
                <UFormField label="النتيجة">
                  <UButtonGroup
                    size="xs"
                    class="control-panel direction-controls"
                  >
                    <UButtonGroup
                      orientation="vertical"
                      size="xs"
                      class="vertical-controls"
                    >
                      <StreamHoldButton
                        icon="heroicons:arrow-up-16-solid"
                        :step="1"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200"
                        :action="
                          (step: number) => {
                            state.scorePanel.leftTeam.score.top -= step;
                            state.scorePanel.rightTeam.score.top -= step;
                          }
                        "
                      ></StreamHoldButton>
                      <StreamHoldButton
                        icon="heroicons:arrow-down-16-solid"
                        :step="1"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200"
                        :action="
                          (step: number) =>
                          {
                            state.scorePanel.leftTeam.score.top += step;
                            state.scorePanel.rightTeam.score.top += step;
                          }
                        "
                      ></StreamHoldButton>
                    </UButtonGroup>
                    <StreamHoldButton
                      icon="lucide:expand"
                      :step="1"
                      class="control-btn hover:bg-green-100 active:bg-green-200"
                      :action="
                        (step: number) =>{
                          state.scorePanel.leftTeam.score.size += step;
                          state.scorePanel.rightTeam.score.size += step;}
                      "
                    ></StreamHoldButton>
                    <StreamHoldButton
                      icon="lucide:shrink"
                      :step="1"
                      class="control-btn hover:bg-green-100 active:bg-green-200"
                      :action="
                        (step: number) =>{
                          state.scorePanel.leftTeam.score.size -= step;
                          state.scorePanel.rightTeam.score.size -= step;
                        }
                      "
                    ></StreamHoldButton>
                  </UButtonGroup>
                </UFormField>
              </div>
              <UAccordion :items="Teamsitems" >
                <template #leftTeam>
                  <div class="flex justify-between">
                    <UFormField label="اسم الفريق">
                      <UButtonGroup
                        size="xs"
                        class="control-panel direction-controls"
                      >
                        <StreamHoldButton
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          icon="heroicons:arrow-right-16-solid"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.leftTeam.name.left += step)
                          "
                        ></StreamHoldButton>
  
                        <UButtonGroup
                          class="vertical-controls"
                          orientation="vertical"
                          size="xs"
                        >
                          <StreamHoldButton
                            class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            icon="heroicons:arrow-up-16-solid"
                            :step="1"
                            :action="
                              (step: number) =>
                                (state.scorePanel.leftTeam.name.top -= step)
                            "
                          ></StreamHoldButton>
                          <StreamHoldButton
                            class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            icon="heroicons:arrow-down-16-solid"
                            :step="1"
                            :action="
                              (step: number) =>
                                (state.scorePanel.leftTeam.name.top += step)
                            "
                          ></StreamHoldButton>
                        </UButtonGroup>
                        <StreamHoldButton
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          icon="heroicons:arrow-left-16-solid"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.leftTeam.name.left -= step)
                          "
                        ></StreamHoldButton>
  
                        <StreamHoldButton
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          icon="ooui:bigger"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.leftTeam.name.size += step)
                          "
                        ></StreamHoldButton>
                        <StreamHoldButton
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          icon="ooui:smaller"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.leftTeam.name.size -= step)
                          "
                        ></StreamHoldButton>
                      </UButtonGroup>
                    </UFormField>
                    <UFormField label="النتيجة">
                      <UButtonGroup
                        size="xs"
                        class="control-panel direction-controls"
                      >
                        <StreamHoldButton
                          icon="heroicons:arrow-right-16-solid"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.leftTeam.score.left += step)
                          "
                        ></StreamHoldButton>
  
                        <UButtonGroup
                          orientation="vertical"
                          size="xs"
                          class="vertical-controls"
                        >
                          <StreamHoldButton
                            icon="heroicons:arrow-up-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            :step="1"
                            :action="
                              (step: number) =>
                                (state.scorePanel.leftTeam.score.top -= step)
                            "
                          ></StreamHoldButton>
                          <StreamHoldButton
                            icon="heroicons:arrow-down-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            :step="1"
                            :action="
                              (step: number) =>
                                (state.scorePanel.leftTeam.score.top += step)
                            "
                          ></StreamHoldButton>
                        </UButtonGroup>
                        <StreamHoldButton
                          icon="heroicons:arrow-left-16-solid"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.leftTeam.score.left -= step)
                          "
                        ></StreamHoldButton>
  
                        <StreamHoldButton
                          icon="ooui:bigger"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.leftTeam.score.size += step)
                          "
                        ></StreamHoldButton>
                        <StreamHoldButton
                          icon="ooui:smaller"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.leftTeam.score.size -= step)
                          "
                        ></StreamHoldButton>
                      </UButtonGroup>
                    </UFormField>
                  </div>
                </template>
                <template #rightTeam>
                  <div class="flex justify-between">
                    <UFormField label="اسم الفريق">
                      <UButtonGroup
                        size="xs"
                        class="control-panel direction-controls"
                      >
                        <StreamHoldButton
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          icon="heroicons:arrow-right-16-solid"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.rightTeam.name.left += step)
                          "
                        ></StreamHoldButton>
  
                        <UButtonGroup
                          class="vertical-controls"
                          orientation="vertical"
                          size="xs"
                        >
                          <StreamHoldButton
                            class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            icon="heroicons:arrow-up-16-solid"
                            :step="1"
                            :action="
                              (step: number) =>
                                (state.scorePanel.rightTeam.name.top -= step)
                            "
                          ></StreamHoldButton>
                          <StreamHoldButton
                            class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            icon="heroicons:arrow-down-16-solid"
                            :step="1"
                            :action="
                              (step: number) =>
                                (state.scorePanel.rightTeam.name.top += step)
                            "
                          ></StreamHoldButton>
                        </UButtonGroup>
                        <StreamHoldButton
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          icon="heroicons:arrow-left-16-solid"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.rightTeam.name.left -= step)
                          "
                        ></StreamHoldButton>
  
                        <StreamHoldButton
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          icon="ooui:bigger"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.rightTeam.name.size += step)
                          "
                        ></StreamHoldButton>
                        <StreamHoldButton
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          icon="ooui:smaller"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.rightTeam.name.size -= step)
                          "
                        ></StreamHoldButton>
                      </UButtonGroup>
                    </UFormField>
                    <UFormField label="النتيجة">
                      <UButtonGroup
                        size="xs"
                        class="control-panel direction-controls"
                      >
                        <StreamHoldButton
                          icon="heroicons:arrow-right-16-solid"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.rightTeam.score.left += step)
                          "
                        ></StreamHoldButton>
  
                        <UButtonGroup
                          orientation="vertical"
                          size="xs"
                          class="vertical-controls"
                        >
                          <StreamHoldButton
                            icon="heroicons:arrow-up-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            :step="1"
                            :action="
                              (step: number) =>
                                (state.scorePanel.rightTeam.score.top -= step)
                            "
                          ></StreamHoldButton>
                          <StreamHoldButton
                            icon="heroicons:arrow-down-16-solid"
                            class="control-btn hover:bg-blue-100 active:bg-blue-200"
                            :step="1"
                            :action="
                              (step: number) =>
                                (state.scorePanel.rightTeam.score.top += step)
                            "
                          ></StreamHoldButton>
                        </UButtonGroup>
                        <StreamHoldButton
                          icon="heroicons:arrow-left-16-solid"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.rightTeam.score.left -= step)
                          "
                        ></StreamHoldButton>
  
                        <StreamHoldButton
                          icon="ooui:bigger"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.rightTeam.score.size += step)
                          "
                        ></StreamHoldButton>
                        <StreamHoldButton
                          icon="ooui:smaller"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) =>
                              (state.scorePanel.rightTeam.score.size -= step)
                          "
                        ></StreamHoldButton>
                      </UButtonGroup>
                    </UFormField>
                  </div>
                </template>
              </UAccordion>
            </template>
  
            <template #playerImages>
              <div class="flex flex-col gap-3">
                <div class="flex justify-between gap-3">
                  <UFormField label=" اللاعب الايمن">
                    <UButtonGroup
                      size="xs"
                      class="control-panel direction-controls"
                    >
                      <StreamHoldButton
                        icon="heroicons:arrow-right-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200"
                        :step="1"
                        :action="
                          (step: number) => (state.RightPlayer.right -= step)
                        "
                      ></StreamHoldButton>
  
                      <UButtonGroup
                        orientation="vertical"
                        size="xs"
                        class="vertical-controls"
                      >
                        <StreamHoldButton
                          icon="heroicons:arrow-up-16-solid"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) => (state.RightPlayer.top += step)
                          "
                        ></StreamHoldButton>
                        <StreamHoldButton
                          icon="heroicons:arrow-down-16-solid"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) => (state.RightPlayer.top -= step)
                          "
                        ></StreamHoldButton>
                      </UButtonGroup>
  
                      <StreamHoldButton
                        icon="heroicons:arrow-left-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200"
                        :step="1"
                        :action="
                          (step: number) => (state.RightPlayer.right += step)
                        "
                      ></StreamHoldButton>
                    </UButtonGroup>
                  </UFormField>
  
                  <div class="flex flex-col gap-2 items-center justify-end">
                    <StreamHoldButton
                      icon="mdi:arrow-expand-horizontal"
                      class="control-btn hover:bg-blue-100 active:bg-blue-200"
                      :step="1"
                      :action="
                        (step: number) => {
                          state.LeftPlayer.left -= step;
                          state.RightPlayer.right -= step;
                        }
                      "
                    />
                    <StreamHoldButton
                      icon="uil:arrow-compress-h"
                      class="control-btn hover:bg-blue-100 active:bg-blue-200"
                      :step="1"
                      :action="
                        (step: number) => {
                          state.LeftPlayer.left += step;
                          state.RightPlayer.right += step;
                        }
                      "
                    />
                  </div>
                  <UFormField label=" اللاعب الايسر">
                    <UButtonGroup
                      size="xs"
                      class="control-panel direction-controls"
                    >
                      <StreamHoldButton
                        icon="heroicons:arrow-right-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200"
                        :step="1"
                        :action="
                          (step: number) => (state.LeftPlayer.left += step)
                        "
                      ></StreamHoldButton>
  
                      <UButtonGroup
                        orientation="vertical"
                        size="xs"
                        class="vertical-controls"
                      >
                        <StreamHoldButton
                          icon="heroicons:arrow-up-16-solid"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) => (state.LeftPlayer.top += step)
                          "
                        ></StreamHoldButton>
                        <StreamHoldButton
                          icon="heroicons:arrow-down-16-solid"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) => (state.LeftPlayer.top -= step)
                          "
                        ></StreamHoldButton>
                      </UButtonGroup>
  
                      <StreamHoldButton
                        icon="heroicons:arrow-left-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200"
                        :step="1"
                        :action="
                          (step: number) => (state.LeftPlayer.left -= step)
                        "
                      ></StreamHoldButton>
                    </UButtonGroup>
                  </UFormField>
  
                  <UFormField label=" اللاعب المنتصف">
                    <UButtonGroup
                      size="xs"
                      class="control-panel direction-controls"
                    >
                      <StreamHoldButton
                        icon="heroicons:arrow-right-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200"
                        :step="1"
                        :action="
                          (step: number) => (state.BottomPlayer.left -= step)
                        "
                      ></StreamHoldButton>
  
                      <UButtonGroup
                        orientation="vertical"
                        size="xs"
                        class="vertical-controls"
                      >
                        <StreamHoldButton
                          icon="heroicons:arrow-up-16-solid"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) => (state.BottomPlayer.bottom += step)
                          "
                        ></StreamHoldButton>
                        <StreamHoldButton
                          icon="heroicons:arrow-down-16-solid"
                          class="control-btn hover:bg-blue-100 active:bg-blue-200"
                          :step="1"
                          :action="
                            (step: number) => (state.BottomPlayer.bottom -= step)
                          "
                        ></StreamHoldButton>
                      </UButtonGroup>
  
                      <StreamHoldButton
                        icon="heroicons:arrow-left-16-solid"
                        class="control-btn hover:bg-blue-100 active:bg-blue-200"
                        :step="1"
                        :action="
                          (step: number) => (state.BottomPlayer.left += step)
                        "
                      ></StreamHoldButton>
                    </UButtonGroup>
                  </UFormField>
                </div>
                <UFormField label="حجم صور الاعبين" name="PlayerImageWidth">
                  <UInput v-model.number="state.PlayerImageWidth" type="number" />
                </UFormField>
              </div>
            </template>
            <template #detailView>
              <UFormField label="Detail Score Color" name="DetailScore.Color">
                <UInput v-model="state.DetailScore.Color" type="color" />
              </UFormField>
              <UFormField label="Detail Font size" name="DetailScore.FontSize">
                <UInput v-model="state.DetailScore.FontSize" type="number" />
              </UFormField>
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
const emit = defineEmits(['close'] );
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
    DetailScore:{
      Color: "#000000",
      FontSize:70
    }
  };

  if (!boardID.value) {
    useToast().add({ title: "Board ID not available", color: "error" });
    return;
  }
  try {
    await useBoardFB().updateTable(boardID.value, defaultTableData);
    state = defaultTableData;
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

<style scoped>
/* Component specific custom styles */
</style>
