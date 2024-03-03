<template>
  <div>
    <v-toolbar border color="#702626">
      <v-app-bar-nav-icon></v-app-bar-nav-icon>
      <v-toolbar-title>Act-Portal</v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn href="" target="_blank text">
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
export default {
  name: "App",

  data: () => ({
    //
  }),
  methods: {
    getUsername() {
      return this.$store.state.username;
    },
  },
};
</script>
