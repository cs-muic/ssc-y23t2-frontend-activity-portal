<template>
  <v-sheet class="mx-auto" width="350">
    <h2 class="title">Welcome to Activity Portal!</h2>
    <p class="text">To get started, you can log in or sign up to continue.</p>

    <v-btn class="mt-4" color="#ad1d25" block @click="login"> Log In </v-btn>
    <v-btn class="mt-4" color="#3cb371" block @click="createAccount">
      Create Account
    </v-btn>
  </v-sheet>
</template>
<script>
export default {
  name: "UnauthorizedHomePage",
  methods: {
    login() {
      this.$router.push("/login");
    },
    createAccount() {
      this.$router.push("/signup");
    },
  },
};
</script>
<style scoped>
.title {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.text {
  padding-left: 20px;
  padding-right: 20px;
}
</style>
