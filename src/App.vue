<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
  font-size:14px;
  height:100%;
  width:100%;
}
html,body{
  padding:0;
  margin:0;
  height:100%;
  width:100%;
}
.el-breadcrumb{
  font-size: 16px;
}
.el-breadcrumb__inner.is-link{
  font-weight: 400;
}
h1{
  font-size: 18px;
}
h5{
  font-size: 17px;
  font-weight: bolder;
  margin: 0;
  text-align: left;
  padding-bottom: 20px;
}
.el-dialog__body,.el-dialog--center .el-dialog__body{
  padding:25px 10% 35px;
}
p{
  margin: 0;
}
</style>
