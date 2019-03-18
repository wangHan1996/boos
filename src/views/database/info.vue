<template>
    <div id="info">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
            <el-breadcrumb-item :to="{ path: '/databaseList' }">谱库管理</el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/databaseList' }">谱库列表</el-breadcrumb-item>
            <el-breadcrumb-item>{{name}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main" v-loading="loading1">
            <h6>{{name}}</h6>
            <el-table :highlight-current-row="true" :border="true" style="margin-top:20px;" :data="list">
                <el-table-column label="物质" prop="name" header-align="center" align="center"></el-table-column>
                <el-table-column label="是否添加到手持设备" prop="result" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" prop="" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button class="second" size="mini" @click="editMatter(scope.row)">编辑</el-button>
                        <el-button class="first" size="mini" @click="deleteMatter(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :cp="cp" :total="total" :ps="ps" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
        </div>
        <el-dialog title="编辑"  :visible.sync="dialogVisible" width="500px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form label-width="140px">
                <el-form-item label="添加到手持设备：">
                    <el-radio-group v-model="editInfo.flag">
                        <el-radio :label='0'>否</el-radio>
                        <el-radio :label="1">是</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAmend">取 消</el-button>
                <el-button type="primary" @click="sureAmend" :loading="loading">确 定</el-button>
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
      dialogVisible: false,
      list: [],
      matter: {
        name: '',
        type: '',
        nub: '',
        HSCoding: '',
        formula: '',
        CASCoding: '',
        integralTime: '',
        power: '',
        intro: '',
        properties: '',
        fireControl: '',
        health: '',
        suggest: ''
      },
      matterRules: {
        name: [
          {required: 'true', message: '请输入中文名称', trigger: 'blur'}
        ],
        type: [
          {required: 'true', message: '请输入类别', trigger: 'blur'}
        ],
        nub: [
          {required: 'true', message: '请输入物品编号', trigger: 'blur'}
        ],
        HSCoding: [
          {required: 'true', message: '请输入HS编码', trigger: 'blur'}
        ],
        formula: [
          {required: 'true', message: '请输入分子式', trigger: 'blur'}
        ],
        CASCoding: [
          {required: 'true', message: '请输入CAS编码', trigger: 'blur'}
        ]
      },
      cp: 1,
      ps: 10,
      total: 0,
      id: null,
      name: '',
      loading: false,
      checked: false,
      editInfo: {
        flag: 0,
        id: 0
      }

    }
  },
  methods: {
    // 分页
    handleCurrentChange (val) {
      this.cp = val
      this.getList()
    },
    handleSizeChange (val) {
      this.ps = val
      this.getList()
    },
    // 删除分类
    deleteMatter (id) {
      this.$confirm('是否删除该物质？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.remove(id)
        })
    },
    remove (id) {
      this.API.post('/api/sepctral/deleteMaterials/' + id)
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
    },
    // 检测
    checkOut () {
      alert(1)
    },
    getList () {
      this.loading1 = true
      let data = {
        'pn': this.cp,
        'ps': this.ps,
        'cateid': this.id
      }
      this.API.get('/api/sepctral/list', data)
        .then((res) => {
          if (res.code == 0) {
            this.list = res.data.records
            this.total = res.data.total
            this.cp = res.data.current
            let result = ''
            this.list.forEach((val, index) => {
              if (this.list[index].handFlag == 1) {
                result = '是'
              } else if (this.list[index].handFlag == 0) {
                result = '否'
              }
              this.$set(this.list[index], 'result', result)
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
          this.loading1 = false
        })
    },
    editMatter (val) {
      this.editInfo.flag = val.handFlag
      this.editInfo.id = val.id
      this.dialogVisible = true
    },
    cancelAmend () {
      this.dialogVisible = false
      this.editInfo.flag = 0
      this.editInfo.id = 0
    },
    sureAmend () {
      this.loading = true
      this.edit()
    },
    edit () {
      this.API.post('/api/sepctral/updateHandFlag?id=' + this.editInfo.id + '&flag=' + this.editInfo.flag)
        .then((res) => {
          if (res.code == 0) {
            this.getList()
            this.dialogVisible = false
            this.editInfo.flag = 0
            this.editInfo.id = 0
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
    }
  },
  created () {
    this.id = sessionStorage.getItem('id')
    this.name = sessionStorage.getItem('name')
    this.getList()
  }
}
</script>

<style scoped>
    #info{
        text-align: left;
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    #info #main{
        background-color: #fff;
        padding: 20px;
    }
    #info #main .el-button{
        color: #fff;
        background-color: #798bf2;
    }
    #info .checkDiv{
        margin-left:20px;
    }
    h6{
        margin: 0;
        font-size: 16px;
        font-weight: bolder;
        line-height: 40px;
        text-align: center;
    }
    #info #main .first{
        background-color:#fef0f0;
        color:#f78181;
        border:1px solid #fbc4c4;
    }
    #info #main .second{
        background-color: #f0f9eb;
        color: #7dc35b;
        border: 1px solid #c2e7b0;
    }
</style>
