<template>
    <el-container class="home_box">
        <!-- 头部区域 -->
        <el-header height="80px">
            <div class="title">
                <img src="../assets/image/og7.jpg" alt="" />
                <span>电商后台管理系统</span>
            </div>
            <el-button type="danger" @click="logout">退出</el-button>
        </el-header>
        <!-- 主题区域 -->
        <el-container class="content">
            <!-- 左侧侧边栏 -->
            <el-aside :width="isShowMenu?'64px':'240px'">
                <!-- 折叠和展开左侧侧边栏的按钮 -->
                <div class="toggle-button"
                @click="showMenu">|||</div>
                <el-menu
                    @open="handleOpen"
                    @close="handleClose"
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409eff"
                    unique-opened
                    router
                    :collapse="isShowMenu"
                    :collapse-transition = "false"
                    :default-active="'/'+activePath"
                >
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id+''" 
                    v-for="item in menulist"
                    :key="item.id">
                        <!-- 一级菜单的模板区 -->
                        <template slot="title">
                            <i :class="iconObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subItem.path"
                        v-for="subItem in item.children"
                        :key="subItem.id"
                        @click="saveNavState(subItem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                        <!-- <el-menu-item index="1-2">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>选项二</span>
                            </template>
                        </el-menu-item> -->
                    </el-submenu>
                    <!-- 一级 -->
                </el-menu>
            </el-aside>
            <!-- 右侧主题内容 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import userApi from '../api/userApi';
export default {
    data() {
        return {
            // 左侧菜单数据
            menulist:[],
            //左侧一级菜单小图标
            iconObj:{
                '125':'el-icon-s-custom',
                '103':'el-icon-s-home',
                '101':'el-icon-s-shop',
                '102':'el-icon-s-order',
                '145':'el-icon-s-data',
            },
            //是否折叠左侧菜单
            isShowMenu:false,
            //当前被激活的链接
            activePath:'',
        };
    },

    components: {},

    methods: {
        /* 退出登录 */
        logout() {
            window.sessionStorage.removeItem("token");
            this.$router.push("/login");
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        /* 获取左侧菜单数据 */
        async fetchMenus(){
            const {data} = await userApi.getMenus();
            //获取到数据以后就应该把获取到的数据立即挂载到data中
            if(data.meta.status !== 200) return this.$message.error(res.meta.msg);
            this.menulist = data.data;
        },
        /* 折叠和展示左侧菜单 */
        showMenu(){
            this.isShowMenu=!this.isShowMenu;
            //除了改变这个状态，还需要对左侧的宽度进行动态赋值
        },
        /* 点击改变二级菜单激活状态 */
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath);
            this.activePath = activePath;
        }
    },

    created(){
        //页面一加载就获取左侧菜单数据
        this.fetchMenus();
        //home组件一创建就获取当前被激活链接的值
        this.activePath = window.sessionStorage.getItem('activePath');
    }
};
</script>

<style scoped lang='scss'>
.home_box {
    width: 100%;
    height: 100%;
    .el-header {
        width: 100%;
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-left: 0;
        .title {
            width: 600px;
            height: 100%;
            display: flex;
            align-items: center;
            font-size: 20px;
            color: #fff;
            img {
                height: 100%;
                margin-right: 20px;
            }
        }
    }
    .content{
        overflow: hidden;
        .el-aside {
            background-color: #333744;
            scrollbar-width:none; /* firefox */
            -ms-overflow-style:none; /* IE 10+ */
            overflow-y: auto;
            &::-webkit-scrollbar{
                display: none; /* Chrome Safari */
            }
            .toggle-button{
                background-color: #4a5064;
                font-size: 10px;
                line-height:30px;
                color: #fff;
                text-align: center;
                letter-spacing: 0.2em;
                cursor: pointer;
            }
            .el-menu{
               border-right:none; 
            }
        }
        .el-main {
            background-color: #eaedf1;
        }
        
    }
}
</style>
