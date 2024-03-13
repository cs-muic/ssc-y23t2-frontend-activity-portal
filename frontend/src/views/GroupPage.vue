<template>
  <v-container>
    <h1>{{ groupID }} {{ groupName }}</h1>
    <v-divider :thickness="20" class="border-opacity-0"></v-divider>
  </v-container>
  <v-col align-self="center">
    <v-sheet class="mx-auto w-75 h-50">
      <v-container class="mx-auto w-65 h-40"> </v-container>
    </v-sheet>
  </v-col>
</template>
<script>
import { defineComponent } from "vue";
import axios from "axios";
import router from "@/router";

// Components
export default defineComponent({
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
