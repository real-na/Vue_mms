import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element";

// 入口文件中导入全局样式表
import "./assets/css/base.scss";

//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
//注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */)

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
