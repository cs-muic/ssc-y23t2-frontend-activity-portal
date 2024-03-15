<template>
  <v-btn
    id="connect"
    class="btn btn-default"
    type="submit"
    :disabled="connected === true"
    @click="connect"
  >
    Connect
  </v-btn>
  <v-btn
    id="disconnect"
    class="btn btn-default"
    type="submit"
    :disabled="connected === false"
    @click="disconnect"
  >
    Disconnect
  </v-btn>
  <v-sheet class="mx-auto" width="300">
    <v-form @submit.prevent>
      <v-text-field
        v-model="send_message"
        :rules="messageRules"
        label="Your Name Here"
      ></v-text-field>
      <v-btn class="mt-2" type="submit" block @click="send">send</v-btn>
    </v-form>
  </v-sheet>
  <v-table theme="dark">
    <thead>
      <tr>
        <th>Greetings</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in received_messages" :key="item">
        <td>{{ item }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import { defineComponent } from "vue";

// Components

export default defineComponent({
  name: "WebsocketDemo",
  data() {
    return {
      received_messages: [],
      send_message: null,
      messageRules: [],
      connected: false,
    };
  },
  methods: {
    send() {
      console.log("Send message:" + this.send_message);
      if (this.stompClient && this.stompClient.connected) {
        const msg = { name: this.send_message };
        this.stompClient.send("/api/socket/hello", JSON.stringify(msg), {});
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
          this.stompClient.subscribe("/api/topic/greetings", (tick) => {
            console.log(tick);
            this.received_messages.push(JSON.parse(tick.body).content);
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
    },
    tickleConnection() {
      this.connected ? this.disconnect() : this.connect();
    },
  },
  mounted() {
    // this.connect();
  },
});
</script>

<style scoped></style>
