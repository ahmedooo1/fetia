<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
    <h1 class="font-display text-3xl font-bold text-cream">Paiement annulé</h1>
    <p class="mt-2 font-body text-cream/60">Aucun montant n'a été prélevé. Tu peux réessayer quand tu veux.</p>
    <NuxtLink
      v-if="route.query.slug"
      :to="`/c/${route.query.slug}`"
      class="mt-8 rounded-full bg-gradient-to-r from-coral to-gold px-6 py-3 font-display font-bold text-ink"
    >
      Réessayer
    </NuxtLink>
  </main>
</template>
