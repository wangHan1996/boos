<template>
    <div id="header">
        <div class="left"><img style="height:24px;margin-right:20px;" src="../../static/image/login/title.png"><span>拉曼光谱检测云平台</span></div>
        <div class="right">您好，{{useName}}
            <el-dropdown trigger="hover">
                <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><span @click="openAmendPassWord">修改密码</span></el-dropdown-item>
                    <el-dropdown-item><span @click="logOut">退出登录</span></el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

        <el-dialog title="修改密码" :visible.sync="passWordVisible" width="500px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form :model="password" ref="password" :rules="passwordRules" label-width="80px">
                <el-form-item label="原密码：" prop="pass1">
                    <el-input type="password" v-model="password.pass1"></el-input>
                </el-form-item>
                <el-form-item label="新密码：" prop="pass2">
                    <el-input type="password" v-model="password.pass2"></el-input>
                </el-form-item>
                <!-- <el-form-item label="新密码：" prop="pass3">
                    <el-input type="password" v-model="password.pass3"></el-input>
                </el-form-item> -->
            </el-form>
             <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAmend1('password')">取 消</el-button>
                <el-button type="primary" @click="sureAmend1('password')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default{
  data () {
    return {
      useName: 'admin',
      loading: false,
      passWordVisible: false,
      password: {
        pass1: '',
        pass2: '',
        passe: ''
      },
      passwordRules: {
        pass1: [
          {required: true, message: '请输入原密码', trigger: 'blur'},
          {min: 6, max: 32, message: '长度为6到32位字符', trigger: 'blur'}
        ],
        pass2: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {min: 6, max: 32, message: '长度为6~32位字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    logOut () {
      this.API.post('/api/logout').then((res) => {
        if (res.code == 0) {
          this.$router.push('/')
          this.$message({
            type: 'success',
            message: res.message
          })
        } else {
          this.$message({
            type: 'info',
            message: res,
            message
          })
        }
      })
        .catch((err) => {
          this.$message({
            type: 'error',
            message: err
          })
        })
    },
    openAmendPassWord () {
      this.passWordVisible = true
    },
    cancelAmend1 (formName) {
      this.$refs[formName].resetFields()
      this.passWordVisible = false
      this.password.pass1 = ''
      this.password.pass2 = ''
      this.password.pass3 = ''
    },
    sureAmend1 (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          let data = {
            'oldPwd': this.password.pass1,
            'newPwd': this.password.pass2
          }
          this.API.post('/api/updatePwd', data)
            .then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.passWordVisible = false
                this.$refs[formName].resetFields()
                this.password.pass1 = ''
                this.password.pass2 = ''
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
        } else {
          return false
        }
      })
    }
  },
  created () {
    this.useName = sessionStorage.getItem('userName')
  }
}
</script>

<style scoped>
    #header{
        width:100%;
        height:61px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color:#3f51b5;
        color:#fff;
    }
    #header .left{
        padding-left:20px;
        font-weight: 500;
        font-size:23px;
        display: flex;
        align-items: center;
        height: 100%;
    }
    #header .right{
        padding-right:50px;
        display: flex;
        /* justify-content: space-between; */
        align-items: center;
    }
    #header .el-dropdown{
        font-size: 22px;
        color:#fff;
    }
</style>
