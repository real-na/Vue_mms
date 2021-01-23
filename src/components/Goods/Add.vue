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
                  <el-checkbox-group v-model="item.goodsTip">
                    <el-checkbox :label="tip"
                    v-for="(tip,idx) in item.goodsTip"
                    :key="idx" border></el-checkbox>
                  </el-checkbox-group>
                </template>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>

        </el-form>
    </el-card>
  </div>
</template>

<script>
import {typeOptions,storeData} from '../../assets/json/navList';

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
        salePrice:0,
        goodsBrand:'',
        goodsStandard:'',
        goodsType:'',
        typeList:[],
        //商品储存环境
        goodsStore:''
      },
      //添加商品的表单验证规则
      addFormRules:{
        goodsName:[{required:true,message:'请输入商品名称',trigger:'blur'}],
        salePrice:[{required:true,message:'请输入商品价格',trigger:'blur'}],
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
    }
  },

  components: {},

  methods: {
    //侧边栏切换
    changeTab(value){
      // console.log(value); //当前点击组件实例
      // console.log(this.activeStep); //当前对应的name名称
      if(this.activeStep === 1){
        //表示访问的是商品参数面板
      }
    },
    //侧边栏切换之前
    beforeTabLeave(newtabName,oldtabName){
      let {goodsName,goodsBrand,goodsType,typeList} = this.addForm;
      // let require = goodsName && goodsBrand && goodsType
      // console.log(!(goodsName && goodsBrand && goodsType));
      /* if(oldtabName === '0'&& !(goodsName && goodsBrand && goodsType && typeList.length == 2)){
        this.$message.error('请填写必填项');
        return false;
      } */
    },
    //多级联动选中项发生改变
    typeChange(nowType){
      console.log(nowType);
    },
    //选中环境变化时把当前环境赋值给addForm中的数据
    enevChange(nowEnev){
      this.addForm.goodsStore = this.storeData[0].goodsEnev[nowEnev];
    }
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
</style>