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
  // ssr: false,

  modules: ["@nuxt/ui", "@pinia/nuxt", 'pinia-plugin-persistedstate/nuxt', "nuxt-aos", "@nuxtjs/tailwindcss", "@nuxtjs/color-mode", "@vueuse/nuxt", "@nuxt/icon", "@nuxt/fonts",],

  css: [
    '@/assets/css/variables.css',
    "~/assets/css/main.css"],

  app: {
    head: {
      htmlAttrs: {
        lang: "ar",
        dir: "rtl",
      },
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
    classSuffix: "",
    preference: "light"
  },

  compatibilityDate: "2024-08-20",

  runtimeConfig: {
    public: {
      qydhaapiBase: process.env.QydhaApiBase,
      qydhaToken: process.env.QydhaToken,
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      appId: process.env.appId,
    },
  },

  devtools: {
    enabled: false,
  },

  tailwindcss: {
    exposeConfig: true,
    editorSupport: true
  },

  imports: {
    imports: [{
      from: "tailwind-variants",
      name: "tv"
    }, {
      from: "tailwind-variants",
      name: "VariantProps",
      type: true
    }]
  }
});