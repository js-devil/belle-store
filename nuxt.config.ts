// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  // ssr: false,

  vue: {
    compilerOptions: {
      // <model-viewer> is a Web Component registered by @google/model-viewer,
      // not a Vue component - tell the compiler not to warn about it.
      isCustomElement: (tag) => tag === "model-viewer",
    },
  },

  css: [
    "~/assets/css/bootstrap.min.css",
    "~/assets/css/plugins.css",
    "~/assets/css/responsive.css",
    "~/assets/css/style.css",
  ],

  // Enable global imports
  components: [{ path: "~/components", pathPrefix: false }],

  app: {
    head: {
      title: "Belle Store | Buy Online | Best Online Store",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        {
          name: "description",
          content: "Buy the best products at the lowest prices.",
        },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/images/favicon.png" },
      ],
      script: [
        { src: "/js/vendor/modernizr-3.6.0.min.js", tagPosition: "head" },
        { src: "/js/vendor/jquery-3.3.1.min.js", tagPosition: "bodyClose" },
        { src: "/js/popper.min.js", tagPosition: "bodyClose" },
        { src: "/js/bootstrap.min.js", tagPosition: "bodyClose" },
        { src: "/js/vendor/wow.min.js", tagPosition: "bodyClose" },
        { src: "/js/plugins.js", tagPosition: "bodyClose" },
        { src: "/js/lazysizes.js", tagPosition: "bodyClose", async: true },
        // { src: "/js/main.js", tagPosition: "bodyClose" },
      ],
    },
  },
});
