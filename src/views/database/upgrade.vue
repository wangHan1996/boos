<template>
    <div id="upgrade">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
            <el-breadcrumb-item >谱库管理</el-breadcrumb-item>
            <el-breadcrumb-item >谱库升级</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main" v-loading="loading1">
            <el-button @click="openUpdate">升级谱库</el-button>
            <el-table :highlight-current-row="true" :border="true" style="margin-top:30px" :data="list">
                <el-table-column label="版本号" prop="code" header-align="center" align="center"></el-table-column>
                <el-table-column label="版本名称" prop="name" header-align="center" align="center"></el-table-column>
                <el-table-column label="版本描述" prop="description" header-align="center" align="center"></el-table-column>
                <el-table-column label="更新日期" prop="createTime" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" prop="" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button class="first" size="mini" type="danger" @click="deleteVersions(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :cp="cp" :total="total" :ps="ps" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
        </div>

        <el-dialog title="升级谱库" :visible.sync="dialogVisible" width="600px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form ref="addDatabase" id="addNew" :model="addDatabase" :rules="addDatabaseRules" label-width="100px">
                <el-form-item label="版本号：">
                    <el-input v-model="addDatabase.number"></el-input>
                </el-form-item>
                <el-form-item label="版本名称：" prop="name">
                    <el-input v-model="addDatabase.name"></el-input>
                </el-form-item>
                <el-form-item label="版本描述：">
                    <el-input type="textarea" :autosize="{ minRows: 2}" v-model="addDatabase.descirbe"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd('addDatabase')">取 消</el-button>
                <el-button type="primary" @click="sureAdd('addDatabase')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import API from '../../common/api'
import Pagination from '../../components/pagination'
export default {
  components: {Pagination},
  data () {
    return {
      loading1: false,
      list: [],
      cp: 1,
      total: 0,
      ps: 10,
      loading: false,
      dialogVisible: false,
      addDatabase: {
        number: '',
        name: '',
        descirbe: ''
      },
      addDatabaseRules: {
        name: [
          {required: 'true', message: '请输入版本名称', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    // 打开升级谱库窗口
    openUpdate () {
      this.dialogVisible = true
    },
    // 取消升级
    cancelAdd (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    // 确认升级
    sureAdd (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.update(formName)
        } else {
          return false
        }
      })
    },
    // 删除版本
    deleteVersions (id) {
      this.$confirm('是否删除该条目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.remove(id)
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
    getList () {
      this.loading1 = true
      let data = {
        'pn': this.cp,
        'ps': this.ps
      }
      this.API.get('/api/spectral/version/list', data)
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
    update (formName) {
      let data = {
        'code': this.addDatabase.number,
        'name': this.addDatabase.name,
        'description': this.addDatabase.descirbe
      }
      this.API.post('/api/spectral/version/add', data)
        .then((res) => {
          if (res.code == 0) {
            this.getList()
            this.$refs[formName].resetFields()
            this.dialogVisible = false
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
        .finally(() => {
          this.loading = false
        })
    },
    remove (id) {
      this.API.post('/api/spectral/version/delete/' + id)
        .then((res) => {
          if (res.code == 0) {
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
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
  created () {
    this.getList()
  }

}
</script>

<style scoped>
    #upgrade{
        text-align: left;
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    #upgrade #main{
        background-color: #fff;
        padding: 20px;
    }
    #upgrade #main .el-button{
        color:#fff;
        background-color: #798bf2;
    }
    #upgrade #main .first{
        color:#f56c6c;
        background-color:#fef0f0 ;
        border:1px solid #fbc4c4;
    }
</style>
