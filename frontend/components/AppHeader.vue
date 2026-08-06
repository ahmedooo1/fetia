<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()
const mobileOpen = ref(false)

function logout() {
  auth.logout()
  mobileOpen.value = false
  router.push('/')
}
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-white/5 bg-night/70 backdrop-blur-xl">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
      <div class="flex items-center gap-8">
        <NuxtLink to="/" class="font-display text-2xl font-extrabold tracking-tight text-cream">
          fetia<span class="text-coral">.</span>
        </NuxtLink>

        <nav class="hidden items-center gap-8 font-body text-sm text-cream/80 md:flex">
          <NuxtLink to="/templates" class="transition hover:text-cream">Modeles</NuxtLink>
        </nav>
      </div>

      <div class="hidden items-center gap-3 md:flex">
        <template v-if="auth.user">
          <NuxtLink
            to="/dashboard"
            class="rounded-full px-4 py-2 text-sm text-cream/80 transition hover:text-cream"
          >
            {{ auth.user.name.split(' ')[0] }}
          </NuxtLink>
          <button
            type="button"
            class="focus-ring rounded-full px-4 py-2 text-sm text-cream/60 transition hover:text-cream"
            @click="logout"
          >
            Deconnexion
          </button>
          <NuxtLink
            to="/templates"
            class="rounded-full bg-gradient-to-r from-coral to-gold px-5 py-2 text-sm font-semibold text-ink shadow-lg shadow-coral/20 transition hover:scale-105"
          >
            Creer une carte
          </NuxtLink>
        </template>
        <template v-else>
          <NuxtLink to="/login" class="text-sm text-cream/80 transition hover:text-cream">
            Connexion
          </NuxtLink>
          <NuxtLink
            to="/register"
            class="rounded-full bg-gradient-to-r from-coral to-gold px-5 py-2 text-sm font-semibold text-ink shadow-lg shadow-coral/20 transition hover:scale-105"
          >
            Commencer
          </NuxtLink>
        </template>
      </div>

      <button
        class="text-cream md:hidden"
        aria-label="Ouvrir le menu"
        @click="mobileOpen = !mobileOpen"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <div v-if="mobileOpen" class="border-t border-white/5 px-6 py-4 md:hidden">
      <div class="flex flex-col gap-4 font-body text-cream/80">
        <NuxtLink to="/templates" @click="mobileOpen = false">Modeles</NuxtLink>
        <template v-if="auth.user">
          <NuxtLink to="/dashboard" @click="mobileOpen = false">Mon espace</NuxtLink>
          <button type="button" class="focus-ring text-left text-cream/60" @click="logout">Deconnexion</button>
        </template>
        <NuxtLink v-else to="/login" @click="mobileOpen = false">Connexion</NuxtLink>
        <NuxtLink
          to="/templates"
          class="w-fit rounded-full bg-gradient-to-r from-coral to-gold px-5 py-2 text-sm font-semibold text-ink"
          @click="mobileOpen = false"
        >
          Creer une carte
        </NuxtLink>
      </div>
    </div>
  </header>
</template>
