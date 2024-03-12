<template>
  <v-container>
    <center>
      <h1>Activity List</h1>
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
        .get("/api/user-activities")
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
        { title: "Activity Name", key: "name" },
        { title: "Description", key: "description" },
        { title: "Location", key: "location" },
        { title: "Start Time", key: "start_time" },
        { title: "End Time", key: "end_time" },
        { title: "Status", key: "ownerID" }, // Maybe change this field to owner name
      ],
      data: [],
    };
  },

  mounted() {
    this.getAllSearch();
  },
});
</script>
