import { createStore } from "vuex";

export default createStore({
  state: {
    loggedIn: false,
    username: null,
    displayName: null,
    role: "",
  },
  getters: {},
  mutations: {
    setLoggedInUser: function (state, payload) {
      console.log(payload);
      state.loggedIn = payload.loggedIn;
      state.username = payload.username;
      state.displayName = payload.displayName;
      state.role = payload.role;
      console.log(state);
    },
    clearUser: function (state) {
      state.loggedIn = false;
      state.username = null;
      state.name = null;
      state.role = "";
    },
  },
  actions: {},
  modules: {},
});
