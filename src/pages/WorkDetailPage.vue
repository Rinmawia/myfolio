<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { getWorkBySlug } from '../data/works'
import FooterSection from '@/components/FooterSection.vue'
import { ImageEffect } from '../utils/ImageEffect'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps({
  slug: String,
  isLoaded: Boolean
})

const route = useRoute()

const resolvedSlug = computed(() => props.slug || route.params.slug)
const work = computed(() => getWorkBySlug(resolvedSlug.value))

const pageRef = ref(null)
const thumbnailRef = ref(null)
const mediaImageRefs = ref([])
const numberRef = ref(null)
const titleRef = ref(null)
const yearRef = ref(null)
const rolesRef = ref(null)
const overviewRef = ref(null)
const descriptionRef = ref(null)

const scrollTriggers = []
let imageEffectInstance = null
let introTl = null
let imageLoadUnsubs = []

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

const waitForImage = (imgEl) => {
  return new Promise((resolve) => {
    if (!imgEl) {
      resolve()
      return
    }
    if (imgEl.complete) {
      resolve()
      return
    }

    const done = () => resolve()
    imgEl.addEventListener('load', done, { once: true })
    imgEl.addEventListener('error', done, { once: true })
    imageLoadUnsubs.push(() => {
      imgEl.removeEventListener('load', done)
      imgEl.removeEventListener('error', done)
    })
  })
}

const cleanup = () => {
  scrollTriggers.splice(0).forEach((st) => st.kill())
  if (introTl) introTl.kill()
  introTl = null

  imageLoadUnsubs.splice(0).forEach((fn) => fn?.())
  if (imageEffectInstance) imageEffectInstance.destroy()
  imageEffectInstance = null
}

const runIntro = async () => {
  await nextTick()
  if (!work.value) return
  if (!pageRef.value) return

  if (introTl) introTl.kill()
  introTl = gsap.timeline()

  const thumbEl = thumbnailRef.value
  await waitForImage(thumbEl)
  await nextTick()
  if (imageEffectInstance?.sizes && imageEffectInstance?.images?.length) {
    imageEffectInstance.images.forEach((img) => img.onResize(imageEffectInstance.sizes))
  }

  const imageTween = imageEffectInstance?.images?.[0]?.reveal?.(1.6)
  if (imageTween) {
    await new Promise((resolve) => imageTween.eventCallback('onComplete', resolve))
  }

  await Promise.all([
    scrambleRevealPromise(numberRef.value, work.value.number, 0.25),
    scrambleRevealPromise(titleRef.value, work.value.title, 0.85),
    scrambleRevealPromise(yearRef.value, work.value.year, 0.35),
    scrambleRevealPromise(rolesRef.value, work.value.roles, 0.65)
  ])

  gsap.to([overviewRef.value, descriptionRef.value].filter(Boolean), {
    autoAlpha: 1,
    duration: 0.45,
    ease: 'power2.out',
    stagger: 0.06
  })

  ScrollTrigger.refresh()
}

const initAnimations = async () => {
  cleanup()
  await nextTick()

  if (!work.value) return
  if (!pageRef.value) return

  imageEffectInstance = new ImageEffect({
    container: pageRef.value,
    color: '#0a0a0a'
  })

  const images = [thumbnailRef.value, ...(mediaImageRefs.value || [])].filter(Boolean)
  if (images.length > 0) {
    imageEffectInstance.addImages(images, { manual: true })
    imageEffectInstance.images.forEach((img) => img.hide(0))
  }

  if (numberRef.value) numberRef.value.innerText = ''
  if (titleRef.value) titleRef.value.innerText = ''
  if (yearRef.value) yearRef.value.innerText = ''
  if (rolesRef.value) rolesRef.value.innerText = ''
  gsap.set([overviewRef.value, descriptionRef.value].filter(Boolean), { autoAlpha: 0 })

  ;(mediaImageRefs.value || []).filter(Boolean).forEach((el, index) => {
    const imageIndex = index + 1
    scrollTriggers.push(
      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: async () => {
          await waitForImage(el)
          await nextTick()
          if (imageEffectInstance?.sizes && imageEffectInstance?.images?.length) {
            imageEffectInstance.images.forEach((img) => img.onResize(imageEffectInstance.sizes))
          }

          const tween = imageEffectInstance?.images?.[imageIndex]?.reveal?.(1.6)
          if (tween) {
            await new Promise((resolve) => tween.eventCallback('onComplete', resolve))
          }
          ScrollTrigger.refresh()
        }
      })
    )
  })

  gsap.delayedCall(0.25, runIntro)
  requestAnimationFrame(() => ScrollTrigger.refresh())
}

const getYoutubeEmbedSrc = (item) => {
  const build = (id, params = {}) => {
    const query = new URLSearchParams({
      rel: '0',
      modestbranding: '1',
      playsinline: '1',
      ...Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
      )
    })
    return `https://www.youtube-nocookie.com/embed/${id}?${query.toString()}`
  }

  if (item?.embedUrl) return item.embedUrl
  if (item?.youtubeId) return build(item.youtubeId, { start: item.start, end: item.end })

  const rawUrl = item?.url
  if (!rawUrl) return null

  try {
    const url = new URL(rawUrl)
    const host = url.hostname.replace('www.', '')

    if (host === 'youtu.be') {
      const id = url.pathname.split('/').filter(Boolean)[0]
      if (!id) return null
      return build(id, { start: item.start || url.searchParams.get('t'), end: item.end })
    }

    if (host.endsWith('youtube.com')) {
      if (url.pathname.startsWith('/watch')) {
        const id = url.searchParams.get('v')
        if (!id) return null
        return build(id, { start: item.start || url.searchParams.get('t'), end: item.end })
      }

      if (url.pathname.startsWith('/embed/')) {
        const id = url.pathname.split('/embed/')[1]?.split('/')[0]
        if (!id) return null
        return build(id, {
          start: item.start || url.searchParams.get('start'),
          end: item.end || url.searchParams.get('end')
        })
      }
    }
  } catch {}

  return null
}

onMounted(initAnimations)
onUnmounted(cleanup)

watch(resolvedSlug, () => {
  mediaImageRefs.value = []
  initAnimations()
})
</script>

<template>
  <main ref="pageRef" class="relative isolate w-full bg-white text-neutral-950">
    <div class="mx-auto w-full max-w-screen-2xl px-6 md:px-8 lg:px-12 pt-28 pb-10 md:pt-32 md:pb-14">
      <div class="flex items-center justify-between">
        <p class="font-sans text-[10px] md:text-xs tracking-widest uppercase text-neutral-600">
          [WORK]
        </p>
        <RouterLink
          to="/"
          class="font-sans text-[10px] md:text-xs tracking-widest uppercase text-neutral-600 hover:text-orange-500 transition-colors"
        >
          Back Home
        </RouterLink>
      </div>
    </div>

    <template v-if="work">
      <div class="mx-auto w-full max-w-screen-2xl px-6 md:px-8 lg:px-12">
        <div class="w-full overflow-hidden bg-transparent">
          <div class="relative aspect-square lg:aspect-video w-full">
            <img
              ref="thumbnailRef"
              :src="work.thumbnail"
              :alt="work.title"
              class="absolute inset-0 block h-full w-full object-cover opacity-0"
              loading="eager"
            />
          </div>
        </div>

        <div class="grid grid-cols-12 gap-x-6 gap-y-6 items-start pt-6 md:pt-12 pb-8 md:pb-14">
          <div class="col-span-12 md:col-span-2">
            <p
              ref="numberRef"
              :aria-label="work.number"
              class="font-display font-medium tracking-tight uppercase text-3xl sm:text-4xl md:text-5xl leading-none text-neutral-950"
            ></p>
          </div>

          <div class="col-span-12 md:col-span-7">
            <h1
              ref="titleRef"
              :aria-label="work.title"
              class="font-display font-medium tracking-tighter uppercase text-4xl sm:text-5xl md:text-6xl leading-[0.95] text-neutral-950 min-h-[1.2em]"
            ></h1>
          </div>

          <div class="col-span-6 md:col-span-1">
            <p
              ref="yearRef"
              :aria-label="work.year"
              class="font-sans text-[10px] md:text-xs tracking-widest uppercase text-neutral-600 min-h-[1em]"
            ></p>
          </div>

          <div class="col-span-6 md:col-span-2">
            <p
              ref="rolesRef"
              :aria-label="work.roles"
              class="font-sans text-[10px] md:text-xs tracking-widest uppercase text-neutral-600 whitespace-pre-line leading-5 min-h-[5em]"
            ></p>
          </div>
        </div>

        <div class="grid grid-cols-12 gap-x-6 gap-y-10 pb-14 md:pb-20">
          <div class="col-span-12 md:col-span-2">
            <p class="font-sans text-[10px] md:text-xs tracking-widest uppercase text-neutral-600">
              [OVERVIEW]
            </p>
          </div>

          <div class="col-span-12 md:col-span-4">
            <p ref="descriptionRef" class="text-sm md:text-base leading-relaxed text-neutral-900 opacity-0">
              {{ work.description }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="work.media?.length" class="w-full">

        <div v-for="(item, index) in work.media" :key="index" class="w-full">
          <div class="mx-auto w-full max-w-screen-2xl px-6 md:px-8 lg:px-12 py-4 md:py-8">
            <div v-if="item.type === 'image'" class="w-full overflow-hidden bg-transparent">
              <img
                :ref="(el) => (mediaImageRefs[index] = el)"
                :src="item.src"
                :alt="item.alt || work.title"
                class="block w-full h-auto opacity-0"
                loading="lazy"
              />
            </div>

            <div v-else-if="item.type === 'video'" class="w-full overflow-hidden bg-transparent">
              <video
                class="block w-full h-auto"
                :src="item.src"
                :poster="item.poster"
                controls
                playsinline
                autoplay
              />
            </div>

            <div v-else-if="item.type === 'youtube'" class="w-full overflow-hidden bg-transparent">
              <div class="relative w-full aspect-video bg-black">
                <iframe
                  v-if="getYoutubeEmbedSrc(item)"
                  class="absolute inset-0 h-full w-full"
                  :src="getYoutubeEmbedSrc(item)"
                  :title="item.title || work.title"
                  frameborder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  referrerpolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterSection />
    </template>

    <template v-else>
      <div class="mx-auto w-full max-w-screen-2xl px-6 md:px-8 lg:px-12 pb-24">
        <h1 class="font-display font-medium tracking-tighter uppercase text-4xl md:text-6xl leading-[0.95]">
          Work Not Found
        </h1>
        <RouterLink
          to="/"
          class="mt-6 inline-block font-sans text-[10px] md:text-xs tracking-widest uppercase text-neutral-600 hover:text-orange-500 transition-colors"
        >
          Back Home
        </RouterLink>
      </div>
      <FooterSection />
    </template>
  </main>
</template>
