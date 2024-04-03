import { createStore } from "vuex";

/**
 * store for the state of each client
 */
export default createStore({
  state: {
    loggedIn: false,
    username: null,
    displayName: null,
    role: "",
    userID: null,
    myGroups: {},
  },
  getters: {},
  mutations: {
    //setting the information for logged in user
    setLoggedInUser: function (state, payload) {
      state.loggedIn = payload.loggedIn;
      state.username = payload.username;
      state.displayName = payload.displayName;
      state.role = payload.role;
      state.userID = payload.userID;
    },
    //clearing the current user
    clearUser: function (state) {
      state.loggedIn = false;
      state.username = null;
      state.name = null;
      state.role = "";
      state.userID = null;
    },
    setGroup: function (state, group) {
      state.myGroups[group.id] = group.groupName;
    },
  },
  actions: {},
  modules: {},
});
