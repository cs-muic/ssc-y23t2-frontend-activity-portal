import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import axios from "axios";
import store from "@/store";
import AboutView from "@/views/AboutView.vue";
import LoginPage from "@/views/LoginPage.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
  },
  {
    path: "/login",
    name: "login",
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// Setup beforeEach hook. Check login states with backend
router.beforeEach(async (to, from, next) => {
  let response = await axios.get("/api/whoami");
  // eslint-disable-next-line no-unused-vars
  store.commit("setLoggedInUser", response.data);
  let isLoggedIn = store.state.loggedIn;
  if (to.name !== "login" && !isLoggedIn) next({ name: "login" });
  else next();
});

export default router;
