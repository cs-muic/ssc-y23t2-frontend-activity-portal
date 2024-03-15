import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import axios from "axios";
import store from "@/store";
import AboutView from "@/views/AboutView.vue";
import LoginPage from "@/views/LoginPage.vue";
import SignupPage from "@/views/SignupPage.vue";
import GroupSearchPage from "@/views/GroupSearchPage.vue";
import GroupCreatePage from "@/views/GroupCreatePage.vue";
import GroupPage from "@/views/GroupPage.vue";
import ActivityCreatePage from "@/views/ActivityCreatePage.vue";
import UserActivityPage from "@/views/UserActivityPage.vue";
import EditProfile from "@/views/EditProfile.vue";
import ChangePassword from "@/views/ChangePassword.vue";
import UserProfile from "@/views/UserProfile.vue";
import UnauthorizedHomePage from "@/views/UnauthorizedHomePage.vue";
import GroupEditPage from "@/views/GroupEditPage.vue";
import GroupActivityPage from "@/views/GroupActivityPage.vue";

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
  {
    path: "/create-activity",
    name: "create activity",
    component: ActivityCreatePage,
  },
  {
    path: "/user-activities",
    name: "user activities",
    component: UserActivityPage,
  },
  {
    path: "/unjoin-activity/:activityID",
    name: "unjoin activity",
    component: UserActivityPage,
  },
  {
    path: "/edit-profile",
    name: "edit-profile",
    component: EditProfile,
  },
  {
    path: "/change-password",
    name: "change-password",
    component: ChangePassword,
  },
  {
    path: "/user/:username",
    name: "user-profile",
    component: UserProfile,
  },
  {
    path: "/welcome",
    name: "welcome",
    component: UnauthorizedHomePage,
  },
  {
    path: "/group/:groupID",
    name: "group-page",
    component: GroupPage,
  },
  {
    path: "/group/:groupID/group-edit",
    name: "group-edit",
    component: GroupEditPage,
    path: "/group-activities",
    name: "group-activities",
    component: GroupActivityPage,
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
  if (
    to.name !== "login" &&
    to.name !== "signup" &&
    to.name !== "welcome" &&
    !isLoggedIn
  )
    next({ name: "login" });
  else next();
});

export default router;
