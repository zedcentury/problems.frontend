// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    css: [
        "assets/bootstrap/css/bootstrap.min.css"
    ],
    runtimeConfig: {
        public: {
            BASE_URL: process.env.BASE_URL
        }
    }
})
