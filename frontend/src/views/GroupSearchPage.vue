<template>
  <v-container>
    <center>
      <h1>Group List</h1>
    </center>
    <v-divider :thickness="20" class="border-opacity-0"></v-divider>
    <v-data-table :headers="headers" :items="data"></v-data-table>
  </v-container>
</template>
<script>
import { defineComponent } from "vue";
import axios from "axios";
// import router from "@/router";

// Components
export default defineComponent({
  name: "GroupSearchPage",

  components: {},

  methods: {
    getAllSearch() {
      return axios
        .get("/api/group-search/fetch-all-groups")
        .then((response) => {
          this.data = response.data;
          console.log(response.data);
        })
        .catch((err) => alert(err));
    },
  },

  data() {
    return {
      headers: [
        { title: "#", key: "id" },
        { title: "Group name", key: "groupName" },
        { title: "Group size", key: "maxMember" },
        { title: "members", key: "memberCount" },
        { title: "Owner", key: "ownerID" }, // Maybe change this field to owner name
        { title: "Description", key: "publicDescription" },
        { title: "private", key: "isPrivate" },
      ],
      data: [],
    };
  },

  mounted() {
    this.getAllSearch();
  },
});
</script>
