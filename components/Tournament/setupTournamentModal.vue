<template>
    <UModal title="بدء تنظيم البطولة" prevent-close description="هل أنت متأكد من بدء تنظيم البطولة؟">

        <template #body>

            <div class="flex flex-col gap-2">
                <p> برجاء اختيار طريقة تنظيم البطوله</p>
                <URadioGroup  v-model="hasStaging" :items="items"  dir="rtl"/>

            </div>
        </template>
        <template #footer>
            <div class="flex justify-between items-center w-full">
                <UButton label="تأكيد" color="success" size="lg"  variant="soft"
                @click="confirm" />
                <UButton label="إلغاء" color="error" size="lg"  variant="soft"
                @click="cancel" />
            </div>
        </template>

    </UModal>
</template>
<script lang="ts" setup>
const hasStaging = ref('direct')
const items = computed(() => [
    {
        label: 'نهائيات مباشرة',
        value: 'direct' as const,
    },
    {
        label: 'مرحلة التصفيات',
        value: 'qualifications' as const,
        disabled: true,
    }])
const emit = defineEmits(['close'])
const cancel = () => {
    emit('close',false)
}
const confirm = () => {
    emit('close', hasStaging.value)
}
</script>