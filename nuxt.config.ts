import { defineNuxtConfig } from "nuxt/config";

// https://nuxt.com/docs/api/configuration/nuxt-config
const Title = "قيدها اكثر من مجرد حاسبة";
const Description = `مكنك الآن عبر تطبيق "قيدها" إدارة جميع عمليات حساب نقاط البلوت وإدارة الجولات بشكل تلقائي تمامًا في
                جميع الباقات الخاصة بتطبيق "قيدها". كما تتوفر خدمات خاصة في الباقات المميزة. اشترك الآن واحصل على هذه
                المميزات الاستثنائية!
`;
// const Keywords =
  // "زات , سام , بلوت , ورقة , لعب ,قيدها ,بلوت ,هاند , تريكس , كنكان ,تسجيل متقدم , حكام , شات , اوساسيونا , الادهم , طويق , دوري , الحزام , كاس , سوبر , اوراق , zat , baloot , sam , calculator";
const LogoURL =
  "https://storage.googleapis.com/qydha_bucket/qydha_assets/qydha.com-assets/qydha-logo.svg";
const WebsiteUrl = "https://qydha.com/";
export default defineNuxtConfig({
  ssr: true,
  modules: [
    "@netlify/nuxt",
    ...(process.env.NETLIFY !== "true" ? ["@nuxt/eslint" as const] : []),
    "@nuxt/ui",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
    "nuxt-aos",
    "@nuxtjs/seo",
    "@nuxtjs/robots",
    "nuxt-og-image",
    "@nuxtjs/sitemap",
    "@nuxt/image",
  ],

  // //

  css: ["~/assets/css/main.css"],

  app: {
    head: {
      htmlAttrs: {
        lang: "ar",
        dir: "rtl",
      },
      // rootAttrs: {
      //   'data-vaul-drawer-wrapper': ''
      // },
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
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "anonymous",
        },
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700&display=swap",
        },
      ],
    },
  },

  aos: {
    once: true,
    duration: 400,
    debounceDelay: 50,
    throttleDelay: 99,
  },
  ogImage: {
    defaults: {
      // component: "NuxtSeo",
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

  compatibilityDate: "2026-06-01",


  imports: {
    dirs: [
      "composables",
      "utils",
      "features/tournament/**/composables",
      "features/tournament/**/composables/api",
      "features/tournament/**/composables/logic",
    ],
  },

  runtimeConfig: {
    public: {
      qydhaapiBase: process.env.QydhaApiBase,
      qydhaToken: process.env.QydhaToken,
      apiBase: process.env.QydhaApiBase,
      streamBase: process.env.StreamBase,
      logo: LogoURL,
      title: Title,
      description: Description,
      /** In-memory banner list (no API). Dev: on unless NUXT_PUBLIC_MOCK_ASSET_BANNERS=false. Prod: only if env true. */
      mockAssetBanners:
        process.env.NODE_ENV === "development"
          ? process.env.NUXT_PUBLIC_MOCK_ASSET_BANNERS !== "false"
          : process.env.NUXT_PUBLIC_MOCK_ASSET_BANNERS === "true",
    },
  },

  devtools: {
    enabled:
      process.env.NODE_ENV === "development"
      && process.env.NUXT_DEVTOOLS === "true",
  },

  sourcemap: {
    server: false,
    client: false,
  },

  vite: {
    build: {
      sourcemap: false,
    },
  },

  nitro: {
    minify: true,
  },

  image: {
    domains: ["storage.googleapis.com"],
    provider: "none",
  },
});
