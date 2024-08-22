export default defineNuxtPlugin((nuxtApp) => {
  if (process.client) {
    const colorMode = useColorMode();
    colorMode.preference = "light";
    localStorage.setItem("color-mode", "light");
    localStorage.setItem("nuxt-color-mode", "light");
  }
})
