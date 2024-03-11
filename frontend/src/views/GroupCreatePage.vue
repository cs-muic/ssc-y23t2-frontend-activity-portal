<template>
  <v-container>
    <center>
      <h1>Create Group</h1>
    </center>
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
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                v-model.numbers="maxMember"
                :rules="maxMemberRules"
                label="Group size"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-checkbox v-model="isPrivate" label="Private"></v-checkbox>
          <v-text-field
            v-model="publicDescription"
            :rules="publicDescriptionRules"
            label="Description"
          ></v-text-field>
          <div class="d-flex flex-column">
            <v-btn block class="mt-4" color="#ad1d25" @click="submit">
              Create Group
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
  name: "GroupCreatePage",
  data() {
    return {
      valid: true,
      groupName: "",
      groupNameRules: [(v) => !!v || "Group name is required!"],
      maxMember: "",
      maxMemberRules: [(v) => !!v || "You must set the group size!"],
      isPrivate: "",
      publicDescription: "",
      publicDescriptionRules: [(v) => !!v || "Group name is required!"],
    };
  },
  components: {},
  methods: {
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const group = {
          groupName: this.groupName,
          isPrivate: this.isPrivate,
          publicDescription: this.publicDescription,
          privateDescription: this.privateDescription,
          ownerID: this.$store.state.userID,
        };
        axios
          .post("/api/group-create", group)
          .then(function (response) {
            if (response.data.success) {
              console.log(response);
              router.push("/");
            } else {
              console.log(response);
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    },
    reset() {
      this.$refs.form.reset();
    },
  },
});
</script>
