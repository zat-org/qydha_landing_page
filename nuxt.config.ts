import { defineNuxtConfig } from "nuxt/config";

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
  ssr: false,

  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-aos",
    "@unlok-co/nuxt-stripe",
  ],

  // Stripe Configuration
  stripe: {
    server: {
      key: process.env.STRIPE_SECRET_KEY,
      options: {
        apiVersion: '2025-05-28.basil',
      },
    },
    client: {
      key: process.env.STRIPE_PUBLISHABLE_KEY,
      options: {},
    },
  },

  css: [
    "~/assets/css/main.css"
  ],

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
        // { hid: "description", name: "description", content: Description },
        // { hid: "keywords", name: "keywords", content: Keywords },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
      ],
      // noscript: [
      //   {
      //     children: `
      //     <p style='text-align: center;color:white ; background-color:rgb(218, 55, 55); margin:5px 10px; padding: 10px 5px ;  border-radius:10px '>Warning: Please Enable Js</p>
      //   `,
      //   },
      // ],
    },
  },

  compatibilityDate: "2024-08-20",

  runtimeConfig: {
    // Private keys (only available on server-side)
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    
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
    enabled: true,
  },

  vite: {
    server: {
      hmr: {
        port: 24678,
      },
      allowedHosts: [
        'hip-lies-create.loca.lt',
        'three-tips-move.loca.lt',
        '.loca.lt' // Allow all loca.lt subdomains
      ],
    },
  },

  nitro: {
    devServer: {
      watch: [],
    },
  },

});