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
      <div class="d-flex text-justify-center" v-if="loginError">
        <v-card width="300px">
          <v-card-title class="text-overline text-center text-red-accent-4"
            >Wrong Credentials</v-card-title
          >
        </v-card>
      </div>

      <div class="d-flex flex-column">
        <v-btn class="mt-4" color="#ad1d25" block @click="submit">
          Login
        </v-btn>

        <v-btn class="mt-4" color="#636161" block @click="reset"> Reset </v-btn>
        <v-btn class="mt-4" color="#3cb371" block @click="createAccount">
          Create Account
        </v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>
<script>
import axios from "axios";
import router from "@/router";
export default {
  name: "LoginPage",

  data: () => {
    return {
      valid: true,
      username: "",
      usernameRules: [(v) => !!v || "Username is required"],
      password: "",
      passwordRules: [(v) => !!v || "Username is required"],
      loginError: false,
    };
  },

  methods: {
    async submit() {
      const { valid } = await this.$refs.form.validate();
      var that = this;

      if (valid) {
        let formData = new FormData();
        formData.append("username", this.username);
        formData.append("password", this.password);
        axios
          .post("/api/login", formData)
          .then((response) => {
            if (response.data.success) {
              that.loginError = false;
              console.log(response);
              router.push("/");
            } else {
              that.loginError = true;
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
    createAccount() {
      router.push("/signup");
    },
  },
};
</script>
