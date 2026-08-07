<script setup lang="ts">
import { computed } from 'vue'
import { svgBackgroundUrl } from '../composables/useSvgBackground'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(
  defineProps<{
    color?: string
    style?: 'floral' | 'minimal' | 'geometric' | 'dashed' | 'rays'
  }>(),
  {
    color: '#B08D3E',
    style: 'floral',
  },
)

const coverVisible = ref(false)

function checkCover() {
  if (typeof document === 'undefined') return false
  const el = document.querySelector('.cover')
  // consider visible if exists in DOM
  return Boolean(el)
}

onMounted(() => {
  coverVisible.value = checkCover()
  const obs = new MutationObserver(() => {
    coverVisible.value = checkCover()
  })
  obs.observe(document.body, { childList: true, subtree: true })
  onBeforeUnmount(() => obs.disconnect())
})

const borderFloral = computed(() =>
  svgBackgroundUrl(
    '<rect x="6" y="6" width="88" height="88" stroke="currentColor" stroke-opacity="0.45" stroke-width="0.35"/><rect x="8" y="8" width="84" height="84" stroke="currentColor" stroke-opacity="0.25" stroke-width="0.2"/>',
    '0 0 100 100',
    props.color,
  ),
)
const cornerFloral = computed(() =>
  svgBackgroundUrl(
    '<path d="M4 30 C 4 14 14 4 30 4" stroke="currentColor" stroke-opacity="0.6" stroke-width="1"/><path d="M8 34 C 8 18 18 8 34 8" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.8"/><path d="M12 22 C 16 16 22 13 28 14 C 24 18 18 21 12 22 Z" stroke="currentColor" stroke-opacity="0.55" stroke-width="0.8"/><circle cx="7" cy="7" r="1.6" fill="currentColor" fill-opacity="0.5"/>',
    '0 0 48 48',
    props.color,
  ),
)
const borderMinimal = computed(() =>
  svgBackgroundUrl(
    '<rect x="6" y="6" width="88" height="88" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.3"/>',
    '0 0 100 100',
    props.color,
  ),
)
const cornerGeometric = computed(() =>
  svgBackgroundUrl('<path d="M0 12 V0 H12" stroke="currentColor" stroke-width="2.4"/>', '0 0 32 32', props.color),
)
const borderDashed = computed(() =>
  svgBackgroundUrl(
    '<rect x="6" y="6" width="88" height="88" rx="10" stroke="currentColor" stroke-opacity="0.3" stroke-width="0.3" stroke-dasharray="1.2 3.2"/>',
    '0 0 100 100',
    props.color,
  ),
)
// bordure + sparkles de coin fusionnes en une seule image : html2canvas ne rend
// pas de facon fiable les petits elements de coin separes (~40px) imbriques dans
// un conteneur etroit (constate empiriquement), alors que la bordure pleine
// largeur, elle, se rend toujours correctement. Tout regrouper dans le meme
// background-image contourne le probleme.
const borderRays = computed(() =>
  svgBackgroundUrl(
    `<rect x="6" y="6" width="88" height="88" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.3"/>
    <path d="M12 8 V16 M8 12 H16" stroke="currentColor" stroke-opacity="0.7" stroke-width="0.8"/><circle cx="12" cy="12" r="1" fill="currentColor" fill-opacity="0.5"/>
    <path d="M88 8 V16 M84 12 H92" stroke="currentColor" stroke-opacity="0.7" stroke-width="0.8"/><circle cx="88" cy="12" r="1" fill="currentColor" fill-opacity="0.5"/>
    <path d="M12 88 V96 M8 92 H16" stroke="currentColor" stroke-opacity="0.7" stroke-width="0.8"/><circle cx="12" cy="92" r="1" fill="currentColor" fill-opacity="0.5"/>
    <path d="M88 88 V96 M84 92 H92" stroke="currentColor" stroke-opacity="0.7" stroke-width="0.8"/><circle cx="88" cy="92" r="1" fill="currentColor" fill-opacity="0.5"/>`,
    '0 0 100 100',
    props.color,
  ),
)
</script>

<template v-if="!coverVisible">
  <!-- FLORAL : cadre double filet + coins courbes fleuris -->
  <template v-if="style === 'floral'">
    <div
      class="pointer-events-none absolute"
      :style="{ left: 'var(--frame-inset, 1.5rem)', right: 'var(--frame-inset, 1.5rem)', top: 'var(--frame-inset, 1.5rem)', bottom: 'var(--frame-inset, 1.5rem)', backgroundImage: borderFloral, backgroundSize: '100% 100%' }"
    />
    <div class="pointer-events-none absolute" :style="{ left: 'var(--frame-inset, 1.5rem)', top: 'var(--frame-inset, 1.5rem)', height: '3rem', width: '3rem', backgroundImage: cornerFloral, backgroundSize: '100% 100%' }" />
    <div class="pointer-events-none absolute -scale-x-100" :style="{ right: 'var(--frame-inset, 1.5rem)', top: 'var(--frame-inset, 1.5rem)', height: '3rem', width: '3rem', backgroundImage: cornerFloral, backgroundSize: '100% 100%' }" />
    <div class="pointer-events-none absolute -scale-y-100" :style="{ left: 'var(--frame-inset, 1.5rem)', bottom: 'var(--frame-inset, 1.5rem)', height: '3rem', width: '3rem', backgroundImage: cornerFloral, backgroundSize: '100% 100%' }" />
    <div class="pointer-events-none absolute -scale-x-100 -scale-y-100" :style="{ right: 'var(--frame-inset, 1.5rem)', bottom: 'var(--frame-inset, 1.5rem)', height: '3rem', width: '3rem', backgroundImage: cornerFloral, backgroundSize: '100% 100%' }" />
  </template>

  <!-- MINIMAL : simple filet fin, aucun coin -->
  <div
    v-else-if="style === 'minimal'"
    class="pointer-events-none absolute"
    :style="{ left: 'var(--frame-inset, 1.5rem)', right: 'var(--frame-inset, 1.5rem)', top: 'var(--frame-inset, 1.5rem)', bottom: 'var(--frame-inset, 1.5rem)', backgroundImage: borderMinimal, backgroundSize: '100% 100%' }"
  />

  <!-- GEOMETRIC : coins en equerre nette, style poster -->
  <template v-else-if="style === 'geometric'">
    <div class="pointer-events-none absolute" :style="{ left: 'calc(var(--frame-inset, 1.5rem) + 0px)', top: 'calc(var(--frame-inset, 1.5rem) + 0px)', height: '2rem', width: '2rem', backgroundImage: cornerGeometric, backgroundSize: '100% 100%' }" />
    <div class="pointer-events-none absolute -scale-x-100" :style="{ right: 'calc(var(--frame-inset, 1.5rem) + 0px)', top: 'calc(var(--frame-inset, 1.5rem) + 0px)', height: '2rem', width: '2rem', backgroundImage: cornerGeometric, backgroundSize: '100% 100%' }" />
    <div class="pointer-events-none absolute -scale-y-100" :style="{ left: 'calc(var(--frame-inset, 1.5rem) + 0px)', bottom: 'calc(var(--frame-inset, 1.5rem) + 0px)', height: '2rem', width: '2rem', backgroundImage: cornerGeometric, backgroundSize: '100% 100%' }" />
    <div class="pointer-events-none absolute -scale-x-100 -scale-y-100" :style="{ right: 'calc(var(--frame-inset, 1.5rem) + 0px)', bottom: 'calc(var(--frame-inset, 1.5rem) + 0px)', height: '2rem', width: '2rem', backgroundImage: cornerGeometric, backgroundSize: '100% 100%' }" />
  </template>

  <!-- DASHED : bordure pointillee arrondie, style pastel -->
  <div
    v-else-if="style === 'dashed'"
    class="pointer-events-none absolute rounded-[2rem]"
    :style="{ left: 'var(--frame-inset, 1.5rem)', right: 'var(--frame-inset, 1.5rem)', top: 'var(--frame-inset, 1.5rem)', bottom: 'var(--frame-inset, 1.5rem)', backgroundImage: borderDashed, backgroundSize: '100% 100%' }"
  />

  <!-- RAYS : bordure + sparkles de coin, style celebration -->
  <div
    v-else-if="style === 'rays'"
    class="pointer-events-none absolute"
    :style="{ left: 'var(--frame-inset, 1.5rem)', right: 'var(--frame-inset, 1.5rem)', top: 'var(--frame-inset, 1.5rem)', bottom: 'var(--frame-inset, 1.5rem)', backgroundImage: borderRays, backgroundSize: '100% 100%' }"
  />
</template>
