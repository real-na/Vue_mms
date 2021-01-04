import Vue from 'vue';
import {
    Button,
    Form,
    FormItem,
    Input,
    Icon,
    Container,
    Header,
    Aside,
    Main,
    Menu,
    Submenu,
    MenuItem,
} from 'element-ui';

import {Message} from 'element-ui';
Vue.prototype.$message = Message;

/* 按需引入 */
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Icon);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
