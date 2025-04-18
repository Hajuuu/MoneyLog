// import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

//import 'bootstrap/dist/css/bootstrap.min.css';
const app = createApp(App);

app.use(VCalendar, {});
app.use(createPinia());
app.use(router);
app.use(Toast);
app.mount('#app');
