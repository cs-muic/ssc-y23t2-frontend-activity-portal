<template>
  <v-container>
    <center>
      <h1>My Groups</h1>
    </center>
    <v-divider :thickness="20" class="border-opacity-0"></v-divider>

    <v-data-table :headers="headers" :items="groupList" :search="search">
      <template v-slot:top>
        <v-divider :thickness="10" class="border-opacity-0"></v-divider>
        <v-text-field
          class="mx-auto w-75"
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
        <v-divider :thickness="10" class="border-opacity-0"></v-divider>
      </template>
      <template v-slot:[`item.memberCount`]="{ item }"
        >{{ item.memberCount }} / {{ item.maxMember }}</template
      >
      <template v-slot:[`item.id`]="{ item }"
        >{{ item.id }} <v-icon v-if="item.isPrivate">mdi-lock</v-icon></template
      >

      <template v-slot:[`item.groupName`]="{ item }"
        >{{ item.groupName.substr(0, 30) }}
        <!-- Find a way to properly limit the number of character display with ... -->
      </template>

      <template v-slot:[`item.publicDescription`]="{ item }"
        >{{ item.publicDescription.substr(0, 30) }}
        <!-- Find a way to properly limit the number of character display with ... -->
      </template>

      <template v-slot:[`item.viewGroup`]="{ item }"
        ><v-btn block class="mt-1" color="#ad1d25" @click="routeGroup(item.id)">
          Visit
        </v-btn></template
      >
    </v-data-table>
  </v-container>
</template>
<script>
import { defineComponent } from "vue";
import axios from "axios";
import router from "@/router";

// Components
export default defineComponent({
  name: "UserGroupPage",

  components: {},

  methods: {
    getAllSearch() {
      return axios
        .get("/api/fetch-my-groups")
        .then((response) => {
          this.data = response.data;
          this.groupList = this.data.group;
          this.message = this.data.message;
          this.success = this.data.success;
          console.log(response.data);
        })
        .catch((err) => alert(err));
    },

    routeGroup(groupID) {
      console.log(`/group/${groupID}`);
      router.push(`/group/${groupID}`);
    },

    idNameFilter(items, search, filter) {
      search = search.toString().toLowerCase();
      return items.filter((row) => filter(row["groupName,id"], search));
    },
  },

  data() {
    return {
      search: "",
      headers: [
        { title: "#", key: "id" },
        { title: "Group name", key: "groupName" },
        { title: "members", key: "memberCount" },
        { title: "Owner", key: "ownerID" }, // Maybe change this field to owner name
        { title: "Description", key: "publicDescription" },
        { title: "View Group", key: "viewGroup" },
      ],
      groupList: [],
      message: "",
      success: "",
      data: "",
    };
  },

  mounted() {
    this.getAllSearch();
  },
});
</script>
