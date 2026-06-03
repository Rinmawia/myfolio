<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const headlineRef = ref(null)
const emailUserRef = ref(null)

const HEADLINE_TEXT = `LET'S\nCONNECT`
const EMAIL_USERS = [
  'hi',
  'chibai',
  'namaste',
  'hola',
  'nihao',
  'konnichiwa',
  'bonjour',
  'privet',
  'jambo',
  'marhaban',
  'salaam'
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

let triggerInstance = null
let emailIntervalId = null
let emailStartTimeoutId = null
let emailIndex = 0

onMounted(async () => {
  await nextTick()
  if (headlineRef.value) headlineRef.value.innerText = ''
  if (emailUserRef.value) emailUserRef.value.innerText = EMAIL_USERS[0].toUpperCase()

  triggerInstance = ScrollTrigger.create({
    trigger: sectionRef.value,
    start: 'top 75%',
    once: true,
    onEnter: async () => {
      await scrambleRevealPromise(headlineRef.value, HEADLINE_TEXT, 1.1)

      emailStartTimeoutId = window.setTimeout(() => {
        emailIntervalId = window.setInterval(async () => {
          emailIndex = (emailIndex + 1) % EMAIL_USERS.length
          await scrambleRevealPromise(emailUserRef.value, EMAIL_USERS[emailIndex].toUpperCase(), 0.55)
        }, 3000)
      }, 3000)
    }
  })
})

onUnmounted(() => {
  if (triggerInstance) triggerInstance.kill()
  if (emailStartTimeoutId) window.clearTimeout(emailStartTimeoutId)
  if (emailIntervalId) window.clearInterval(emailIntervalId)
})
</script>

<template>
  <footer ref="sectionRef" class="w-full bg-white text-black pt-16">
    <div class="mx-auto w-full max-w-screen-2xl px-6 md:px-8 lg:px-12 py-16 md:py-24">
      <div class="grid grid-cols-12 gap-x-6 gap-y-12 items-start">
        <div class="col-span-12 lg:col-span-6">
          <h2
            ref="headlineRef"
            :aria-label="HEADLINE_TEXT.replaceAll('\n', ' ')"
            class="font-display font-medium tracking-tighter uppercase leading-[0.85] whitespace-pre-line text-[4.25rem] sm:text-[5.5rem] md:text-[7rem] lg:text-[6.5rem] xl:text-[7.5rem] min-h-[2.1em]"
          ></h2>
        </div>

        <div class="col-span-12 lg:col-span-6 lg:order-1">
          <p class="font-sans text-[10px] md:text-xs tracking-widest uppercase text-neutral-600">
            REACH OUT AT
          </p>
          <a
            class="mt-4 inline-flex items-baseline font-display font-medium tracking-tight uppercase leading-none text-2xl sm:text-3xl md:text-4xl"
            href="#"
          >
            <span ref="emailUserRef" class="text-orange-500"></span>
            <span>@RINMAWIA.ME</span>
          </a>

          <div class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#" class="font-sans text-[11px] md:text-xs tracking-widest uppercase text-neutral-950">
              LINKEDIN
            </a>
            <span class="font-sans text-[11px] md:text-xs tracking-widest uppercase text-neutral-600">/</span>
            <a href="#" class="font-sans text-[11px] md:text-xs tracking-widest uppercase text-neutral-950">
              INSTAGRAM
            </a>
            <span class="font-sans text-[11px] md:text-xs tracking-widest uppercase text-neutral-600">/</span>
            <a href="#" class="font-sans text-[11px] md:text-xs tracking-widest uppercase text-neutral-950">
              GITHUB
            </a>
            <!-- <span class="font-sans text-[11px] md:text-xs tracking-widest uppercase text-neutral-600">/</span>
            <a href="#" class="font-sans text-[11px] md:text-xs tracking-widest uppercase text-neutral-950">
              CREDITS
            </a> -->
          </div>
        </div>
      </div>

      <div class="pt-14 md:pt-20">
        <p class="text-center font-sans text-[11px] md:text-xs text-neutral-700">
          Designed and Developed with love by me
        </p>
      </div>
    </div>
  </footer>
</template>
