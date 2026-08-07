<script setup lang="ts">
useHead({ title: 'Mentions légales - Fetia' })
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="font-display text-3xl font-bold text-cream">Mentions légales</h1>

    <div class="mt-8 space-y-8 font-body text-sm leading-relaxed text-cream/70">
      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Éditeur du site</h2>
        <p class="mt-2">
          [À COMPLÉTER : nom ou raison sociale, forme juridique, adresse du siège, numéro SIRET/SIREN
          si activité commerciale, capital social le cas échéant]<br />
          Directeur de la publication : [À COMPLÉTER : nom]<br />
          Contact : [À COMPLÉTER : email de contact]
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Hébergement</h2>
        <p class="mt-2">
          Application : [À COMPLÉTER : nom de l'hébergeur, adresse, téléphone]<br />
          Envoi d'emails : Google LLC (Gmail SMTP)
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Propriété intellectuelle</h2>
        <p class="mt-2">
          L'ensemble des éléments du site Fetia (textes, graphismes, logo, modèles de cartes) est
          protégé par le droit d'auteur. Toute reproduction non autorisée est interdite.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Traceurs et cookies</h2>
        <p class="mt-2">
          Fetia utilise uniquement des traceurs strictement nécessaires au fonctionnement du
          service (session de connexion, stockée dans le navigateur). Aucun cookie publicitaire ou
          de mesure d'audience tiers n'est déposé à ce jour.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Contact</h2>
        <p class="mt-2">
          Pour toute question, utilise notre
          <NuxtLink to="/contact" class="text-gold underline">formulaire de contact</NuxtLink>.
        </p>
      </section>
    </div>
  </main>
</template>
