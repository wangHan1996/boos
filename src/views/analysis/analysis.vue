<template>
    <div id="analysis">
        <!-- <h5>数据研判</h5> -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
            <el-breadcrumb-item >数据研判</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main">
            <div id="top">
                <el-input v-model="inputWord" placeholder="请输入设备序列号"></el-input>
                <el-select v-model="status" clearable>
                    <el-option v-for="item in statusList" :key="item.code" :label="item.msg" :value="item.code"></el-option>
                </el-select>
                <el-button @click="query">查询</el-button>
            </div>
            <div id="tables" v-loading="loading1">
                <el-table :border="true" :highlight-current-row="true" :data="list" :header-row-style="{backgroundColor:'red'}">
                    <el-table-column label="上报时间" prop="createTime" header-align="center" align="center"></el-table-column>
                    <el-table-column label="设备序列号" prop="deviceId" header-align="center" align="center"></el-table-column>
                    <el-table-column label="研判时间" prop="judgeTime" header-align="center" align="center"></el-table-column>
                    <el-table-column label="研判结果" header-align="center" align="center">
                        <template slot-scope="scope">
                                <span :style="{color:scope.row.color}">{{scope.row.result}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" prop="" header-align="center" width="265">
                        <template slot-scope="scope">
                            <el-button class="first" v-if="scope.row.status==4"  size="mini" @click="openLabour(scope.row)">人工研判</el-button>
                            <el-button class="second" v-if="scope.row.status!=3&&scope.row.status!=4" size="mini" @click="openResult(scope.row)">查看结果</el-button>
                            <el-button class="third" size="mini" @click="deleteRecord(scope.row.id)">删除</el-button>
                            <el-button :disabled="scope.row.disabled" v-if="scope.row.status==2" class="four" size="mini" @click="openImportLibrary(scope.row.id)">录入谱库</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <Pagination :cp="cp" :total="total" :ps="ps" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
            </div>
        </div>

        <el-dialog title="人工研判" :visible.sync="dialogVisible" width="600px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <div id="diaEChart">

            </div>
            <el-form ref="labour" id="addNew" :model="AIjudge" :rules="labourRules" label-width="120px">
                <el-form-item label-width="0">
                    <h4>主要信息</h4>
                </el-form-item>
                <el-form-item label="中文名称：" prop="name">
                    <el-input v-model="AIjudge.name"></el-input>
                </el-form-item>
                <el-form-item label="类别：" prop="cateid">
                    <el-select v-model="AIjudge.cateid"  clearable>
                        <el-option v-for="(item,index) in list1" :key="index" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="物质编号：" prop="catenumber">
                    <el-input v-model="AIjudge.catenumber"></el-input>
                </el-form-item>
                <el-form-item label="HS编码：" prop="hsnumber">
                    <el-input v-model="AIjudge.hsnumber"></el-input>
                </el-form-item>
                <el-form-item label="分子式：" prop="formula">
                    <el-input v-model="AIjudge.formula"></el-input>
                </el-form-item>
                <el-form-item label="CAS编码：" prop="casno">
                    <el-input v-model="AIjudge.casno"></el-input>
                </el-form-item>
                <el-form-item label="积分时间：">
                    <el-input disabled v-model="AIjudge.intgrtime"></el-input>
                </el-form-item>
                <el-form-item label="激光功率：">
                    <el-input disabled v-model="AIjudge.laserlevel"></el-input>
                </el-form-item>
                <el-form-item label-width="0">
                    <h4>其他信息</h4>
                </el-form-item>
                <el-form-item label="简介：">
                    <el-input type="textarea" :row='3' v-model="AIjudge.purpose"></el-input>
                </el-form-item>
                <el-form-item label="化学属性：">
                    <el-input type="textarea" :row='3' v-model="AIjudge.properties"></el-input>
                </el-form-item>
                <el-form-item label="消防：">
                    <el-input type="textarea" :row='3' v-model="AIjudge.feature"></el-input>
                </el-form-item>
                <el-form-item label="健康：">
                    <el-input type="textarea" :row='3' v-model="AIjudge.toxicology"></el-input>
                </el-form-item>
                <el-form-item label="处置建议：">
                    <el-input type="textarea" :row='3' v-model="AIjudge.storage"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelLabour('labour')">取 消</el-button>
                <el-button type="primary" @click="sureLabour('labour')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="研判结果" :visible.sync="dialogVisible2" width="700px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <div id="caintentTop">
                    <span class="mainSpan">光谱图：</span>
                    <div id="formEcharts"></div>
                </div>
                <span class="mainSpan">详情参数：</span>
                <el-form label-width="120px" class="resultForm">
                    <el-form-item label="中文名称：">
                        {{AIjudge.name}}
                    </el-form-item>
                    <el-form-item label="类别：">
                        {{AIjudge.cateid}}
                    </el-form-item>
                    <el-form-item label="积分时间：">
                        {{AIjudge.intgrtime}}
                    </el-form-item>
                    <el-form-item label="激光功率：">
                        {{AIjudge.laserlevel}}
                    </el-form-item>
                    <el-form-item label="物品编号：">
                        {{AIjudge.catenumber}}
                    </el-form-item>
                    <el-form-item label="HS编码：">
                        {{AIjudge.hsnumber}}
                    </el-form-item>
                    <el-form-item label="分子式：">
                        {{AIjudge.formula}}
                    </el-form-item>
                    <el-form-item label="CAS编码：">
                        {{AIjudge.casno}}
                    </el-form-item>
                    <el-form-item label="地理信息：">
                        {{AIjudge.addr}}
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closeResult">关闭</el-button>
            </span>
        </el-dialog>

        <el-dialog title="录入谱库" :visible.sync="dialogVisible3" width="600px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form>
                <el-form-item label="选择分类：">
                    <el-select v-model="importLibrary" clearable>
                        <el-option v-for="item in SpectralLibrary" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="cancelImportLibrary">取 消</el-button>
                <el-button type="primary" @click="sureImportLibrary" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import API from '../../common/api'
import Pagination from '@/components/pagination'
export default {
  name: 'analysis',
  components: {Pagination},
  data () {
    return {
      loading1: false,
      drawData: [],
      drawData1: [],
      judgeID: '',
      AIjudge: {},
      list: [],
      list1: [],
      status: '',
      statusList: [],
      labourRules: {
        name: [
          {required: true, message: '请输入中文名称', trigger: 'blur'}
        ],
        cateid: [
          {required: true, message: '请选择类别', trigger: 'change'}
        ],
        catenumber: [
          {required: true, message: '请输入物品编号', trigger: 'blur'}
        ],
        hsnumber: [
          {required: true, message: '请输入HS编码', trigger: 'blur'}
        ],
        formula: [
          {required: true, message: '请输入分子式', trigger: 'blur'}
        ],
        casno: [
          {required: true, message: '请输入CAS编码', trigger: 'blur'}
        ]
      },
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      loading: false,
      inputWord: '',
      cp: 1,
      ps: 10,
      total: 0,
      labourAnalysis: {
        name: '',
        ingredient: '',
        spectrum: '',
        waveLength: ''
      },
      labourAnalysisRules: {
        name: [
          {required: 'true', message: '请输入物质名称', trigger: 'blur'}
        ],
        ingredient: [
          {required: 'true', message: '请输入物质成分', trigger: 'blur'}
        ],
        spectrum: [
          {required: 'true', message: '请输入物质光谱', trigger: 'blur'}
        ],
        waveLength: [
          {required: 'true', message: '请输入波长', trigger: 'blur'}
        ]
      },
      SpectralLibrary: [],
      importLibrary: null

    }
  },
  methods: {
    // 打开人工研判窗口
    openLabour (val) {
      this.AIjudge = val
      this.dialogVisible = true
      this.getLIst1()
      setTimeout(() => {
        this.drawChart('diaEChart')
      }, 10)
    },
    // 绘图
    drawChart (name) {
      this.drawData = []
      this.drawData1 = []
      let arr1 = this.AIjudge.wavelength.split(',')
      let arr2 = this.AIjudge.intensity.split(',')
      arr1.forEach((val, index) => {
        this.drawData.push([Number(arr1[index]), Number(arr2[index])])
      })
      let arr3 = this.AIjudge.materialsWavelength.split(',')
      let arr4 = this.AIjudge.materialsIntensity.split(',')
      if (arr3.length > 0 && arr3[0] != '') {
        arr3.forEach((val, index) => {
          this.drawData1.push([Number(arr3[index]), Number(arr4[index])])
        })
      };
      console.log(this.drawData1)
      var myChart = this.$echarts.init(document.getElementById(name))
      myChart.setOption({
        color: ['#f39800', '#4e7be2'],
        legend: {
          right: 20,
          top: 20,
          textStyle: {
            fontSize: 16
          },
          data: [
            {
              name: '样品',
              icon: 'circle'
            },
            {
              name: '谱库',
              icon: 'circle'
            }
          ]

        },
        xAxis: [
          {
            type: 'value',
            name: '',
            axisTick: {
              show: false
            },
            min: 'dataMin'
          }
        ],
        yAxis: [
          {
            type: 'value',
            min: 'dataMin'
          }
        ],
        series: [
          {
            name: '样品',
            type: 'line',
            symbolSize: 0,
            lineStyle: {
              color: '#f39800'
            },
            data: this.drawData
          },
          {
            name: '谱库',
            type: 'line',
            symbolSize: 0,
            lineStyle: {
              color: '#4e7be2'
            },
            data: this.drawData1
          }
        ]
      })
    },
    // 取消人工研判
    cancelLabour (formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
    // 确认人工研判
    sureLabour (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          this.rengong(formName)
        } else {
          return false
        }
      })
    },
    rengong (formName) {
      let data = {
        'id': this.AIjudge.id,
        'deviceId': this.AIjudge.deviceId,
        'laserlevel': this.AIjudge.laserlevel,
        'intgrtime': this.AIjudge.intgrtime,
        'intensity': this.AIjudge.intensity,
        'wavelength': this.AIjudge.wavelength,
        'name': this.AIjudge.name,
        'cateid': this.AIjudge.cateid,
        'catenumber': this.AIjudge.catenumber,
        'hsnumber': this.AIjudge.hsnumber,
        'formula': this.AIjudge.formula,
        'casno': this.AIjudge.casno,
        'purpose': this.AIjudge.purpose,
        'properties': this.AIjudge.properties,
        'feature': this.AIjudge.feature,
        'toxicology': this.AIjudge.toxicology,
        'storage': this.AIjudge.storage
      }
      this.API.post('/api/judge/manualJudge', data)
        .then((res) => {
          if (res.code == 0) {
            console.log(res)
            this.dialogVisible = false
            this.$refs[formName].resetFields()
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
    // 打开研判结果窗口
    openResult (val) {
      this.loading1 = true
      this.getInfo(val.id)
    },
    getInfo (id) {
      let data = {
        'id': id
      }
      this.API.get('/api/judge/get', data)
        .then((res) => {
          if (res.code == 0) {
            this.AIjudge = res.data
            console.log(this.AIjudge)
            this.dialogVisible2 = true
            setTimeout(() => {
              this.drawChart('formEcharts')
            }, 10)
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
    // 关闭研判结果窗口
    closeResult () {
      this.AIjudge = {}
      this.dialogVisible2 = false
    },
    // 分页
    handleCurrentChange (val) {
      this.cp = val
      this.getLIst()
    },
    handleSizeChange (val) {
      this.ps = val
      this.getLIst()
    },
    // 打开录入谱库窗口
    openImportLibrary (id) {
      this.judgeID = id
      this.getType()
    },
    // 取消录入谱库
    cancelImportLibrary () {
      this.dialogVisible3 = false
      this.importLibrary = null
    },
    // 确定录入谱库
    sureImportLibrary () {
      if (this.importLibrary) {
        this.loading = true
        let data = {
          'judgeId': this.judgeID,
          'typeId': this.importLibrary
        }
        this.API.get('/api/judge/addMaterials', data)
          .then((res) => {
            if (res.code == 0) {
              this.getLIst()
              this.dialogVisible3 = false
              this.$message({
                type: 'success',
                message: res.message
              })
              this.importLibrary = null
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
        this.$message({
          type: 'info',
          message: '请先选择谱库'
        })
      }
    },
    // 删除研判记录
    deleteRecord (id) {
      this.$confirm('是否删除该条目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.remove(id)
        })
    },
    remove (id) {
      this.API.post('/api/judge/delete/' + id)
        .then((res) => {
          if (res.code == 0) {
            this.getLIst()
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
    getLIst () {
      this.loading1 = true
      let data = {
        'pn': this.cp,
        'ps': this.ps,
        'deviceId': this.inputWord,
        'status': this.status
      }
      API.get('/api/judge/list', data)
        .then((res) => {
          if (res.code == 0) {
            this.list = res.data.records
            this.total = res.data.total
            this.cp = res.data.current
            let result = '',
              disabled = false,
              color = ''
            this.list.forEach((val, index, arr) => {
              this.list[index]
              if (this.list[index].status == 1) {
                result = '研判成功'
                disabled = false
                color = 'green'
              } else if (this.list[index].status == 2) {
                result = '人工研判成功'
                disabled = false
                color = 'green'
              } else if (this.list[index].status == 3) {
                result = '研判失败'
                disabled = true
                color = 'red'
              } else if (this.list[index].status == 4) {
                result = '待研判'
                disabled = true
                color = 'black'
              } else if (this.list[index].status == 5) {
                result = '已录入到谱库'
                disabled = false
                color = 'green'
              }
              this.$set(this.list[index], 'result', result)
              this.$set(this.list[index], 'disabled', disabled)
              this.$set(this.list[index], 'color', color)
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
    getType () {
      API.get('/api/sepctral/listType')
        .then((res) => {
          if (res.code == 0) {
            this.SpectralLibrary = res.data
            this.dialogVisible3 = true
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
      this.getLIst()
    },
    getLIst1 () {
      this.API.get('/api/sepctral/countType')
        .then((res) => {
          if (res.code == 0) {
            this.list1 = res.data
          } else {
            this.$message({
              type: 'info',
              message: res.message
            })
          }
        })
        .catch((err) => {
          this.$message({
            typ: 'error',
            message: err.message
          })
        })
    },
    getStatusList () {
      this.API.get('/api/judge/listStatus')
        .then((res) => {
          if (res.code == 0) {
            this.statusList = res.data
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
    this.getLIst()
    this.getStatusList()
    // this.getTypeList();
  }
}
</script>

<style scoped>
    #analysis #caintentTop{
        display: flex;
        justify-content: flex-start;
    }
    #analysis .mainSpan{
        font-size: 16px;
        font-weight: bolder;
        display: inline-block;
        width: 120px;
        text-align: right;
        line-height: 60px;
    }
    #analysis #diaEChart,#formEcharts{
        height: 300px;
    }
    #analysis #formEcharts{
        width: calc(100% - 120px);
    }
    #analysis .first{
        background-color: #2a96f9;
        color:#fff;
        border: none;
    }
    #analysis .second{
        background-color: #ecf5ff;
        color:#409eff;
        border:1px solid #b3d8ff;
    }
    #analysis .third{
        background-color: #fef0f0;
        color:#f56c6c;
        border:1px solid #fbc4c4 ;
    }
    #analysis .four{
        background-color: #f0f9eb;
        color:#85c766;
        border:1px solid #c2e7b0 ;
    }
    #analysis{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 20px;
    }
    #analysis h4{
        margin: 0;
        padding-left: 25px;
        font-size: 17px;
    }
    #analysis #top{
        text-align: left;
    }
    #analysis #top .el-input{
        width:20%
    }
    #analysis #top .el-button{
        color: #fff;
        background-color: #798bf2;
    }
    #analysis #tables{
        margin-top:30px;
        text-align: left;
    }
    #analysis #main{
        padding: 20px;
        background-color: #fff;
        box-sizing: border-box;
    }
    #analysis .resultForm .el-form-item{
        margin-bottom: 0;
    }
</style>
