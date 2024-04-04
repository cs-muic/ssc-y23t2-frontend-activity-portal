<template>
  <v-col align-self="center">
    <v-container>
      <h1 class="text-center text-h3">{{ group.groupName }}</h1>
      <v-divider :thickness="15" class="border-opacity-0"></v-divider>

      <div class="text-center"># {{ group.id }}</div>
      <v-divider :thickness="20" class="border-opacity-0"></v-divider>
    </v-container>
    <v-container>
      <v-row>
        <v-col class="mx-auto w-50 h-100">
          <v-sheet class="mx-auto w-100 h-50">
            <v-container class="mx-auto w-65 h-40">
              {{ group.memberCount }} / {{ group.maxMember }}
              <v-container class="mx-auto w-20 h-40">
                <v-sheet :elevation="24" :height="200">
                  <v-container class="mx-auto w-15 h-30">
                    <h1 class="text-h5">Description:</h1>
                    <v-divider
                      :thickness="2"
                      class="border-opacity-2"
                    ></v-divider>
                    <v-divider
                      :thickness="20"
                      class="border-opacity-0"
                    ></v-divider>
                    <h1 class="text-body-1">{{ group.publicDescription }}</h1>
                  </v-container>
                </v-sheet>
              </v-container>
              <v-container v-if="this.isMember && group.isPrivate">
                <v-sheet :elevation="24" :height="200">
                  <v-container class="mx-auto w-15 h-30">
                    <h1 class="text-h5">Private Description:</h1>
                    <v-divider
                      :thickness="2"
                      class="border-opacity-2"
                    ></v-divider>
                    <v-divider
                      :thickness="20"
                      class="border-opacity-0"
                    ></v-divider>
                    <h1 class="text-body-1">{{ group.privateDescription }}</h1>
                  </v-container>
                </v-sheet>
              </v-container>
              <v-container class="mx-auto w-20 h-40">
                <v-row>
                  <v-col class="mx-auto">
                    <v-btn
                      block
                      v-if="this.isOwner"
                      class="mt-1"
                      color="#ad1d25"
                      @click="routeEditGroup()"
                    >
                      Edit Group
                    </v-btn>
                  </v-col>
                  <v-col class="mx-auto">
                    <v-btn
                      block
                      v-if="this.isOwner"
                      class="mt-1"
                      color="#ad1d25"
                      @click="routeCreateActivity()"
                    >
                      Create Activity
                    </v-btn>
                  </v-col>
                  <v-col>
                    <v-btn
                      block
                      v-if="isOwner && group.isPrivate"
                      class="mt-1"
                      color="#ad1d25"
                      @click="getPendingRequests()"
                    >
                      Pending Requests
                    </v-btn></v-col
                  >
                </v-row>
              </v-container>

              <v-btn
                block
                v-if="!this.isMember && !this.isOwner"
                class="mt-1"
                color="#ad1d25"
                @click="joinGroup()"
                :disabled="isJoining"
              >
                Join Group
              </v-btn>
              <v-btn
                block
                v-if="this.isMember"
                class="mt-1"
                color="#ad1d25"
                @click="checkActivity()"
              >
                Check Activity
              </v-btn>
              <v-btn
                block
                v-if="this.isMember && !this.isOwner"
                class="mt-1"
                color="#ad1d25"
                @click="leaveGroup()"
              >
                Leave Group
              </v-btn>

              <v-dialog v-model="dialog" max-width="600px">
                <v-card>
                  <v-card-title class="text-center"
                    >Pending Requests</v-card-title
                  >
                  <v-card-text>
                    <v-data-table
                      :headers="requestHeaders"
                      :items="pendingRequests"
                    >
                      <template v-slot:[`item.displayName`]="{ item }">{{
                        item.displayName
                      }}</template>
                      <template v-slot:[`item.username`]="{ item }">{{
                        item.username
                      }}</template>
                      <template v-slot:[`item.actions`]="{ item }">
                        <div class="d-flex justify-space-between">
                          <v-btn
                            flex
                            class="small-button"
                            color="blue"
                            @click="viewProfile(item.username)"
                          >
                            View Profile
                          </v-btn>
                          <v-btn
                            flex
                            class="small-button"
                            color="green"
                            @click="acceptRequest(item.joinRequest.userID)"
                          >
                            Accept
                          </v-btn>
                          <v-btn
                            flex
                            class="small-button"
                            color="#ad1d25"
                            @click="rejectRequest(item.joinRequest.userID)"
                          >
                            Reject
                          </v-btn>
                        </div>
                      </template>
                    </v-data-table>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="#b01c24"
                      text
                      @click="
                        dialog = false;
                        getGroupInfo();
                        getMembers();
                      "
                      >Close</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-container>
          </v-sheet>
        </v-col>
        <v-col class="mx-auto w-50 h-100">
          <v-container>
            <h1 class="text-center">Member List</h1>
            <v-divider :thickness="20" class="border-opacity-0"></v-divider>
            <v-data-table :headers="headers" :items="memberList">
              <template v-slot:[`item.displayName`]="{ item }">{{
                item.displayName
              }}</template>
              <template v-slot:[`item.username`]="{ item }">{{
                item.username
              }}</template>
              <template v-slot:[`item.actions`]="{ item }">
                <v-btn
                  class="mr-4"
                  color="blue"
                  @click="viewProfile(item.username)"
                >
                  View Profile
                </v-btn>
                <v-btn
                  v-if="isOwner && item.id !== ownerID"
                  color="#ad1d25"
                  @click="kickMember(item.id)"
                >
                  Kick
                </v-btn>
              </template>
            </v-data-table>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </v-col>
</template>
<script>
import { defineComponent } from "vue";
import axios from "axios";
import router from "@/router";
import app from "@/App.vue";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";

// Components
export default defineComponent({
  props: {},
  name: "GroupSearchPage",

  components: {},

  methods: {
    viewProfile(username) {
      router.push(`/user/${username}`);
    },

    acceptRequest(userID) {
      axios
        .post(
          `/api/accept-join-request/${this.$route.params.groupID}/${userID}`
        )
        .then((response) => {
          if (response.data.success) {
            this.pendingRequests = this.pendingRequests.filter(
              (request) => request.id !== userID
            );
          } else {
            console.log(response.data.message);
          }
          this.getPendingRequests();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    rejectRequest(userID) {
      axios
        .post(
          `/api/reject-join-request/${this.$route.params.groupID}/${userID}`
        )
        .then((response) => {
          if (response.data.success) {
            this.pendingRequests = this.pendingRequests.filter(
              (request) => request.id !== userID
            );
          } else {
            console.log(response.data.message);
          }
          this.getPendingRequests();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    kickMember(userID) {
      axios
        .post(`/api/kick-member/${this.$route.params.groupID}/${userID}`)
        .then((response) => {
          if (response.data.success) {
            this.memberList = this.memberList.filter(
              (member) => member.id !== userID
            );
          } else {
            console.log(response.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getPendingRequests() {
      this.dialog = true;
      axios
        .get(`/api/get-pending-requests/${this.$route.params.groupID}`)
        .then((response) => {
          console.log(response.data);
          if (response.data.success) {
            this.data = response.data;
            this.pendingRequests = response.data.joinRequests;
            console.log("Pending Requests: ", this.pendingRequests);
            this.message = this.data.message;
            this.success = this.data.success;
          } else {
            console.log(response.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    getGroupInfo() {
      axios
        .get(`/api/group-search/${this.$route.params.groupID}`)
        .then((response) => {
          console.log(response.data);
          if (response.data.success) {
            this.data = response.data;
            this.group = this.data.group;
            this.message = this.data.message;
            this.success = this.data.success;
            this.ownerID = this.data.group.ownerID;
          } else {
            console.log("This group does not exist!");
            router.push("/");
          }
        })
        .catch((err) => {
          // alert(err);
          console.log(err);
          router.push("/");
        });
    },
    getGroupRole() {
      axios
        .get(`/api/get-group-role/${this.$route.params.groupID}`)
        .then((response) => {
          console.log(response.data);
          if (response.data.success) {
            this.data = response.data;
            this.isOwner = this.data.owner;
            this.isMember = this.data.member;
            this.success = this.data.success;
          } else {
            console.log("Cannot fetch your role in this group!");
            router.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
          router.push("/");
        });
    },
    getMembers() {
      axios
        .get(`/api/get-group-members/${this.$route.params.groupID}`)
        .then((response) => {
          console.log(response.data);
          if (response.data.success) {
            this.data = response.data;
            this.memberList = this.data.members;
            console.log("Members: ", this.memberList);
            this.message = this.data.message;
            this.success = this.data.success;
          } else {
            console.log("This group does not exist!");
            router.push("/");
          }
        })
        .catch((err) => {
          // alert(err);
          console.log(err);
          router.push("/");
        });
    },
    routeEditGroup() {
      console.log(`/group/${this.group.id}/group-edit`);
      router.push(`/group/${this.group.id}/group-edit`);
    },
    routeCreateActivity() {
      console.log(`/group/${this.group.id}/activity-create`);
      if (!app.stompClient || !app.stompClient.connected) {
        app.socket = new SockJS("/api/portal-socket");
        app.stompClient = Stomp.over(app.socket);
        app.stompClient.connect({}, (frame) => {
          console.log(frame);
        });
      }
      router.push(`/group/${this.group.id}/activity-create`);
    },
    checkActivity() {
      console.log(`/group/${this.group.id}/group-activities`);
      router.push(`/group/${this.group.id}/group-activities`);
    },
    joinGroup() {
      this.isJoining = true;
      console.log(`/api/group-join/${this.group.id}`);
      axios
        .post(`/api/group-join/${this.group.id}`)
        .then((response) => {
          if (response.data.success) {
            console.log(response);
            this.getMembers();
            this.getGroupInfo();
            this.getGroupRole();
            if (this.group.isPrivate) {
              alert("Request sent successfully! Please wait for approval.");
            } else {
              alert("You have joined the group!");
              this.$router.go();
            }
          } else {
            alert("Request failed!");
            console.log(response);
            this.$router.go();
          }
        })
        .catch(function (error) {
          alert("Request failed!");
          console.log(error);
          this.$router.go();
        });
    },
    leaveGroup() {
      console.log(`/api/group-leave/${this.group.id}`);
      axios
        .post(`/api/group-leave/${this.group.id}`)
        .then((response) => {
          if (response.data.success) {
            console.log(response);
            this.getMembers();
            this.getGroupInfo();
            this.getGroupRole();
            alert("You have left the group!");
            this.$router.go();
          } else {
            alert("Failed to leave group!");
            console.log(response);
            this.$router.go();
          }
        })
        .catch(function (error) {
          alert("Failed to leave group!");
          console.log(error);
          this.$router.go();
        });
    },
  },

  data() {
    return {
      headers: [
        { title: "Display Name", key: "displayName" },
        { title: "Username", key: "username" },
        { title: "Actions", key: "actions" },
      ],
      memberList: [],
      group: "",
      message: "",
      success: "",
      ownerID: null,
      isOwner: this.isOwner,
      isMember: this.isMember,
      isJoining: false,
      pendingRequests: [],
      dialog: false,
      requestHeaders: [
        { title: "Display Name", key: "displayName" },
        { title: "Username", key: "username" },
        { title: "Actions", key: "actions" },
      ],
    };
  },

  mounted() {
    this.getGroupInfo();
    this.getGroupRole();
    this.getMembers();
    if (this.isOwner) {
      this.getPendingRequests();
    }
  },
});
</script>
<style scoped>
.small-button {
  padding: 4px 8px;
  font-size: 0.7rem;
}
</style>
