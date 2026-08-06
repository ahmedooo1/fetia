<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: string
    style?: 'floral' | 'bold' | 'line' | 'dots' | 'rays'
  }>(),
  {
    color: '#B08D3E',
    style: 'floral',
  },
)
</script>

<template>
  <!-- FLORAL : filet + losange + petales -->
  <svg v-if="style === 'floral'" class="mx-auto h-6 w-56" :style="{ color }" viewBox="0 0 224 24" fill="none">
    <path d="M0 12 H 88" stroke="currentColor" stroke-opacity="0.4" stroke-width="1" />
    <path d="M136 12 H 224" stroke="currentColor" stroke-opacity="0.4" stroke-width="1" />
    <path d="M112 4 L 119 12 L 112 20 L 105 12 Z" stroke="currentColor" stroke-opacity="0.7" stroke-width="1" fill="currentColor" fill-opacity="0.12" />
    <path d="M92 12 C 96 8 100 8 103 12 C 100 16 96 16 92 12 Z" stroke="currentColor" stroke-opacity="0.5" stroke-width="0.8" />
    <path d="M132 12 C 128 8 124 8 121 12 C 124 16 128 16 132 12 Z" stroke="currentColor" stroke-opacity="0.5" stroke-width="0.8" />
    <circle cx="112" cy="12" r="1.4" fill="currentColor" fill-opacity="0.7" />
  </svg>

  <!-- BOLD : zigzag epais, style poster -->
  <svg v-else-if="style === 'bold'" class="mx-auto h-5 w-40" :style="{ color }" viewBox="0 0 160 20" fill="none">
    <path d="M0 10 L16 3 L32 17 L48 3 L64 17 L80 3 L96 17 L112 3 L128 17 L144 3 L160 10" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <!-- LINE : double filet fin, style editorial -->
  <svg v-else-if="style === 'line'" class="mx-auto h-3 w-40" :style="{ color }" viewBox="0 0 160 12" fill="none">
    <path d="M0 4 H160" stroke="currentColor" stroke-opacity="0.55" stroke-width="0.8" />
    <path d="M64 8 H96" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.2" />
  </svg>

  <!-- DOTS : trois points, style pastel -->
  <svg v-else-if="style === 'dots'" class="mx-auto h-4 w-24" :style="{ color }" viewBox="0 0 96 16" fill="none">
    <circle cx="20" cy="8" r="3.4" fill="currentColor" fill-opacity="0.55" />
    <circle cx="48" cy="8" r="4.4" fill="currentColor" fill-opacity="0.8" />
    <circle cx="76" cy="8" r="3.4" fill="currentColor" fill-opacity="0.55" />
  </svg>

  <!-- RAYS : losange rayonnant, style celebration -->
  <svg v-else-if="style === 'rays'" class="mx-auto h-8 w-40" :style="{ color }" viewBox="0 0 160 32" fill="none">
    <path d="M0 16 H60" stroke="currentColor" stroke-opacity="0.4" stroke-width="1" />
    <path d="M100 16 H160" stroke="currentColor" stroke-opacity="0.4" stroke-width="1" />
    <g stroke="currentColor" stroke-width="1.2" stroke-linecap="round">
      <path d="M80 4 V12" /><path d="M80 20 V28" /><path d="M68 16 H76" /><path d="M84 16 H92" />
      <path d="M71 7 L76 12" /><path d="M89 7 L84 12" /><path d="M71 25 L76 20" /><path d="M89 25 L84 20" />
    </g>
    <circle cx="80" cy="16" r="4" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="1" />
  </svg>
</template>
