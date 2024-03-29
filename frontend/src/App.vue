<template>
  <div>
    <v-toolbar border color="#702626">
      <div class="text-center">
        <v-menu transition="slide-x-transition">
          <template v-slot:activator="{ props }">
            <v-app-bar-nav-icon v-bind="props"></v-app-bar-nav-icon>
          </template>

          <v-list>
            <v-list-item v-for="(item, index) in items" :key="index">
              <v-list-item-title
                style="cursor: pointer"
                @click="$router.push(item.link)"
                >{{ item.title }}</v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <v-toolbar-title style="cursor: pointer" @click="$router.push('/')"
        >Act-Portal</v-toolbar-title
      >
      <v-spacer></v-spacer>

      <v-btn @click="logout" target="_blank text">
        <span class="mr-2">{{ getUsername() }}</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-toolbar>
  </div>

  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
//This will be run on every page
import axios from "axios";

export default {
  name: "App",

  data: () => ({
    items: [
      { title: "Join Group", link: "/group-search" },
      { title: "Create Group", link: "/group-create" },
      { title: "Your Groups", link: "/my-groups" },
    ],
  }),
  methods: {
    //getting the username from the store
    getUsername() {
      let username = this.$store.state.username;
      if (username == null) {
        return "";
      } else {
        return username;
      }
    },
    //logging the user out
    logout() {
      this.$store.commit("clearUser");
      axios.get("/api/logout");
      this.$router.push("/login");
    },
  },
};
</script>
