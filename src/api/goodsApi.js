let {
    request,
    ajax
} = require('../utils/request'); //引入二次封装的文件
const goodsUrl = '/goods'
// 获取所有数据
function getAll() {
    return request.get(goodsUrl + '/Allgoods');
}

// 分页获取数据
function getList({
    page = 1,
    size = 6,
    query = {},
    sort = ''
}) {
    // console.log(page, size, query, sort);
    return request.get(goodsUrl + '/list', {
        params: {
            page,
            size,
            query,
            sort
        }
    })
}

// 正则获取商品数据
function getRegList({page = 1, size = 10, query = {}, sort = ''}) {
    return request.get(goodsUrl + '/regList', {
        params: {
            page,
            size,
            query,
            sort
        }
    })
}

// 按商品id查询详情页数据,不是_id
function getDetail(id) {
    return request.get(goodsUrl + '/details/' + id)
}

//删除一个商品，根据_id
function delgood(id){
    return request.delete(goodsUrl + '/del/'+id)
}
/************ 购物车相关接口 ************/
//修改某用户购物车，有就是修改没有就是添加,id是商品id,不是_id
function addCar(username, id, goodsnum) {
    return request.put(cartUrl + '/addCar', {
        username,
        id,
        goodsnum
    })
}

//获取当前用户购物车数据
function getCar(username) {
    return request.get(cartUrl + '/getCar', {
        params: {
            username
        }
    })
};

//根据拼接的id获取多个数据
function getMany(ids){
    return request.get(goodsUrl + '/getmulti',{
        params:{ids}
    })
}

// 删除购物车单个商品,id是_id
function delOne(id) {
    return request.delete(cartUrl + '/del/' + id)
}

// 删除多个商品ids是用,拼接要删除的商品的_id
function delMany(ids) {
    return request.delete(cartUrl + '/delmulti', {
        data:{
            ids
        }
    })
}
// 功能：修改商品数量，参数:当前这条数据的_id，修改后的商品数量
function changeNum(id, goodsnum) {
    return request.put(cartUrl + `/update`, {
        _id:id,
        goodsnum,
    });
}

//功能：根据当前购物车数据的_id修改商品选中状态
function changeCheck(id,obj){
    return request.put(cartUrl + '/edit'+id,obj);
}

/************ 订单相关接口 ************/
// 功能：添加订单，想要添加什么字段就写什么参数
function addOrder(obj) {
    return request.post(orderUrl + '/add', obj);
}

// 功能：根据用户表中的用户id查询当前用户的订单
function getOrder(uid) {
    return request.get(orderUrl + '/getorder', {
        params: {
            uid
        }
    })
};

// 搜索页相关
const searchUrl = "/dev-api/news/recommend/seats/";
function getHotSearch(){
    return request.get(searchUrl+'?type=10')
}
//热门推荐
function getHotRecom(id){
    return request.get(`${searchUrl}${id}/goods?pageNo=1`)
}

// 功能：
export default {
    getAll,
    getList,
    getRegList,
    getDetail,
    addCar,
    getCar,
    delOne,
    delMany,
    changeNum,
    addOrder,
    getOrder,
    getHotSearch,
    getHotRecom,
    changeCheck,
    getMany,
    delgood,
}