<script setup lang="ts">
const opened = ref(false)
const confettiRef = ref<{ burst: () => void } | null>(null)

function openCard() {
  opened.value = true
  confettiRef.value?.burst()
}

const categories = [
  { name: 'Anniversaire', accent: 'sunset', to: '/templates?category=anniversaire' },
  { name: 'Fete', accent: 'candy', to: '/templates?category=fete' },
  { name: 'Invitation', accent: 'gold', to: '/templates?category=invitation' },
  { name: 'Mariage', accent: 'sage', to: '/templates?category=mariage' },
  { name: 'Naissance', accent: 'sky', to: '/templates?category=naissance' },
]

const steps = [
  { n: '01', title: 'Choisis un modele', text: 'Anniversaire, mariage, naissance ou soiree: pioche parmi des designs originaux.' },
  { n: '02', title: 'Personnalise en direct', text: 'Textes, prenoms, couleurs, photo: ta carte se met a jour a chaque frappe.' },
  { n: '03', title: 'Partage un lien', text: 'Envoie ta carte par message, elle s ouvre avec une animation sur n importe quel telephone.' },
]
</script>

<template>
  <main>
    <!-- HERO -->
    <section class="relative mx-auto flex max-w-6xl flex-col items-center gap-16 px-6 pb-24 pt-16 md:flex-row md:pt-24">
      <div class="relative z-10 max-w-xl text-center md:text-left">
        <span class="mb-5 inline-block rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-cream/70">
          Cartes en ligne &middot; sans design requis
        </span>
        <h1 class="font-display text-5xl font-extrabold leading-[1.02] text-cream text-balance md:text-6xl">
          Des cartes <span class="bg-gradient-to-r from-coral via-gold to-violet bg-clip-text text-transparent">trop belles</span> pour vos moments
        </h1>
        <p class="mt-6 font-body text-lg leading-relaxed text-cream/70">
          Anniversaires, invitations, mariages, naissances. Choisis un modele, personnalise-le en deux minutes et partage un lien qui s'ouvre comme une vraie carte.
        </p>
        <div class="mt-8 flex flex-col items-center gap-4 sm:flex-row md:items-start">
          <NuxtLink
            to="/templates"
            class="rounded-full bg-gradient-to-r from-coral to-gold px-7 py-3.5 font-display text-base font-bold text-ink shadow-xl shadow-coral/20 transition hover:scale-105"
          >
            Creer ma carte
          </NuxtLink>
          <NuxtLink to="/templates" class="font-body text-sm font-medium text-cream/70 underline-offset-4 hover:text-cream hover:underline">
            Voir les modeles &rarr;
          </NuxtLink>
        </div>
      </div>

      <!-- carte interactive -->
      <div class="relative z-10 w-full max-w-sm animate-floatSlow" style="perspective: 1200px">
        <button
          type="button"
          class="focus-ring block w-full text-left"
          :style="{ transform: opened ? 'rotateY(-18deg)' : 'rotateY(0deg)', transition: 'transform 0.7s cubic-bezier(.2,.8,.2,1)' }"
          @click="openCard"
        >
          <CardCanvas
            design-key="aurora-birthday"
            title="Joyeux anniversaire"
            subtitle="On celebre Lina !"
            :message="opened ? 'Merci d etre exactement toi. On t attend ce soir a 19h, ne sois pas en retard !' : 'Touche la carte pour l ouvrir'"
            accent="sunset"
          />
        </button>
        <ConfettiCanvas ref="confettiRef" />
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="mx-auto max-w-6xl px-6 py-10">
      <div class="flex flex-wrap justify-center gap-3 md:justify-start">
        <NuxtLink
          v-for="cat in categories"
          :key="cat.name"
          :to="cat.to"
          class="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 font-body text-sm text-cream/80 transition hover:border-white/20 hover:bg-white/10 hover:text-cream"
        >
          {{ cat.name }}
        </NuxtLink>
      </div>
    </section>

    <!-- INVITATION MAGIQUE -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="grid items-center gap-14 md:grid-cols-2">
        <div class="order-2 md:order-1">
          <span class="mb-4 inline-block rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-gold">
            Invitations premium
          </span>
          <h2 class="font-display text-3xl font-bold text-cream text-balance md:text-4xl">
            Une invitation qui se <span class="bg-gradient-to-r from-gold to-coral bg-clip-text text-transparent">merite d'etre ouverte</span>
          </h2>
          <p class="mt-4 font-body text-cream/70">
            Sceau de cire, particules lumineuses, texte qui scintille: chaque invitation Fetia se vit comme un petit moment,
            pas comme un simple message.
          </p>
          <NuxtLink
            to="/templates?category=invitation"
            class="mt-6 inline-block rounded-full bg-gradient-to-r from-gold to-coral px-7 py-3.5 font-display text-base font-bold text-ink shadow-xl shadow-gold/20 transition hover:scale-105"
          >
            Voir les invitations
          </NuxtLink>
        </div>
        <div class="order-1 mx-auto w-full max-w-sm md:order-2">
          <InvitationEnvelope
            title="Vous etes invites"
            subtitle="Soiree du Nouvel An"
            message="Venez celebrer avec nous, robe de fete et bonne humeur exigees."
          />
        </div>
      </div>
    </section>

    <!-- COMMENT CA MARCHE -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <h2 class="mb-12 font-display text-3xl font-bold text-cream md:text-4xl">Trois etapes, une carte prete</h2>
      <div class="grid gap-10 md:grid-cols-3">
        <div v-for="step in steps" :key="step.n" class="relative">
          <span class="font-display text-5xl font-extrabold text-cream/10">{{ step.n }}</span>
          <h3 class="mt-2 font-display text-xl font-bold text-cream">{{ step.title }}</h3>
          <p class="mt-2 font-body text-sm leading-relaxed text-cream/60">{{ step.text }}</p>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="mx-auto max-w-4xl px-6 py-20 text-center">
      <h2 class="font-display text-3xl font-bold text-cream md:text-4xl">Prete a faire sourire quelqu'un ?</h2>
      <p class="mx-auto mt-4 max-w-md font-body text-cream/60">
        Les modeles gratuits sont utilisables tout de suite, sans carte bancaire.
      </p>
      <NuxtLink
        to="/templates"
        class="mt-8 inline-block rounded-full bg-gradient-to-r from-coral to-gold px-8 py-4 font-display font-bold text-ink shadow-xl shadow-coral/20 transition hover:scale-105"
      >
        Parcourir les modeles
      </NuxtLink>
    </section>
  </main>
</template>
