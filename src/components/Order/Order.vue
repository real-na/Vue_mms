<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator=">">
        <el-breadcrumb-item :to="{ path: '/home' }"
            >首页</el-breadcrumb-item
        >
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="80"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status" width="80">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="80">
          
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentPageChange"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed">
      <el-form ref="addressFormRef" :model="addressForm" label-width="100px"
      :rules="addressFormRules">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            placeholder="请选择地址"
            :options="cityData"
            clearable
            v-model="addressForm.address1"
            @change="addressChange"
            class="address"></el-cascader>
        </el-form-item>
        <el-form-item label="具体地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部确定和取消按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureAddress">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度的进度对话框 -->
    <el-dialog
      title="物流进度"
      :visible.sync="progressVisible"
      width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>  
    </el-dialog>
  </div>
</template>

<script>
import orderApi from '../../api/orderApi';
import cityData from '../../assets/json/adress';
export default {
  name:'order',
  data () {
    return {
      //查询对象
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      total:0,
      orderList:[],
      addressVisible:false,
      addressForm:{
        address1:[],
        address2:''
      },
      addressFormRules:{
        address1:[
           { required: true, message: '请选择省市区县', trigger: 'blur' },
        ],
        address2:[
           { required: true, message: '请填写详细', trigger: 'blur' },
        ],
      },
      //省市区数据
      cityData,
      //物流进度
      progressVisible:false,
      progressInfo:[],
    }
  },

  components: {},

  methods: {
    async fetchOrder(){
      const {data:res} = await orderApi.getOrder(this.queryInfo);
      if(res.meta.status !== 200){
        return this.$message.console.error('获取订单列表失败');
      }
      console.log(res);
      this.total = res.data.total;
      this.orderList = res.data.goods;
    },
    // 每页条数改变
    sizeChange(nowSize){
      this.queryInfo.pagesize = nowSize;
      this.fetchOrder();
    },
    //当前页改变
    currentPageChange(nowPage){
      this.queryInfo.pagesize = nowPage;
      this.fetchOrder();
    },

    //选择的地址变化
    addressChange(){
      this.progressVisible = true;
    },
    //展示修改地址的对话框
    showBox(){
      this.addressVisible = true;
    },

    //确认修改地址
    sureAddress(){
      
    },

    //表单关闭就清空
    addressDialogClosed(){
      this.$refs.addressFormRef.resetFields()
    },

    //展示物流信息对话框
    async showProgressBox(){
      //1.发起请求获取物流数据
      const {data:res} = await orderApi.getLogistics();
      if(res.meta.status !== 200){
        return this.$message.error('获取物流进度失败')
      }
      //获取到物流信息绑定到data属性里面
      this.progressInfo = res.data;
      console.log("物流信息",res.data);
      this.progressVisible = true;
    }
  },
  created(){
    this.fetchOrder()
  }
}
</script>

<style scoped lang='scss'>
.el-cascader{
  width: 100%;
  
}
.el-cascader__dropdown{
    top: 230px !important;
    // left: 0;
    .el-cascader-menu{
        max-height: 200px;
    }
}
</style>