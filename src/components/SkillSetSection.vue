<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const introRef = ref(null)
const numberRefs = ref([])
const titleRefs = ref([])
const descRefs = ref([])
const lineRefs = ref([])
const hoveredIndex = ref(null)

const introText = "PEOPLE KNOW ME AS RINMAWIA, RIN, OR RIN.K —\nAND JUST LIKE THAT I BRING A DIVERSE SET OF SKILLS TO THE TABLE."

const skills = [
  {
    number: '/01',
    title: 'BRAND IDENTITY \nDESIGN',
    description: 'I craft cohesive visual identities that align brand strategy with distinctive logos, typography, and design systems.'
  },
  {
    number: '/02',
    title: 'ART \nDIRECTION',
    description: 'I define the overall look and feel, guiding imagery, layout, and storytelling to keep every touchpoint on-brand.'
  },
  {
    number: '/03',
    title: 'USER EXPERIENCE \nDESIGN',
    description: 'I design intuitive flows and structures that make complex products feel friendly, useful, and enjoyable to use.'
  },
  {
    number: '/04',
    title: 'UI \nDESIGN',
    description: 'I translate ideas into clean, accessible interfaces with clear hierarchy, consistent components, and thoughtful detail.'
  },
  {
    number: '/05',
    title: 'AI VISUAL \nDEVELOPMENT',
    description: 'I use AI tools and creative coding to prototype bold visual concepts and extend brand expression in new mediums.'
  }
]

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
const scrambleRevealPromise = (element, finalString, duration = 0.9) => {
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

const animateLinePromise = (element, duration = 0.55) => {
  return new Promise((resolve) => {
    if (!element) {
      resolve()
      return
    }

    gsap.fromTo(
      element,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration,
        ease: 'none',
        onComplete: resolve
      }
    )
  })
}

const hoverLocks = new Set()
const handleItemEnter = (index) => {
  hoveredIndex.value = index

  if (hoverLocks.has(index)) return
  hoverLocks.add(index)

  scrambleRevealPromise(titleRefs.value?.[index], skills[index]?.title ?? '', 0.32).finally(() => {
    hoverLocks.delete(index)
  })
}

const handleItemLeave = (index) => {
  if (hoveredIndex.value === index) hoveredIndex.value = null
}

let scrollTriggerInstance = null

onMounted(async () => {
  await nextTick()

  scrollTriggerInstance = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 60%',
    once: true,
    onEnter: async () => {
      await scrambleRevealPromise(introRef.value, introText, 0.85)

      const titleDuration = 0.45
      const descDuration = 0.55
      const numberDuration = 0.25
      const itemDuration = Math.max(titleDuration, descDuration)
      const startGap = itemDuration * 0.5

      const itemPromises = skills.map((skill, index) => {
        return new Promise((resolve) => {
          const numberEl = numberRefs.value?.[index]
          const titleEl = titleRefs.value?.[index]
          const descEl = descRefs.value?.[index]
          const lineEl = lineRefs.value?.[index]

          setTimeout(() => {
            Promise.all([
              scrambleRevealPromise(numberEl, skill.number, numberDuration),
              scrambleRevealPromise(titleEl, skill.title, titleDuration),
              scrambleRevealPromise(descEl, skill.description, descDuration),
              animateLinePromise(lineEl, itemDuration)
            ]).then(resolve)
          }, index * startGap * 1000)
        })
      })

      await Promise.all(itemPromises)
    }
  })
})

onUnmounted(() => {
  if (scrollTriggerInstance) scrollTriggerInstance.kill()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="w-full flex items-center px-8 md:px-16 lg:px-24 bg-white text-black pb-24"
  >
    <div class="w-full max-w-screen-2xl mx-auto">
      <p
        ref="introRef"
        class="font-sans text-xs md:text-sm tracking-normal uppercase text-neutral-600 min-h-[2.5em]"
      ></p>

      <div class="mt-10">
        <div
          v-for="(skill, index) in skills"
          :key="skill.number"
          class="group relative grid grid-cols-12 gap-x-6 gap-y-4 py-8 md:py-10"
          @mouseenter="handleItemEnter(index)"
          @mouseleave="handleItemLeave(index)"
        >
          <div class="absolute inset-x-0 top-0 h-px bg-neutral-200"></div>
          <div
            :ref="(el) => (lineRefs[index] = el)"
            class="absolute inset-x-0 top-0 h-px bg-black origin-left scale-x-0"
          ></div>

          <div class="col-span-12 md:col-span-1 font-mono text-sm tracking-tight text-neutral-500">
            <span :ref="(el) => (numberRefs[index] = el)"></span>
          </div>

          <div class="col-span-12 md:col-span-7">
            <h3
              :ref="(el) => (titleRefs[index] = el)"
              class="font-display font-medium tracking-tighter uppercase text-3xl md:text-4xl lg:text-5xl leading-[1.05] min-h-[2.2em] transition-colors duration-200"
              :class="hoveredIndex === index ? 'text-orange-500' : 'text-black'"
            ></h3>
          </div>

          <div class="col-span-12 md:col-span-4">
            <p
              :ref="(el) => (descRefs[index] = el)"
              class="font-sans text-sm md:text-base text-neutral-600 leading-5 min-h-[3em] lg:min-h-0 transition-all duration-300 ease-out lg:opacity-0 lg:max-h-0 lg:overflow-hidden lg:translate-y-1 lg:group-hover:opacity-100 lg:group-hover:max-h-[8rem] lg:group-hover:translate-y-0"
            ></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
