<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: string
    style?: 'floral' | 'minimal' | 'geometric' | 'dashed' | 'rays'
  }>(),
  {
    color: '#B08D3E',
    style: 'floral',
  },
)
</script>

<template>
  <!-- FLORAL : cadre double filet + coins courbes fleuris -->
  <template v-if="style === 'floral'">
    <svg class="pointer-events-none absolute inset-0 h-full w-full" :style="{ color }" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
      <rect x="3" y="2.2" width="94" height="95.6" stroke="currentColor" stroke-opacity="0.45" stroke-width="0.35" vector-effect="non-scaling-stroke" />
      <rect x="4.6" y="3.4" width="90.8" height="93.2" stroke="currentColor" stroke-opacity="0.25" stroke-width="0.2" vector-effect="non-scaling-stroke" />
    </svg>
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

  <!-- MINIMAL : simple filet fin, aucun coin -->
  <svg v-else-if="style === 'minimal'" class="pointer-events-none absolute inset-0 h-full w-full" :style="{ color }" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
    <rect x="2" y="1.5" width="96" height="97" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.3" vector-effect="non-scaling-stroke" />
  </svg>

  <!-- GEOMETRIC : coins en equerre nette, style poster -->
  <template v-else-if="style === 'geometric'">
    <svg class="pointer-events-none absolute left-3 top-3 h-8 w-8" :style="{ color }" viewBox="0 0 32 32" fill="none">
      <path d="M0 12 V0 H12" stroke="currentColor" stroke-width="2.4" />
    </svg>
    <svg class="pointer-events-none absolute right-3 top-3 h-8 w-8 -scale-x-100" :style="{ color }" viewBox="0 0 32 32" fill="none">
      <path d="M0 12 V0 H12" stroke="currentColor" stroke-width="2.4" />
    </svg>
    <svg class="pointer-events-none absolute bottom-3 left-3 h-8 w-8 -scale-y-100" :style="{ color }" viewBox="0 0 32 32" fill="none">
      <path d="M0 12 V0 H12" stroke="currentColor" stroke-width="2.4" />
    </svg>
    <svg class="pointer-events-none absolute bottom-3 right-3 h-8 w-8 -scale-x-100 -scale-y-100" :style="{ color }" viewBox="0 0 32 32" fill="none">
      <path d="M0 12 V0 H12" stroke="currentColor" stroke-width="2.4" />
    </svg>
  </template>

  <!-- DASHED : bordure pointillee arrondie, style pastel -->
  <svg v-else-if="style === 'dashed'" class="pointer-events-none absolute inset-0 h-full w-full rounded-[2rem]" :style="{ color }" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
    <rect x="3" y="3" width="94" height="94" rx="10" stroke="currentColor" stroke-opacity="0.5" stroke-width="0.6" stroke-dasharray="2.4 2.4" vector-effect="non-scaling-stroke" />
  </svg>

  <!-- RAYS : petits traits rayonnants aux coins, style celebration -->
  <template v-else-if="style === 'rays'">
    <svg class="pointer-events-none absolute inset-0 h-full w-full" :style="{ color }" preserveAspectRatio="none" viewBox="0 0 100 100" fill="none">
      <rect x="3" y="2.2" width="94" height="95.6" stroke="currentColor" stroke-opacity="0.35" stroke-width="0.3" vector-effect="non-scaling-stroke" />
    </svg>
    <svg class="pointer-events-none absolute left-2 top-2 h-10 w-10" :style="{ color }" viewBox="0 0 40 40" fill="none">
      <g stroke="currentColor" stroke-opacity="0.7" stroke-width="1" stroke-linecap="round">
        <path d="M4 4 L14 4" /><path d="M4 4 L4 14" /><path d="M4 4 L11 11" />
      </g>
    </svg>
    <svg class="pointer-events-none absolute right-2 top-2 h-10 w-10 -scale-x-100" :style="{ color }" viewBox="0 0 40 40" fill="none">
      <g stroke="currentColor" stroke-opacity="0.7" stroke-width="1" stroke-linecap="round">
        <path d="M4 4 L14 4" /><path d="M4 4 L4 14" /><path d="M4 4 L11 11" />
      </g>
    </svg>
    <svg class="pointer-events-none absolute bottom-2 left-2 h-10 w-10 -scale-y-100" :style="{ color }" viewBox="0 0 40 40" fill="none">
      <g stroke="currentColor" stroke-opacity="0.7" stroke-width="1" stroke-linecap="round">
        <path d="M4 4 L14 4" /><path d="M4 4 L4 14" /><path d="M4 4 L11 11" />
      </g>
    </svg>
    <svg class="pointer-events-none absolute bottom-2 right-2 h-10 w-10 -scale-x-100 -scale-y-100" :style="{ color }" viewBox="0 0 40 40" fill="none">
      <g stroke="currentColor" stroke-opacity="0.7" stroke-width="1" stroke-linecap="round">
        <path d="M4 4 L14 4" /><path d="M4 4 L4 14" /><path d="M4 4 L11 11" />
      </g>
    </svg>
  </template>
</template>
