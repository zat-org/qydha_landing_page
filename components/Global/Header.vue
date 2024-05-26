<template>
    <div class="border-b border-[#F6BD68] bg-transparent flex flex-row justify-around">
        <div class="w-1/5 flex justify-center items-center">
            <NuxtLink to="/"><img src="@/assets/images/qydha-logo.svg" class="w-20" alt="Qydha Logo"  /></NuxtLink>
        </div>
        <div class="w-2/5 flex justify-around items-center">
            <ui class="list-none " v-for="l in links">
                <li class="hover:underline underline-offset-8 decoration-2	 cursor-pointer decoration-amber-400	">
                    <NuxtLink>{{ l.text }}</NuxtLink>
                </li>
            </ui>
        </div>
        
        <div class="w-1/5 flex justify-center items-center">
            
        </div>
    </div>
</template>

<script setup lang="ts">
    let links = [
        {text:"الرئيسية", link:""},
        {text:"الخدمات", link:""},
        {text:"من نحن", link:""},
        {text:"تواصل معنا", link:""},
    ]
</script>

<style scoped></style>