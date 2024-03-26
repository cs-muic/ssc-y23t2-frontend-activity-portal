import { createRouter, createWebHashHistory } from "vue-router";
import HomeView from "../views/common/HomeView.vue";
import axios from "axios";
import store from "@/store";

import AboutView from "@/views/common/AboutView.vue";
import LoginPage from "@/views/common/LoginPage.vue";
import SignupPage from "@/views/profile/SignupPage.vue";
import WebsocketDemo from "@/views/websocket/StompDemo.vue";
import GroupSearchPage from "@/views/group/GroupSearchPage.vue";
import GroupCreatePage from "@/views/group/GroupCreatePage.vue";
import GroupPage from "@/views/group/GroupPage.vue";
import ActivityCreatePage from "@/views/activity/ActivityCreatePage.vue";
import UserActivityPage from "@/views/profile/UserActivityPage.vue";
import EditProfile from "@/views/profile/EditProfile.vue";
import ChangePassword from "@/views/profile/ChangePassword.vue";
import UserProfile from "@/views/profile/UserProfile.vue";
import UnauthorizedHomePage from "@/views/common/UnauthorizedHomePage.vue";
import GroupEditPage from "@/views/group/GroupEditPage.vue";
import GroupActivityPage from "@/views/activity/GroupActivityPage.vue";
import ActivityEditPage from "@/views/activity/ActivityEditPage.vue";
import UserGroupPage from "@/views/profile/UserGroupPage.vue";

/**
 * The route for various paths
 */
const routes = [
  {
    path: "/stomping",
    name: "stomp",
    component: WebsocketDemo,
  },
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
  },
  {
    path: "/group/:groupID/activity-create",
    name: "create activity",
    component: ActivityCreatePage,
  },
  {
    path: "/group/:groupID/group-activities",
    name: "group-activities",
    component: GroupActivityPage,
  },
  {
    path: "/group/:groupID/edit-activity/:activityID",
    name: "edit-activity",
    component: ActivityEditPage,
  },
  {
    path: "/my-groups",
    name: "my-groups",
    component: UserGroupPage,
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
