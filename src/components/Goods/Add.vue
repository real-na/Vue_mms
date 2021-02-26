<template>
  <div>
    <!-- 面包屑导航区域 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
        <!-- 提示区域 -->
        <el-alert title="添加商品信息"
            type="info" center show-icon :closable="false"></el-alert>
        <!-- 步骤条 -->
        <el-steps :space="200" :active="activeStep - 0" finish-status="success"
        class="m-4"
        align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
        </el-steps>

<!-- 所有的步骤都要用一个form表单+包裹 -->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
        <!-- 左边tab栏 -->
        <el-tabs tab-position="left"
        v-model="activeStep" @tab-click="changeTab"
        :before-leave="beforeTabLeave">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item prop="goodsName" label="商品名称">
              <el-input v-model="addForm.goodsName"></el-input>
            </el-form-item>
            <el-form-item prop="salePrice" label="商品价格">
              <el-input v-model="addForm.salePrice" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goodsBrand" label="商品品牌">
              <el-input v-model="addForm.goodsBrand"></el-input>
            </el-form-item>
            <el-form-item prop="goodsStandard" label="商品单位">
              <el-input v-model="addForm.goodsStandard"></el-input>
            </el-form-item>
            <el-form-item prop="goodsType" label="商品来源">
              <el-select v-model="addForm.goodsType" placeholder="请选择商品来源">
                <el-option label="自营商品" value="0"></el-option>
                <el-option label="代发商品" value="1"></el-option>
              </el-select>
            </el-form-item>
            <!-- 多级联动 -->
            <el-form-item prop="typeList" label="商品类型">
              <el-cascader
                v-model="addForm.typeList"
                :options="typeOptions"
                :props="typeProps"
                @change="typeChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in storeData" :key="item.name" :label="item.name" prop="goodsStore">
                <template v-if="item.name === '存储条件'">
                   <el-radio 
                   v-for="(enev,index) in item.goodsEnev" 
                   :key="index" v-model="chooseEnv" :label="index"
                   @change="enevChange">{{enev}}</el-radio>
                </template>
                <template v-else>
                  <el-checkbox-group v-model="addForm.goodsTip">
                    <el-checkbox :label="tip"
                    v-for="(tip,idx) in addForm.goodsTip"
                    :key="idx" border></el-checkbox>
                  </el-checkbox-group>
                </template>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="其他信息" name="2">
            <el-form-item label="商品商场价" prop="mallPrice">
              <el-input v-model="addForm.mallPrice"></el-input>
            </el-form-item>
            <el-form-item label="商品零售价" >
              <el-input v-model="addForm.retailPrice" prop="retailPrice"></el-input>
            </el-form-item>
            <el-form-item label="商品供应价" >
              <el-input v-model="addForm.supplyPrice" prop="supplyPrice"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :http-request="uploadFile"
              multiple>
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.slogan">
            </quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
        </el-form>
    </el-card>
  </div>
</template>

<script>
import {typeOptions,storeData,otherAttr} from '../../assets/json/navList';
import goodsApi from '../../api/goodsApi';
export default {
  name:'',
  data () {
    return {
      //当前步骤
      activeStep:'0',
      storeData,
      //添加商品的表单数据对象
      addForm:{
        goodsName:'',
        salePrice:null,
        goodsBrand:'',
        goodsStandard:'',
        typeList:[],
        //商品储存环境
        goodsStore:storeData[0].goodsEnev[0],
        goodsTip:storeData[1].goodsTip,
        //商品mallPrice,零售价,进价
        mallPrice:null,
        retailPrice:null,
        supplyPrice:null,
        slogan:'',
      },
      //添加商品的表单验证规则
      addFormRules:{
        goodsName:[{required:true,message:'请输入商品名称',trigger:'blur'}],
        salePrice:[{required:true,message:'请输入商品售价',trigger:'blur'}],
        goodsBrand:[{required:true,message:'请输入品牌名称',trigger:'blur'}],
        goodsType:[{required:true,message:'请选择商品来源',trigger:'blur'}],
        typeList:[{required:true,message:'请选择商品类型',trigger:'blur'}],
      },
      //商品类型多级联动数据
      typeOptions,
      typeProps:{ expandTrigger: 'hover',
      label:'name',value:'id',children:'item' },
      //当前选中的存储环境
      chooseEnv:0,
      //其他静态属性
      otherAttr,
      // uploadURL:'http://47.98.112.14:3010/goods/action',
      //存储上传的图片信息
      picForm:[],
      formdata:new FormData(),
    }
  },

  components: {},

  methods: {
    //侧边栏切换
    changeTab(value){
      // console.log(value); //当前点击组件实例
      // console.log(this.activeStep); //当前对应的name名称
      if(this.activeStep === 2){
        //表示访问的是其他属性面板，调别人的接口，获取到有那些其他属性
      }
    },
    //侧边栏切换之前
    beforeTabLeave(newtabName,oldtabName){
      let {typeList} = this.addForm;
      
      if(oldtabName === '0'&&  typeList.length !== 2){
        this.$message.error('请选择商品分类');
        return false;
      }
    },
    //多级联动选中项发生改变
    typeChange(nowType){
      console.log(nowType);
      console.log("选中的",this.addForm.typeList);
    },
    //选中环境变化时把当前环境赋值给addForm中的数据
    enevChange(nowEnev){
      // console.log(nowEnev);
      this.addForm.goodsStore = this.storeData[0].goodsEnev[nowEnev];
    },
    //选中的goodsTip发生改变
    // checkboxChange(value){
    //   console.log(value);
    //   console.log(this.addForm.goodsTip);
    // },
    //点击图片预览
    handlePreview(){

    },
    //处理移除图片的操作
    handleRemove(file){
      //file:当前移除的图片
      //fileList:移除后剩余的图片数组
      // console.log("removefile",file);
      this.picForm = this.picForm.filter(item=>{
        return item.uid !== file.raw.uid;
      });
    },
    //自定义上传行为
    async uploadFile(file){
      // this.formdata.append('goodsImg',file.file);
      this.picForm = [...this.picForm,file.file];
      // console.log("picForm=",this.picForm);
    },
    addGood(){
      // console.log("addForm=",this.addForm);
      // console.log("picForm=",this.picForm);
      this.$refs.addFormRef.validate(async (valid)=>{
        if(!valid)return this.$message.error('请填写必要的表单信息')
        //执行添加商品的业务逻辑
        const {goodsName,salePrice,goodsBrand,goodsStandard,goodsStore,goodsTip,mallPrice,retailPrice,supplyPrice,slogan} = this.addForm;
        let typeList = this.addForm.typeList.join(',');
        let formdata = new FormData();
        formdata.append('goodsName',goodsName);
        formdata.append('salePrice',salePrice);
        formdata.append('goodsBrand',goodsBrand);
        formdata.append('goodsStandard',goodsStandard);
        formdata.append('typeList',typeList);
        formdata.append('goodsStore',goodsStore);
        formdata.append('goodsTip',goodsTip);
        formdata.append('mallPrice',mallPrice);
        formdata.append('retailPrice',retailPrice);
        formdata.append('supplyPrice',supplyPrice);
        formdata.append('slogan',slogan);
        this.picForm.forEach(item=>{
          formdata.append('goodsImg',item);
        })
        // console.log("formdata=",this.formdata);
        let {data} = await goodsApi.addGoods(formdata);
        if(!data.flag)return this.$message.error('添加商品失败');
        this.$message.success('添加商品成功');
        this.$router.push('/goods')
      })
    },
  },
  computed:{
    // typeList(){
    //   if(this.addForm.typeList.length === 2){
    //     return this.addForm.typeList[1];
    //   }
    //   //没有二级分类id
    //   return null;
    // }
  }
}
</script>

<style scoped lang='scss'>
.el-steps{
  width: 100%;
  .el-step__title{
    font-size: 13px;
  }
}
.el-checkbox{
  margin: 5px !important;
}
.btnAdd{
  margin-top: 15px;
}
</style>