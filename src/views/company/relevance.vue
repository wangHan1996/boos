<template>
    <div id="relevance">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
            <el-breadcrumb-item to="/companyManage">企业管理</el-breadcrumb-item>
            <el-breadcrumb-item >关联列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main" v-loading="loading1">
            <h1>{{name}}关联设备列表</h1>
            <div id="rows">
                <el-input v-model="inputWord" placeholder="请输入序列号"></el-input>
                <el-button @click="query">查询</el-button>
            </div>
            <el-table :data="list" :highlight-current-row="true" :border="true">
                <el-table-column label="设备序列号" prop="deviceId" header-align="center" align="center"></el-table-column>
                <el-table-column label="版本信息" prop="version" header-align="center" align="center"></el-table-column>
                <el-table-column label="位置信息" prop="address" header-align="center" align="center"></el-table-column>
                <el-table-column label="最近使用" prop="modifyTime" header-align="center" align="center"></el-table-column>
            </el-table>
            <Pagination :cp="cp" :total="total" :ps="ps" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/pagination'
export default{
  components: {Pagination},
  data () {
    return {
      loading1: false,
      name: '',
      uid: '',
      list: [],
      inputWord: '',
      cp: 1,
      ps: 10,
      total: 0
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.cp = val
      this.getList()
    },
    handleSizeChange (val) {
      this.ps = val
      this.getList()
    },
    getList () {
      this.loading1 = true
      let data = {
        'pn': this.cp,
        'ps': this.ps,
        'uid': this.uid,
        'serialNumber': this.inputWord
      }
      this.API.post('/api/device/list', data)
        .then((res) => {
          if (res.code == 0) {
            this.list = res.data.records
            this.total = res.data.total
            this.cp = res.data.current
          } else {
            this.$message({
              type: 'info',
              message: res.message
            })
          }
        })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err.message
          })
        })
        .finally(() => {
          this.loading1 = false
        })
    },
    query () {
      this.getList()
    }
  },
  created () {
    this.uid = sessionStorage.getItem('uid')
    this.name = sessionStorage.getItem('companyName')
    this.getList()
  }
}
</script>

<style scoped>
    #relevance{
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    #main{
        padding: 20px;
        background-color: #fff;
        text-align: left;
    }
    h1{
        margin-top: 0px;
        text-align: center;
    }
    #rows{
        margin-bottom:30px;
    }
    #rows .el-input{
        width: 20%;
    }
    #rows .el-button{
        color: #fff;
        background-color: #798bf2;
    }
</style>
