<script setup>
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ImageEffect } from '../utils/ImageEffect'

const props = defineProps({
  isLoaded: Boolean
})

const subtitle1Ref = ref(null)
const title1Ref = ref(null)
const title2MobileRef = ref(null)
const title3MobileRef = ref(null)
const subtitle2MobileRef = ref(null)
const title2DesktopRef = ref(null)
const title3DesktopRef = ref(null)
const subtitle2DesktopRef = ref(null)
const carouselRef = ref(null)
const imageRefs = ref([])

const isAnimationComplete = ref(false)
const currentImage = ref(0)
const images = [
  '/public/images/slide_01.png',
  '/public/images/slide_02.png',
  '/public/images/slide_03.png',
  '/public/images/slide_02.png',
]

const orangeTextLabels = ['VISUAL', 'UI/UX', 'IDENTITY', 'COOL']

let imageEffectInstance = null
let carouselIntervalId = null
let introTl = null

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
const scrambleRevealPromise = (element, finalString, duration = 0.8) => {
  return new Promise((resolve) => {
    if (!element) {
      resolve();
      return;
    }
    
    let progress = { value: 0 };
    element.innerText = '';
    
    gsap.to(progress, {
      value: 1,
      duration: duration,
      ease: "none",
      onUpdate: () => {
        const revealCount = Math.floor(progress.value * finalString.length);
        const scrambleCount = Math.min(finalString.length - revealCount, 3);
        
        let currentText = finalString.substring(0, revealCount);
        for(let i=0; i<scrambleCount; i++) {
          currentText += chars[Math.floor(Math.random() * chars.length)];
        }
        
        element.innerText = currentText;
      },
      onComplete: () => {
        element.innerText = finalString;
        resolve();
      }
    });
  });
};

onMounted(async () => {
  gsap.set([subtitle1Ref.value, subtitle2MobileRef.value, subtitle2DesktopRef.value], { yPercent: 100 })

  imageEffectInstance = new ImageEffect({
    container: carouselRef.value,
    color: "#e5e5e5"
  })

  await nextTick()

  const els = (imageRefs.value || []).filter(Boolean)
  if (els.length > 0) {
    imageEffectInstance.addImages(els, { manual: true })
    imageEffectInstance.images.forEach((img) => img.hide(0))
  }

  if (props.isLoaded) {
    runIntro()
  }
})

onUnmounted(() => {
  if (introTl) introTl.kill()
  if (imageEffectInstance) {
    imageEffectInstance.destroy()
  }
  if (carouselIntervalId) {
    clearInterval(carouselIntervalId)
  }
})

watch(currentImage, (newVal, oldVal) => {
  if (isAnimationComplete.value && imageEffectInstance && imageEffectInstance.images.length > 0) {
    scrambleRevealPromise(title2MobileRef.value, orangeTextLabels[newVal], 0.6);
    scrambleRevealPromise(title2DesktopRef.value, orangeTextLabels[newVal], 0.6);
    
    if (oldVal !== undefined && imageEffectInstance.images[oldVal]) {
      imageEffectInstance.images[oldVal].hide(1.2)
    }
    if (imageEffectInstance.images[newVal]) {
      imageEffectInstance.images[newVal].reveal(1.2)
    }
  }
})

const runIntro = async () => {
  await nextTick()

  if (!subtitle1Ref.value || !title1Ref.value) return

  if (introTl) introTl.kill()
  if (carouselIntervalId) clearInterval(carouselIntervalId)
  carouselIntervalId = null
  isAnimationComplete.value = false

  const tl = gsap.timeline()
  introTl = tl

  if (imageEffectInstance && imageEffectInstance.images.length > 0) {
    currentImage.value = 0
    imageEffectInstance.images.forEach((img) => img.hide(0))
    tl.call(() => {
      if (imageEffectInstance?.images?.[0]) {
        imageEffectInstance.images[0].reveal(1.6)
      }
    })
  }

  if (title1Ref.value) title1Ref.value.innerText = ''
  if (title2MobileRef.value) title2MobileRef.value.innerText = ''
  if (title3MobileRef.value) title3MobileRef.value.innerText = ''
  if (title2DesktopRef.value) title2DesktopRef.value.innerText = ''
  if (title3DesktopRef.value) title3DesktopRef.value.innerText = ''

  tl.fromTo(
    subtitle1Ref.value,
    { yPercent: 100 },
    { yPercent: 0, duration: 0.8, ease: 'power4.out' }
  )
    .call(async () => {
      await scrambleRevealPromise(title1Ref.value, 'I MAKE', 0.8)
    })
    .call(async () => {
      await Promise.all([
        scrambleRevealPromise(title2MobileRef.value, orangeTextLabels[currentImage.value], 0.8),
        scrambleRevealPromise(title2DesktopRef.value, orangeTextLabels[currentImage.value], 0.8)
      ])
    }, null, '+=0.4')
    .call(async () => {
      await Promise.all([
        scrambleRevealPromise(title3MobileRef.value, 'DESIGNS', 0.8),
        scrambleRevealPromise(title3DesktopRef.value, 'DESIGNS', 0.8)
      ])

      if (!isAnimationComplete.value) {
        isAnimationComplete.value = true
        carouselIntervalId = setInterval(() => {
          currentImage.value = (currentImage.value + 1) % images.length
        }, 3000)
      }
    }, null, '+=0.4')
    .fromTo(
      [subtitle2MobileRef.value, subtitle2DesktopRef.value].filter(Boolean),
      { yPercent: 100 },
      { yPercent: 0, duration: 0.8, ease: 'power4.out' },
      '+=0.2'
    )
}

watch(
  () => props.isLoaded,
  (newVal) => {
    if (newVal) runIntro()
  }
)
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-white text-black">
    
    <!-- Left Column -->
    <div class="relative flex flex-col justify-center px-8 md:px-16 lg:px-24 h-[50vh] lg:h-screen">
      
      <div class="relative w-full lg:h-[10rem] xl:h-[18rem] flex flex-col justify-start">
        <div class="absolute bottom-full left-0 mb-2 overflow-hidden w-full">
          <p class="font-sans text-xs md:text-sm tracking-normal uppercase" ref="subtitle1Ref">HELLO, I'M RINMAWIA KHIANGTE</p>
        </div>
        <h1 class="text-6xl sm:text-7xl md:text-[6rem] lg:text-7xl xl:text-[8rem] font-display font-medium tracking-tighter uppercase leading-none min-h-[1em] text-black" ref="title1Ref"></h1>
        <h1 class="lg:hidden text-6xl sm:text-7xl md:text-[6rem] font-display tracking-tighter font-medium text-orange-500 uppercase leading-none min-h-[1em]" ref="title2MobileRef"></h1>
        <h1 class="lg:hidden text-6xl sm:text-7xl md:text-[6rem] font-display tracking-tighter font-medium text-black uppercase leading-none min-h-[1em]" ref="title3MobileRef"></h1>
        <div class="lg:hidden overflow-hidden">
          <p class="text-xs md:text-sm font-sans tracking-normal uppercase text-black" ref="subtitle2MobileRef">FOR THE PAST 5+ YEARS</p>
        </div>
      </div>
    </div>

    <!-- Right Column (Carousel) -->
    <div ref="carouselRef" class="relative h-[50vh] lg:h-screen w-full overflow-hidden bg-white">
      <!-- Stacked Images for ImageEffect -->
      <div v-for="(img, index) in images" :key="index" class="absolute inset-0 z-0">
        <img :ref="el => imageRefs[index] = el" :src="img" class="object-cover w-full h-full grayscale brightness(2.85)" />
      </div>

      <!-- Text Overlays (Desktop only) -->
      <div class="hidden lg:absolute inset-0 z-10 lg:flex lg:flex-col lg:justify-center px-8 md:px-16 lg:px-24 pointer-events-none">
        <div class="w-full lg:h-[10rem] xl:h-[18rem] flex flex-col justify-start">
          <h1 class="text-7xl md:text-[8rem] lg:text-7xl xl:text-[8rem] font-display tracking-tighter font-medium text-white uppercase leading-none min-h-[1em]" ref="title2DesktopRef"></h1>
          <h1 class="text-7xl md:text-[8rem] lg:text-7xl xl:text-[8rem] font-display tracking-tighter font-medium text-white mix-blend-difference uppercase leading-none min-h-[1em]" ref="title3DesktopRef"></h1>
          <div class="overflow-hidden">
            <p class="text-xs md:text-sm font-sans tracking-normal uppercase text-white mix-blend-difference" ref="subtitle2DesktopRef">FOR THE PAST 5+ YEARS</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
