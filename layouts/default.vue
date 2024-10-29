<template>
    <Header ></Header>
    <main class="  flex grow    justify-between  " > 
      <!-- <SideBar  class=" w-[200px]" v-if="logedin"/> -->
      <div class="  my-[20px]  w-[80%]  mx-auto"  >

       <slot ></slot>
     </div>
    </main>
    <Footer ></Footer>
 
</template>

<script lang="ts" setup>
import { useMyAuthStore } from '~/store/Auth';

const userStore = useMyAuthStore()
const {logedin} =storeToRefs(userStore) 
</script>

<style>

</style>