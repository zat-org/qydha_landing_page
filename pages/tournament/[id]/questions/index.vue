<script lang="ts" setup>
const route = useRoute();

await navigateTo({
  path: `/tournament/${route.params.id}/faqs`,
  query: { tab: "questions" },
});
</script>
