const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    host: "localhost",
    allowedHosts: "all",
    port: 8080, //frontend
    https: false,
    proxy: {
      //api will get proxy to the correct port of 8081
      // ALL API PATH MUST START WITH /api
      "/api": { target: "http://localhost:8081" },
    },
    headers: {
      // typical header settings
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
