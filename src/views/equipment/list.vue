<template>
    <div id="equList">
        <!-- <h5>设备列表</h5> -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
            <el-breadcrumb-item >设备列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main">
            <div id="top">
                <el-select v-model="addressFirst" @change="firstChange" clearable>
                    <el-option v-for="item in areaList" :key="item.id" :value="item.id" :label="item.areaName"></el-option>
                </el-select>
                <el-select v-model="addressSecond" clearable>
                   <el-option  v-for="items in areaSonList" :key="items.id" :value="items.id" :label="items.areaName"></el-option>
                </el-select>
                <el-select v-model="uid" clearable>
                    <el-option v-for="(item,index) in companyList" :key="index" :label="item.companyName" :value="item.uid"></el-option>
                </el-select>
                <el-input v-model="serialNumber" placeholder="请输入序列号"></el-input>
                <el-button @click="query">查询</el-button>
            </div>
            <div id='bottom' v-loading="loading1">
                <el-table :data="equipmentList" border>
                    <el-table-column label="设备ID" prop="serialNumber" header-align="center" align="center"></el-table-column>
                    <el-table-column label="设备序列号" prop="deviceId" header-align="center" align="center"></el-table-column>
                    <el-table-column label="设备名称" prop="name" header-align="center" align="center"></el-table-column>
                    <el-table-column label="所属企业" prop="companyName" header-align="center" align="center"></el-table-column>
                    <el-table-column label="位置" prop="address" header-align="center" align="center"></el-table-column>
                    <el-table-column label="最后使用时间" prop="modifyTime" header-align="center" align="center"></el-table-column>
                    <el-table-column label="版本信息" prop="version" header-align="center" align="center"></el-table-column>
                    <el-table-column label="操作" prop="" header-align="center" align="center">
                        <template slot-scope="scope">
                            <el-button @click="viewInfo(scope.row)" size="mini">查看设备详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination :cp="cp" :total="total" :ps="ps" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
            </div>
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/pagination'
export default {
  components: {Pagination},
  data () {
    return {
      loading1: false,
      addressFirst: '',
      addressSecond: '',
      uid: '',
      serialNumber: '',
      cp: 1,
      ps: 10,
      total: 0,
      equipmentList: [],
      companyList: [],
      areaList: [],
      areaSonList: []
    }
  },
  methods: {
    // 查看详情
    viewInfo (val) {
      sessionStorage.setItem('info', JSON.stringify(val))
      this.$router.push('/equipmentDetails')
    },
    // 分页
    handleCurrentChange (val) {
      this.cp = val
      this.getList()
    },
    handleSizeChange (val) {
      this.ps = val
      this.getList()
    },
    // 获取列表
    getList () {
      this.loading1 = true
      let data = {
        'pn': this.cp,
        'ps': this.ps,
        'uid': this.uid,
        'serialNumber': this.serialNumber,
        'addressFirst': this.addressFirst,
        'addressSecond': this.addressSecond
      }
      this.API.post('/api/device/list', data)
        .then((res) => {
          if (res.code == 0) {
            this.total = res.data.total
            this.cp = res.data.current
            this.equipmentList = res.data.records
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
      this.cp = 1
      this.getList()
    },
    firstChange (val) {
      this.areaSonList = []
      for (let i = 0; i < this.areaList.length; i++) {
        if (this.areaList[i].id == val) {
          this.areaSonList = this.areaList[i].children
          this.addressSecond = ''
          return i
        }
      }
    },
    getCompanyList () {
      this.API.get('/api/company/listAll')
        .then((res) => {
          if (res.code == 0) {
            res.data.forEach((val, index) => {
              if (val.companyName != '') {
                this.companyList.push(res.data[index])
              }
            })
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
    }
  },
  mounted () {
    this.areaList = JSON.parse(sessionStorage.getItem('area'))
    this.getList()
    this.getCompanyList()
  }
}
</script>

<style scoped>
    #equList{
        text-align: left;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 20px;
        background-color: #ebeef5;
    }
    #equList #top .el-select,.el-input{
        width:15%;
    }
    #top{
        margin-bottom:30px
    }
    #top .el-button{
        color: #fff;
        background-color: #798bf2;
    }
    #bottom .el-button{
        background-color: #ecf5ff;
        color: #409eff;
        border: 1px solid #b3d8ff;
    }
    #main{
        background-color: #fff;
        padding: 20px;
        box-sizing: border-box;
    }
</style>
