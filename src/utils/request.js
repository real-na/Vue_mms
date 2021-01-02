//axios二次封装:做一些公共的基础性设置
const axios = require('axios');
const url = process.env.VUE_APP_BASE_API;

const request = axios.create({
    baseUrl:url,
    timeout:5000,
});

module.exports = request;
//request==axios 但是又比axios多了一些基础设置