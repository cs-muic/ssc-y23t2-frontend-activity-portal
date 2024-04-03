<template>
  <v-container>
    <h1 class="text-center">Edit Group : {{ groupName }}</h1>
    <v-divider :thickness="20" class="border-opacity-0"></v-divider>
  </v-container>
  <v-col align-self="center">
    <v-sheet class="mx-auto w-75 h-50">
      <v-container class="mx-auto w-65 h-40">
        <v-form ref="form">
          <v-row>
            <v-col class="mx-auto">
              <v-text-field
                v-model="groupName"
                :rules="groupNameRules"
                label="Group name"
                required
                counter
                :maxlength="64"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" md="auto">
              <v-checkbox v-model="isPrivate" label="Private"></v-checkbox>
            </v-col>
          </v-row>
          <v-text-field
            v-model="publicDescription"
            :rules="publicDescriptionRules"
            label="Description"
            counter
            :maxlength="256"
          ></v-text-field>
          <v-text-field
            v-if="isPrivate"
            v-model="privateDescription"
            :rules="privateDescriptionRules"
            label="Private Description"
            counter
            :maxlength="256"
          ></v-text-field>
          <div class="d-flex flex-column">
            <v-btn block class="mt-4" color="#ad1d25" @click="submit">
              Edit Group
            </v-btn>
            <v-btn block class="mt-4" color="#ad1d25" @click="deleteGroup">
              Delete Group
            </v-btn>
            <v-btn block class="mt-4" color="#636161" @click="reset">
              Reset</v-btn
            >
          </div>
        </v-form>
      </v-container>
    </v-sheet>
  </v-col>
</template>
<script>
import { defineComponent } from "vue";
import axios from "axios";
import router from "@/router";
// Components

export default defineComponent({
  watch: {},
  name: "GroupEditPage",
  data() {
    return {
      valid: true,
      groupName: this.groupName,
      groupNameRules: [(v) => !!v || "Group name is required!"],
      publicDescription: this.publicDescription,
      isPrivate: this.isPrivate,
      publicDescriptionRules: [],
      privateDescription: this.privateDescription,
      privateDescriptionRules: [],
    };
  },
  components: {},
  methods: {
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const group = {
          id: this.groupID,
          groupName: this.groupName,
          isPrivate: this.isPrivate,
          publicDescription: this.publicDescription,
          privateDescription: this.privateDescription,
          ownerID: this.$store.state.userID,
        };
        const groupID = group.id;
        console.log(group);
        axios
          .post(`/api/group-edit`, group)
          .then(function (response) {
            if (response.data.success) {
              console.log(response);
              router.push({
                name: `group-page`,
                params: { groupID },
              });
            } else {
              console.log(response);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    async deleteGroup() {
      const group = {
        id: this.groupID,
      };
      axios
        .post(`/api/group-delete`, group)
        .then(function (response) {
          if (response.data.success) {
            console.log(response);
            router.push(`/my-groups`);
          } else {
            console.log(response);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    reset() {
      this.$refs.form.reset();
      this.groupName = this.data.group.groupName;
      this.isPrivate = this.data.group.isPrivate;
      this.publicDescription = this.data.group.publicDescription;
      this.privateDescription = this.data.group.privateDescription;
    },
    getGroupInfo() {
      axios
        .get(`/api/group-search/${this.$route.params.groupID}`)
        .then((response) => {
          if (!response.data.success) {
            console.log("This group does not exist!");
            router.push("/");
          } else if (
            !(response.data.group.ownerID == this.$store.state.userID)
          ) {
            console.log("Wrong Authentication!");
            router.push("/");
          } else {
            this.data = response.data;
            this.groupID = response.data.group.id;
            this.groupName = response.data.group.groupName;
            this.isPrivate = response.data.group.isPrivate;
            this.ownerID = response.data.group.ownerID;
            this.privateDescription = response.data.group.isPrivate
              ? response.data.group.privateDescription
              : "";
            this.publicDescription = response.data.group.publicDescription;
          }
        })
        .catch((err) => {
          console.log(err);
          router.push("/");
        });
    },
  },
  mounted() {
    this.getGroupInfo();
  },
});
</script>
