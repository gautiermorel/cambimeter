import { createApp } from 'vue'

// import DisableAutocomplete from '@aacassandra/vue-disable-autocomplete';

import App from './App.vue'

import router from './router.js'

import './assets/main.css'

const app = createApp(App)

app.use(router)

app.use(DisableAutocomplete)

app.mount('#app')
