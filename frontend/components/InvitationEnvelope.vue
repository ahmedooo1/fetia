<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title?: string
    subtitle?: string
    message?: string
    monogram?: string
  }>(),
  {
    title: 'Vous etes invites',
    subtitle: '',
    message: '',
    monogram: '&',
  },
)

const opened = ref(false)
const bursting = ref(false)

function open() {
  if (opened.value) return
  bursting.value = true
  opened.value = true
  setTimeout(() => {
    bursting.value = false
  }, 900)
}
</script>

<template>
  <div class="envelope-frame card-frame relative aspect-[3/4] w-full overflow-hidden bg-[#FBF3E7]">
    <!-- particules d'ambiance, toujours actives -->
    <AmbientMagic :density="opened ? 26 : 10" color="#C9A227" />

    <!-- flash lumineux a l'ouverture -->
    <div v-if="bursting" class="light-burst absolute inset-0" />

    <!-- CONTENU REVELE -->
    <div
      class="relative flex h-full flex-col justify-between p-7 transition-all duration-700 ease-out"
      :class="opened ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'"
    >
      <span class="w-fit rounded-full border border-ink/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/50">
        Invitation
      </span>

      <div class="space-y-3">
        <h3 class="shimmer-text font-display text-3xl font-extrabold leading-[1.05] text-ink text-balance">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="font-display text-base font-medium text-ink/80">{{ subtitle }}</p>
        <p v-if="message" class="max-w-[85%] font-body text-sm leading-relaxed text-ink/60">
          {{ message }}
        </p>
      </div>
    </div>

    <!-- FACE ENVELOPPE (visible avant ouverture) -->
    <button
      type="button"
      class="envelope-face focus-ring absolute inset-0 flex flex-col items-center justify-center"
      :class="opened ? 'envelope-open' : ''"
      :disabled="opened"
      aria-label="Ouvrir l'invitation"
      @click="open"
    >
      <!-- plis de l'enveloppe -->
      <svg class="absolute inset-0 h-full w-full" viewBox="0 0 300 400" preserveAspectRatio="none">
        <polygon points="0,0 300,0 150,190" fill="#F1E4CC" fill-opacity="0.7" stroke="#C9A227" stroke-opacity="0.35" stroke-width="1" />
        <polygon points="0,400 300,400 150,210" fill="#F1E4CC" fill-opacity="0.5" stroke="#C9A227" stroke-opacity="0.3" stroke-width="1" />
        <polygon points="0,0 0,400 150,200" fill="#EFE0C4" fill-opacity="0.5" stroke="#C9A227" stroke-opacity="0.25" stroke-width="1" />
        <polygon points="300,0 300,400 150,200" fill="#EFE0C4" fill-opacity="0.5" stroke="#C9A227" stroke-opacity="0.25" stroke-width="1" />
      </svg>

      <!-- fioritures dans les coins -->
      <svg class="absolute left-4 top-4 h-10 w-10 opacity-60" viewBox="0 0 40 40" fill="none">
        <path d="M2 2 Q 20 2 20 20 Q 20 2 38 2" stroke="#C9A227" stroke-width="1.2" fill="none" />
        <circle cx="20" cy="20" r="1.6" fill="#C9A227" />
      </svg>
      <svg class="absolute right-4 top-4 h-10 w-10 -scale-x-100 opacity-60" viewBox="0 0 40 40" fill="none">
        <path d="M2 2 Q 20 2 20 20 Q 20 2 38 2" stroke="#C9A227" stroke-width="1.2" fill="none" />
        <circle cx="20" cy="20" r="1.6" fill="#C9A227" />
      </svg>
      <svg class="absolute bottom-4 left-4 h-10 w-10 -scale-y-100 opacity-60" viewBox="0 0 40 40" fill="none">
        <path d="M2 2 Q 20 2 20 20 Q 20 2 38 2" stroke="#C9A227" stroke-width="1.2" fill="none" />
        <circle cx="20" cy="20" r="1.6" fill="#C9A227" />
      </svg>
      <svg class="absolute bottom-4 right-4 h-10 w-10 -scale-x-100 -scale-y-100 opacity-60" viewBox="0 0 40 40" fill="none">
        <path d="M2 2 Q 20 2 20 20 Q 20 2 38 2" stroke="#C9A227" stroke-width="1.2" fill="none" />
        <circle cx="20" cy="20" r="1.6" fill="#C9A227" />
      </svg>

      <!-- sceau de cire -->
      <div class="seal relative flex h-20 w-20 items-center justify-center rounded-full">
        <span class="font-display text-2xl italic text-[#FBF3E7]">{{ monogram }}</span>
      </div>
      <div class="seal-crack-left" />
      <div class="seal-crack-right" />

      <p class="absolute bottom-8 font-body text-xs font-medium uppercase tracking-[0.15em] text-ink/40">
        Touchez pour ouvrir
      </p>
    </button>
  </div>
</template>

<style scoped>
.envelope-face {
  transition: opacity 0.5s ease 0.15s;
}
.envelope-open {
  opacity: 0;
  pointer-events: none;
}

.seal {
  background: radial-gradient(circle at 35% 30%, #d9b34c, #a9791f 70%);
  box-shadow:
    0 3px 6px rgba(0, 0, 0, 0.25),
    inset 0 1px 2px rgba(255, 255, 255, 0.35);
  transition:
    transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.4s ease;
}
.envelope-open .seal,
button:disabled .seal {
  transform: scale(1.3) rotate(12deg);
  opacity: 0;
}

.seal-crack-left,
.seal-crack-right {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 40px;
  height: 80px;
  margin-top: -40px;
  background: radial-gradient(circle at 70% 30%, #d9b34c, #a9791f 70%);
  opacity: 0;
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}
.seal-crack-left {
  margin-left: -40px;
  border-radius: 40px 0 0 40px;
}
.seal-crack-right {
  margin-left: 0;
  border-radius: 0 40px 40px 0;
}
button:disabled .seal-crack-left {
  opacity: 1;
  transform: translateX(-14px) rotate(-10deg);
}
button:disabled .seal-crack-right {
  opacity: 1;
  transform: translateX(14px) rotate(10deg);
}

.light-burst {
  background: radial-gradient(circle, rgba(255, 224, 158, 0.9), rgba(255, 224, 158, 0) 60%);
  animation: burst 0.9s ease-out forwards;
  pointer-events: none;
}
@keyframes burst {
  0% {
    opacity: 0;
    transform: scale(0.2);
  }
  30% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(2.4);
  }
}

.shimmer-text {
  background: linear-gradient(100deg, #241536 40%, #c9a227 50%, #241536 60%);
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: shimmerSweep 5s ease-in-out infinite;
}
@keyframes shimmerSweep {
  0%,
  40% {
    background-position: 200% 0;
  }
  60%,
  100% {
    background-position: -100% 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .shimmer-text,
  .light-burst {
    animation: none;
  }
}
</style>
