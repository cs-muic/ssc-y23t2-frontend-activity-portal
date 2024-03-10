<template>
  <v-sheet class="mx-auto" width="300">
    <v-form ref="form">
      <v-text-field
        v-model="displayname"
        :rules="displaynameRules"
        label="Display Name"
        required
      ></v-text-field>

      <div class="d-flex flex-column">
        <v-btn block class="mt-4" color="#ad1d25" @click="submit">
          Update Profile
        </v-btn>

        <v-btn block class="mt-4" color="#636161" @click="reset"> Reset</v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script>
import axios from "axios";
import router from "@/router";

export default {
  name: "LoginPage",

  data() {
    return {
      valid: true,
      displayname: "",
      displaynameRules: [(v) => !!v || "Display Name is required"],
    };
  },

  methods: {
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const user = {
          displayName: this.displayname,
        };
        axios
          .post("/api/edit-profile", user)
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
};
</script>
