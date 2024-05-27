<template>
    <section id="hero" class="flex justify-center items-center ">
        <div class="w-full lg:w-1/2 space-y-5 mt-10 lg:mt-0  text-center lg:text-right">
            <h2 class="text-4xl ">ماتحلى الجلسه إلا بقيدها</h2>
            <p class="ps-2 text-xl ">
                سهلناها عليكم … تطبيق حاسبة بلوت بإنعكاس شاشتين👏
                <br /> سرعوا اللعب يا شباب
                حملوا التطبيق وخلونا نشوف لعبكم
            </p>
            <UButton color="amber" class="px-10 animate-bounce" to="#download-section" padded>حمل التطبيق الان</UButton>
        </div>
        <div class="w-1/3 hidden lg:block">
            <div class="flex justify-center items-center h-full w-full ">
                <div class="relative h-96 w-52 mb-20 mt-10">
                    <img src="@/assets/images/baloot_page-portrait.png"
                        class="absolute h-96 rounded-lg  top-0 right-0 translate-x-1/2  rotate-[15deg] " />
                    <img src="@/assets/images/subscription_page-portrait.png"
                        class="absolute h-96 rounded-lg  top-0 left-0  -translate-x-1/2  -rotate-[15deg] " />
                    <img src="@/assets/images/home_page-portrait.png"
                        class="absolute h-96 rounded-lg  top-0 left-1/2 -translate-x-1/2 " />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">

</script>

<style></style>