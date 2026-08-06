<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: string
  }>(),
  {
    color: '#B08D3E',
  },
)
</script>

<template>
  <!-- Cadre double filet avec coins ornementaux, se pose en absolute inset-0 -->
  <svg class="pointer-events-none absolute inset-0 h-full w-full" :style="{ color }" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
    <rect x="3" y="2.2" width="94" height="95.6" stroke="currentColor" stroke-opacity="0.45" stroke-width="0.35" vector-effect="non-scaling-stroke" />
    <rect x="4.6" y="3.4" width="90.8" height="93.2" stroke="currentColor" stroke-opacity="0.25" stroke-width="0.2" vector-effect="non-scaling-stroke" />
  </svg>
  <!-- coins (non deformes) -->
  <svg class="pointer-events-none absolute left-2 top-2 h-12 w-12" :style="{ color }" viewBox="0 0 48 48" fill="none">
    <path d="M4 30 C 4 14 14 4 30 4" stroke="currentColor" stroke-opacity="0.6" stroke-width="1" />
    <path d="M8 34 C 8 18 18 8 34 8" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.8" />
    <path d="M12 22 C 16 16 22 13 28 14 C 24 18 18 21 12 22 Z" stroke="currentColor" stroke-opacity="0.55" stroke-width="0.8" />
    <circle cx="7" cy="7" r="1.6" fill="currentColor" fill-opacity="0.5" />
  </svg>
  <svg class="pointer-events-none absolute right-2 top-2 h-12 w-12 -scale-x-100" :style="{ color }" viewBox="0 0 48 48" fill="none">
    <path d="M4 30 C 4 14 14 4 30 4" stroke="currentColor" stroke-opacity="0.6" stroke-width="1" />
    <path d="M8 34 C 8 18 18 8 34 8" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.8" />
    <path d="M12 22 C 16 16 22 13 28 14 C 24 18 18 21 12 22 Z" stroke="currentColor" stroke-opacity="0.55" stroke-width="0.8" />
    <circle cx="7" cy="7" r="1.6" fill="currentColor" fill-opacity="0.5" />
  </svg>
  <svg class="pointer-events-none absolute bottom-2 left-2 h-12 w-12 -scale-y-100" :style="{ color }" viewBox="0 0 48 48" fill="none">
    <path d="M4 30 C 4 14 14 4 30 4" stroke="currentColor" stroke-opacity="0.6" stroke-width="1" />
    <path d="M8 34 C 8 18 18 8 34 8" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.8" />
    <path d="M12 22 C 16 16 22 13 28 14 C 24 18 18 21 12 22 Z" stroke="currentColor" stroke-opacity="0.55" stroke-width="0.8" />
    <circle cx="7" cy="7" r="1.6" fill="currentColor" fill-opacity="0.5" />
  </svg>
  <svg class="pointer-events-none absolute bottom-2 right-2 h-12 w-12 -scale-x-100 -scale-y-100" :style="{ color }" viewBox="0 0 48 48" fill="none">
    <path d="M4 30 C 4 14 14 4 30 4" stroke="currentColor" stroke-opacity="0.6" stroke-width="1" />
    <path d="M8 34 C 8 18 18 8 34 8" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.8" />
    <path d="M12 22 C 16 16 22 13 28 14 C 24 18 18 21 12 22 Z" stroke="currentColor" stroke-opacity="0.55" stroke-width="0.8" />
    <circle cx="7" cy="7" r="1.6" fill="currentColor" fill-opacity="0.5" />
  </svg>
</template>
