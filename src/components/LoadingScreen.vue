<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const percentRef = ref(null)
const loadingContainer = ref(null)

const emit = defineEmits(['complete'])

onMounted(() => {
  let progress = { value: 0 }
  
  // Check if all assets are already loaded
  const checkLoad = () => document.readyState === 'complete'
  
  const hideScreen = () => {
    // Smooth slick swipe transition up using GSAP
    gsap.to(loadingContainer.value, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut",
      delay: 0.1, // Slight pause before swiping out
      onComplete: () => {
        emit('complete')
      }
    })
  }

  // Characters used for the scrambling text effect
  const chars = '0123456789!@#$%^&*'
  
  gsap.to(progress, {
    value: 100,
    duration: 2.5, // Fake loading duration to allow the animation to play
    ease: "power2.inOut",
    onUpdate: () => {
      if (!percentRef.value) return
      
      const val = Math.floor(progress.value)
      const valStr = val.toString()
      
      // Random scramble effect
      if (val < 100 && Math.random() > 0.6) {
        let scrambled = ''
        for (let i = 0; i < valStr.length; i++) {
          scrambled += chars[Math.floor(Math.random() * chars.length)]
        }
        percentRef.value.innerText = scrambled + '%'
      } else {
        percentRef.value.innerText = val + '%'
      }
    },
    onComplete: () => {
      if (!percentRef.value) return
      percentRef.value.innerText = '100%'
      
      // Once it hits 100%, we wait for actual window load if it hasn't already
      if (checkLoad()) {
        hideScreen()
      } else {
        window.addEventListener('load', hideScreen)
      }
    }
  })
})
</script>

<template>
  <div ref="loadingContainer" class="fixed inset-0 z-50 flex items-center justify-center bg-white text-white w-full h-full">
    <div class="flex flex-row items-start gap-12 md:gap-24 lg:gap-32 px-6">
      
      <!-- Left side (Loading % indicator) -->
      <div class="flex flex-col mt-2">
        <span class="text-xs uppercase tracking-widest text-gray-400 mb-1">Loading</span>
        <span class="text-sm font-mono text-orange-500 w-8" ref="percentRef">0%</span>
      </div>
      
      <!-- Right side (Typography) -->
      <div class="flex flex-col">
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-black uppercase tracking-tight leading-none">
          Good Things
        </h1>
        <h1 class="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-orange-500 uppercase tracking-tight leading-none">
          Take Time
        </h1>
        <p class="text-black text-sm md:text-base font-sans font-light max-w-sm leading-tight">
          Don't worry, we live in 2026,
          this website loads really fast.
        </p>
      </div>
      
    </div>
  </div>
</template>
