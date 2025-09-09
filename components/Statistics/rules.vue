<template>
    <div>
        {{ data }}
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    type: "day" | "week" | "month" | "year" | "custom"
    startDate: Date | null
    endDate: Date | null
}>()

const { getBalootBookStatics } = useStatics()
const { data, pending, error, refresh, status, fetchREQ } = await getBalootBookStatics()
watch(() => [props.type, props.startDate, props.endDate], () => {
    if (props.startDate && props.endDate) {
        fetchREQ(props.type, props.startDate, props.endDate)
    }
}, { immediate: true })

onMounted(() => {
  fetchREQ(props.type, props.startDate, props.endDate)
})

</script>

<style scoped>
</style>