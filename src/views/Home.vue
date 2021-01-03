<template>
  <div class="home_box">
    <el-button type="info"
    @click="logout">退出</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },

  components: {},

  methods: {
    /* 退出登录 */
    logout(){
        window.sessionStorage.removeItem('token');
        this.$router.push("/login");
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
