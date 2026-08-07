<script setup lang="ts">
const showcase = [
  {
    accent: 'gold',
    label: 'Mariage elegant',
    demo: '/demo/gold',
    props: {
      accent: 'gold',
      forceOpen: true,
      compact: true,
      title: 'Nora & Adam',
      subtitle: 'ont la joie de vous convier a leur mariage',
      date: 'Samedi 14 juin 2026',
      location: 'Domaine des Cerisiers, Rouen',
    },
  },
  {
    accent: 'sage',
    label: 'Champetre',
    demo: '/demo/sage',
    props: {
      accent: 'sage',
      forceOpen: true,
      compact: true,
      title: 'Lea & Mehdi',
      subtitle: 'se disent oui',
      date: 'Samedi 5 septembre 2026',
      location: 'La Grange aux Saules, Elbeuf',
    },
  },
  {
    accent: 'sky',
    label: 'Naissance',
    demo: '/demo/sky',
    props: {
      accent: 'sky',
      forceOpen: true,
      compact: true,
      title: 'Bienvenue Nour',
      subtitle: 'notre petite etoile',
      date: '2 aout 2026',
    },
  },
  {
    accent: 'sunset',
    label: 'Anniversaire',
    demo: '/demo/sunset',
    props: {
      accent: 'sunset',
      forceOpen: true,
      compact: true,
      title: 'Lina a 25 ans',
      subtitle: 'et ca se fete',
      date: 'Samedi 19 septembre, 19h',
    },
  },
  {
    accent: 'neon',
    label: 'Soiree',
    demo: '/demo/neon',
    props: {
      accent: 'neon',
      forceOpen: true,
      compact: true,
      title: 'Neon Nights',
      subtitle: 'la soiree dont on parlera encore lundi',
      date: 'Samedi 25 juillet, 23h',
    },
  },
]
</script>

<template>
  <main>
    <!-- HERO : la demo EST le hero -->
    <section class="relative mx-auto max-w-6xl px-6 pb-10 pt-14 text-center">

      <h1 class="mx-auto max-w-3xl font-display text-5xl font-extrabold leading-[1.02] text-cream text-balance md:text-6xl">
        Des invitations que vos proches vont <span class="bg-gradient-to-r from-coral via-gold to-violet bg-clip-text text-transparent">ouvrir deux fois</span>
      </h1>
      <span class="mb-5 inline-block px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-cream/70">
        Cartes et invitations en ligne
      </span>
      <p class="mx-auto mt-6 max-w-xl font-body text-lg leading-relaxed text-cream/70">
       Chaque carte est un mini-site que vous partagez en un lien.
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <NuxtLink
          to="/templates"
          class="rounded-full bg-gradient-to-r from-coral to-gold px-7 py-3.5 font-display text-base font-bold text-ink shadow-xl shadow-coral/20 transition hover:scale-105"
        >
          Creer ma carte
        </NuxtLink>
        <NuxtLink to="/demo/gold" class="font-body text-sm font-medium text-cream/70 underline-offset-4 hover:text-cream hover:underline">
          Voir une demo en plein ecran &rarr;
        </NuxtLink>
      </div>
    </section>

    <!-- LA DEMO PRINCIPALE : l'invitation en direct, pleine largeur -->
    <section class="mx-auto max-w-4xl px-4 pb-24 md:px-6">
      <div class="overflow-hidden rounded-3xl shadow-2xl shadow-black/50 ring-1 ring-white/10">
        <MagicExperience
          accent="gold"
          title="Nora & Adam"
          subtitle="ont la joie de vous convier a leur mariage"
          message="Votre presence sera notre plus beau cadeau."
          date="Samedi 14 juin 2026"
          location="Domaine des Cerisiers, Rouen"
          :timeline="[
            { time: '16h00', label: 'Ceremonie' },
            { time: '18h00', label: 'Cocktail dans les jardins' },
            { time: '20h00', label: 'Diner aux chandelles' },
            { time: '22h30', label: 'Ouverture du bal' },
          ]"
          closing="Avec tout notre amour"
          compact
        />
      </div>
      <p class="mt-4 text-center font-body text-xs text-cream/40">
        Demo interactive - touchez le sceau, puis faites defiler a l'interieur de la carte
      </p>
    </section>

    <!-- GALERIE DES 5 AMBIANCES : cartes ouvertes, pleine largeur en alternance -->
    <section class="mx-auto max-w-6xl px-6 pb-10">
      <h2 class="mb-3 text-center font-display text-3xl font-bold text-cream md:text-4xl">Cinq ambiances, cinq emotions</h2>
      <p class="mx-auto mb-12 max-w-lg text-center font-body text-cream/60">
        Chaque ambiance a ses ornements, sa typographie et sa propre facon de s'ouvrir. Cliquez pour la vivre en plein ecran.
      </p>

      <div class="grid gap-8 md:grid-cols-2">
        <NuxtLink
          v-for="(item, i) in showcase"
          :key="item.accent"
          :to="item.demo"
          class="group relative block overflow-hidden rounded-3xl shadow-xl shadow-black/40 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
          :class="i === 0 ? 'md:col-span-2' : ''"
        >
          <div class="pointer-events-none">
            <MagicExperience v-bind="item.props" />
          </div>
          <div class="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/60 to-transparent p-5">
            <span class="font-display text-lg font-bold text-white drop-shadow">{{ item.label }}</span>
            <span class="rounded-full bg-white/15 px-4 py-1.5 font-body text-xs font-semibold text-white backdrop-blur transition group-hover:bg-white/25">
              Voir en plein ecran &rarr;
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="mx-auto max-w-4xl px-6 py-24 text-center">
      <h2 class="font-display text-3xl font-bold text-cream md:text-4xl">Votre evenement merite mieux qu'un message</h2>
      <p class="mx-auto mt-4 font-body text-cream/60">
        Modeles gratuits disponibles tout de suite, sans carte bancaire.
      </p>
      <NuxtLink
        to="/templates"
        class="mt-8 inline-block rounded-full bg-gradient-to-r from-coral to-gold px-8 py-4 font-display font-bold text-ink shadow-xl shadow-coral/20 transition hover:scale-105"
      >
        Creer ma carte
      </NuxtLink>
    </section>
  </main>
</template>
