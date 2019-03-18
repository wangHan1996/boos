<template>
    <div id="authority">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
            <el-breadcrumb-item >用户权限管理</el-breadcrumb-item>
            <el-breadcrumb-item >管理员账号</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main" v-loading="loading1">
            <el-button @click="openAdd">添加账号</el-button>
            <el-table :border="true" :highlight-current-row="true" style="margin-top:30px" :data="list">
                <el-table-column label="账号" prop="username" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" prop="" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" class="first" @click="editUser(scope.row)">编辑</el-button>
                        <el-button size="mini" class="second" @click="deleteUser(scope.row.uid)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :cp="cp" :total="total" :ps="ps" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
        </div>
        <el-dialog :title="dialogName" :visible.sync="dialogVisible" width="400px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form ref="addUser" :model="addUser" :rules="addUserRules" label-width="100px">
                <el-form-item label="角色名称：" prop="role">
                    <el-select v-model="addUser.role" clearable>
                        <el-option v-for="item in list1" :key="item.id" :value="item.id" :label="item.nameZh"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号：" prop="admin">
                    <el-input v-model="addUser.admin"></el-input>
                </el-form-item>
                <el-form-item label="密码：">
                    <el-input type="password" v-model="addUser.password"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd('addUser')">取 消</el-button>
                <el-button type="primary" @click="sureAdd('addUser')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from '@/components/pagination'
export default{
  components: {Pagination},
  data () {
    return {
      loading1: false,
      cp: 1,
      ps: 10,
      total: 0,
      loading: false,
      dialogVisible: false,
      dialogName: '',
      addUser: {
        role: '',
        admin: '',
        password: '',
        uid: ''
      },
      list: [],
      list1: [],
      addUserRules: {
        role: [
          {required: 'true', message: '请选择角色', trigger: 'change'}
        ],
        admin: [
          {required: 'true', message: '请输入账号', trigger: 'blur'},
          {min: 1, max: 32, message: '长度位1~32位字符', trigger: 'blur'}
        ],
        password: [
          {required: 'true', message: '请输入密码', trigger: 'blur'},
          {min: 4, max: 32, message: '长度为4~32位字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 打开添加用户窗口
    openAdd () {
      this.dialogName = '添加用户'
      this.getList1()
    },
    // 取消添加用户
    cancelAdd (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
      this.addUser.admin = ''
      this.addUser.password = ''
      this.addUser.role = ''
      this.addUser.uid = ''
      console.log(1)
    },
    // 确认添加用户
    sureAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.updateAdmin(formName)
        } else {
          return false
        }
      })
    },
    // 添加或修改接口
    updateAdmin (formName) {
      let data = {
        'username': this.addUser.admin,
        'password': this.addUser.password,
        'roleId': this.addUser.role,
        'uid': this.addUser.uid
      }
      this.API.post('/api/admin/user/update', data)
        .then((res) => {
          if (res.code == 0) {
            this.getList()
            this.dialogVisible = false
            this.$refs[formName].resetFields()
            this.addUser.admin = ''
            this.addUser.password = ''
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
          this.loading = false
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
    // 编辑用户
    editUser (val) {
      this.dialogName = '编辑用户'
      this.addUser.admin = val.username
      this.addUser.password = val.password
      this.addUser.role = val.roleId
      this.addUser.uid = val.uid
      this.getList1()
    },
    // 删除用户
    deleteUser (id) {
      this.$confirm('是否删除该用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.remove(id)
        })
    },
    getList () {
      this.loading1 = true
      let data = {
        'pn': this.cp,
        'ps': this.ps
      }
      this.API.get('/api/admin/user/list', data)
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
    remove (id) {
      this.API.post('/api/admin/user/delete' + '?id=' + id)
        .then((res) => {
          if (res.code == 0) {
            console.log(res)
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getList()
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
    getList1 () {
      this.API.get('/api/menu/listRole?type=0')
        .then((res) => {
          if (res.code == 0) {
            this.list1 = res.data
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
    }
  },
  created () {
    this.getList()
  }
}
</script>

<style scoped>

    #authority{
        text-align: left;
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    #authority .el-checkbox{
        width:100%;
    }
    #authority .el-checkbox+.el-checkbox{
        margin-left:0;
    }
    #main{
        padding: 20px;
        background-color:#fff;
    }
    #main .el-button{
        color: #fff;
        background-color: #798bf2;
    }
    #main .first{
        background-color:#f0f9eb;
        color:#7dc35b;
        border: 1px solid #c2e7b0;
    }
    #main .second{
        background-color:#fef0f0;
        color:#f66c96;
        border: 1px solid #fbc4c4;
    }
</style>
