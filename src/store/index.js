import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
    text: "Value",
};

const getters = {
    getText(state) {
        return state.text;
    },
};

const mutations = {
    setText: (state, text) => {
        state.text = text;
    },
};

export default new Vuex.Store({
    state,
    mutations,
    getters,
});
