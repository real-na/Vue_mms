<template>
  <div class="goods-box">
    <!-- 面包屑导航区域 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <!-- 搜索与添加 -->
        <el-row :gutter="20">
            <el-col :span="16">
                <el-input placeholder="请输入内容" v-model="queryInfo.keyword"
                class="input-with-select"
                clearable
                @clear="fetchGoodsData">
                    <el-button slot="append" icon="el-icon-search"
                    @click="fetchRegGood"></el-button>
                </el-input>
            </el-col>
            <el-col :span="6">
                <el-button type="primary"
                @click="goAddPage">添加商品</el-button>
            </el-col>
        </el-row>
        <!-- 商品列表 -->
        <el-table :data="goodsList" border style="width: 100%" class="mt-2 goods-list">
            <el-table-column type="index"></el-table-column>
            <el-table-column
                prop="goodsName"
                label="商品名称"
                width="300"
            ></el-table-column>
            <el-table-column
                prop="salePrice"
                label="商品价格(元)"
                width="120"
            ></el-table-column>
            <el-table-column
                prop="goodsStandard"
                label="商品单位"
                width="120"
            ></el-table-column>
            <el-table-column
                prop="goodsType"
                label="商品来源"
                width="160">
                <template slot-scope="scope">
                    <span>{{scope.row.goodsType?'代发商品':'自营商品'}}</span>
                </template>
            </el-table-column>
             <el-table-column label="操作" width="180">
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
                        @click="delItem(prop.row._id)"
                    ></el-button>
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
import goodsApi from '../../api/goodsApi';
export default {
  name:'',
  data () {
    return {
        //商品数据
        goodsList:[],
        total:0,
        //查询条件
        queryInfo: {
            keyword: '',
            page: 1,
            size: 15,
        },
        //新增
        addFrom:{
            goodsName:'',
            goodsType:'',
            goodsStandard:'',
            salePrice:'',
        },
    }
  },

  components: {},

  methods: {
    //获取商品数据
    async fetchGoodsData() {
        const {keyword,page,size} = this.queryInfo;
        let query = {goodsName:keyword};
        const { data } = await goodsApi.getList({keyword,page,size});
        if (!data.flag)return this.$message.error("获取商品列表失败");
        this.goodsList = data.data;
        this.total = data.total;
    },
    //正则获取数据
    async fetchRegGood(){
        const {keyword,page,size} = this.queryInfo;
        let query = {goodsName:keyword};
        console.log(query);
        const {data} = await goodsApi.getRegList({page,size,query});
        console.log(data);
        if (!data.flag)return this.$message.error("查询用户失败");
        this.goodsList = data.data;
        this.total = data.total;
    },
    //页数改变
    sizeChange(newSize) {
        console.log("newSize", newSize);
        this.queryInfo.size = newSize;
        if(this.queryInfo.keyword){
            this.fetchRegGood();
            return;
        }
        this.fetchGoodsData();
    },
    //当前页码改变
    currentChange(currentPage) {
        console.log("currentPage=", currentPage);
        this.queryInfo.page = currentPage;
        if(this.queryInfo.keyword){
            console.log(1);
            this.fetchRegGood();
            return;
        }
        this.fetchGoodsData();
    },
    //删除当前商品
    async delItem(id){
        const confirmRes = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err);
        console.log("confirmRes",confirmRes);
        if(confirmRes !== 'confirm'){
            return this.$message.info('已取消删除');   
        }
        const {data} = await goodsApi.delgood(id);
        console.log(data);
        if(!data.flag){
            return this.$message.error('删除失败!');
        }
        this.$message.success('删除成功!');
        this.fetchGoodsData();
    },
    // 添加商品，跳转到新增商品界面
    goAddPage(){
        this.$router.push('/goods/add');
    }
  },
  created(){
      this.fetchGoodsData();
  }
}
</script>

<style scoped lang='scss'>
</style>