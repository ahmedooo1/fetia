<script setup lang="ts">
definePageMeta({ layout: false })

const route = useRoute()

const demos: Record<string, any> = {
  gold: {
    accent: 'gold',
    title: 'Nora & Adam',
    subtitle: 'ont la joie de vous convier a leur mariage',
    message: 'Votre presence sera notre plus beau cadeau.',
    date: 'Samedi 14 juin 2026',
    location: 'Domaine des Cerisiers, Rouen',
    timeline: [
      { time: '16h00', label: 'Ceremonie' },
      { time: '18h00', label: 'Cocktail dans les jardins' },
      { time: '20h00', label: 'Diner aux chandelles' },
      { time: '22h30', label: 'Ouverture du bal' },
    ],
    closing: 'Avec tout notre amour',
  },
  sage: {
    accent: 'sage',
    title: 'Lea & Mehdi',
    subtitle: 'se disent oui',
    message: 'Entoures de ceux qu ils aiment, sous les arbres du domaine.',
    date: 'Samedi 5 septembre 2026',
    location: 'La Grange aux Saules, Elbeuf',
    timeline: [
      { time: '15h30', label: 'Ceremonie laique' },
      { time: '17h00', label: 'Vin d honneur' },
      { time: '19h30', label: 'Repas champetre' },
      { time: '23h00', label: 'Feu de camp et guimauves' },
    ],
    closing: 'On vous attend',
  },
  sky: {
    accent: 'sky',
    title: 'Bienvenue Nour',
    subtitle: 'notre petite etoile',
    message: 'Nee le 2 aout 2026 a 4h12, 3,2 kg de bonheur.',
    date: '2 aout 2026',
    location: 'Maternite de Rouen',
    closing: 'Maman, papa et Nour se portent a merveille',
  },
  sunset: {
    accent: 'sunset',
    title: 'Lina a 25 ans',
    subtitle: 'et ca se fete',
    message: 'Un quart de siecle, ca merite mieux qu un simple message.',
    date: 'Samedi 19 septembre, 19h',
    location: 'Le Rooftop, Rouen',
    timeline: [
      { time: '19h00', label: 'Apero au coucher du soleil' },
      { time: '21h00', label: 'Gateau surprise' },
      { time: '22h00', label: 'Playlist de Lina, volume max' },
    ],
    closing: 'Ne sois pas en retard',
  },
  neon: {
    accent: 'neon',
    title: 'Neon Nights',
    subtitle: 'la soiree dont on parlera encore lundi',
    message: 'Dress code : ca brille. DJ set, cocktails, surprises.',
    date: 'Samedi 25 juillet, 23h',
    location: 'Warehouse 12, Rouen',
    timeline: [
      { time: '23h00', label: 'Ouverture des portes' },
      { time: '00h00', label: 'DJ set live' },
      { time: '03h00', label: 'After sur le toit' },
    ],
    closing: 'Viens comme tu es',
  },
}

const demo = computed(() => demos[route.params.accent as string] || demos.gold)

useHead({ title: `Fetia - Demo ${route.params.accent}` })
</script>

<template>
  <div>
    <MagicExperience v-bind="demo" />
    <div class="fixed bottom-5 left-1/2 z-40 -translate-x-1/2">
      <NuxtLink
        to="/templates"
        class="rounded-full bg-night/85 px-6 py-3 font-body text-sm font-semibold text-cream shadow-2xl backdrop-blur transition hover:scale-105"
      >
        Creer la mienne sur Fetia &rarr;
      </NuxtLink>
    </div>
  </div>
</template>
