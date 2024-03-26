<template>
  <v-container>
    <h1 class="text-center">Create Group</h1>
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
                counter
                :maxlength="64"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="1" md="2">
              <v-text-field
                v-on:keypress="NumbersOnly"
                v-model.numbers="maxMember"
                :rules="maxMemberRules"
                label="Group size"
                type="number"
                required
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
          <v-text-field
            v-model="tagInfo.gameName"
            label="Game Name"
            :rules="gameNameRules"
            counter
            :maxlength="64"
            required
          ></v-text-field>
          <v-select
            v-model="tagInfo.region"
            :items="regions"
            label="Region"
          ></v-select>
          <v-select
            v-model="tagInfo.language"
            :items="languages"
            label="Language"
          ></v-select>
          <v-select
            v-model="tagInfo.playStyle"
            :items="playStyles"
            label="Play Style"
            required
          ></v-select>
          <v-select
            v-model="tagInfo.skillLevel"
            :items="skillLevels"
            label="Skill Level"
          ></v-select>
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
      maxMemberRules: [
        (v) =>
          (!!v && parseInt(v) == v && v >= 2 && v <= 255) ||
          "The group size must be an integer between 2-255!",
      ],
      publicDescription: "",
      isPrivate: false,
      publicDescriptionRules: [],
      privateDescription: "",
      tagInfo: {
        gameName: "",
        region: "",
        language: "",
        playStyle: "",
        skillLevel: "",
      },
      gameNameRules: [(v) => !!v || "Game name is required!"],
      regions: [
        "North America",
        "Europe",
        "Asia",
        "Oceania",
        "South America",
        "Africa",
      ],
      languages: [
        "English",
        "Spanish",
        "French",
        "German",
        "Chinese (Mandarin)",
        "Chinese (Cantonese)",
        "Japanese",
        "Thai",
        "Hindi",
        "etc.",
      ],
      playStyles: ["Casual", "Competitive"],
      skillLevels: ["Beginner", "Intermediate", "Advanced", "Expert", "Pro"],
    };
  },
  components: {},
  methods: {
    NumbersOnly(event) {
      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    },
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const group = {
          groupName: this.groupName,
          isPrivate: this.isPrivate,
          maxMember: parseInt(this.maxMember),
          publicDescription: this.publicDescription,
          privateDescription: this.privateDescription,
          ownerID: this.$store.state.userID,
          tagInfo: JSON.stringify(this.tagInfo),
        };
        console.log(group);
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
