<template>
  <UModal>
    <UCard>
      <template #header>
        <h3 class="text-xl font-bold">تعديل إعدادات الطاولة</h3>
      </template>
      <UForm
        :schema="schema"
        :state="state"
        @submit="onSubmit"
        ref="updateForm"
      >
        <UAccordion :items="items">
          <template #dimension>
            <div class="grid grid-cols-2 gap-2">
              <UFormGroup label="العرض" name="dimension.width">
                <UInput v-model.number="state.dimension.width" type="number" />
              </UFormGroup>
              <UFormGroup label="الطول" name="dimension.height">
                <UInput v-model.number="state.dimension.height" type="number" />
              </UFormGroup>
            </div>
          </template>
          <template #scorePanel>
            <div class="flex gap-5">
              <UFormGroup label="النتيجة">
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
              </UFormGroup>

              <UFormGroup label="اللوجو">
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
              </UFormGroup>
            </div>
          </template>

          <template #Teams>
            <div class="flex justify-center gap-5 w-[90%] mb-[10px]">
              <UFormGroup label="اسماء الفرق">
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
              </UFormGroup>
              <UFormGroup label="النتيجة">
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
              </UFormGroup>
            </div>
            <UAccordion :items="Teamsitems" :ui="{ wrapper: ' w-[90%]' }">
              <template #leftTeam>
                <div class="flex justify-between">
                  <UFormGroup label="اسم الفريق">
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
                  </UFormGroup>
                  <UFormGroup label="النتيجة">
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
                  </UFormGroup>
                </div>
              </template>
              <template #rightTeam>
                <div class="flex justify-between">
                  <UFormGroup label="اسم الفريق">
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
                  </UFormGroup>
                  <UFormGroup label="النتيجة">
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
                  </UFormGroup>
                </div>
              </template>
            </UAccordion>
          </template>

          <template #playerImages>
            <div class="flex flex-col gap-3">
              <div class="flex justify-between gap-3">
                <UFormGroup label=" اللاعب الايمن">
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
                </UFormGroup>

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
                <UFormGroup label=" اللاعب الايسر">
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
                </UFormGroup>

                <UFormGroup label=" اللاعب المنتصف">
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
                </UFormGroup>
              </div>
              <UFormGroup label="حجم صور الاعبين" name="PlayerImageWidth">
                <UInput v-model.number="state.PlayerImageWidth" type="number" />
              </UFormGroup>
            </div>
          </template>
          <template #detailView>
            <UFormGroup label="Detail Score Color" name="DetailScore.Color">
              <UInput v-model="state.DetailScore.Color" type="color" />
            </UFormGroup>
            <UFormGroup label="Detail Font size" name="DetailScore.FontSize">
              <UInput v-model="state.DetailScore.FontSize" type="number" />
            </UFormGroup>
          </template>
        </UAccordion>
      </UForm>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton @click="closeModal()" color="red"> غلق </UButton>
          <UButton @click="resetBoard()">اعادة الضبط </UButton>

          <UButton @click="updateBoard()">حفظ </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script lang="ts" setup>
import { object, string, number } from "yup";
import type { TableData, TableUpdate } from "~/composables/BoardFB";
import { useMyAuthStore } from "~/store/Auth";
const updateForm = ref<HTMLFormElement>();
const authstore = useMyAuthStore();
const boardID = computed(() => {
  if (authstore.user)
    return authstore.user.boardLink.split("/")[
      authstore.user.boardLink.split("/").length - 1
    ];
});

let data: TableData = await useBoardFB().getOrCreateTable(boardID.value!);
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
        width: number().required(),
        height: number().required(),
      }),
      score: object({
        size: number().required(),
        top: number().required(),
        left: number().required(),
        width: number().required(),
        height: number().required(),
      }),
    }),
    rightTeam: object({
      name: object({
        size: number().required(),
        top: number().required(),
        left: number().required(),
        width: number().required(),
        height: number().required(),
      }),
      score: object({
        size: number().required(),
        top: number().required(),
        left: number().required(),
        width: number().required(),
        height: number().required(),
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

const state = ref<TableUpdate>({
  dimension: {
    width: +data.dimension.width.replace("px", ""),
    height: +data.dimension.height.replace("px", ""),
  },
  scorePanel: {
    topMargin: +data.scorePanel.topMargin.replace("px", ""),
    height: +data.scorePanel.height.replace("px", ""),
    position: {
      scale: data.scorePanel.position.scale,
      top: +data.scorePanel.position.top.replace("px", ""),
      left: +data.scorePanel.position.left.replace("px", ""),
    },
    leftTeam: {
      name: {
        size: +data.scorePanel.leftTeam.name.size.replace("px", ""),
        top: +data.scorePanel.leftTeam.name.top.replace("px", ""),
        left: +data.scorePanel.leftTeam.name.left.replace("px", ""),
      },

      score: {
        size: +data.scorePanel.leftTeam.score.size.replace("px", ""),
        top: +data.scorePanel.leftTeam.score.top.replace("px", ""),
        left: +data.scorePanel.leftTeam.score.left.replace("px", ""),
      },
    },
    rightTeam: {
      name: {
        size: +data.scorePanel.rightTeam.name.size.replace("px", ""),
        top: +data.scorePanel.rightTeam.name.top.replace("px", ""),
        left: +data.scorePanel.rightTeam.name.left.replace("px", ""),
      },

      score: {
        size: +data.scorePanel.rightTeam.score.size.replace("px", ""),
        top: +data.scorePanel.rightTeam.score.top.replace("px", ""),
        left: +data.scorePanel.rightTeam.score.left.replace("px", ""),
      },
    },
  },
  LeftPlayer: {
    top: +data.LeftPlayer.top.replace("px", ""),
    left: +data.LeftPlayer.left.replace("px", ""),
  },
  RightPlayer: {
    top: +data.RightPlayer.top.replace("px", ""),
    right: +data.RightPlayer.right.replace("px", ""),
  },
  BottomPlayer: {
    bottom: +data.BottomPlayer.bottom.replace("px", ""),
    left: +data.BottomPlayer.left.replace("px", ""),
  },
  PlayerImageWidth: data.PlayerImageWidth,
  DetailScore:{Color: data.DetailScore.Color,
    FontSize: +data.DetailScore.FontSize.replace("px", ""),
  }
  

});
const updateBoard = () => {
  updateForm.value?.submit();
};
const closeModal = () => {
  useModal().close();
};
const onSubmit = async (event: any) => {
  try {
    await useBoardFB().updateTable(boardID.value!, state.value);
    useToast().add({ title: "update Done" });
  } catch (error: any) {
    console.log(error.message);
    useToast().add({ title: "update error", color: "red" });
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
        name: { size: 30, top: 0, left: 0,  },
        score: { size: 50, top: 0, left: 0, },
      },
      rightTeam: {
        name: { size: 30, top: 0, left: 0,  },
        score: { size: 50, top: 0, left: 0, },
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

  try {
    await useBoardFB().updateTable(boardID.value!, defaultTableData);
    state.value = defaultTableData;
    useToast().add({ title: "update Done" });
  } catch (error: any) {
    console.log(error.message);
    useToast().add({ title: "update error", color: "red" });
  }
};

watch(
  state,
  async (n, o) => {
    try {
      await useBoardFB().updateTable(boardID.value!, n);
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
.control-panel {
  @apply p-2 bg-gray-50 rounded-lg shadow-sm;
}

.direction-controls {
  @apply gap-1 flex items-center;
}

.vertical-controls {
  @apply gap-1;
}

.scale-controls {
  @apply flex gap-1 ml-2 border-l pl-2 border-gray-200;
}

.control-btn {
  @apply p-2 rounded-md transition-all duration-200 text-gray-700;
  @apply hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300;
}

.scale-btn {
  @apply text-green-600;
}
</style>
