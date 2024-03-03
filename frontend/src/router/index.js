import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import axios from "axios";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/login",
    name: "login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LoginPage.vue"),
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
  store.dispatch("setLoggedInUser", response.data).then((res) => {
    let isLoggedIn = store.state.isLoggedIn;
    if (to.name !== "login" && !isLoggedIn) next({ name: "login" });
    else next();
  });
});

export default router;
