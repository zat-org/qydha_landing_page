<template>
    <UCard>
        <template #header>
            <div class="flex items-center gap-2">
                <UButton @click="router.back()" size="sm" icon="i-heroicons-arrow-right" variant="ghost"
                >العودة</UButton>
                <h1 class="text-2xl font-bold">حاسبة البطولة</h1>
            </div>
<div>

    <UFormField label=" عدد الفرق" name="teamsCount">
        <div class="flex items-center gap-2">
            <!-- <USelect v-model="TeamsCount" :items=TeamsCountOptions / -->
            <UInput v-model="teamsCount" type="number" min="1"
                placeholder="0" />
        </div>
    </UFormField>

    <UFormField label=" عدد الطاولات" name="tablesCount"
       >
        <UInput v-model="tablesCount" type="number" placeholder="0" />
    </UFormField>


    <pre dir="ltr"> {{ rounds }} </pre>
</div>

        
        
        
        </template>
    </UCard>
</template>

<script setup lang="ts">


const {getNumberOfRounds, rounds, teamsCount, tablesCount, sakkTime} = useTourCalc();


const router = useRouter();
definePageMeta({
    middleware: ['auth', 'role'],
    requiredRoles: ['StaffAdmin', 'SuperAdmin','Organizer'],
})
</script>