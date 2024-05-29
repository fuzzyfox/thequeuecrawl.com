<script setup lang="ts">
import Header from './components/Header.vue';
import Pub from './components/Pub.vue'

import {route} from './assets/route'
</script>

<template>
  <Header/>
  <main class="flex-1">
    <!-- Hero -->
    <section class="w-full py-12 md:py-24 lg:py-32 border-y">
      <div class="container px-4 md:px-6 space-y-10 xl:space-y-16">
        <div class="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
          <div>
            <h1 class="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
              The Queue Crawl
            </h1>
            <p class="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Join us for a fun-filled pub crawl through the heart of the city. Explore the best local pubs and
              bars, and enjoy great drinks and company along the way.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- The Pubs -->
    <section class="w-full py-12 md:py-24 lg:py-32">
      <div class="container px-4 md:px-6">
        <div class="flex flex-col items-center justify-center space-y-4 text-center">
          <div class="space-y-2">
            <div class="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
              Route Map
            </div>
            <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">Explore the Pubs on the Crawl</h2>
            <p class="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Check out the locations of the pubs on the crawl and get directions to each stop.
            </p>
          </div>
        </div>
        <div class="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
          <Pub v-for="pub in route" :pub="pub"/>
        </div>
      </div>
    </section>
  </main>
</template>

