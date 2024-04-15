import Vue from "vue";

import App from "./App.vue";
import Router from "./router";
import Store from "./store";

const app = new Vue({
  router: Router,
  store: Store,
  ...App,
});
app.$mount("#app");
