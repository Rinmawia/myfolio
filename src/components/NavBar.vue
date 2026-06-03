<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  isLoaded: Boolean
})

const logoRef = ref(null)
const linkRefs = ref([])
const timeRef = ref(null)
const activeSection = ref('home')

const currentTime = ref('')

const route = useRoute()
const router = useRouter()

const goHome = () => router.push({ name: 'home' })
const goWorks = () => router.push({ name: 'home', hash: '#works' })

const updateTime = () => {
  const now = new Date()
  let hours = now.getHours()
  let minutes = now.getMinutes()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  
  currentTime.value = `<span class="flex flex-row items-center gap-2"><span>${hours}:${minutes}</span> <span class="flex flex-col gap-0"><span class="text-[0.6em] leading-none">${ampm}</span> <span class="text-[0.5em] tracking-widest leading-none">LOCAL TIME</span></span></span>`
}

let timerInterval
let worksTrigger = null
onMounted(() => {
  updateTime()
  timerInterval = setInterval(updateTime, 1000)
  
  // Initially hide elements for the masking effect
  gsap.set(logoRef.value, { yPercent: 100 })
  gsap.set(linkRefs.value, { yPercent: 100 })
  gsap.set(timeRef.value, { yPercent: 100 })
})

onUnmounted(() => {
  clearInterval(timerInterval)
  if (worksTrigger) worksTrigger.kill()
})

watch(() => props.isLoaded, (newVal) => {
  if (newVal) {
    const tl = gsap.timeline()
    
    tl.fromTo(logoRef.value,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.8, ease: "power4.out" }
    )
    .fromTo(linkRefs.value,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.1 },
      "-=0.6"
    )
    .fromTo(timeRef.value,
      { yPercent: 100 },
      { yPercent: 0, duration: 0.8, ease: "power4.out" },
      "-=0.6"
    )

    nextTick(() => {
      if (route.name !== 'home') return
      const worksEl = document.getElementById('works')
      if (!worksEl) return

      if (worksTrigger) worksTrigger.kill()
      worksTrigger = ScrollTrigger.create({
        trigger: worksEl,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => (activeSection.value = 'works'),
        onEnterBack: () => (activeSection.value = 'works'),
        onLeaveBack: () => (activeSection.value = 'home'),
        onLeave: () => (activeSection.value = null)
      })

      ScrollTrigger.refresh()
    })
  }
})

watch(
  () => route.name,
  (name) => {
    activeSection.value = name === 'home' ? 'home' : null
    if (name !== 'home' && worksTrigger) {
      worksTrigger.kill()
      worksTrigger = null
    }
  },
  { immediate: true }
)
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-40 grid grid-cols-1 md:grid-cols-2 px-8 md:px-16 lg:px-24 py-8 font-sans text-xs md:text-sm tracking-widest uppercase mix-blend-difference text-white">
    
    <!-- Left Column (Logo) -->
    <div class="flex items-center">
      <div class="overflow-hidden">
        <div ref="logoRef" class="font-medium">RIN.K</div>
      </div>
    </div>
    
    <!-- Right Column (Navigation & Time) -->
    <div class="hidden md:flex items-center justify-between">
      
      <!-- Navigation Links -->
      <div class="flex items-center gap-12 px-6">
        <div class="overflow-hidden">
          <RouterLink
            to="/"
            ref="linkRefs"
            class="hover:text-orange-500 transition-colors duration-300"
          >
            <span :class="activeSection === 'home' ? 'text-orange-500 mr-1' : 'text-transparent mr-1'">></span>
            HOME
          </RouterLink>
        </div>
        <div class="overflow-hidden">
          <a
            href="/#works"
            ref="linkRefs"
            class="hover:text-orange-500 transition-colors duration-300"
            @click.prevent="goWorks"
          >
            <span :class="activeSection === 'works' ? 'text-orange-500 mr-1' : 'text-transparent mr-1'">></span>
            WORKS
          </a>
        </div>
        <!-- <div class="overflow-hidden">
          <a href="#" ref="linkRefs" class="hover:text-orange-500 transition-colors duration-300">
            <span class="text-transparent mr-1">></span> PLAY
          </a>
        </div> -->
      </div>
      
      <!-- Local Time -->
      <div class="overflow-hidden">
        <div ref="timeRef" class="font-medium" v-html="currentTime"></div>
      </div>
      
    </div>
    
  </nav>
</template>
