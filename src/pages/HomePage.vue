<script setup>
import HeroSection from '../components/HeroSection.vue'
import BioSection from '../components/BioSection.vue'
import SkillSetSection from '../components/SkillSetSection.vue'
import WorkSection from '../components/WorkSection.vue'
import FooterSection from '../components/FooterSection.vue'

defineProps({
  isLoaded: Boolean
})
</script>

<template>
  <HeroSection :is-loaded="isLoaded" />
  <BioSection v-if="isLoaded" />
  <SkillSetSection v-if="isLoaded" />
  <WorkSection v-if="isLoaded" />
  <FooterSection v-if="isLoaded" />
</template>
