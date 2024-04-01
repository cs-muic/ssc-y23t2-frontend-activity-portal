<template>
  <v-col align-self="center">
    <v-container>
      <h1 class="text-center">{{ group.groupName }}</h1>
      <div class="text-center">{{ group.id }}</div>
      <v-divider :thickness="20" class="border-opacity-0"></v-divider>
    </v-container>
    <v-sheet class="mx-auto w-75 h-50">
      <v-container class="mx-auto w-65 h-40">
        {{ group.memberCount }} / {{ group.maxMember }}
        <h1>{{ group.publicDescription }}</h1>
        <v-container v-if="this.isMember">
          {{ group.privateDescription }}
        </v-container>
        <v-btn
          block
          v-if="this.isOwner"
          class="mt-1"
          color="#ad1d25"
          @click="routeEditGroup()"
        >
          Edit Group
        </v-btn>
        <v-btn
          block
          v-if="this.isOwner"
          class="mt-1"
          color="#ad1d25"
          @click="routeCreateActivity()"
        >
          Create Activity
        </v-btn>
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
        <v-btn
          block
          v-if="isOwner"
          class="mt-1"
          color="#ad1d25"
          @click="getPendingRequests()"
        >
          Pending Requests
        </v-btn>
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title class="text-center">Pending Requests</v-card-title>
            <v-card-text>
              <v-data-table :headers="requestHeaders" :items="pendingRequests">
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
                      color="green"
                      @click="acceptRequest(item.username)"
                    >
                      Accept
                    </v-btn>
                    <v-btn
                      flex
                      color="#ad1d25"
                      @click="rejectRequest(item.username)"
                    >
                      Reject
                    </v-btn>
                  </div>
                </template>
              </v-data-table>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="#b01c24" text @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-container>
    </v-sheet>
  </v-col>
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
    </v-data-table>
  </v-container>
</template>
<script>
import { defineComponent } from "vue";
import axios from "axios";
import router from "@/router";

/**
 * TODO:
 * - Check if user alr joined group then turn join button to leave button
 * - Disable edit button for non-admin
 */

// Components
export default defineComponent({
  props: {},
  name: "GroupSearchPage",

  components: {},

  methods: {
    getPendingRequests() {
      this.dialog = true;
      axios
        .get(`/api/get-pending-requests/${this.$route.params.groupID}`)
        .then((response) => {
          console.log(response.data);
          if (response.data.success) {
            this.data = response.data;
            this.pendingRequests = response.data.joinRequests;
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
            }
          } else {
            alert("Request failed!");
            console.log(response);
          }
        })
        .catch(function (error) {
          alert("Request failed!");
          console.log(error);
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
          } else {
            console.log(response);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },

  data() {
    return {
      headers: [
        { title: "displayName", key: "displayName" },
        { title: "username", key: "username" },
      ],
      memberList: [],
      group: "",
      message: "",
      success: "",
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
