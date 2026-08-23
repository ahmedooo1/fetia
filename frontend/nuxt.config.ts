export default defineNuxtConfig({
  compatibilityDate: '2024-08-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Fetia - Des cartes trop belles pour vos moments',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            "Crée des cartes d'invitation et de fête magnifiques en 2 minutes, personnalise-les et partage-les avec un lien.",
        },
        { name: 'theme-color', content: '#1B0E2E' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Fetia' },
        { property: 'og:title', content: 'Fetia - Des cartes trop belles pour vos moments' },
        {
          property: 'og:description',
          content:
            "Crée des cartes d'invitation et de fête magnifiques en 2 minutes, personnalise-les et partage-les avec un lien.",
        },
        { property: 'og:image', content: 'https://fetia.aaweb.fr/og-image.png' },
        { property: 'og:url', content: 'https://fetia.aaweb.fr' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Fetia - Des cartes trop belles pour vos moments' },
        { name: 'twitter:image', content: 'https://fetia.aaweb.fr/og-image.png' },
      ],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
    },
  },
})
