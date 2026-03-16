import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { loadRuntimeConfig, getConfig } from './runtime-config';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css';

async function bootstrap(){
  await loadRuntimeConfig();
  createApp(App)
    .use(createPinia())
    .use(router)
    .mount('#app');
}

bootstrap();
