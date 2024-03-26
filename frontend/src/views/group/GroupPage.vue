<template>
  <v-col align-self="center">
    <v-container>
      <center>
        <h1>{{ group.groupName }}</h1>
        {{ group.id }}
      </center>
      <v-divider :thickness="20" class="border-opacity-0"></v-divider>
    </v-container>
    <v-sheet class="mx-auto w-75 h-50">
      <v-container class="mx-auto w-65 h-40">
        {{ group.memberCount }} / {{ group.maxMember }}
        <h1>{{ group.publicDescription }}</h1>
        <v-container> {{ group.privateDescription }} </v-container>
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
          v-if="!this.isMember"
          class="mt-1"
          color="#ad1d25"
          @click="joinGroup()"
        >
          Join Group
        </v-btn>
        <v-btn
          block
          v-if="this.isMember"
          class="mt-1"
          color="#ad1d25"
          @click="leaveGroup()"
        >
          Leave Group
        </v-btn>
      </v-container>
    </v-sheet>
  </v-col>
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
    routeEditGroup() {
      console.log(`/group/${this.group.id}/group-edit`);
      router.push(`/group/${this.group.id}/group-edit`);
    },
    joinGroup() {
      console.log(`/api/group-join/${this.group.id}`);
      axios
        .post(`/api/group-join/${this.group.id}`)
        .then(function (response) {
          if (response.data.success) {
            console.log(response);
            // TODO: route this to force refresh page
            //   const routeId = this.$route.params.groupID;
            //   this.$router.push(`/group/${routeId}`);
          } else {
            console.log(response);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    leaveGroup() {
      console.log(`/api/group-leave/${this.group.id}`);
      axios
        .post(`/api/group-leave/${this.group.id}`)
        .then(function (response) {
          if (response.data.success) {
            console.log(response);
            // TODO: route this to force refresh page
            //   const routeId = this.$route.params.groupID;
            //   this.$router.push(`/group/${routeId}`);
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
      group: "",
      message: "",
      success: "",
      isOwner: this.isOwner,
      isMember: this.isMember,
    };
  },

  mounted() {
    this.getGroupInfo();
    this.getGroupRole();
  },
});
</script>
