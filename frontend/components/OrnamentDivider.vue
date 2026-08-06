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
  <svg class="mx-auto h-6 w-56" :style="{ color }" viewBox="0 0 224 24" fill="none">
    <path d="M0 12 H 88" stroke="currentColor" stroke-opacity="0.4" stroke-width="1" />
    <path d="M136 12 H 224" stroke="currentColor" stroke-opacity="0.4" stroke-width="1" />
    <path d="M112 4 L 119 12 L 112 20 L 105 12 Z" stroke="currentColor" stroke-opacity="0.7" stroke-width="1" fill="currentColor" fill-opacity="0.12" />
    <path d="M92 12 C 96 8 100 8 103 12 C 100 16 96 16 92 12 Z" stroke="currentColor" stroke-opacity="0.5" stroke-width="0.8" />
    <path d="M132 12 C 128 8 124 8 121 12 C 124 16 128 16 132 12 Z" stroke="currentColor" stroke-opacity="0.5" stroke-width="0.8" />
    <circle cx="112" cy="12" r="1.4" fill="currentColor" fill-opacity="0.7" />
  </svg>
</template>
