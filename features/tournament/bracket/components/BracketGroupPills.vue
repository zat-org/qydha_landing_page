<template>
  <div
    v-if="tourStore.tournament.length > 0"
    class="flex w-full flex-col gap-1 px-1 py-1.5 sm:px-2"
  >
    <div class="flex items-center gap-0.5 sm:gap-1">
      <UButton
        v-if="clipRight"
        icon="i-heroicons-chevron-right-20-solid"
        size="xs"
        color="neutral"
        variant="ghost"
        square
        class="shrink-0"
        aria-label="المزيد من المجموعات"
        @click="scrollPage(1)"
      />

      <div
        ref="scrollerRef"
        class="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory py-0.5 scrollbar-none"
        :style="maskStyle"
        @scroll="updateOverflow"
      >
        <button
          v-for="item in tourStore.tournament"
          :key="item.data.id"
          type="button"
          class="inline-flex snap-start items-center gap-1.5 px-3.5 py-2.5 min-h-10 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer select-none shrink-0"
          :class="
            tourStore.selectedGroup?.data.id === item.data.id
              ? 'bg-primary text-white shadow-sm shadow-primary/30 ring-2 ring-primary/20'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          "
          @click="selectGroup(item.data.id.toString())"
        >
          <UIcon
            :name="
              item.data.type === GroupType.Final || item.data.stageType === 'Final'
                ? 'i-heroicons-trophy-20-solid'
                : 'i-heroicons-squares-2x2-20-solid'
            "
            class="size-3.5 shrink-0"
          />
          <span>{{ item.data.name }}</span>
        </button>
      </div>

      <UButton
        v-if="clipLeft"
        icon="i-heroicons-chevron-left-20-solid"
        size="xs"
        color="neutral"
        variant="ghost"
        square
        class="shrink-0"
        aria-label="المجموعات السابقة"
        @click="scrollPage(-1)"
      />
    </div>

    <p
      v-if="hasOverflow"
      class="px-2 text-center text-[10px] font-medium tabular-nums text-gray-500 dark:text-gray-400"
    >
      {{ selectedIndex + 1 }} / {{ tourStore.tournament.length }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { GroupType } from "~/features/tournament/models/group";
import { useTournamentBracketStore } from "~/features/tournament/bracket/stores";

const tourStore = useTournamentBracketStore();
const route = useRoute();
const router = useRouter();
const scrollerRef = ref<HTMLElement | null>(null);
const clipLeft = ref(false);
const clipRight = ref(false);

const hasOverflow = computed(() => clipLeft.value || clipRight.value);

const selectedIndex = computed(() => {
  const id = tourStore.selectedGroup?.data.id;
  if (!id) return 0;
  const index = tourStore.tournament.findIndex((item) => item.data.id === id);
  return index >= 0 ? index : 0;
});

const maskStyle = computed(() => {
  let gradient = "none";
  if (clipLeft.value && clipRight.value) {
    gradient =
      "linear-gradient(to right, transparent, black 20px, black calc(100% - 20px), transparent)";
  } else if (clipLeft.value) {
    gradient = "linear-gradient(to right, transparent, black 20px)";
  } else if (clipRight.value) {
    gradient = "linear-gradient(to right, black calc(100% - 20px), transparent)";
  }
  return {
    maskImage: gradient,
    WebkitMaskImage: gradient,
  };
});

const selectGroup = (groupId: string) => {
  router.push({
    path: route.path,
    query: { ...route.query, group: groupId },
  });
};

const updateOverflow = () => {
  const el = scrollerRef.value;
  if (!el) {
    clipLeft.value = false;
    clipRight.value = false;
    return;
  }

  const root = el.getBoundingClientRect();
  let left = false;
  let right = false;
  for (const child of el.children) {
    const rect = (child as HTMLElement).getBoundingClientRect();
    if (rect.left < root.left - 2) left = true;
    if (rect.right > root.right + 2) right = true;
  }
  clipLeft.value = left;
  clipRight.value = right;
};

const scrollPage = (direction: -1 | 1) => {
  const el = scrollerRef.value;
  if (!el) return;
  el.scrollBy({ left: direction * el.clientWidth * 0.7, behavior: "smooth" });
};

const scrollSelectedIntoView = () => {
  const el = scrollerRef.value;
  if (!el) return;
  const selected = el.children[selectedIndex.value] as HTMLElement | undefined;
  selected?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
};

let resizeObserver: ResizeObserver | undefined;

watch(
  scrollerRef,
  (el) => {
    resizeObserver?.disconnect();
    if (!el || typeof ResizeObserver === "undefined") return;
    resizeObserver = new ResizeObserver(() => updateOverflow());
    resizeObserver.observe(el);
    nextTick(() => {
      updateOverflow();
      scrollSelectedIntoView();
    });
  },
);

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

watch(
  () => [tourStore.tournament.length, tourStore.selectedGroup?.data.id],
  async () => {
    await nextTick();
    updateOverflow();
    scrollSelectedIntoView();
  },
);
</script>
