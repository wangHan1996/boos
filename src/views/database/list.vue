<template>
    <div id='databaseList'>
        <!-- <h5>谱库列表</h5> -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
            <el-breadcrumb-item >谱库列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="echarts"></div>
        <div id="tables" v-loading="loading1">
            <h5>谱库列表</h5>
            <el-table :border="true" :highlight-current-row="true" :data="list">
                <el-table-column label="谱库类别" prop="name" align="center" header-align="center"></el-table-column>
                <el-table-column label="物质数量" prop="count" align="center" header-align="center"></el-table-column>
                <el-table-column label="操作" prop="" align="center" header-align="center">
                    <template slot-scope="scope">
                        <el-button class="first" size="mini" @click="viewInfo(scope.row)">查看</el-button>
                        <el-button class="second" size="mini" @click="openAmend(scope.row)">修改名称</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :cp="cp" :total="total" :ps="ps" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>

            <el-dialog title="修改谱库名称"  :visible.sync="dialogVisible" width="400px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <el-form label-width="100px" ref="amend" :model="newName" :rules="amendRules">
                    <el-form-item label="原名称：">
                        {{oldName}}
                    </el-form-item>
                    <el-form-item label="新名称：" prop="name">
                        <el-input v-model="newName.name"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelAmend('amend')">取 消</el-button>
                    <el-button type="primary" @click="sureAmend('amend')" :loading="loading">确 定</el-button>
                </span>
            </el-dialog>
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
      list: [],
      cp: 1,
      ps: 5,
      total: 0,
      loading: false,
      dialogVisible: false,
      oldName: '',
      id: null,
      newName: {
        name: ''
      },
      amendRules: {
        name: [
          {required: 'true', message: '请输入新名称', trigger: 'blur'}
        ]
      },
      xName: [],
      yName: []
    }
  },
  methods: {
    // 绘图
    drawChart () {
      var myChart = this.$echarts.init(document.getElementById('echarts'))
      myChart.setOption({
        title: {
          text: '谱库统计',
          left: 'center',
          textStyle: {
            color: '#000'
          }
        },
        xAxis: {
          type: 'category',
          name: '',
          data: this.xName,
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: '单位：百分比'
        },
        series: [{
          name: '',
          type: 'bar',
          barWidth: '40%',
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          },
          itemStyle: {
            color: (params) => {
              let colors = ['#2a96f9', '#fe9d8e', '#2a96f9', '#3cc6d0'],
                len = colors.length,
                mul = Math.floor(params.dataIndex / len)
              return colors[params.dataIndex - mul * len]
            }
          },
          data: this.yName
        }]
      })
    },
    // 打开修改类名窗口
    openAmend (val) {
      this.dialogVisible = true
      this.oldName = val.name
      this.id = val.id
    },
    // 取消修改类名
    cancelAmend (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    // 确认修改类名
    sureAmend (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.editTypaName(formName)
        } else {
          return false
        }
      })
    },
    // 分页
    handleCurrentChange (val) {
      this.cp = val
    },
    handleSizeChange (val) {
      this.ps = val
    },
    // 查看
    viewInfo (val) {
      sessionStorage.setItem('name', val.name)
      sessionStorage.setItem('id', val.id)
      this.$router.push('/databaseInfo')
    },
    getList () {
      this.loading1 = true
      this.API.get('/api/sepctral/countType')
        .then((res) => {
          if (res.code == 0) {
            this.list = res.data
            this.total = res.data.length
            this.xName = []
            this.yName = []
            let sum = 0
            this.list.forEach((val, index) => {
              this.xName.push(this.list[index].name)
              sum += this.list[index].count
            })
            this.list.forEach((val, index) => {
              this.yName.push(((this.list[index].count / sum) * 100).toFixed(2))
            })
            this.drawChart()
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
    editTypaName (formName) {
      let data = {
        'id': this.id,
        'name': this.newName.name
      }
      this.API.post('/api/sepctral/updateType', data)
        .then((res) => {
          if (res.code == 0) {
            this.loading = false
            this.$message({
              type: 'success',
              message: res.message
            })
            this.dialogVisible = false
            this.$refs[formName].resetFields()
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
    }
  },
  mounted () {
    this.getList()
  }
}
</script>

<style scoped>
    #databaseList{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 20px;
        background-color: #ebeef5
    }
    #echarts{
        width:100%;
        height:300px;
        padding-top:30px;
        background-color: #fff;
    }
    #tables{
        margin-top:30px;
        text-align: left;
        background-color: #fff;
        padding: 20px 20px 0;
    }
    h1{
        margin-top: 0;
        text-align: left;
    }
    .first{
        background-color:#ecf5ff;
        color:#409eff;
        border:1px solid #b3d8ff;
    }
    .second{
        background-color:#f0f9eb;
        color:#75bf51;
        border:1px solid #c2e7b0;
    }
    .third{
        background-color:#fef0f0;
        color:#f56c6c;
        border:1px solid #fbc4c4;
    }
</style>
