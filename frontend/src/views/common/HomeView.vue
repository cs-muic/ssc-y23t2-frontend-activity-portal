<template>
  <v-container>
    <div style="text-align: center">
      <h1>To Your Activity!</h1>
    </div>
    <v-btn class="mt-4" color="#851c09" block @click="joinGroup">
      Join a group!
      <v-icon
        class="mx-2"
        color="#030302"
        icon="mdi-home-plus"
        size="30"
      ></v-icon>
    </v-btn>
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="auto">
          <v-btn class="mt-4" color="#851c09" block @click="groupCheck">
            <v-icon
              class="mx-2"
              color="#030302"
              icon="mdi-account-group-outline"
              size="30"
            ></v-icon>
            Check your joined groups!
          </v-btn>
        </v-col>

        <v-col cols="auto">
          <v-btn class="mt-4" color="#851c09" block @click="createGroup">
            Create a group of your own!
            <v-icon
              class="mx-2"
              color="#030302"
              icon="mdi-account-multiple-plus-outline"
              size="30"
            ></v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <div style="text-align: center">
      <h2>Activity List Preview</h2>
    </div>
    <v-divider :thickness="20" class="border-opacity-0"></v-divider>
    <v-data-table-virtual :headers="headers" :items="activities">
      <template v-slot:[`item.action`]="{ item }">
        <v-btn @click="unjoinActivity(item.id)" color="error"> Unjoin</v-btn>
      </template>
      <template v-slot:[`item.start_time`]="{ item }">
        {{ formatDate(item.start_time) }}
      </template>
      <template v-slot:[`item.end_time`]="{ item }">
        {{ formatDate(item.end_time) }}
      </template>
    </v-data-table-virtual>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import router from "@/router";
import axios from "axios";

// Components

export default defineComponent({
  name: "HomeView",

  components: {},
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
    joinGroup() {
      router.push("/group-search");
    },
    createGroup() {
      router.push("/group-create");
    },
    groupCheck() {
      router.push("/my-groups");
    },
    getUsername() {
      return this.$store.state.username;
    },
    getActivities() {
      return axios
        .get("api/user-activities")
        .then((response) => {
          this.activities = response.data.slice(0, 5);
          this.activities.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.date) - new Date(a.date);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    unjoinActivity(activityId) {
      axios.post(`/api/unjoin-activity/${activityId}`).then(() => {
        axios.get("api/user-activities").then((response) => {
          this.activities = response.data.slice(0, 5);
        });
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
});
</script>
