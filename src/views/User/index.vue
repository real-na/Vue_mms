<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加 -->
            <el-row :gutter="40">
                <el-col :span="10">
                    <el-input
                        placeholder="请输入内容"
                        v-model="queryInfo.query"
                        clearable
                        @clear="fetchUserData"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="fetchUserData"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addUser"
                        >添加用户</el-button
                    >
                    <!-- 添加用户的对话框 -->
                    <el-dialog :title="title"
                        :visible.sync="AddDialogVisible"
                        @close="AddDialogClosed"
                    >
                        <el-form :model="addForm" label-width="80px" 
                        :rules="addFormRules"
                        ref="addFormRef">
                            <el-form-item label="用户名"
                            prop="name">
                                <el-input v-model="addForm.name"></el-input>
                            </el-form-item>
                            <el-form-item label="密码"
                            prop="password">
                                <el-input v-model="addForm.password"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="addForm.email"></el-input>
                            </el-form-item>
                            <el-form-item label="手机" prop="tel">
                                <el-input v-model="addForm.tel"></el-input>
                            </el-form-item>
                        </el-form>
                        <div slot="footer" class="dialog-footer">
                            <el-button @click="AddDialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="AddDialogVisible = false">确 定</el-button>
                        </div>
                    </el-dialog>
                </el-col>
            </el-row>
            <!-- 用户列表 -->
            <el-table :data="listData" border style="width: 100%" class="mt-2">
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    prop="username"
                    label="姓名"
                    width="180"
                ></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column
                    prop="mobile"
                    label="电话"
                    width="180"
                ></el-table-column>
                <el-table-column
                    prop="role_name"
                    label="角色"
                ></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            @change="changeSwitch(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="240">
                    <template v-slot:="prop">
                        <el-button
                            type="primary"
                            icon="el-icon-edit"
                            size="mini"
                        ></el-button>
                        <el-button
                            type="warning"
                            icon="el-icon-delete"
                            size="mini"
                        ></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip
                            effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false"
                        >
                            <el-button
                                type="success"
                                icon="el-icon-s-tools"
                                size="mini"
                            ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-divider></el-divider>
            <!-- 分页 -->
            <el-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page="queryInfo.pagenum"
                background
                :page-sizes="[2, 4, 6]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>
    </div>
</template>

<script>
import userApi from "../../api/userApi";

export default {
    data() {
        let validateName = (rule,value,callback) =>{
            const regName = /^[a-z][a-z0-9]{2,9}/i;
            if(regName.test(value)){
                callback();
            }else{
                callback(new Error('用户名只能是字母和数字组成，并且字母开头,长度为3-10'));
            }
        };
        //验证邮箱
        let validateEmail = (rule,value,callback) =>{
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/i;
            if(regEmail.test(value)){
                callback();
            }else{
                callback(new Error('请输入合法的邮箱'));
            }
        };
        //验证手机号
        let validateTel = (rule,value,callback) =>{
            const regTel = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}/;
            if(regTel.test(value)){
                callback();
            }else{
                callback(new Error('请输入合法的手机号'));
            }
        };
        return {
            queryInfo: {
                query: "",
                pagenum: 1,
                pagesize: 2,
            },
            listData: [],
            total: 0,
            //控制添加用户对话框的显示与隐藏
            AddDialogVisible: false,
            addForm: {
                name: "",
                password: "",
                email: "",
                tel: "",
            },
            addFormRules: {
                name: [
                    {required: true,message: "用户名不能为空", trigger: "blur",},
                    { validator: validateName, trigger: 'blur' }
                ],password:[
                    {required: true,message: "密码不能为空", trigger: "blur",},
                    {min:6,max:15,message:"密码的长度在6-15个字符之间",trigger:"blur"}
                ],email:[
                    {required: true,message: "邮箱不能为空", trigger: "blur",},
                    { validator: validateEmail, trigger: 'blur' }
                ],tel:[
                    {required: true,message: "手机号不能为空", trigger: "blur",},
                    { validator: validateTel, trigger: 'blur' }
                ],
            },
            //弹出框的标题
            title:'添加用户',
        };
    },

    components: {},

    methods: {
        async fetchUserData() {
            const { data } = await userApi.getUserList(this.queryInfo);
            console.log("data=", data);
            if (data.meta.status !== 200)
                return this.$message.error("获取用户列表失败");

            this.listData = data.data.users;
            this.total = data.data.total;
        },
        //页数改变
        sizeChange(newSize) {
            console.log("newSize", newSize);
            this.queryInfo.pagesize = newSize;
            this.fetchUserData();
        },
        //当前页码改变
        currentChange(currentPage) {
            console.log("currentPage=", currentPage);
            this.queryInfo.pagenum = currentPage;
            4;
            this.fetchUserData();
        },
        //监听switch开关状态的改变
        async changeSwitch(rowInfo = {}) {
            const { id, mg_state } = rowInfo;
            //发请求修改数据库用户状态
            const { data } = await userApi.changeUserState(id, mg_state);
            if (data.meta.status !== 200) {
                rowInfo.mg_state = !mg_state;
                return this.$message.error("更新用户状态失败");
            }
            this.$message.success("更新用户状态成功!");
        },
        //监听添加用户对话框的关闭事件
        // AddDialogClosed(){
        //     this.$refs.addFormRef.resetFields();
        // },
        // 添加用户
        addUser(){
            this.AddDialogVisible = true;
            this.title = '添加用户';
            this.addForm = {
                name: "",
                password: "",
                email: "",
                tel: "",
            };
        }
    },

    created() {
        this.fetchUserData();
    },
};
</script>

<style scoped lang='scss'>
.el-table {
    font-size: 12px;
}
</style>