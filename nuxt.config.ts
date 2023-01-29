// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    /**
     * Global CSS
     * https://nuxtjs.org/docs/configuration-glossary/configuration-css
     */
    css: [
        'honcau',
        '@viivue/atomic-css',
        '@/assets/css/style.scss',
    ],

    /**
     * App
     */
    app: {
        head: {
            charset: 'utf-8',
            viewport: 'width=device-width, initial-scale=1',
            title: 'ThreeJs Journey',
            meta: [
                // <meta name="description" content="My amazing site">
                //{name: 'description', content: 'My amazing site.'}
            ],
        },

        // https://nuxt.com/docs/getting-started/transitions
        pageTransition: {name: 'page', mode: 'out-in'},
    },
})
