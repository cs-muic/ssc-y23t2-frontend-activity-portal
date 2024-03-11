import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import axios from "axios";
import store from "@/store";
import AboutView from "@/views/AboutView.vue";
import LoginPage from "@/views/LoginPage.vue";
import SignupPage from "@/views/SignupPage.vue";
import GroupSearchPage from "@/views/GroupSearchPage.vue";
import GroupCreatePage from "@/views/GroupCreatePage.vue";

/**
 * The route for various paths
 */
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
  {
    path: "/signup",
    name: "signup",
    component: SignupPage,
  },
  {
    path: "/group-search",
    name: "group-search",
    component: GroupSearchPage,
  },
  {
    path: "/group-create",
    name: "group-create",
    component: GroupCreatePage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

/**
 * setup that will run before entering each path
 */
router.beforeEach(async (to, from, next) => {
  // check user status via API
  let response = await axios.get("/api/whoami");
  // eslint-disable-next-line no-unused-vars
  store.commit("setLoggedInUser", response.data);
  let isLoggedIn = store.state.loggedIn;
  if (to.name !== "login" && to.name !== "signup" && !isLoggedIn)
    next({ name: "login" });
  else next();
});

export default router;
