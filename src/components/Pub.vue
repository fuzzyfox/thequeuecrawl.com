<script setup lang="ts">
import {Button} from "@/ui/button";
import qs from 'qs'
import {computed, ref, watch} from "vue";
import {loader} from  '@/lib/maps'
import { MapIcon } from "lucide-vue-next";
import {RouteLocation} from "@/assets/route.ts";

const props = defineProps<{ pub: RouteLocation, index?: number }>()

const photoUrl = ref<string>()

const directionsUrl = computed<string>(() => 'https://www.google.com/maps/dir/?' + qs.stringify({
  api: 1,
  destination: props.pub.address,
  destination_place_id: props.pub.placeId,
  travelmode: 'walking',
}))

watch(
    () => props.pub,
    async (pub) => {
      try {
        const {Place} = await loader.importLibrary('places')
        const place = new Place({id: pub.placeId})
        await place.fetchFields({fields: ['photos']})
        const photos = place.photos
        if (!photos || !photos.length) {
          return;
        }

        photoUrl.value = photos[0].getURI({maxHeight: 512, maxWidth: 512})
      } catch (error) {
        console.error(error)
      }
    },
    {immediate: true}
)
</script>

<template>
  <div class="grid gap-1">
    <div class="flex items-start gap-4">
      <img
          :alt="pub.name"
          class="rounded-lg bg-slate-500 w-22 h-22 flex-shrink-0 block"
          width="80"
          height="80"
          :src="photoUrl"
          style="aspectRatio: 80/80; objectFit: cover;"
      />
      <div>
        <h3 class="text-lg font-bold">{{ index }}{{ index ? '.' : null }} {{ pub.name }}</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ pub.address }}</p>
        <Button as="a" type="button" size="xs" :href="directionsUrl" rel="noopener" target="_blank" class="mt-2">
          <MapIcon class="size-4 mr-1" />
          Directions
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>