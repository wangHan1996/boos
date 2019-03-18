<template>
  <div id="hello">
    <el-header style="height:61px">
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside style="width:220px;">
        <Menu :list="list"></Menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Header from '../components/header'
import Menu from '../components/menu'
export default {
  components: {Header, Menu},
  name: 'Main',
  data () {
    return {
      list:[],
      areaList:[],
    }
  },
  methods:{
    menuList(){
      this.API.get('/api/menu/list').then((res)=>{
        if(res.code==0){
          this.list=res.data;
        }else{
          this.$message({
            type:'info',
            message:res.message
          })
        }
      })
      .catch((err)=>{
        this.$message({
          type:'error',
          message:err.message
        })
      })
    },
    getArea(){
        this.API.get('/api/area/list')
        .then((res)=>{
            if(res.code==0){
                this.areaList=res.data;
                sessionStorage.setItem('area',JSON.stringify(this.areaList));
            }else{
                this.$message({
                    type:'info',
                    message:res.message
                })
            }
        })
        .catch((err)=>{
            this.$message({
                type:'error',
                message:err.message
            }) 
        })
    },
  },
  created(){
    this.menuList();
    this.getArea();
  }
}
</script>

<style>
  #hello{
    height:100%;
    width:100%;
    background-color:#ebeef5;
  }
  #hello .el-header{
    padding:0;
    height:61px;
  }
  #hello .el-container{
    height:calc( 100% - 61px);
  }
  #hello .el-main{
    padding: 0;
    background-color: #ebeef5;
  }
</style>
