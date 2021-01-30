<template>
    <div class="user-box">
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
            <el-row :gutter="20">
                <el-col :span="3">
                    <el-select v-model="currentOption" filterable placeholder="查询字段">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="10">
                    <el-input
                        placeholder="请输入查询内容"
                        v-model="queryInfo.keyword"
                        clearable
                        @clear="fetchUserData"
                    >
                        <el-button
                            slot="append"
                            icon="el-icon-search"
                            @click="fetchRegUser"
                        ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="2"><el-button type="success" @click="fetchUserData">重置</el-button></el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addUser">添加用户</el-button>
                    <!-- 添加用户的对话框 -->
                    <el-dialog :title="title"
                        :visible.sync="AddDialogVisible"
                        @close="AddDialogClosed"
                        class="add-user">
                        <el-form :model="addForm" label-width="80px" 
                        :rules="addFormRules"
                        ref="addFormRef">
                            <el-form-item label="用户名"
                            prop="username">
                                <el-input v-model="addForm.username"></el-input>
                            </el-form-item>
                            <el-form-item label="手机号"
                            prop="phone">
                                <el-input v-model="addForm.phone"></el-input>
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
                                <el-input v-model="addForm.email"></el-input>
                            </el-form-item>
                            <el-form-item label="性别" prop="sex">
                                <el-select v-model="addForm.sex" placeholder="性别">
                                    <el-option label="男" value="male"></el-option>
                                    <el-option label="女" value="female"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="地址" prop="address">
                                <el-cascader
                                    placeholder="请选择地址"
                                    :options="addressOption"
                                    clearable
                                    v-model="addForm.address"
                                    @change="addressChange"
                                    class="address"></el-cascader>
                            </el-form-item>
                            <el-form-item label="头像" prop="headpic">
                                    <el-upload
                                action="string"
                                list-type="picture-card"
                                :auto-upload="false"
                                :on-success="avatarSuccess"
                                :on-preview="avatarPreview"
                                :on-remove="avatarRemove">
                                    <i slot="default" class="el-icon-plus"></i>
                                    <div slot="file" slot-scope="{file}">
                                    <img
                                        class="el-upload-list__item-thumbnail"
                                        :src="file.url" alt=""
                                    >
                                    <span class="el-upload-list__item-actions">
                                        <span
                                        class="el-upload-list__item-preview"
                                        @click="handlePictureCardPreview(file)"
                                        >
                                        <i class="el-icon-zoom-in"></i>
                                        </span>
                                        <span
                                        v-if="!disabled"
                                        class="el-upload-list__item-delete"
                                        @click="handleRemove(file)"
                                        >
                                        <i class="el-icon-delete"></i>
                                        </span>
                                    </span>
                                    </div>
                                </el-upload>
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
            <el-table :data="listData" border style="width: 100%" class="mt-2 user-list">
                <el-table-column type="index"></el-table-column>
                <el-table-column
                    prop="username"
                    label="姓名"
                    width="100"
                ></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>
                <el-table-column
                    prop="phone"
                    label="手机号"
                    width="100"
                ></el-table-column>
                <el-table-column prop="sex" label="性别" width="60"></el-table-column>
                <el-table-column prop="headpic" label="头像" width="80">
                    <template slot-scope="scope">
                        <el-avatar size="large" :src="scope.row.headpic" v-if="scope.row.headpic"></el-avatar>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="100">
                    <template slot-scope="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            @change="changeSwitch(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="地址" prop="address">
                    
                </el-table-column>
                <el-table-column label="操作" width="240">
                    <template v-slot:="prop">
                        <el-button type="primary"
                            icon="el-icon-edit"
                            size="mini"
                        ></el-button>
                        <el-button type="warning"
                            icon="el-icon-delete"
                            size="mini"
                            @click="delUser(prop.row._id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip effect="dark"
                            content="分配角色"
                            placement="top"
                            :enterable="false" >
                            <el-button type="success"
                                icon="el-icon-s-tools"
                                size="mini" ></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-divider></el-divider>
            <!-- 分页 -->
            <el-pagination
                @size-change="sizeChange"
                @current-change="currentChange"
                :current-page="queryInfo.page"
                background
                :page-sizes="[15, 30, 40]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>
    </div>
</template>

<script>
import userApi from "../../api/userApi";
import addressOption from "../../assets/json/adress.js";

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
                keyword: '',
                page: 1,
                size: 15,
            },
            listData: [],
            total: 0,
            //控制添加用户对话框的显示与隐藏
            AddDialogVisible: false,
            addForm: {
                username: "",
                phone: "",
                address:[],
                email: "",
                sex: "male",
                avatar:'',
            },
            addFormRules: {
                username: [
                    {required: true,message: "用户名不能为空", trigger: "blur",},
                    { validator: validateName, trigger: 'blur' }
                ],email:[
                    {required: true,message: "邮箱不能为空", trigger: "blur",},
                    { validator: validateEmail, trigger: 'blur' }
                ],phone:[
                    {required: true,message: "手机号不能为空", trigger: "blur",},
                    { validator: validateTel, trigger: 'blur' }
                ],sex:[{required: true,message: "性别为必选项", trigger: "blur",}],
                address:[{required: true,message: "请选择地址", trigger: "blur",}]
            },
            //弹出框的标题
            title:'添加用户',
            //按照某个字段查询
            options:[{
                value:'username',
                label:'姓名'
            },{
                value:'phone',
                label:'手机号'
            },{
                value:'sex',
                label:'性别'
            },{
                value:'address',
                label:'地址'
            }],
            currentOption:'username',
            //选择地址
            addressOption,
        
            //上传头像
            formData:"",

        };
    },

    components: {},

    methods: {
        //获取数据
        async fetchUserData() {
            const {keyword,page,size} = this.queryInfo;
            let query = {username:keyword};
            const { data } = await userApi.getUserList({keyword,page,size});
            if (!data.flag)return this.$message.error("获取用户列表失败");
            this.listData = data.data;
            this.total = data.total;
        },
        //正则获取数据
        async fetchRegUser(){
            const {keyword,page,size} = this.queryInfo;
            console.log("currentOption=",this.currentOption);
            let query = {[this.currentOption]:keyword};
            const {data} = await userApi.getRegList({page,size,query});
            if (!data.flag)return this.$message.error("查询用户失败");
            this.listData = data.data;
            this.total = data.total;
        },
        //页数改变
        sizeChange(newSize) {
            this.queryInfo.size = newSize;
            if(this.queryInfo.keyword){
                this.fetchRegUser();
                return;
            }
            this.fetchUserData();
        },
        //当前页码改变
        currentChange(currentPage) {
            this.queryInfo.page = currentPage;
            if(this.queryInfo.keyword){
                this.fetchRegUser();
                return;
            }
            this.fetchUserData();
        },
        //监听switch开关状态的改变
        async changeSwitch(rowInfo = {}) {
            console.log(rowInfo);
            const { _id, mg_state } = rowInfo;
            //发请求修改数据库用户状态
            const { data } = await userApi.changeUserState(_id, mg_state);
            if (!data.flag) {
                rowInfo.mg_state = !mg_state;
                return this.$message.error("更新用户状态失败");
            }
            this.$message.success("更新用户状态成功!");
        },
        //监听添加用户对话框的关闭事件
        AddDialogClosed(){
            this.$refs.addFormRef.resetFields();
        },
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
        },
        //选中的地址改变
        addressChange(currentAddr){
            console.log("currentAddr=",currentAddr);
            // console.log("222",this.addForm.address);//跟上面是一样的
        },
        //头像上传成功
        avatarSuccess(response, file){
            //response:成功时保存一下后台给你返回的图片，可以渲染到页面上
            this.addForm.avatar = URL.createObjectURL(file.raw);
        },

        handleRemove(file) {
            console.log(file);
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },

        //删除用户
        async delUser(id){
            const confirmRes = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).catch(err=>err);
            console.log("confirmRes",confirmRes);
            if(confirmRes !== 'confirm'){
                return this.$message.info('已取消删除');   
            }
            const {data} = await userApi.delUser(id);
            console.log(data);
            if(!data.flag){
                return this.$message.error('删除失败!');
            }
            this.$message.success('删除成功!');
            this.fetchGoodsData();
        }
    },

    created() {
        this.fetchUserData();
    },
};
</script>

<style lang='scss'>
.user-box{
    .el-table {
    font-size: 12px;
    }
}
.el-cascader__dropdown{
    // top: 483px !important;
    left: 0;
    .el-cascader-menu{
        max-height: 200px;
    }
}
</style>