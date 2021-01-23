let {
    request,
    ajax
} = require('../utils/request'); //引入二次封装的文件

/* 检查用户名是否存在 */
function checkName(username) {
    return ajax.get('/checkname', {
        params: {
            name: username
        }
    })
}

/* 注册功能 */
function reg(username, password) {
    return request.post('/reg', {
        username,
        password
    })
};

/* 登录功能 */
function login(username, password) {
    return ajax.post('/login', {
        username,
        password
    })
}

/* 获取左侧菜单数据 */
function getMenus() {
    return ajax.get('/menus')
}

/* 获取用户列表数据 */
function getUserList({
    page = 1,
    size = 15,
    query = {},
    sort = ''
}) {
    return request.get('/user/list', {
        params: {
            page,
            size,
            query,
            sort
        }
    })
}

/* 正则获取用户列表数据 */
function getRegList({
    page = 1,
    size = 15,
    query = {},
    sort = ''
}) {
    return request.get('/user/regList', {
        params: {
            page,
            size,
            query,
            sort
        }
    })
}

/* 删除某一个用户 */
function delUser(id){
    return request.delete('/user/del/'+id)
}
/* 修改用户状态 */
function changeUserState(id, mg_state) {
    return request.put(`/user/edit/` + id, {
        mg_state
    })
}

module.exports = {
    checkName,
    reg,
    login,
    getMenus,
    getUserList,
    changeUserState,
    getRegList,
    delUser
}