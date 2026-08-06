<script setup lang="ts">
useHead({ title: 'Mentions legales - Fetia' })
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="font-display text-3xl font-bold text-cream">Mentions legales</h1>

    <div class="mt-8 space-y-8 font-body text-sm leading-relaxed text-cream/70">
      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Editeur du site</h2>
        <p class="mt-2">
          [A COMPLETER : nom ou raison sociale, forme juridique, adresse du siege, numero SIRET/SIREN
          si activite commerciale, capital social le cas echeant]<br />
          Directeur de la publication : [A COMPLETER : nom]<br />
          Contact : [A COMPLETER : email de contact]
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Hebergement</h2>
        <p class="mt-2">
          Application : [A COMPLETER : nom de l'hebergeur, adresse, telephone]<br />
          Envoi d'emails : Google LLC (Gmail SMTP)
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Propriete intellectuelle</h2>
        <p class="mt-2">
          L'ensemble des elements du site Fetia (textes, graphismes, logo, modeles de cartes) est
          protege par le droit d'auteur. Toute reproduction non autorisee est interdite.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Traceurs et cookies</h2>
        <p class="mt-2">
          Fetia utilise uniquement des traceurs strictement necessaires au fonctionnement du
          service (session de connexion, stockee dans le navigateur). Aucun cookie publicitaire ou
          de mesure d'audience tiers n'est depose a ce jour.
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
