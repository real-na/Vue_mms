let request = require('../utils/request'); //引入二次封装的文件

/* 检查用户名是否存在 */
function checkName(username){
    return request.get('/checkname',{
        params:{
            name:username
        }
    })
}

/* 注册功能 */
function reg(username,password){
    return request.post('/reg',{
        username,
        password
    })
};

/* 登录功能 */
function login(username,password){
    return request.post('login',{
            username,
            password
        }
    )
}

module.exports = {
    checkName,
    reg,
    login
}