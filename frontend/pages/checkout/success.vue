<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <main class="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
    <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/15 text-gold">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
        <path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>
    <h1 class="font-display text-3xl font-bold text-cream">Paiement confirme</h1>
    <p class="mt-2 font-body text-cream/60">Ta carte est debloquee et prete a etre partagee.</p>
    <NuxtLink
      v-if="route.query.slug"
      :to="`/c/${route.query.slug}`"
      class="mt-8 rounded-full bg-gradient-to-r from-coral to-gold px-6 py-3 font-display font-bold text-ink"
    >
      Voir ma carte
    </NuxtLink>
    <NuxtLink to="/dashboard" class="mt-4 font-body text-sm text-cream/50 underline">Aller a mon espace</NuxtLink>
  </main>
</template>
