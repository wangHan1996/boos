<template>
    <div id="details">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
            <el-breadcrumb-item to="/equipmentList">设备列表</el-breadcrumb-item>
            <el-breadcrumb-item >设备详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main">
            <h1>设备详情</h1>
            <div class="container">
                <el-form label-width="110px" class="infoForm">
                    <el-form-item label="设备ID：">
                        <p>{{info.serialNumber}}</p>
                    </el-form-item>
                    <el-form-item label="设备序列号：">
                        <p>{{info.deviceId}}</p>
                    </el-form-item>
                    <el-form-item label="设备名称：">
                        <p>{{info.name}}</p>
                    </el-form-item>
                    <el-form-item label="所属企业：">
                        <p>{{info.companyName}}</p>
                    </el-form-item>
                    <el-form-item label="位置：">
                        <p>{{info.address}}</p>
                    </el-form-item>
                    <el-form-item label="最后使用时间：">
                        <p>{{info.modifyTime}}</p>
                    </el-form-item>
                    <el-form-item label="版本信息：">
                        <p>{{info.version}}</p>
                    </el-form-item>
                </el-form>
                <el-tabs v-model="tabsName" type="card"  @tab-click="handleClick">
                    <el-tab-pane label="上报历史" name="first">
                        <el-table :data="history" border :header-cell-style="{background:'#f0f9eb'}">
                            <el-table-column label="上报时间" prop="createTime"  header-align="center" align="center"></el-table-column>
                            <el-table-column label="经纬度" prop="address"  header-align="center" align="center"></el-table-column>
                            <el-table-column label="操作"  header-align="center" align="center">
                                <template slot-scope="scope">
                                    <el-button @click="deleteInfo(scope.row.id)" type="danger" size="mini">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <Pagination :cp="cp1" :total="total1" :ps="ps1" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
                    </el-tab-pane>
                    <el-tab-pane label="使用记录" name="second">
                        <el-table :data='record' border :header-cell-style="{background:'#f0f9eb'}">
                            <el-table-column label="使用时间" prop="createTime"  header-align="center" align="center"></el-table-column>
                            <el-table-column label="检测人员" prop="inspector"  header-align="center" align="center"></el-table-column>
                            <el-table-column label="检测位置" prop="addr"  header-align="center" align="center"></el-table-column>
                            <el-table-column label="检测结果" prop="toxicology"  header-align="center" align="center">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.name==''||scope.row.name=='未知物质'">
                                        未知物质
                                    </span>
                                    <span v-else>{{scope.row.name}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="匹配系数" prop="coef"  header-align="center" align="center"></el-table-column>
                            <el-table-column label="操作"  header-align="center" align="center" width="200">
                                <template slot-scope="scope">
                                    <el-button @click="lookDatil(scope.row.id)" type="primary" size="mini">查看详情</el-button>
                                    <el-button @click="deleteInfo(scope.row.id)" type="danger" size="mini">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <Pagination :cp="cp2" :total="total2" :ps="ps2" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
                    </el-tab-pane>
                </el-tabs>
            </div>
        </div>
        <el-dialog title="设备详情--使用详情" :visible.sync="dialogVisible" width="700px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
                <div id="caintentTop">
                    <span class="mainSpan">光谱图：</span>
                    <div id="formEcharts"></div>
                </div>
                <el-form label-width="120px" class="resultForm" v-loading="loading1">
                    <el-form-item label="中文名称：">
                        {{AIjudge.name}}
                    </el-form-item>
                    <el-form-item label="检测结果：">
                        <span v-if="AIjudge.name==''||AIjudge.name=='未知物质'">
                            未检出
                        </span>
                        <span v-else>已检出</span>
                    </el-form-item>
                    <el-form-item label="匹配系数：">
                        {{AIjudge.coef}}
                    </el-form-item>
                    <el-form-item label="类别信息：">
                        {{AIjudge.cateid}}
                    </el-form-item>
                    <el-form-item label="检测人员：">
                        {{AIjudge.inspector}}
                    </el-form-item>
                    <el-form-item label="备注信息：">
                        {{AIjudge.remark}}
                    </el-form-item>
                    <el-form-item label="积分时间：">
                        {{AIjudge.intgrtime}}
                    </el-form-item>
                    <el-form-item label="激光功率：">
                        {{AIjudge.laserlevel}}
                    </el-form-item>
                    <el-form-item label="检测时间：">
                        {{AIjudge.createTime}}
                    </el-form-item>
                    <el-form-item label="地理信息：">
                        {{AIjudge.addr}}
                    </el-form-item>
                    <el-form-item label="本地拍照：">
                        <!-- <span v-if="AIjudge.img==''">暂无照片</span>
                        <img v-else :src="AIjudge.img" style="width:300px;height:150px;"> -->
                        <span v-if="AIjudgeImg.length==0">
                            暂无图片
                        </span>
                        <span v-else>
                            <img  v-for="(item,index) in AIjudgeImg" :key="index" :src="item" style="width:200px;height:120px;">
                        </span>
                    </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible=false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from '@/components/pagination'
export default {
  name: '',
  components: {Pagination},
  data () {
    return {
      tabsName: 'second',
      oldTabsName: 'first',
      cp1: 1,
      ps1: 5,
      cp2: 1,
      ps2: 5,
      total1: 0,
      total2: 0,
      info: '',
      history: [],
      record: [],
      dialogVisible: false,
      AIjudge: {},
      drawData: [],
      drawData1: [],
      loading1: false,
      AIjudgeImg: ''
    }
  },
  methods: {
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
    // 查看详情
    lookDatil (val) {
      this.AIjudge = ''
      this.drawData = []
      this.drawData1 = []
      this.dialogVisible = true
      this.loading1 = true
      this.getInfo(val)
    },
    getInfo (id) {
      let data = {
      }
      this.API.get('/api/device/getHistoryDetail/' + id, data)
        .then((res) => {
          if (res.code == 0) {
            this.AIjudge = res.data
            if (res.data.img == '') {
              this.AIjudgeImg = []
            } else {
              this.AIjudgeImg = res.data.img.split(',')
            }
            setTimeout(() => {
              this.drawChart('formEcharts')
            }, 10)
            this.loading1 = false
          } else {
            this.loading1 = false
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
    handleClick () {
      if (this.tabsName != this.oldTabsName) {
        this.cp = 1
        this.oldTabsName = this.tabsName
      };
    },
    // 分页
    handleCurrentChange (val) {
      console.log(val)
      this.cp = val
      if (this.tabsName == 'first') {
        this.getHistory(1)
      } else if (this.tabsName == 'second') {
        this.getHistory(2)
      }
    },
    handleSizeChange (val) {
      this.ps = val
      if (this.tabsName == 'first') {
        this.getHistory(1)
      } else if (this.tabsName == 'second') {
        this.getHistory(2)
      }
    },
    getHistory (type) {
      let cp, ps
      if (type == 1) {
        cp = this.cp1
        ps = this.ps1
      } else if (type == 2) {
        cp = this.cp2
        ps = this.ps2
      }
      let data = {
        'pn': cp,
        'ps': ps,
        'deviceId': this.info.deviceId,
        'type': type
      }
      this.API.get('/api/device/getHistory', data)
        .then((res) => {
          if (res.code == 0) {
            if (type == 1) {
              this.history = res.data.records
              this.total1 = res.data.total
              this.cp1 = res.data.current
              this.ps1 = res.data.size
            } else if (type == 2) {
              this.record = res.data.records
              this.total2 = res.data.total
              this.cp2 = res.data.current
              this.ps2 = res.data.size
            };
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
    deleteInfo (id) {
      this.$confirm('是否删除该条信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.remove(id)
        })
    },
    remove (id) {
      this.API.post('/api/device/deleteHistory/' + id)
        .then((res) => {
          if (res.code == 0) {
            if (this.tabsName == 'first') {
              this.getHistory(1)
            } else if (this.tabsName == 'second') {
              this.getHistory(2)
            }
            this.$message({
              type: 'success',
              message: '删除成功'
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
    this.info = JSON.parse(sessionStorage.getItem('info'))
    this.getHistory(1)
    this.getHistory(2)
  }
}
</script>

<style>
    .mainSpan{
        font-size: 16px;
        font-weight: bolder;
        display: inline-block;
        width: 120px;
        text-align: right;
        line-height: 60px;
    }
    #formEcharts{
        height: 300px;
    }
    #formEcharts div{
        margin: auto !important;
    }
    #details{
        text-align: left;
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    #details .container{
        padding-left:50px;
    }
    #details .container .infoForm{
        margin-bottom: 20px;
    }
    #details .container .infoForm .el-form-item{
        margin-bottom: 0;
    }
    #details #main{
        background-color: #fff;
        padding: 20px;
    }
    #details h1{
        margin-top: 0;
    }
    #details .el-form-item__content{
        width: calc(100% - 110px);
    }
    #details .el-form-item__content p{
        word-break:break-all;
    }
</style>
