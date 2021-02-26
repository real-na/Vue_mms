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

//定义一个全局的过滤器
Vue.filter('dateFormat',function(originVal){
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2,'0');
  const d = (dt.getDate() + '').padStart(2,'0');
  const h = (dt.getHours() + '').padStart(2,'0');
  const min = (dt.getMinutes() + '').padStart(2,'0');
  const s = (dt.getSeconds() + '').padStart(2,'0');
  return `${y}-${m}-${d} ${h}:${min}:${s}`
  // return new Date(originVal).toLocaleString('zh',{ hour12:false})
});
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
