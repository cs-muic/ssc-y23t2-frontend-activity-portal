<template>
  <v-container>
    <h2>Home Page</h2>
    <ul>
      <li>
        <router-link to="/">To: Home</router-link>
      </li>
      <li>
        <router-link to="/about">To: About</router-link>
      </li>
      <li>
        <router-link to="/login">To: Login</router-link>
      </li>
      <li>
        <router-link to="/user-activities">To: User Activity</router-link>
      </li>
    </ul>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";

// Components

export default defineComponent({
  name: "HomeView",

  components: {},
});
</script>
