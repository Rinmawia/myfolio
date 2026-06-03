<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ImageEffect } from '../utils/ImageEffect'
import { works } from '../data/works'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const itemRefs = ref([])
const imageRefs = ref([])
const numberRefs = ref([])
const titleRefs = ref([])
const yearRefs = ref([])
const rolesRefs = ref([])

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
const scrambleRevealPromise = (element, finalString, duration = 0.85) => {
  return new Promise((resolve) => {
    if (!element) {
      resolve()
      return
    }

    const progress = { value: 0 }
    element.innerText = ''

    gsap.to(progress, {
      value: 1,
      duration,
      ease: 'none',
      onUpdate: () => {
        const revealCount = Math.floor(progress.value * finalString.length)
        const scrambleCount = Math.min(finalString.length - revealCount, 3)

        let currentText = finalString.substring(0, revealCount)
        for (let i = 0; i < scrambleCount; i++) {
          currentText += chars[Math.floor(Math.random() * chars.length)]
        }

        element.innerText = currentText
      },
      onComplete: () => {
        element.innerText = finalString
        resolve()
      }
    })
  })
}

const scrollTriggers = []
let imageEffectInstance = null

const animateWork = async (index) => {
  const work = works[index]
  if (!work) return

  await Promise.all([
    scrambleRevealPromise(numberRefs.value?.[index], work.number, 0.25),
    scrambleRevealPromise(titleRefs.value?.[index], work.title, 0.85),
    scrambleRevealPromise(yearRefs.value?.[index], work.year, 0.35),
    scrambleRevealPromise(rolesRefs.value?.[index], work.roles, 0.65)
  ])
}

onMounted(async () => {
  await nextTick()

  imageEffectInstance = new ImageEffect({
    container: sectionRef.value,
    color: '#0a0a0a'
  })

  const images = (imageRefs.value || []).filter(Boolean)
  if (images.length > 0) {
    imageEffectInstance.addImages(images, { manual: true })
    imageEffectInstance.images.forEach((img) => img.hide(0))
    const firstImageEl = imageRefs.value?.[0]
    if (firstImageEl) firstImageEl.style.opacity = '1'
  }

  const items = (itemRefs.value || []).filter(Boolean)
  items.forEach((item, index) => {
    scrollTriggers.push(
      ScrollTrigger.create({
        trigger: item,
        start: index === 0 ? 'top 90%' : 'top 60%',
        once: true,
        onEnter: async () => {
          const imageEl = imageRefs.value?.[index]
          if (imageEl) {
            gsap.to(imageEl, { opacity: 0, duration: 0.25, ease: 'power2.out' })
          }
          const tween = imageEffectInstance?.images?.[index]?.reveal?.(1.6)
          if (tween) {
            await new Promise((resolve) => tween.eventCallback('onComplete', resolve))
          }
          await animateWork(index)
          await nextTick()
          if (imageEffectInstance?.sizes && imageEffectInstance?.images?.length) {
            imageEffectInstance.images.forEach((img) => img.onResize(imageEffectInstance.sizes))
          }
          ScrollTrigger.refresh()
        }
      })
    )
  })

  ScrollTrigger.refresh()
})

onUnmounted(() => {
  scrollTriggers.forEach((st) => st.kill())
  if (imageEffectInstance) imageEffectInstance.destroy()
})
</script>

<template>
  <section id="works" ref="sectionRef" class="relative isolate w-full bg-white text-neutral-950">
    <div class="mx-auto w-full max-w-screen-2xl px-6 md:px-8 lg:px-12 py-16 md:py-24">
      <p class="font-sans text-[10px] md:text-xs tracking-widest uppercase text-neutral-600">
        [SELECTED WORKS]
      </p>
    </div>

    <div
      v-for="(work, index) in works"
      :key="work.slug"
      :ref="(el) => (itemRefs[index] = el)"
      class="group w-full"
    >
      <div class="mx-auto w-full max-w-screen-2xl px-6 md:px-8 lg:px-12">
        <div v-if="index !== 0" class="h-px w-full bg-black"></div>

        <div class="py-8 md:py-14">
          <RouterLink :to="`/work/${work.slug}`" class="block focus:outline-none">
            <div class="w-full overflow-hidden bg-transparent">
              <div class="relative aspect-square lg:aspect-video w-full">
                <img
                  :ref="(el) => (imageRefs[index] = el)"
                  :src="work.thumbnail"
                  :alt="work.title"
                  class="absolute inset-0 block h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            <div class="grid grid-cols-12 gap-x-6 gap-y-6 items-start pt-6 md:pt-12">
              <div class="col-span-12 md:col-span-2">
                <p
                  :ref="(el) => (numberRefs[index] = el)"
                  :aria-label="work.number"
                  class="font-display font-medium tracking-tight uppercase text-3xl sm:text-4xl md:text-5xl leading-none min-h-[1em] text-neutral-950"
                ></p>
              </div>

              <div class="col-span-12 md:col-span-7">
                <h3
                  :ref="(el) => (titleRefs[index] = el)"
                  :aria-label="work.title"
                  class="font-display font-medium tracking-tighter uppercase text-4xl sm:text-5xl md:text-6xl leading-[0.95] min-h-[2.2em] md:min-h-[1.2em] text-neutral-950 group-hover:text-orange-500 transition-colors"
                ></h3>
              </div>

              <div class="col-span-6 md:col-span-1">
                <p
                  :ref="(el) => (yearRefs[index] = el)"
                  :aria-label="work.year"
                  class="font-sans text-[10px] md:text-xs tracking-widest uppercase text-neutral-600 min-h-[1em]"
                ></p>
              </div>

              <div class="col-span-6 md:col-span-2">
                <p
                  :ref="(el) => (rolesRefs[index] = el)"
                  :aria-label="work.roles"
                  class="font-sans text-[10px] md:text-xs tracking-widest uppercase text-neutral-600 whitespace-pre-line leading-5 min-h-[5em]"
                ></p>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>
