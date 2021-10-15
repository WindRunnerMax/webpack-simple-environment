import Vue from "vue";
import App from "./App.vue";
import Router from "./router/index";

const app = new Vue({
    router: Router,
    ...App,
});
app.$mount("#app");