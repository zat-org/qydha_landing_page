<template>
    <UCard :ui="{ base: 'flex flex-col h-full  ' }">
        <template #header>
            filter day list

        </template>
        <UTabs :items="items">
            <template #data>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <!-- Users Statistics Card -->
                    <UCard class="bg-gradient-to-br from-primary-50 to-primary-100">
                        <div class="flex flex-col items-center p-4">
                            <div class="text-sm text-gray-600">Total Users</div>
                            <div class="text-2xl font-bold text-primary-600">1,234</div>
                        </div>
                    </UCard>

                    <!-- Sakkas Statistics Card -->
                    <UCard class="bg-gradient-to-br from-secondary-50 to-secondary-100">
                        <div class="flex flex-col items-center p-4">
                            <div class="text-sm text-gray-600">Total Sakkas</div>
                            <div class="text-2xl font-bold text-secondary-600">5,678</div>
                        </div>
                    </UCard>

                </div>
            </template>
            <template #map>
            </template>
        </UTabs>
    </UCard>
</template>


<script lang="ts" setup>

const items = [{ label: "data",slot: "data" }, { label: "map", slot: "map" },]
</script>

<style></style>