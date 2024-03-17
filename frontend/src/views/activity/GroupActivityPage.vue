<template>
  <v-container>
    <div style="text-align: center">
      <h1>Activity List for Group: {{ groupName }}</h1>
    </div>
    <v-divider :thickness="20" class="border-opacity-0"></v-divider>
    <v-data-table :headers="headers" :items="activities">
      <template v-slot:[`item.action`]="{ item }">
        <v-btn @click="editActivity(item.id)" color="error">Edit</v-btn>
      </template>
      <!--      <template v-slot:[`item.action`]="{ item }">-->
      <!--        <v-btn @click="unjoinActivity(item.id)" color="error"> Unjoin</v-btn>-->
      <!--      </template>-->
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
import router from "@/router";

export default {
  data() {
    return {
      valid: true,
      groupName: this.groupName,
      groupNameRules: [(v) => !!v || "Group name is required!"],
      //   maxMember: "",
      //   maxMemberRules: [
      //     (v) =>
      //       (!!v && parseInt(v) == v && v >= 2 && v <= 255) ||
      //       "The group size must be an integer between 2-255!",
      //   ],
      publicDescription: this.publicDescription,
      isPrivate: this.isPrivate,
      publicDescriptionRules: [],
      privateDescription: this.privateDescription,
      privateDescriptionRules: [],
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
    editActivity(activityId) {
      router.push(
        `/group/${this.$route.params.groupID}/edit-activity/${activityId}`
      );
    },
    getGroupInfo() {
      axios
        .get(`/api/group-search/${this.$route.params.groupID}`)
        .then((response) => {
          if (!response.data) {
            console.log("This group does not exist!");
            router.push("/");
          } else {
            console.log(response.data);
            this.data = response.data;
            this.groupID = response.data.id;
            this.groupName = response.data.groupName;
            this.isPrivate = response.data.isPrivate;
            this.ownerID = response.data.ownerID;
            this.privateDescription = response.data.privateDescription;
            this.publicDescription = response.data.publicDescription;
          }
        })
        .catch((err) => {
          // alert(err);
          console.log(err);
          router.push("/");
        });
    },
    getActivities() {
      const groupID = this.$route.params.groupID;
      if (groupID) {
        fetch(`/api/group-activity/${groupID}`)
          .then((response) => response.json())
          .then((data) => {
            this.activities = data.activities;
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.error("groupID is not defined");
      }
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
    this.getGroupInfo();
    this.getActivities();
  },
};
</script>
