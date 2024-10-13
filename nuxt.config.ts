// https://nuxt.com/docs/api/configuration/nuxt-config
const Title = "قيدها اكثر من مجرد حاسبة";
const Description = `مكنك الآن عبر تطبيق "قيدها" إدارة جميع عمليات حساب نقاط البلوت وإدارة الجولات بشكل تلقائي تمامًا في
                جميع الباقات الخاصة بتطبيق "قيدها". كما تتوفر خدمات خاصة في الباقات المميزة. اشترك الآن واحصل على هذه
                المميزات الاستثنائية!
`;
const Keywords =
  "زات , سام , بلوت , ورقة , لعب ,قيدها ,بلوت ,هاند , تريكس , كنكان ,تسجيل متقدم , حكام , شات , اوساسيونا , الادهم , طويق , دوري , الحزام , كاس , سوبر , اوراق , zat , baloot , sam , calculator";
const LogoURL =
  "https://storage.googleapis.com/qydha_bucket/qydha_assets/qydha.com-assets/qydha-logo.svg";
const WebsiteUrl = "https://qydha.com/";
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: ["@nuxt/ui", "@pinia/nuxt", 'pinia-plugin-persistedstate/nuxt', "@samk-dev/nuxt-vcalendar"],
  css: ["~/assets/css/main.css"],

  app: {
    head: {
      htmlAttrs: {
        lang: "ar",
        dir: "rtl",
      },
      link: [{ rel: "stylesheet", href: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" ,integrity:"sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" , crossorigin:""}],
      title: Title,
      meta: [
        { name: "image", property: "og:image", content: LogoURL },
        { name: "og:title", content: Title },
        { name: "og:description", content: Description },
        { name: "og:image", content: LogoURL },
        { name: "og:url", content: WebsiteUrl },
        { name: "author", content: "Zat Compony" },
        { hid: "description", name: "description", content: Description },
        { hid: "keywords", name: "keywords", content: Keywords },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
      ],
      noscript: [
        {
          children: `
          <p style='text-align: center;color:white ; background-color:rgb(218, 55, 55); margin:5px 10px; padding: 10px 5px ;  border-radius:10px '>Warning: Please Enable Js</p>
        `,
        },
      ],
    },
  },
  colorMode: {
    preference: "light",
  },
  compatibilityDate: "2024-08-20",
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL,
      qydhaToken: `eyJhbGciOiJodHRwOi8vd3d3LnczLm9yZy8yMDAxLzA0L3htbGRzaWctbW9yZSNobWFjLXNoYTI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImFlOWQ2YTg3LWQ5ZDUtNDE4OC05Y2EzLWIyZTEzNGQyMWIxYiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL25hbWUiOiJvbHltcGljcyBicmFja2V0IiwiVG9rZW5UeXBlIjoiU2VydmljZUFjY291bnRUb2tlbiIsImF1ZCI6InF5ZGhhQXBpX2F1ZGllbmNlIiwiaXNzIjoicXlkaGFBcGkiLCJleHAiOjE3Mjg4MzA3NDYsImlhdCI6MTcyODgyMzU0NiwibmJmIjoxNzI4ODIzNTQ2fQ.5sJt0kLXYskA6vIb4mORFKP4yVVTTP_47zPs9DjeUec`,
      // qydhaapiBase: "http://192.168.1.2:5101"
     
      qydhaapiBase: "https://sam-baloot-admin.online/qydha"
    },
  },
});