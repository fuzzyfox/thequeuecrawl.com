import { createApp } from 'vue'
import App from './App.vue'
import './assets/index.css'

console.log(import.meta, import.meta.env)
console.log(import.meta.env.GOOGLE_MAPS_API_KEY)

createApp(App).mount('#app')

