<template>
    <div class="border-b border-[#F6BD68]  bg-[#1d2145] flex flex-row justify-around pb-2">
        <div class="flex justify-center items-center">
            <NuxtLink to="/"><img src="@/assets/images/qydha-logo.svg" class="w-20" alt="Qydha Logo" /></NuxtLink>
        </div>
        <!-- <div class="w-2/5 hidden md:flex justify-around items-center text-white ">
            <ui class="list-none " v-for="l in links">
                <li class="hover:underline underline-offset-8 decoration-2	hover:text-amber-400 cursor-pointer decoration-amber-400	">
                    <NuxtLink>{{ l.text }}</NuxtLink>
                </li>
            </ui>
        </div> -->
    </div>
</template>

<script setup lang="ts">
let links = [
    { text: "الرئيسية", link: "" },
    { text: "الخدمات", link: "" },
    { text: "من نحن", link: "" },
    { text: "تواصل معنا", link: "" },
]
</script>

<style scoped></style>