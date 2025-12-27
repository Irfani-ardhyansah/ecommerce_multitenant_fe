import { createApp } from 'vue'
import { createPinia } from 'pinia' // Import Pinia
import App from './App.vue'
import router from './router'
import './style.css'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia() // Inisialisasi Pinia

app.use(pinia) // Wajib didaftarkan pertama kali
app.use(router) // Baru kemudian router

app.mount('#app')