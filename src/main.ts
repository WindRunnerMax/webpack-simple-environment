import Vue from "vue";
import App from "./App.vue";
import Store from "./store";
import Router from "./router";

const app = new Vue({
    router: Router,
    store: Store,
    ...App,
});
app.$mount("#app");
