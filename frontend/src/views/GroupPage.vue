<template>
  <v-col align-self="center">
    <v-container>
      <center>
        <h1>{{ groupName }}</h1>
        {{ groupID }}
      </center>
      <v-divider :thickness="20" class="border-opacity-0"></v-divider>
    </v-container>
    <v-sheet class="mx-auto w-75 h-50">
      <v-container class="mx-auto w-65 h-40">
        {{ memberCount }} / {{ maxMember }}
        <h1>{{ publicDescription }}</h1>
        <v-container> {{ privateDescription }} </v-container>
        <v-btn block class="mt-1" color="#ad1d25" @click="routeEditGroup()">
          Edit Group
        </v-btn>
        <v-btn block class="mt-1" color="#ad1d25" @click="joinGroup()">
          Join Group
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
          if (!response.data) {
            console.log("This group does not exist!");
            router.push("/");
          }
          this.data = response.data;
          this.groupID = this.data.id;
          this.groupName = this.data.groupName;
          this.isPrivate = this.data.isPrivate;
          this.maxMember = this.data.maxMember;
          this.memberCount = this.data.memberCount;
          this.ownerID = this.data.ownerID;
          this.privateDescription = this.data.privateDescription;
          this.publicDescription = this.data.publicDescription;
        })
        .catch((err) => {
          // alert(err);
          console.log(err);
          router.push("/");
        });
    },
    routeEditGroup() {
      console.log(`/group/${this.groupID}/group-edit`);
      router.push(`/group/${this.groupID}/group-edit`);
    },
    joinGroup() {
      console.log(`/api/group-join/${this.groupID}`);
      axios
        .post(`/api/group-join/${this.groupID}`)
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
      groupID: "",
      groupName: "",
      isPrivate: "",
      maxMember: "",
      memberCount: "",
      ownerID: "",
      privateDescription: "",
      publicDescription: "",
    };
  },

  mounted() {
    this.getGroupInfo();
  },
});
</script>
