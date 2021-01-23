//axios二次封装:做一些公共的基础性设置
const axios = require('axios');
const baseURL1 = 'http://47.98.112.14:3010/';
const ajax = axios.create({
    baseURL:process.env.VUE_APP_SERVICE_URL,
    timeout:3000,
});
const request = axios.create({
    baseURL:baseURL1,
    timeout:3000,
})

ajax.interceptors.request.use(config=>{
    // console.log("config=",config);
    config.headers.Authorization = window.sessionStorage.getItem('token');
   
    return config;
})
module.exports = {request,ajax};
//request==axios 但是又比axios多了一些基础设置