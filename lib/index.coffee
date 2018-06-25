Vue = require "vue"
if Vue.default?
  Vue = Vue.default

Vue.component "marked", require("./marked.vue").default
Vue.component "dagre",  require("./dagre.vue").default
