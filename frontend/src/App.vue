<template>
  <div>
    <v-toolbar border color="#702626">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Act-Portal</v-toolbar-title>
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
    //
  }),
  methods: {
    //getting the username from the store
    getUsername() {
      return this.$store.state.username;
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
