<template>
  <v-container>
    <h1 class="text-center">Group List</h1>
    <v-divider :thickness="20" class="border-opacity-0"></v-divider>

    <v-data-table :headers="headers" :items="groupList" :search="search">
      <template v-slot:[`item.tags`]="{ item }">
        <v-chip
          v-for="(value, key) in filteredTags(item)"
          :key="key"
          color="red"
          class="ma-1"
          small
        >
          <v-icon left>mdi-label</v-icon>
          {{ value }}
        </v-chip>
      </template>
      <template v-slot:top>
        <v-divider :thickness="10" class="border-opacity-0"></v-divider>
        <v-row no-gutters align="center">
          <v-col cols="11" class="align-center">
            <v-text-field
              class="mx-auto w-75 mr-4"
              v-model="search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
            ></v-text-field>
          </v-col>
          <v-col cols="1">
            <v-btn color="#b01c24" small @click="dialog = true">
              <v-icon left>mdi-filter</v-icon>
              Filter
            </v-btn>
          </v-col>
        </v-row>
        <v-dialog v-model="dialog" max-width="600px">
          <v-card>
            <v-card-title class="headline">Filter by Tags</v-card-title>
            <v-card-text>
              <v-chip-group v-model="selectedTags" column multiple>
                <div
                  v-for="(tags, category) in categorizedTags"
                  :key="category"
                  style="padding: 0 10px; ,max-width: 200px; overflow: auto"
                >
                  {{ categoryNames[category] }}
                  <div>
                    <hr
                      style="
                        width: 520px;
                        border: none;
                        border-top: 1px solid white;
                        margin: 0 auto 13px;
                      "
                    />
                  </div>
                  <div>
                    <v-chip
                      v-for="(tag, i) in tags"
                      :key="i"
                      color="red"
                      class="ma-1"
                      small
                      :value="tag"
                      filter
                    >
                      <v-icon left>mdi-label</v-icon>
                      {{ tag }}
                    </v-chip>
                  </div>
                </div>
              </v-chip-group>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="filterByTags"
                >Filter</v-btn
              >
              <v-btn color="blue darken-1" text @click="resetAll">Reset</v-btn>
              <v-btn color="#b01c24" text @click="dialog = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-divider :thickness="10" class="border-opacity-0"></v-divider>
      </template>
      <template v-slot:[`item.memberCount`]="{ item }"
        >{{ item.memberCount }} / {{ item.maxMember }}</template
      >
      <template v-slot:[`item.id`]="{ item }"
        >{{ item.id }} <v-icon v-if="item.isPrivate">mdi-lock</v-icon></template
      >

      <template v-slot:[`item.groupName`]="{ item }"
        >{{ item.groupName.substr(0, 30) }}
        <!-- Find a way to properly limit the number of character display with ... -->
      </template>

      <template v-slot:[`item.publicDescription`]="{ item }"
        >{{ item.publicDescription.substr(0, 30) }}
        <!-- Find a way to properly limit the number of character display with ... -->
      </template>

      <template v-slot:[`item.viewGroup`]="{ item }"
        ><v-btn block class="mt-1" color="#ad1d25" @click="routeGroup(item.id)">
          Visit
        </v-btn></template
      >
    </v-data-table>
  </v-container>
</template>
<script>
import { defineComponent } from "vue";
import axios from "axios";
import router from "@/router";

// Components
export default defineComponent({
  name: "GroupSearchPage",

  components: {},

  methods: {
    getAllSearch() {
      return axios
        .get("/api/group-search/fetch-all-groups")
        .then((response) => {
          this.data = response.data;
          if (this.data.group) {
            this.groupList = this.data.group.map((group) => {
              group.tagInfo = JSON.parse(group.tagInfo);
              return group;
            });
          } else this.groupList = [];
          this.message = this.data.message;
          this.success = this.data.success;
          console.log(response.data);

          this.tags = [
            ...new Set(
              this.groupList
                .flatMap((group) => Object.values(group.tagInfo))
                .filter((tag) => tag.trim() !== "")
            ),
          ];
        })
        .catch((err) => alert(err));
    },

    routeGroup(groupID) {
      console.log(`/group/${groupID}`);
      router.push(`/group/${groupID}`);
    },

    idNameFilter(items, search, filter) {
      search = search.toString().toLowerCase();
      return items.filter((row) => filter(row["groupName,id"], search));
    },

    resetAll() {
      this.selectedTags = [];
      this.getAllSearch();
      this.dialog = false;
    },

    async filterByTags() {
      await this.getAllSearch();
      const selectedTagsArray = JSON.parse(JSON.stringify(this.selectedTags));

      this.groupList = this.groupList.filter((group) => {
        const groupTags = this.filteredTags(group);

        return selectedTagsArray.every((tag) =>
          Object.values(groupTags).includes(tag)
        );
      });
      this.dialog = false;
    },
  },

  computed: {
    filteredTags() {
      return function (item) {
        return Object.entries(item.tagInfo).reduce((acc, [key, value]) => {
          if (value) {
            acc[key] = value;
          }
          return acc;
        }, {});
      };
    },

    categorizedTags() {
      return this.groupList.reduce((categories, group) => {
        Object.entries(group.tagInfo).forEach(([category, tag]) => {
          if (tag) {
            if (!categories[category]) {
              categories[category] = [];
            }
            if (!categories[category].includes(tag)) {
              categories[category].push(tag);
            }
          }
        });

        return categories;
      }, {});
    },
  },

  data() {
    return {
      search: "",
      headers: [
        { title: "#", key: "id" },
        { title: "Group name", key: "groupName" },
        { title: "members", key: "memberCount" },
        { title: "Owner", key: "ownerID" }, // Maybe change this field to owner name
        { title: "Description", key: "publicDescription" },
        { title: "Tags", key: "tags" },
        { title: "View Group", key: "viewGroup" },
      ],
      groupList: [],
      message: "",
      success: "",
      data: "",
      selectedTags: [],
      categoryNames: {
        gameName: "Game Name",
        region: "Region",
        language: "Language",
        playStyle: "Play Style",
        skillLevel: "Skill Level",
      },

      dialog: false,
    };
  },

  mounted() {
    this.getAllSearch();
  },
});
</script>
