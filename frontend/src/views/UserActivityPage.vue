<template>
  <v-container>
    <div style="text-align: center">
      <h1>Activity List for User: {{ getUsername() }}</h1>
    </div>
    <v-divider :thickness="20" class="border-opacity-0"></v-divider>
    <v-data-table :headers="headers" :items="activities">
      <template v-slot:[`item.action`]="{ item }">
        <v-btn @click="unjoinActivity(item.id)" color="error"> Unjoin</v-btn>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      headers: [
        { title: "Name", value: "name" },
        { title: "Start Time", value: "start_time" },
        { title: "End Time", value: "end_time" },
        { title: "Description", value: "description" },
        { title: "Action", value: "action" },
      ],
      activities: [],
    };
  },
  methods: {
    getUsername() {
      return this.$store.state.username;
    },
    getActivities() {
      return axios
        .get("api/user-activities")
        .then((response) => {
          this.activities = response.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    unjoinActivity(activityId) {
      axios.post(`/api/unjoin-activity/${activityId}`).then(() => {
        axios.get("api/user-activities").then((response) => {
          this.activities = response.data;
        });
      });
    },
  },
  mounted() {
    console.log(this.getActivities());
    this.getActivities();
  },
};
</script>
