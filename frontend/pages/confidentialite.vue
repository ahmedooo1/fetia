<script setup lang="ts">
useHead({ title: 'Confidentialité - Fetia' })
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="font-display text-3xl font-bold text-cream">Politique de confidentialité</h1>
    <p class="mt-2 font-body text-xs text-cream/40">Dernière mise à jour : [À COMPLÉTER : date]</p>

    <div class="mt-8 space-y-8 font-body text-sm leading-relaxed text-cream/70">
      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Donnees collectees</h2>
        <p class="mt-2">
          Lors de la création d'un compte : nom, email, mot de passe (stocké sous forme chiffrée,
          jamais en clair). Lors de la personnalisation d'une carte : titre, message, date, lieu,
          photo éventuelle. Lors d'une réponse RSVP par un invité : nom, présence, nombre
          d'accompagnants, message optionnel.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Finalite du traitement</h2>
        <p class="mt-2">
          Ces données sont utilisées exclusivement pour fournir le service : création et affichage
          des cartes, gestion des réponses RSVP, communication avec l'utilisateur (email de
          réinitialisation de mot de passe, réponse au formulaire de contact).
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Duree de conservation</h2>
        <p class="mt-2">
          Les données sont conservées tant que le compte est actif. Une carte et ses réponses RSVP
          sont supprimées définitivement lorsque l'utilisateur supprime la carte ou son compte.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Destinataires et sous-traitants</h2>
        <p class="mt-2">
          Les données sont hébergées chez [À COMPLÉTER : nom de l'hébergeur]. L'envoi d'emails
          transite par Google (Gmail SMTP). Aucune donnée n'est vendue ni partagée à des fins
          publicitaires.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Tes droits</h2>
        <p class="mt-2">
          Conformément au RGPD, tu disposes d'un droit d'accès, de rectification, de suppression et
          d'opposition sur tes données personnelles. Pour exercer ces droits, contacte-nous via
          notre <NuxtLink to="/contact" class="text-gold underline">formulaire de contact</NuxtLink>.
        </p>
      </section>
    </div>
  </main>
</template>
