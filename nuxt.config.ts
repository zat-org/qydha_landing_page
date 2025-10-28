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
  ssr: true,
  modules: ["@nuxt/ui", "@pinia/nuxt", "pinia-plugin-persistedstate/nuxt", "nuxt-aos", "@unlok-co/nuxt-stripe", "@nuxtjs/seo", "@nuxtjs/robots", "nuxt-og-image", "@nuxtjs/sitemap", "@nuxt/image"],

  // //

  css: ["~/assets/css/main.css"],

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
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
      ],
    },
  },
  ogImage: {
    defaults: {
      component: "NuxtSeo",
      // title: "Welcome to Nuxt OG Image",
      // description: "You can modify the og:image by changing these props.",
      // colorMode: "dark",
    },
  },
  site: {
    url: "https://qydha.com/",
    name: "قيدها | Qydha",
    routes: [
      "/login",
      "/register",
      "/privacy-Policy",
      "/Term-Of-Use",
      "/tournament",
    ],
  },
  robots: {
    disallow: ["/me", "/user", "/stream", "/tournament", "/unauthorized"],
    sitemap: "https://qydha.com/sitemap.xml",
  },

  compatibilityDate: "2024-08-20",

  runtimeConfig: {
    // Private keys (only available on server-side)
    // stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    qydhaapiBase: process.env.QydhaApiBase,
    public: {
      qydhaToken: process.env.QydhaToken,
      apiBase: "/api",
      // apiBase: process.env.QydhaApiBase,

      logo: LogoURL,
      title: Title,
      description: Description,
      apiKey: process.env.apiKey,
      authDomain: process.env.authDomain,
      projectId: process.env.projectId,
      appId: process.env.appId,
    },
  },

  devtools: {
    enabled: true,
  },
});