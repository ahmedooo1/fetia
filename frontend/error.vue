<script setup lang="ts">
const props = defineProps<{
  error: { statusCode: number; statusMessage?: string; message?: string }
}>()

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 bg-night bg-party-gradient px-6 text-center">
    <p class="font-display text-6xl font-extrabold text-cream/20">{{ props.error.statusCode }}</p>
    <h1 class="font-display text-2xl font-bold text-cream">
      {{ props.error.statusCode === 404 ? 'Page introuvable' : 'Une erreur est survenue' }}
    </h1>
    <p class="max-w-sm font-body text-sm text-cream/60">
      {{ props.error.statusCode === 404
        ? "Cette page n'existe pas ou plus."
        : "Quelque chose s'est mal passe, reessaie dans quelques instants." }}
    </p>
    <button
      type="button"
      class="focus-ring mt-2 rounded-full bg-gradient-to-r from-coral to-gold px-6 py-3 font-display font-bold text-ink shadow-lg shadow-coral/20 transition hover:scale-105"
      @click="goHome"
    >
      Retour a l'accueil
    </button>
  </div>
</template>
