import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path:'/',
    redirect:'/login',
  },
  {
    path:'/login',
    component:()=>import("../views/Login.vue"),
  },{
    path:'/home',
    redirect:'/welcome',
    component:()=>import("../views/Home.vue"),
    children:[
      {
        path:"/users",
        component:()=>import("../views/User"),
      },{
        path:"/welcome",
        component:()=>import("../views/Home/Welcome.vue"),
      },{
        path:"/rights",
        component:()=>import("../views/Home/Welcome.vue"),
      },{
        path:"/roles",
        component:()=>import("../views/Home/Welcome.vue"),
      },{
        path:"/categories",
        component:()=>import("../views/Home/Welcome.vue"),
      },{
        path:"/params",
        component:()=>import("../views/Home/Welcome.vue"),
      },{
        path:"/goods",
        component:()=>import("../components/Goods/List.vue"),
      },{
        path:"/goods/add",
        component:()=>import("../components/Goods/Add.vue"),
      }
    ]
  },
];

const router = new VueRouter({
  routes
});

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  // console.log("to=",to);
  // console.log("from=",from);
  //to : 将要访问的路径
  //path : 代表从哪个路径跳转而来
  //next : 是一个函数，表示放行 next('/login')强制跳转
  if(to.path === '/login')return next(); //登录页不需要权限控制
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  if(!tokenStr) return next('/login'); //无token,跳到登录页
  next(); //有token，放行
})

export default router;
