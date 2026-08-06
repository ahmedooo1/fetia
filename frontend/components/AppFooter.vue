<template>
  <footer class="mt-24 border-t border-white/5">
    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-sm text-cream/50 md:flex-row">
      <p class="font-display text-lg font-bold text-cream/80">fetia<span class="text-coral">.</span></p>
      <p>Fait avec soin pour les moments qui comptent.</p>
      <nav class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <NuxtLink to="/contact" class="transition hover:text-cream">Nous contacter</NuxtLink>
        <NuxtLink to="/mentions-legales" class="transition hover:text-cream">Mentions legales</NuxtLink>
        <NuxtLink to="/cgu" class="transition hover:text-cream">CGU</NuxtLink>
        <NuxtLink to="/confidentialite" class="transition hover:text-cream">Confidentialite</NuxtLink>
      </nav>
      <p>&copy; {{ new Date().getFullYear() }} Fetia</p>
    </div>
  </footer>
</template>
