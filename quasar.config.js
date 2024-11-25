/* eslint-env node */

const { configure } = require("quasar/wrappers");

module.exports = configure(function (/* ctx */) {
  return {
    boot: [
      "axios",
      "pinia", // añadimos pinia aquí
    ],

    css: ["app.scss"],

    extras: ["roboto-font", "material-icons"],

    build: {
      target: {
        browser: ["es2019", "edge88", "firefox78", "chrome87", "safari13.1"],
        node: "node20",
      },

      vueRouterMode: "hash",
      publicPath: "/WebScraping-Project/", // asegúrate que coincida con el nombre de tu repo
    },

    devServer: {
      open: true,
    },

    framework: {
      config: {},

      components: [
        "QLayout",
        "QHeader",
        "QDrawer",
        "QPageContainer",
        "QPage",
        "QToolbar",
        "QToolbarTitle",
        "QBtn",
        "QIcon",
        "QList",
        "QItem",
        "QItemSection",
        "QItemLabel",
        "QCard",
        "QCardSection",
        "QCardActions",
        "QInput",
        "QForm",
        "QSpinner",
        "QSpinnerFacebook",
        "QDialog",
        "QAvatar",
      ],

      directives: ["Ripple", "ClosePopup"],

      plugins: ["Notify", "Dialog", "Loading"],
    },

    animations: [],

    ssr: {
      pwa: false,
      prodPort: 3000,
      middlewares: ["render"],
    },

    pwa: {
      workboxMode: "generateSW",
      injectPwaMetaTags: true,
      swFilename: "sw.js",
      manifestFilename: "manifest.json",
      useCredentialsForManifestTag: false,
    },

    cordova: {},

    capacitor: {
      hideSplashscreen: true,
    },

    electron: {
      inspectPort: 5858,
      bundler: "packager",

      packager: {},

      builder: {
        appId: "webscraping-project",
      },
    },

    bex: {
      contentScripts: ["my-content-script"],
    },
  };
});
