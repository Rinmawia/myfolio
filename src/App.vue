<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import LoadingScreen from './components/LoadingScreen.vue'
import NavBar from './components/NavBar.vue'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const isLoaded = ref(false)
const transitionRef = ref(null)
const router = useRouter()

const handleLoadingComplete = () => {
  isLoaded.value = true
}

let lenisInstance = null
let tickerCallback = null
let refreshListener = null
let unsubs = []
let transitionTween = null

onMounted(() => {
  const isTouchDevice =
    (typeof window !== 'undefined' && 'ontouchstart' in window) ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0)

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: isTouchDevice,
    touchMultiplier: 1.2,
    gestureOrientation: 'vertical'
  })

  lenisInstance.on('scroll', ScrollTrigger.update)

  tickerCallback = (time) => lenisInstance?.raf(time * 1000)
  gsap.ticker.add(tickerCallback)

  gsap.ticker.lagSmoothing(0)

  refreshListener = () => lenisInstance?.resize?.()
  ScrollTrigger.addEventListener('refresh', refreshListener)

  requestAnimationFrame(() => {
    ScrollTrigger.refresh()
  })

  const removeBefore = router.beforeEach(async (to, from) => {
    if (!isLoaded.value) return true
    if (!transitionRef.value) return true
    if (!from?.name) return true
    if (to.fullPath === from.fullPath) return true

    if (transitionTween) transitionTween.kill()
    await new Promise((resolve) => {
      transitionTween = gsap.to(transitionRef.value, {
        autoAlpha: 1,
        duration: 0.25,
        ease: 'power2.out',
        onComplete: resolve
      })
    })
    return true
  })

  const removeAfter = router.afterEach(async (to) => {
    await nextTick()

    if (!to.hash) {
      if (lenisInstance?.scrollTo) {
        lenisInstance.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo(0, 0)
      }
    }

    if (!transitionRef.value) return
    if (transitionTween) transitionTween.kill()
    transitionTween = gsap.to(transitionRef.value, {
      autoAlpha: 0,
      duration: 0.35,
      ease: 'power2.out'
    })
  })

  unsubs = [removeBefore, removeAfter]
})

onUnmounted(() => {
  unsubs.forEach((fn) => fn?.())
  unsubs = []
  if (refreshListener) ScrollTrigger.removeEventListener('refresh', refreshListener)
  if (tickerCallback) gsap.ticker.remove(tickerCallback)
  if (lenisInstance) lenisInstance.destroy()
  tickerCallback = null
  lenisInstance = null
  refreshListener = null
})
</script>

<template>
  <LoadingScreen @complete="handleLoadingComplete" />
  
  <NavBar :is-loaded="isLoaded" />
  <router-view v-slot="{ Component }">
    <component :is="Component" :is-loaded="isLoaded" />
  </router-view>
  <div ref="transitionRef" class="fixed inset-0 bg-white opacity-0 pointer-events-none z-50"></div>
</template>

<style scoped></style>
