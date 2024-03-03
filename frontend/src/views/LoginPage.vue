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
        type="password"
        v-model="password"
        :rules="passwordRules"
        label="Password"
        required
      ></v-text-field>

      <div class="d-flex flex-column">
        <v-btn class="mt-4" color="success" block @click="submit">
          Login
        </v-btn>

        <v-btn class="mt-4" color="error" block @click="reset"> Reset </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>
<script>
import axios from "axios";
import router from "@/router";
export default {
  name: "LoginPage",

  data: () => ({
    valid: true,
    username: "",
    usernameRules: [(v) => !!v || "Username is required"],
    password: "",
    passwordRules: [(v) => !!v || "Password is required"],
  }),

  methods: {
    async submit() {
      const { valid } = await this.$refs.form.validate();

      if (valid) {
        let formData = new FormData();
        formData.append("username", this.username);
        formData.append("password", this.password);
        axios
          .post("/api/login", formData)
          .then(function (response) {
            if (response.data.success) {
              console.log(response);
              router.push("/");
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
