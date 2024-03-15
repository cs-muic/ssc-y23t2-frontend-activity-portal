<template>
  <v-sheet class="mx-auto" width="300">
    <v-form ref="form">
      <v-text-field
        v-model="username"
        :rules="usernameRules"
        label="Username"
        required
      ></v-text-field>

      <v-text-field
        v-model="displayname"
        :rules="displaynameRules"
        label="Display Name"
        required
      ></v-text-field>

      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Password"
        required
        type="password"
      ></v-text-field>

      <v-text-field
        v-model="confirmPassword"
        :rules="confirmPasswordRules"
        label="Confirm Password"
        required
        type="password"
      ></v-text-field>

      <div class="d-flex flex-column">
        <v-btn block class="mt-4" color="#ad1d25" @click="submit">
          Sign Up
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
  name: "SignupPage",

  data() {
    return {
      valid: true,
      username: "",
      usernameRules: [(v) => !!v || "Username is required"],
      displayname: "",
      displaynameRules: [(v) => !!v || "Display Name is required"],
      password: "",
      passwordRules: [(v) => !!v || "Password is required"],
      confirmPassword: "",
    };
  },

  computed: {
    confirmPasswordRules() {
      return [
        (v) => !!v || "Confirm Password is required",
        (v) => v === this.password || "Passwords do not match",
      ];
    },
  },

  methods: {
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const user = {
          username: this.username,
          displayName: this.displayname,
          password: this.password,
        };
        axios
          .post("/api/create-account", user)
          .then(function (response) {
            if (response.data.success) {
              console.log(response);
              router.push("/login");
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
