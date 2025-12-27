import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// 🔥 INI SATU-SATUNYA IMPORT CSS
// import './assets/main.css'
import './style.css' // Import file CSS tadi di sini

createApp(App)
  .use(createPinia())
  .use(router)
  .mount('#app')
