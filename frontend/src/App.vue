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
    <v-container v-if="status()">
      <div class="text_box">
        <div class="header">
          <v-btn
            @click="chatWindow"
            target="_blank text"
            position="relative"
            v-if="loggedIn()"
          >
            <v-icon v-if="status()">mdi-window-minimize</v-icon>
            <v-icon v-else>mdi-menu-down</v-icon>
          </v-btn>
        </div>
        <v-container v-if="status()" class="w-100">
          <v-table theme="dark">
            <thead>
              <tr>
                <th>Messages</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in received_messages" :key="item">
                <td>
                  <h4 v-if="item.username">{{ item.username }}</h4>
                  <h5 v-if="item.groupID">
                    GROUP: {{ getGroupname(item.groupID) }}
                  </h5>
                  {{ item.message }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <div class="bottom">
            <v-card>
              <v-container class="ga-0">
                <v-row class="ga-0">
                  <v-col class="ga-0">
                    <v-text-field
                      v-model="send_message"
                      :rules="messageRules"
                      label="Send your message"
                      base-color="gray"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2" class="ga-0">
                    <v-select
                      v-model="group"
                      :items="groups"
                      item-title="name"
                      item-value="id"
                      label="Select"
                      return-object
                      single-line
                      @update:modelValue="changeGroup(group.id)"
                      @click="getGroups()"
                    ></v-select>
                  </v-col>
                </v-row>
              </v-container>
              <v-btn type="submit" block @click="send" class="mt-n7 mx-auto"
                >send</v-btn
              >
            </v-card>
          </div>
        </v-container>
      </div>
    </v-container>
    <v-container v-else>
      <div class="collapsed">
        <v-btn
          @click="chatWindow"
          target="_blank text"
          position="relative"
          v-if="loggedIn()"
        >
          <v-icon>mdi-menu-up</v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-app>
</template>

<style>
.text_box {
  position: fixed;
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
.collapsed {
  position: fixed;
  width: 10%;
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
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

export default {
  name: "App",

  data: () => ({
    group: { id: null, name: "Public Chat" },
    items: [
      { title: "Join Group", link: "/group-search" },
      { title: "Create Group", link: "/group-create" },
      { title: "Your Groups", link: "/my-groups" },
      { title: "Edit Profile", link: "/edit-profile" },
      { title: "Change Password", link: "/change-password" },
    ],
    openChat: false,
    received_messages: [],
    send_message: null,
    messageRules: [],
    connected: false,
    chatGroupID: null,
    groups: [],
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
    getGroupname(groupID) {
      return this.$store.state.myGroups.get(groupID);
    },
    changeGroup(id) {
      this.chatGroupID = id;
      console.log(this.chatGroupID);
    },
    getGroups() {
      let array = Array.from(this.$store.state.myGroups, ([id, name]) => ({
        id,
        name,
      }));
      array.push({ id: null, name: "Public chat" });
      console.log(this.$store.state.myGroups);
      this.groups = array;
    },
    status() {
      let username = this.$store.state.username;
      if (username == null) {
        return false;
      } else {
        return this.openChat;
      }
    },
    loggedIn() {
      let username = this.$store.state.username;
      return username != null;
    },
    //logging the user out
    logout() {
      this.disconnect();
      this.$store.commit("clearUser");
      axios.get("/api/logout");
      this.$router.push("/login");
    },
    chatWindow() {
      this.openChat = !this.openChat;
      if (!this.connected) this.connect();
    },
    send() {
      console.log("Send message:" + this.send_message);
      if (this.stompClient && this.stompClient.connected) {
        const msg = {
          username: this.getUsername(),
          content: this.send_message,
          groupID: this.chatGroupID,
        };
        this.stompClient.send("/api/socket/messages", JSON.stringify(msg), {});
      }
    },
    connect() {
      this.socket = new SockJS("/api/portal-socket");
      this.stompClient = Stomp.over(this.socket);
      this.stompClient.connect(
        {},
        (frame) => {
          this.connected = true;
          console.log(frame);
          this.stompClient.subscribe("/api/topic/messages", (tick) => {
            const message = JSON.parse(tick.body);
            console.log("GOT SMTH");
            console.log(tick);
            if (message.groupID) {
              axios
                .get(`/api/get-group-role/${message.groupID}`)
                .then((response) => {
                  console.log(response);
                  if (response.data.member)
                    this.received_messages.push(message);
                });
            } else this.received_messages.push(message);
          });
        },
        (error) => {
          console.log(error);
          this.connected = false;
        }
      );
    },
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
      this.connected = false;
      this.openChat = false;
      this.received_messages = [];
    },
  },
};
</script>
