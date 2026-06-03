<template>
  <main class="min-h-screen w-full bg-white text-neutral-950">
    <div class="mx-auto w-full max-w-screen-2xl px-6 md:px-8 lg:px-12 pt-32 pb-24">
      <h1 class="font-display font-medium tracking-tighter uppercase text-5xl md:text-7xl leading-[0.95]">
        404
      </h1>
      <p class="mt-6 text-sm md:text-base text-neutral-700">This page doesn’t exist.</p>
      <RouterLink
        to="/"
        class="mt-8 inline-block font-sans text-[10px] md:text-xs tracking-widest uppercase text-neutral-600 hover:text-orange-500 transition-colors"
      >
        Go Home
      </RouterLink>
    </div>
  </main>
</template>
