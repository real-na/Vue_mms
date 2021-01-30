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

//新增商品（可上传商品图片数组）接收一个formData对象
function addGoods(formData){
    return request.post(goodsUrl + '/addgoods',formData,{
        headers: {
        "Content-Type": "multipart/form-data;charset=utf-8"
      }})
}

// 功能：
export default {
    getAll,
    getList,
    getRegList,
    getDetail,
    addGoods,
    delgood,
}