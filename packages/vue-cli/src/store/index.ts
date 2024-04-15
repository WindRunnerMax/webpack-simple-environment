import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export interface State {
  text: string;
}
const state: State = {
  text: "Value",
};

const getters = {
  getText(state: State) {
    return state.text;
  },
};

const mutations = {
  setText: (state: State, text: string) => {
    state.text = text;
  },
};

export default new Vuex.Store({
  state,
  mutations,
  getters,
});
