<template>
  <v-container fluid>
    <v-btn @click="goToActivity()" color="error">Back to Activity Page</v-btn>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8">
        <v-sheet class="mx-auto" width="1000">
          <v-card-text>
            <v-form ref="form">
              <h1 class="text-center">Edit Activity:</h1>
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
                >Edit Activity
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

export default {
  name: "ActivityEditPage",

  data() {
    return {
      minDate: moment().format("YYYY-MM-DD hh:mm a'"),
      valid: true,
      activity: {
        name: "",
        start_time: null,
        end_time: null,
        cleanup_date: null,
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
    endTimeNotEarlier(value) {
      return (
        !value ||
        new Date(value) >= new Date(this.activity.start_time) ||
        "End time can't be before start time"
      );
    },
  },
  methods: {
    goToGroup() {
      router.push(`/group/${this.$route.params.groupID}/group-activities`);
    },
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const activity = {
          name: this.activity.name,
          start_time: new Date(this.activity.start_time).getTime(),
          end_time: new Date(this.activity.end_time).getTime(),
          cleanup_date: this.activity.cleanup_date,
          auto_delete_overtime: this.activity.auto_delete_overtime,
          description: this.activity.description,
          status: this.activity.status,
        };

        axios
          .put(
            `api/${this.$route.params.groupID}/activity-edit/${this.$route.params.activityID}`,
            activity
          )
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
    async getActivityInfo() {
      try {
        const response = await axios.get(
          `/api/${this.$route.params.activityID}/activity`
        );
        if (response.data) {
          this.activity = response.data;
        } else {
          console.log("This activity does not exist!");
          router.push("/");
        }
      } catch (error) {
        console.log(error);
        router.push("/");
      }
    },
  },
  mounted() {
    this.getActivityInfo();
  },
  reset() {
    this.$refs.form.reset();
  },
};
</script>
