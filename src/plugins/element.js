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
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Divider,
    Pagination,
    Dialog,
    Avatar,
    Option,
    Select,
    Cascader,
    Upload,
    Alert,
    Step,
    Steps,
    TabPane,
    Tabs,Radio,
    Checkbox,
    CheckboxGroup,
    Tag,
    Timeline,
    TimelineItem,
} from 'element-ui';

import {Message,MessageBox} from 'element-ui';
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;
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
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Divider);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Avatar);
Vue.use(Option);
Vue.use(Select);
Vue.use(Cascader);
Vue.use(Upload);
Vue.use(Alert);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Radio);
Vue.use(CheckboxGroup);
Vue.use(Checkbox);
Vue.use(Tag);
Vue.use(Timeline);
Vue.use(TimelineItem);