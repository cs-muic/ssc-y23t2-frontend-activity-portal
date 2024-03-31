<template>
  <div class="header">
    <v-toolbar border color="#702626" class="fixed-bar">
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
    <div class="text_box">
      <div class="header">
        <v-btn @click="chatWindow" target="_blank text" position="relative">
          <v-icon>mdi-open-in-new</v-icon>
        </v-btn>
      </div>
      <v-container v-if="status()" class="w-100">
        <v-table theme="dark">
          <thead>
            <tr>
              <th>Greetings</th>
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>

            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
            <tr>
              x
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in received_messages" :key="item">
              <td>{{ item }}</td>
            </tr>
          </tbody>
        </v-table>
        <div class="bottom">
          <v-sheet class="mx-auto" width="300">
            <v-form @submit.prevent>
              <v-text-field
                v-model="send_message"
                :rules="messageRules"
                label="Your Name Here"
                position="sticky"
              ></v-text-field>
              <v-btn class="mt-2" type="submit" block @click="send">send</v-btn>
            </v-form>
          </v-sheet>
        </div>
      </v-container>
    </div>
  </v-app>
</template>

<style>
.text_box {
  position: sticky;
  width: 30%;
  height: 300px;
  bottom: 0;
  left: 0;
  overflow: auto;
}
.bottom {
  position: sticky;
  width: 100%;
  height: 10%;
  bottom: 0;
  left: 0;
}
.header {
  position: sticky;
  top: 0;
  margin: auto;
  width: 100%;
  z-index: 1;
}
</style>
<script>
//This will be run on every page
import axios from "axios";

let openChat = true;
export default {
  name: "App",

  data: () => ({
    items: [
      { title: "Join Group", link: "/group-search" },
      { title: "Create Group", link: "/group-create" },
      { title: "Your Groups", link: "/my-groups" },
    ],
    openChat,
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
    status() {
      let username = this.$store.state.username;
      if (username == null) {
        return false;
      } else {
        return this.openChat;
      }
    },
    //logging the user out
    logout() {
      this.$store.commit("clearUser");
      axios.get("/api/logout");
      this.$router.push("/login");
    },
    chatWindow() {
      this.openChat = !this.openChat;
      console.log(this.openChat);
    },
  },
};
</script>
