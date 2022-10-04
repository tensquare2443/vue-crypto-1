import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "./assets/main.css";

const app = createApp(App);

app.use(createPinia());
app.use(router);

/**
 * axios setup
 */
import axios from "axios";
import VueAxios from "vue-axios";

axios.defaults.baseURL = "https://api.coingecko.com/api/v3";

app.use(VueAxios, axios);
app.provide("axios", app.config.globalProperties.axios);
/**
 * end
 */

/**
 * ag-grid setup
 */
import { AgGridVue } from "ag-grid-vue3";

app.component("AgGridVue", AgGridVue);

import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS
/**
 * end
 */

/**
 * fontawesome setup
 */
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";

library.add(faCalendarDay);

app.component("font-awesome-icon", FontAwesomeIcon);
/**
 * end
 */

/**
 * datepicker setup
 */
import "v-calendar/dist/style.css";
import VCalendar from "v-calendar";

app.use(VCalendar, {});
/**
 * end
 */

app.mount("#app");
