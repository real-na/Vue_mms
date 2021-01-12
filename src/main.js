import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element";

// 入口文件中导入全局样式表
import "./assets/css/base.scss";

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
