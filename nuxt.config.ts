// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxthub/core"],

  css: ["~/assets/css/main.css"],

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-27",

  hub: {
    cache: true,
  },

  runtimeConfig: {
    IPREGISTRY_API_KEY: process.env.IPREGISTRY_API_KEY,
  },
});
