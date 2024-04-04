<template>
  <v-btn @click="goToGroup()" color="#4f1811">Back To Group Page</v-btn>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-sheet class="mx-auto" width="1000">
          <v-card-text>
            <v-form ref="form">
              <h1 class="text-center">Create Activity</h1>
              <v-text-field
                v-model="activity.name"
                label="Name"
                required
              ></v-text-field>

              <v-row>
                <v-col cols="6">
                  <VueCtkDateTimePicker
                    v-model="activity.start_time"
                    :min-date="minDate"
                    label="Start Time"
                    dark
                    required
                    :rules="startTimeRules"
                  ></VueCtkDateTimePicker>
                </v-col>
                <v-col cols="6">
                  <VueCtkDateTimePicker
                    v-model="activity.end_time"
                    label="End Time"
                    :min-date="activity.start_time"
                    dark
                    required
                    :rules="endTimeRules"
                  ></VueCtkDateTimePicker>
                </v-col>
              </v-row>

              <v-textarea
                v-model="activity.description"
                label="Description"
                required
              ></v-textarea>

              <v-btn block class="mt-4" color="#ad1d25" @click="submit"
                >Create Activity
              </v-btn>
              <v-btn block class="mt-4" color="#636161" @click="reset"
                >Reset
              </v-btn>
            </v-form>
          </v-card-text>
        </v-sheet>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import router from "@/router";
import moment from "moment";
import SockJS from "sockjs-client";
import Stomp from "webstomp-client";
import app from "@/App.vue";

export default {
  name: "ActivityCreatePage",

  data() {
    return {
      minDate: moment().format("YYYY-MM-DD hh:mm a'"),
      valid: true,
      activity: {
        name: "",
        start_time: null,
        end_time: null,
        cleanup_date: null,
        status: null,
        auto_delete_overtime: false,
        description: "",
      },
      nameRules: [(v) => !!v || "Name is required"],
      startTimeRules: [(v) => !!v || "Start Time is required"],
      endTimeRules: [
        (v) => !!v || "End Time is required",
        () => this.endTimeNotEarlier,
      ],
      descriptionRules: [(v) => !!v || "Description is required"],
    };
  },

  computed: {
    endTimeNotEarlier() {
      return (
        !this.activity.end_time ||
        new Date(this.activity.end_time) >=
          new Date(this.activity.start_time) ||
        "End time can't be before start time"
      );
    },
  },
  methods: {
    goToGroup() {
      router.push(`/group/${this.$route.params.groupID}`);
    },
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const activity = {
          name: this.activity.name,
          start_time: new Date(this.activity.start_time).toLocaleString(
            "en-US",
            { timeZone: "Asia/Bangkok" }
          ),
          end_time: new Date(this.activity.end_time).toLocaleString("en-US", {
            timeZone: "Asia/Bangkok",
          }),
          cleanup_date: this.activity.cleanup_date,
          auto_delete_overtime: this.activity.auto_delete_overtime,
          description: this.activity.description,
          status: this.activity.status,
        };
        axios
          .post(`/api/${this.$route.params.groupID}/activity-create`, activity)
          .then((response) => {
            if (response.data.success) {
              console.log(response);
              console.log(this.$route.params.groupID);
              if (app.stompClient && app.stompClient.connected) {
                const info = {
                  groupID: this.$route.params.groupID,
                  content: "Group has made a new activity!",
                };
                console.log(info);
                app.stompClient.send(
                  "/api/socket/messages",
                  JSON.stringify(info),
                  {}
                );
              } else {
                app.socket = new SockJS("/api/portal-socket");
                app.stompClient = Stomp.over(app.socket);
                app.stompClient.connect({}, (frame) => {
                  console.log(frame);
                });
                let info;
                info.groupID = this.groupID;
                info.content = "Group has made a new activity!";
                console.log(info);
                app.stompClient.send(
                  "/api/socket/messages",
                  JSON.stringify(info),
                  {}
                );
                app.stompClient.disconnect();
              }
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
    mounted() {
      this.getGroupInfo();
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>
