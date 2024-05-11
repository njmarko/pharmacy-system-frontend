import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from './plugins/vuetify';
import VueConfirmDialog from 'vue-confirm-dialog'
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
// Import VueSelect stylesheet
import 'vue-search-select/dist/VueSearchSelect.css'
// Import Bootstrap an BootstrapVue CSS files (order is important)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
// Import OpenLayers stylesheet
import "ol/ol.css";
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);
// Vue moment
const moment = require("moment");
require("moment/locale/es");
// VueTimepicker
import 'vue2-timepicker/dist/VueTimepicker.css'
import 'vue2-datepicker/index.css';
Vue.use(require("vue-moment"), {
  moment,
});
Vue.use(VueConfirmDialog);
Vue.component('vue-confirm-dialog', VueConfirmDialog.default);

Vue.config.productionTip = false;

import axios from 'axios';

// Configure axios to always include JWT when sending a request
axios.interceptors.request.use(config => {
  if (store.getters.loggedUser.jwt) {
    config.headers.Authorization = `Bearer ${store.getters.loggedUser.jwt}`
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Configure frontend authorization
router.beforeEach((to, _from, next) => {
  const {authenticated, authorities} = to.meta;
  if(store.getters.loggedUser.jwt){
    if(!store.getters.loggedUser.loggedIn && !store.getters.loggedUser.authorities.includes("ROLE_PATIENT") && to.name !== "ChangePasswordView"){
      next({name: "ChangePasswordView"});
    }
    else{
      next();
    }
  }
  else{
    next();
  }

  if (authenticated) {
    if (store.getters.loggedUser.jwt) {
      if (authorities && store.getters.loggedUser.authorities) {
        if (authorities.some(role => store.getters.loggedUser.authorities.includes(role))) {
          next();
        } else {
          next({ name: "Home" });
        }
      } else {
        next();
      }
    } else {
      next({name: "Login", query: { redirect: to.fullPath } });
    }
  } else {
    next();
  }
})

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
