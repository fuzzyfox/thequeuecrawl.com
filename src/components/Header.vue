<script setup lang="ts">
import {BeerIcon} from 'lucide-vue-next'
</script>

<template>
  <header class="px-4 lg:px-6 h-14 flex items-center">
    <a href="#home" class="flex items-center justify-center">
      <BeerIcon class="h-6 w-6" />
      <span class="sr-only">The Queue Crawl</span>
    </a>

    <nav className="ml-auto flex gap-4 sm:gap-6">
      <a href="#about" class="text-sm font-medium hover:underline underline-offset-4">About</a>
      <a href="#route-map" class="text-sm font-medium hover:underline underline-offset-4">Route Map</a>
      <a href="#contact" class="text-sm font-medium hover:underline underline-offset-4">Contact</a>
    </nav>
  </header>
</template>

<style scoped>

</style>