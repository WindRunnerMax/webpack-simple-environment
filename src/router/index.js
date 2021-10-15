import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

import FrameWork from "../views/framework.vue";
import TabA from "../components/tab-a.vue";
import TabB from "../components/tab-b.vue";


const routes = [{
	path: "/",
	component: FrameWork,
    children: [
        {
            path: "tab-a",
            name: "TabA",
            component: TabA,
        },{
            path: "tab-b",
            name: "TabB",
            component: TabB,
        } 
    ]
}]

export default new VueRouter({
	routes
})