// TODO: make the form taller so that it fits the date time picker
<template>
  <div>
    <h1 class="text-center">Create Activity</h1>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="8">
          <v-card class="mx-auto" max-width="1000">
            <v-card-text>
              <v-form ref="form" class="border p-4">
                <v-text-field
                  v-model="activity.name"
                  :rules="nameRules"
                  label="Name"
                  required
                ></v-text-field>

                <v-row>
                  <v-col cols="6">
                    <VueCtkDateTimePicker
                      v-model="activity.start_time"
                      :rules="startTimeRules"
                      label="Start Time"
                      timeFormat
                      dark
                      required
                    ></VueCtkDateTimePicker>
                  </v-col>
                  <v-col cols="6">
                    <VueCtkDateTimePicker
                      v-model="activity.end_time"
                      :rules="endTimeRules"
                      label="End Time"
                      dark
                      required
                    ></VueCtkDateTimePicker>
                  </v-col>
                </v-row>

                <v-textarea
                  v-model="activity.description"
                  :rules="descriptionRules"
                  label="Description"
                  required
                ></v-textarea>

                <div class="d-flex flex-column">
                  <v-btn block class="mt-4" color="#ad1d25" @click="submit">
                    Create Activity
                  </v-btn>
                  <v-btn block class="mt-4" color="#636161" @click="reset">
                    Reset
                  </v-btn>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import router from "@/router";

export default {
  name: "ActivityCreatePage",

  data() {
    return {
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
      endTimeRules: [(v) => !!v || "End Time is required"],
      cleanupDateRules: [(v) => !!v || "Cleanup Date is required"],
      autoDeleteOvertimeRules: [],
      descriptionRules: [(v) => !!v || "Description is required"],
    };
  },

  //TODO: compute so that end time can't be before start time.

  methods: {
    async submit() {
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const activity = {
          name: this.activity.name,
          start_time: new Date(this.activity.start_time).toISOString(),
          end_time: new Date(this.activity.end_time).toISOString(),
          cleanup_date: this.activity.cleanup_date,
          auto_delete_overtime: this.activity.auto_delete_overtime,
          description: this.activity.description,
        };
        axios
          .post("/api/create-activity", activity)
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
