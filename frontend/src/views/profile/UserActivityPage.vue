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
      <template v-slot:[`item.start_time`]="{ item }">
        {{ formatDate(item.start_time) }}
      </template>
      <template v-slot:[`item.end_time`]="{ item }">
        {{ formatDate(item.end_time) }}
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
        { title: "Description", value: "description" },
        { title: "Start Time", value: "start_time" },
        { title: "End Time", value: "end_time" },
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
    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleString(undefined, options);
    },
  },

  mounted() {
    console.log(this.getActivities());
    this.getActivities();
  },
};
</script>
