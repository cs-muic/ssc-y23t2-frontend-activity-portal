<template>
  <v-container>
    <center>
      <h1>Group List</h1>
    </center>
    <v-divider :thickness="20" class="border-opacity-0"></v-divider>
    <v-data-table :headers="headers" :items="items"></v-data-table>
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
      return axios.get("/api/search-account");
    },
  },

  data() {
    return {
      headers: ["a", "b"],
      items: [
        {
          a: 1,
          b: 2,
        },
        {
          a: 1,
          b: 2,
        },
      ],
    };
  },
});
</script>
