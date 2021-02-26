let {ajax} = require('../utils/request');

//obj里面是其他查询条件，做模糊搜索用的，可以根据不同的条件查询
function getOrder(queryInfo){
    return ajax.get('/orders',{
        params:queryInfo
    })
};

//获取物流数据:804909574412544580专门用来测试
function getLogistics(){
    return ajax.get('/kuaidi/804909574412544580')
}

module.exports = {
    getOrder,
    getLogistics
}