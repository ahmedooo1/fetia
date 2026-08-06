<script setup lang="ts">
defineProps<{
  template: {
    id: string
    name: string
    category: string
    designKey: string
    isPremium: boolean
    priceCents: number
    defaultData: { title?: string; subtitle?: string; message?: string; accent?: string }
  }
}>()
</script>

<template>
  <NuxtLink
    :to="`/editor/${template.id}`"
    class="group block transition duration-300 hover:-translate-y-1.5"
  >
    <div class="relative overflow-hidden rounded-3xl shadow-xl shadow-black/40 ring-1 ring-white/10">
      <div class="pointer-events-none">
        <MagicExperience
          force-open
          compact
          :accent="(template.defaultData?.accent as any) || 'gold'"
          :title="template.defaultData?.title"
          :subtitle="template.defaultData?.subtitle"
        />
      </div>
      <span
        v-if="template.isPremium"
        class="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-semibold text-gold backdrop-blur"
      >
        {{ (template.priceCents / 100).toFixed(2) }} &euro;
      </span>
      <span
        v-else
        class="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-semibold text-cream/90 backdrop-blur"
      >
        Gratuit
      </span>
    </div>
    <div class="mt-3 flex items-center justify-between">
      <p class="font-display text-sm font-semibold text-cream">{{ template.name }}</p>
      <span class="text-xs text-cream/50 opacity-0 transition group-hover:opacity-100">
        Personnaliser &rarr;
      </span>
    </div>
  </NuxtLink>
</template>
