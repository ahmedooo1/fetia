<script setup lang="ts">
const route = useRoute()
const showChrome = computed(() => route.meta.layout !== false)
</script>

<template>
  <div class="min-h-screen bg-night bg-party-gradient">
    <AppHeader v-if="showChrome" />
    <NuxtPage />
    <AppFooter v-if="showChrome" />
  </div>
</template>
