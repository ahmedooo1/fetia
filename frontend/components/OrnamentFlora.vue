<script setup lang="ts">
withDefaults(
  defineProps<{
    color?: string
    opacity?: number
  }>(),
  {
    color: '#B08D3E',
    opacity: 0.5,
  },
)
</script>

<template>
  <!-- Bouquet floral stylise : pivoine centrale, boutons, feuillage, brins -->
  <svg viewBox="0 0 200 160" fill="none" :style="{ color, opacity }" xmlns="http://www.w3.org/2000/svg">
    <!-- pivoine centrale -->
    <g stroke="currentColor" stroke-width="1.1" fill="none" stroke-linecap="round">
      <circle cx="100" cy="70" r="7" fill="currentColor" fill-opacity="0.14" />
      <path d="M100 55 C 91 55 86 63 88 70 C 84 71 82 79 87 83 C 85 90 93 96 100 93 C 107 96 115 90 113 83 C 118 79 116 71 112 70 C 114 63 109 55 100 55 Z" />
      <path d="M100 60 C 94 60 91 66 93 70 C 90 72 89 77 93 80 C 92 85 97 89 100 87 C 103 89 108 85 107 80 C 111 77 110 72 107 70 C 109 66 106 60 100 60 Z" />
      <path d="M96 67 C 96 64 104 64 104 67" />
      <path d="M94 74 C 97 78 103 78 106 74" />
    </g>

    <!-- petales exterieurs asymetriques -->
    <g stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round">
      <path d="M88 62 C 80 56 78 48 84 42 C 92 46 94 54 92 60" />
      <path d="M112 62 C 120 56 122 48 116 42 C 108 46 106 54 108 60" />
      <path d="M86 80 C 76 82 70 78 68 70 C 76 66 84 70 88 74" />
      <path d="M114 80 C 124 82 130 78 132 70 C 124 66 116 70 112 74" />
    </g>

    <!-- boutons lateraux -->
    <g stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round">
      <path d="M56 96 C 52 88 56 80 64 79 C 68 86 65 94 60 97" />
      <path d="M60 97 C 58 91 61 85 66 84" />
      <path d="M144 96 C 148 88 144 80 136 79 C 132 86 135 94 140 97" />
      <path d="M140 97 C 142 91 139 85 134 84" />
      <circle cx="47" cy="76" r="3.4" fill="currentColor" fill-opacity="0.2" />
      <circle cx="153" cy="76" r="3.4" fill="currentColor" fill-opacity="0.2" />
    </g>

    <!-- feuillage -->
    <g stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round">
      <path d="M100 93 C 100 108 100 118 100 130" />
      <path d="M100 104 C 90 100 84 104 80 112 C 88 114 96 110 100 104 Z" />
      <path d="M100 116 C 110 112 116 116 120 124 C 112 126 104 122 100 116 Z" />
      <path d="M78 90 C 66 94 58 92 50 84" />
      <path d="M60 90 C 60 87 63 85 66 86" />
      <path d="M70 93 C 70 90 73 88 76 89" />
      <path d="M122 90 C 134 94 142 92 150 84" />
      <path d="M140 90 C 140 87 137 85 134 86" />
      <path d="M130 93 C 130 90 127 88 124 89" />
    </g>

    <!-- brins et baies -->
    <g stroke="currentColor" stroke-width="0.9" fill="none" stroke-linecap="round">
      <path d="M70 60 C 62 50 60 40 64 30" />
      <circle cx="64" cy="28" r="2" fill="currentColor" fill-opacity="0.35" />
      <circle cx="68" cy="40" r="1.6" fill="currentColor" fill-opacity="0.3" />
      <circle cx="66" cy="50" r="1.6" fill="currentColor" fill-opacity="0.3" />
      <path d="M130 60 C 138 50 140 40 136 30" />
      <circle cx="136" cy="28" r="2" fill="currentColor" fill-opacity="0.35" />
      <circle cx="132" cy="40" r="1.6" fill="currentColor" fill-opacity="0.3" />
      <circle cx="134" cy="50" r="1.6" fill="currentColor" fill-opacity="0.3" />
      <path d="M88 46 C 86 38 88 30 94 24" />
      <path d="M112 46 C 114 38 112 30 106 24" />
      <circle cx="95" cy="22" r="1.4" fill="currentColor" fill-opacity="0.3" />
      <circle cx="105" cy="22" r="1.4" fill="currentColor" fill-opacity="0.3" />
    </g>
  </svg>
</template>
