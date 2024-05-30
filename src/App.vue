<script setup lang="ts">
import Header from './components/Header.vue';
import Pub from './components/Pub.vue'
import {route} from './assets/route'
import {ref, watch} from "vue";
import {loader} from "@/lib/maps.ts";
import {
  MapIcon,
  CalendarDaysIcon,
  ClockIcon,
  LocateIcon,
  TicketIcon,
  GroupIcon,
  BeerIcon
} from 'lucide-vue-next'
import {Button} from "@/ui/button"
import {google} from "@googlemaps/js-api-loader";
import qs from "qs";

const map = ref()
const showMap = ref<boolean>(false)
const startLocationUrl = ref<string>('https://www.google.com/maps/dir/?' + qs.stringify({
  api: 1,
  destination: 'Bermondsey, London SE16 4RT',
  destination_place_id: 'ChIJlar6FzwDdkgRnjisAZMgrQw'
}))

let gmap: google.maps.MapsLibrary

loader.importLibrary('maps')
    .then(async ({Map}) => {
      gmap = new Map(map.value, {
        mapId: 'd24e543d900c0c5a',
        disableDefaultUI: !showMap.value,
        gestureHandling: showMap.value ? 'cooperative' : 'none',
        center: {lat: 0, lng: 0}
      })

      const {AdvancedMarkerElement} = await loader.importLibrary("marker");
      const {Place} = await loader.importLibrary('places');
      const {DirectionsService, DirectionsRenderer} = await loader.importLibrary("routes")

      const bounds = {
        north: undefined as number|undefined,
        east: undefined as number|undefined,
        south: undefined as number|undefined,
        west: undefined as number|undefined
      }

      const pubs: Place[] = await Promise.all(route.map(async (pub) => {
        const place = new Place({id: pub.placeId})
        await place.fetchFields({fields: ['location']})
        pub.place = place
        return pub
      }))

      pubs.forEach((pub) => {
        const place = pub.place
        bounds.north = Math.max(bounds.north ?? place.location.lat(), place.location.lat())
        bounds.south = Math.min(bounds.south ?? place.location.lat(), place.location.lat())
        bounds.east = Math.max(bounds.east ?? place.location.lng(), place.location.lng())
        bounds.west = Math.min(bounds.west ?? place.location.lng(), place.location.lng())

        if (!pub.waypoint) {
          new AdvancedMarkerElement({
            map: gmap,
            position: place.location,
            title: place.name,
          })
        }
      })

      gmap.fitBounds(bounds, 20)

      const directionService = new DirectionsService()
      const directionsRenderer = new DirectionsRenderer({
        map: gmap,
        draggagle: false,
      })

      directionService.route({
        origin: pubs.at(0).place.location,
        destination: pubs.at(-1).place.location,
        waypoints: pubs.slice(1, -1).map(pub => ({location: pub.place.location, stopover: !pub.waypoint})),
        travelMode: 'WALKING',
      }).then((result) => directionsRenderer.setDirections(result))
    })

watch(showMap, (value) => {
  if (!gmap) return

  gmap.setOptions({
    disableDefaultUI: !value,
    gestureHandling: value ? 'cooperative' : 'none',
  })
})

const showDetails = ref<boolean>(!!qs.parse(window.location.search.substring(1)).showDetails)
</script>

<template>
  <Header/>
  <main class="flex-1">
    <!-- Hero -->
    <section class="w-full py-12 md:py-24 lg:py-32 border-y h-[80vh] flex items-center relative">
      <div v-if="!showMap" class="container px-4 md:px-6 space-y-10 xl:space-y-16 z-10">
        <div class="grid max-w-[1300px] mx-auto gap-4 px-4 sm:px-6 md:px-10 md:grid-cols-2 md:gap-16">
          <div class="bg-white/80 p-8">
            <h1 class="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
              The Queue Crawl
            </h1>
            <p class="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
              Join us for a fun-filled pub crawl through the heart of the city. Explore the best local pubs and
              bars, and enjoy great drinks and company along the way.
            </p>
            <Button size="sm" class="ml-auto mt-4 flex" @click="showMap = true">
              <MapIcon class="size-6 mr-2" /> View the map
            </Button>
          </div>
        </div>
      </div>

      <div id="map" ref="map" class="top-0 left-0 w-full h-full absolute"></div>
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

        <div
            class="mx-auto mt-8 md:mt-12 grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
          <Pub v-for="(pub, i) in route.filter(p => !p.waypoint)" :pub="pub" :index="i + 1"/>
        </div>
      </div>
    </section>

    <section v-if="showDetails" class="w-full py-12 md:py-24 lg:py-32">
      <div class="container px-4 md:px-6">
        <div class="grid gap-8">
          <div>
            <h2 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About The Queue Crawl</h2>
            <p class="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Join us for a fun-filled pub crawl through the city's best watering holes. Get ready to make new friends
              and discover hidden gems as we raise a glass to Her Majesty Queen Elizabeth II.
            </p>
          </div>
          <div class="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            <div class="flex items-center gap-4">
              <CalendarDaysIcon class="h-6 w-6" />
              <div>
                <h3 class="text-lg font-semibold">Date</h3>
                <p class="text-gray-500 dark:text-gray-400">June 1, 2024</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <ClockIcon class="h-6 w-6" />
              <div>
                <h3 class="text-lg font-semibold">Time</h3>
                <p class="text-gray-500 dark:text-gray-400">2:00 PM - Late</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <LocateIcon class="h-6 w-6" />
              <div>
                <h3 class="text-lg font-semibold">Start Location</h3>
                <p class="text-gray-500 dark:text-gray-400">
                  <a :href="startLocationUrl" rel="noopener" target="_blank">
                    Bermondsy Tube Station
                  </a>
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <TicketIcon class="h-6 w-6" />
              <div>
                <h3 class="text-lg font-semibold">Tickets</h3>
                <p class="text-gray-500 dark:text-gray-400">Free</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <GroupIcon class="h-6 w-6" />
              <div>
                <h3 class="text-lg font-semibold">Group Size</h3>
                <p class="text-gray-500 dark:text-gray-400">5-10 people</p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <BeerIcon class="h-6 w-6" />
              <div>
                <h3 class="text-lg font-semibold">Drinks Included</h3>
                <p class="text-gray-500 dark:text-gray-400">None, buy your own!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
    <p class="text-xs text-gray-500 dark:text-gray-400">© 2024 The Queue Crawl. All rights reserved.</p>
    <nav class="sm:ml-auto flex gap-4 sm:gap-6">
      <a class="text-xs hover:underline underline-offset-4" href="#">
        Terms of Service
      </a>
      <a class="text-xs hover:underline underline-offset-4" href="#">
        Privacy
      </a>
    </nav>
  </footer>
</template>

