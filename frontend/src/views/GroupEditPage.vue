<template>
  <v-container>
    <center>
      <h1>Edit Group : {{ groupName }}</h1>
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
                counter
                :maxlength="64"
              ></v-text-field>
            </v-col>
            <!-- <v-col cols="12" sm="1" md="2">
                <v-text-field
                  v-on:keypress="NumbersOnly"
                  v-model.numbers="maxMember"
                  :rules="maxMemberRules"
                  label="Group size"
                  type="number"
                  required
                ></v-text-field>
              </v-col> -->
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
          //   maxMember: parseInt(this.maxMember),
          publicDescription: this.publicDescription,
          privateDescription: this.privateDescription,
          ownerID: this.$store.state.userID,
        };
        console.log(group);
        axios
          .post(`/api/group-edit`, group)
          .then(function (response) {
            if (response.data.success) {
              console.log(response);
              // TODO: route this dynamically
              router.push(`/group-search`);
              //   const routeId = this.$route.params.groupID;
              //   this.$router.push(`/group/${routeId}`);
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
    getGroupInfo() {
      axios
        .get(`/api/group-search/${this.$route.params.groupID}`)
        .then((response) => {
          if (!response.data) {
            console.log("This group does not exist!");
            router.push("/");
          }
          if (!(response.data.ownerID == this.$store.state.userID)) {
            console.log("Wrong Authentication!");
            router.push("/");
          }

          console.log(response.data);
          this.data = response.data;
          this.groupID = this.data.id;
          this.groupName = this.data.groupName;
          this.isPrivate = this.data.isPrivate;
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
  mounted() {
    this.getGroupInfo();
  },
});
</script>
