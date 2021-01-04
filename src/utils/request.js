//axios二次封装:做一些公共的基础性设置
const axios = require('axios');

const request = axios.create({
    baseURL:process.env.VUE_APP_SERVICE_URL,
    timeout:5000,
});

request.interceptors.request.use(config=>{
    // console.log("config=",config);
    config.headers.Authorization = window.sessionStorage.getItem('token');
   
    return config;
})
module.exports = request;
//request==axios 但是又比axios多了一些基础设置