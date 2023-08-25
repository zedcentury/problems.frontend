// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    css: [
        "assets/bootstrap/css/bootstrap.min.css"
    ],
    runtimeConfig: {
        BASE_URL: process.env.BASE_URL
    }
})
