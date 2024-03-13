<template>
  <v-container class="mx-auto" max-width="600">
    <v-card>
      <v-card-title class="text-center text-h4 text my-6 font-weight-bold">
        {{ displayname }}'s Profile
      </v-card-title>
      <v-card-text class="text my-6">
        <v-row justify="center">
          <v-col cols="10">
            <v-card class="bg-white">
              <v-card-text class="text-h6 black--text">
                <div class="bio-box">
                  <div v-if="bio">{{ bio }}</div>
                  <div v-else>This user has not yet provided a bio.</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "UserProfilePage",
  props: ["username"],
  data() {
    return {
      displayname: "",
      bio: "",
    };
  },
  created() {
    const username = this.$route.params.username;
    axios
      .get(`/api/user/${username}`)
      .then((response) => {
        console.log(response.data);
        this.displayname = response.data.displayName;
        this.bio = response.data.bio;
      })
      .catch((error) => {
        console.log(error);
      });
  },
};
</script>
