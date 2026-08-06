<script setup lang="ts">
useHead({ title: 'Confidentialite - Fetia' })
</script>

<template>
  <main class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="font-display text-3xl font-bold text-cream">Politique de confidentialite</h1>
    <p class="mt-2 font-body text-xs text-cream/40">Derniere mise a jour : [A COMPLETER : date]</p>

    <div class="mt-8 space-y-8 font-body text-sm leading-relaxed text-cream/70">
      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Donnees collectees</h2>
        <p class="mt-2">
          Lors de la creation d'un compte : nom, email, mot de passe (stocke sous forme chiffree,
          jamais en clair). Lors de la personnalisation d'une carte : titre, message, date, lieu,
          photo eventuelle. Lors d'une reponse RSVP par un invite : nom, presence, nombre
          d'accompagnants, message optionnel.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Finalite du traitement</h2>
        <p class="mt-2">
          Ces donnees sont utilisees exclusivement pour fournir le service : creation et affichage
          des cartes, gestion des reponses RSVP, communication avec l'utilisateur (email de
          reinitialisation de mot de passe, reponse au formulaire de contact).
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Duree de conservation</h2>
        <p class="mt-2">
          Les donnees sont conservees tant que le compte est actif. Une carte et ses reponses RSVP
          sont supprimees definitivement lorsque l'utilisateur supprime la carte ou son compte.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Destinataires et sous-traitants</h2>
        <p class="mt-2">
          Les donnees sont hebergees chez [A COMPLETER : nom de l'hebergeur]. L'envoi d'emails
          transite par Google (Gmail SMTP). Aucune donnee n'est vendue ni partagee a des fins
          publicitaires.
        </p>
      </section>

      <section>
        <h2 class="font-display text-lg font-semibold text-cream">Tes droits</h2>
        <p class="mt-2">
          Conformement au RGPD, tu disposes d'un droit d'acces, de rectification, de suppression et
          d'opposition sur tes donnees personnelles. Pour exercer ces droits, contacte-nous via
          notre <NuxtLink to="/contact" class="text-gold underline">formulaire de contact</NuxtLink>.
        </p>
      </section>
    </div>
  </main>
</template>
