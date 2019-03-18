<template>
    <div id="menu">
        <el-menu
                :default-active="PATH"
                class="el-menu-vertical-demo"
                background-color="#3c4557"
                text-color="#fff"
                :router='true'
                active-text-color="#798bf2">
                <template v-for="(item,ind) in list">
                    <el-submenu :index="String(ind)" v-if="item.children" :key="ind">
                        <template slot="title">
                        <img v-if="item.name=='设备管理'" src="../../static/image/tb01.png">
                        <img v-if="item.name=='谱库管理'" src="../../static/image/tb03.png">
                        <img v-if="item.name=='用户权限管理'" src="../../static/image/tb05.png">
                        <img v-if="item.name=='身份证核验管理'" src="../../static/image/tb1.png">
                        <span>{{item.name}}</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item style="padding-left:60px;font-size:14px"  v-for="(items,indexs) in item.children" :key="indexs" :index="items.path">{{items.name}}</el-menu-item>
                        </el-menu-item-group>
                    </el-submenu>
                    <el-menu-item :index="item.path" :key="ind" v-if="!item.children">
                        <img v-if="item.name=='数据研判'" src="../../static/image/tb02.png">
                        <img v-if="item.name=='企业管理'" src="../../static/image/tb04.png">
                        <img v-if="item.name=='版本管理'" src="../../static/image/tb06.png">
                        <img v-if="item.name=='关于我们'" src="../../static/image/tb2.png">
                        <span slot="title">{{item.name}}</span>
                    </el-menu-item>
                </template>
        </el-menu>
    </div>

</template>

<script>
export default{
  computed: {
    PATH () {
      if (this.$route.path == '/equipmentDetails') {
        return '/equipmentList'
      } else if (this.$route.path == '/companyRelevance') {
        return '/companyManage'
      } else if (this.$route.path == '/databaseInfo') {
        return '/databaseList'
      } else {
        return this.$route.path
      }
    }
  },
  props: ['list']

}
</script>

<style>
    #menu{
        width:220px;
        height:100%;
        background-color:#29303a;
        text-align: left;
    }
    #menu .el-menu-item{
        font-size:16px;
        font-weight: 410;
    }
    #menu .el-submenu__title{
        font-size:16px;
    }
    #menu .iconfont{
        color:#fff;
    }
    #menu .iconfont{
        color:#68707d;
        padding-right: 10px;
        font-size: 25px;
    }
    #menu img{
        margin-right: 10px;
    }
    #menu .el-menu-item-group__title{
        padding: 0;
    }
    #menu li.is-active {
    background: #303646!important;
}
</style>
