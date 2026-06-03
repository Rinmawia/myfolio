<script setup>
import { onMounted, ref, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ImageEffect } from '../utils/ImageEffect'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
const imageRef = ref(null)
const shortBioRef = ref(null)
const bigWriteupRef = ref(null)

let imageEffectInstance = null

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
const scrambleRevealPromise = (element, finalString, duration = 1.0) => {
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

onMounted(() => {
  // Initialize Image Effect
  imageEffectInstance = new ImageEffect({
    container: sectionRef.value,
    color: "#e5e5e5"
  })
  
  if (imageRef.value) {
    imageEffectInstance.addImages(imageRef.value)
  }

  // Set up animation timeline
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value,
      start: "top 60%",
      once: true
    }
  })

  // 1. Image animation is handled automatically by ImageEffect's internal ScrollTrigger
  // We just need to sequence the texts to start after the image reveal begins
  
  tl.add(() => {}, "+=0.4") // Initial delay to let image animation start
  
  .call(async () => {
    await scrambleRevealPromise(shortBioRef.value, "[SHORT BIO]", 0.8)
  })
  
  .call(async () => {
    await scrambleRevealPromise(bigWriteupRef.value, "Self-directed designer \ndedicated to creating \nhigh-quality & impactful \ndigital experiences.", 1.5)
  }, null, "+=0.2")
})

onUnmounted(() => {
  if (imageEffectInstance) {
    imageEffectInstance.destroy()
  }
})
</script>

<template>
  <section ref="sectionRef" class="min-h-screen flex items-center px-8 md:px-16 lg:px-24 bg-white text-black border-t border-neutral-100">
    <div class="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-center w-full relative">
      
      <!-- Headshot Image -->
      <div class="w-full md:w-[45%] lg:w-[30%] aspect-square bg-neutral-100 flex-shrink-0 relative overflow-hidden z-0">
        <img 
          ref="imageRef"
          src="/public/images/me_profile.png"
          class="w-full h-full object-cover"
          alt="Rinmawia Khiangte"
        />
      </div>
      
      <!-- Content Wrapper -->
      <div class="relative z-10 mt-12 md:mt-32 md:-ml-24 lg:ml-0 lg:pl-12 xl:pl-16 w-full">
        
        <!-- Label -->
        <div class="lg:relative lg:left-0 lg:top-[0.6em]">
          <span ref="shortBioRef" class="font-sans text-[10px] md:text-xs tracking-widest uppercase"></span>
        </div>
        
        <!-- Bio Text -->
        <h2 ref="bigWriteupRef" class="text-2xl md:text-2xl lg:text-3xl xl:text-6xl font-display font-medium leading-[1.05] tracking-tighter uppercase lg:indent-[8rem] min-h-[3em]">
        </h2>
        
      </div>
    </div>
  </section>
</template>
