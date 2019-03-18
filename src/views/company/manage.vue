<template>
    <div id="manages">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
            <el-breadcrumb-item >企业管理</el-breadcrumb-item>
            <el-breadcrumb-item >企业列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main">
            <el-button @click="openAddCompany">新增企业</el-button>
            <div id="rows">
                <el-input v-model="inputWord" placeholder="请输入企业名称或账号或手机号码"></el-input>
                <el-button @click="query">查询</el-button>
            </div>
            <el-table :highlight-current-row="true" :border="true" :data="companyList" v-loading="loading1">
                <el-table-column label="企业名称" prop="companyName" header-align="center" align="center"></el-table-column>
                <el-table-column label="地址" prop="address" header-align="center" align="center"></el-table-column>
                <el-table-column label="联系方式" prop="phone" header-align="center" align="center"></el-table-column>
                <el-table-column label="账号" prop="username" header-align="center" align="center"></el-table-column>
                <el-table-column label="关联设备数" prop="count" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" prop="" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button @click="viewEquipment(scope.row)" size="mini" class="first">查看关联设备</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :cp="cp" :total="total" :ps="ps" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
        </div>
        <el-dialog title="新增企业" :visible.sync="dialogVisible" width="650px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form ref="addCompany" id="addNew" :model="addCompany" :rules="addCompanyRules" label-width="120px">
                <el-form-item label="企业名称：" prop="name">
                    <el-input v-model.trim="addCompany.name"></el-input>
                </el-form-item>
                <el-form-item label="账号：" prop="admin">
                    <el-input v-model.trim="addCompany.admin"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password">
                    <el-input type="password" v-model.trim="addCompany.password"></el-input>
                </el-form-item>
                <el-form-item label="联系方式：" prop="phone">
                    <el-input v-model="addCompany.phone"></el-input>
                </el-form-item>
                <el-form-item label="地址：" prop="select1">
                    <el-select v-model="addCompany.select1" @change="firstChange" clearable>
                        <el-option v-for="item in areaList" :key="item.id" :value="item.id" :label="item.areaName"></el-option>
                    </el-select>
                    <el-select v-model="addCompany.select2" @change="secondChange" clearable>
                         <el-option  v-for="items in areaSonList" :key="items.id" :value="items.id" :label="items.areaName"></el-option>
                    </el-select>
                    <el-select v-model="addCompany.select3" clearable>
                        <el-option  v-for="items in areaThirdList" :key="items.id" :value="items.id" :label="items.areaName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择关联设备" prop="equipment">
                    <div style="padding:20px;background-color:#f2f2f2;width:330px">
                        <el-input size="mini" v-model="search" placeholder="搜索序列号"  class="ruleForm">
                            <el-button slot="append" icon="el-icon-search" @click="queryQquipment"></el-button>
                        </el-input>
                        <el-checkbox-group v-model="addCompany.equipment" style="max-height:300px;overflow-y:auto;">
                            <el-checkbox v-for="(item , index) in equipmentList" :key="index" :label="item.deviceId">设备序列号：{{item.deviceId}}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd('addCompany')">取 消</el-button>
                <el-button type="primary" @click="sureAdd('addCompany')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from '@/components/pagination'
export default {
  components: {Pagination},
  data () {
    return {
      loading1: false,
      search: '',
      areaList: [],
      areaSonList: [],
      areaThirdList: [],
      inputWord: '',
      cp: 1,
      ps: 10,
      total: 0,
      loading: false,
      dialogVisible: false,
      addCompany: {
        name: '',
        admin: '',
        password: '',
        phone: '',
        select1: '',
        select2: '',
        select3: '',
        equipment: []
      },
      addCompanyRules: {
        name: [
          {required: true, message: '请输入企业名称', trigger: 'blur'},
          {min: 1, max: 32, message: '长度为1~32位字符', trigger: 'blur'}
        ],
        admin: [
          {required: true, message: '请输入账号', trigger: 'blur'},
          {min: 1, max: 32, message: '长度为1~32位字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 32, message: '长度为6~32位字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '请输入联系方式', trigger: 'blur'},
          {pattern: /^1[345678][0-9]{9}$/, message: '请输入正确的手机号码', trigger: 'blur'}
        ],
        select1: [
          {required: true, message: '请选择地区', trigger: 'change'}
        ],
        equipment: [
          {required: true, message: '请至少选择一个关联设备', trigger: 'change'}
        ]
      },
      companyList: [],
      equipmentList: []
    }
  },
  methods: {
    // 打开新增企业窗口
    openAddCompany () {
      this.getEquipment()
    },
    // 取消新增企业
    cancelAdd (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    // 确认新增企业
    sureAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.addCompanys(formName)
        } else {
          return false
        }
      })
    },
    // 新增企业接口
    addCompanys (formName) {
      let data = {
        'companyName': this.addCompany.name,
        'username': this.addCompany.admin,
        'password': this.addCompany.password,
        'phone': this.addCompany.phone,
        'addressFirst': this.addCompany.select1,
        'addressSecond': this.addCompany.select2,
        'addressThird': this.addCompany.select3,
        'deviceList': this.addCompany.equipment
      }
      this.API.post('/api/company/update', data)
        .then((res) => {
          if (res.code == 0) {
            this.getList()
            this.loading = false
            this.dialogVisible = false
            this.$refs[formName].resetFields()
            this.$message({
              type: 'success',
              message: res.message
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
    },
    // 查询设备
    queryQquipment () {
      this.getEquipment()
    },
    getList () {
      this.loading1 = true
      let data = {
        'pn': this.cp,
        'ps': this.ps,
        'key': this.inputWord
      }
      this.API.get('/api/company/list', data)
        .then((res) => {
          if (res.code == 0) {
            this.companyList = res.data.records
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
    // 分页
    handleCurrentChange (val) {
      this.cp = val
      this.getList()
    },
    handleSizeChange (val) {
      this.ps = val
      this.getList()
    },
    viewEquipment (val) {
      sessionStorage.setItem('uid', val.uid)
      sessionStorage.setItem('companyName', val.companyName)
      this.$router.push('/companyRelevance')
    },
    getEquipment () {
      this.API.get('/api/company/deviceList', {'deviceId': this.search})
        .then((res) => {
          if (res.code == 0) {
            this.equipmentList = res.data
            this.dialogVisible = true
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
          this.addCompany.select2 = ''
          this.addCompany.select3 = ''
          return i
        }
      }
    },
    secondChange (val) {
      this.API.get('/api/area/get', {'parentId': val})
        .then((res) => {
          if (res.code == 0) {
            this.areaThirdList = res.data
            this.addCompany.select3 = ''
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
  created () {
    this.getList()
    this.areaList = JSON.parse(sessionStorage.getItem('area'))
  }
}
</script>

<style>
    #manages{
        text-align: left;
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
        background-color: #ebeef5;
    }
    #manages .el-checkbox-group{
        background-color:#fff;
        padding-left:5px;
        margin-top:10px;
    }
    #manages #rows .el-input{
        width:25%;
    }
    #manages #rows{
        margin: 20px 0;
    }
    #manages #addNew .el-select{
        width:100px;
    }
    #manages #main{
        background-color: #fff;
        padding: 20px;
    }
    #manages #main .el-button{
        color: #fff;
        background-color: #798bf2;
    }
    #manages .el-checkbox:first-of-type{
        margin-left: 30px;
    }
    #manages #main .first{
        color: #409eff;
        background-color: #ecf5ff;
        border: 1px solid #b3d8ff;
    }
    #manages .el-form-item.is-error .ruleForm .el-input__inner{
        border-color: #dcdfe6;
    }
</style>
