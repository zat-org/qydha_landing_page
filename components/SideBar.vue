<template>
  <USlideover
    dir="rtl"
    title="قيدها "
    description="الحاسبة الذكية للعبة البلوت "
    side="right"
    class="z-[100]"
  >
    <template #body>
      <UNavigationMenu
        orientation="vertical"
        :items="links"
        class="text-right rtl-navigation"
      />
    </template>
  </USlideover>
</template>

<script lang="ts" setup>
const emit = defineEmits(["close"]);

const { links } = useNavLinks({
  onSelect: () => {
    emit("close");
  },
});
</script>

<style>
.rtl-navigation {
  direction: rtl;
  text-align: right;
}

.rtl-navigation * {
  direction: rtl;
  text-align: right;
}
</style>
