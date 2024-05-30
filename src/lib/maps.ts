import { Loader } from "@googlemaps/js-api-loader"
export const loader = (new Loader({
    apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? '',
    version: "weekly",
}))

export const Map = async () => await loader.importLibrary('maps')
export const Place = async () => await loader.importLibrary('places')
