<template>
    <div id="idCard" v-loading="loading">
        <div id="main">
            <el-row style="padding:20px;">
                <el-button @click="add" class="first">新增核验信息</el-button>
                <el-input class="queryInput" placeholder="输入关键词" clearable v-model="keyword"></el-input>
                <el-button @click="query">查询</el-button>
            </el-row>
            <el-table :data="list" border >
                <el-table-column label="身份证号" prop="idcard"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="性别" prop="sex1"></el-table-column>
                <el-table-column label="民族" prop="ethnic"></el-table-column>
                <el-table-column label="出生日期" prop="birthday"></el-table-column>
                <el-table-column label="住址" prop="address"></el-table-column>
                <el-table-column label="是否在逃" prop="escape1"></el-table-column>
                <el-table-column label="是否为吸毒涉毒人员" prop="drug1"></el-table-column>
                <el-table-column label="是否有重大前科" prop="criminal1"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button class="edit" size="mini" @click="edit(scope.row)">编辑</el-button>
                        <el-button size="mini" class="third"  @click="del(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <Pagination :cp="cp" :total="total" :ps="ps" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
        </div>
        <el-dialog :title="name" :visible.sync="visible" width="800px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form class="formData" :model="info" ref="info" :rules="infoRule" label-width="160px">
                <el-form-item label="身份证号" prop="idcard">
                    <el-input v-model="info.idcard"></el-input>
                </el-form-item>
                <el-form-item label="姓名 " prop="name">
                    <el-input v-model="info.name"></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="info.sex">
                        <el-radio label="1">男</el-radio>
                        <el-radio label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="民族" prop="ethnic">
                    <el-input v-model="info.ethnic"></el-input>
                </el-form-item>
                <el-form-item label="出生日期 " prop="birthday">
                    <el-date-picker
                        v-model="info.birthday"
                        type="date"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="住址" prop="addressFirst">
                    <el-select v-model="info.addressFirst" @change="firstChange">
                        <el-option v-for="(item,index) in areaList" :key="index" :label="item.areaName" :value="item.id"></el-option>
                    </el-select>
                    <el-select v-model="info.addressSecond" @change="secondChange">
                        <el-option v-for="(item,index) in areaList1" :key="index" :label="item.areaName" :value="item.id"></el-option>
                    </el-select>
                    <el-select v-model="info.addressThird">
                         <el-option v-for="(item,index) in areaList2" :key="index" :label="item.areaName" :value="item.id"></el-option>
                    </el-select>
                    <el-input class="addressInput" placeholder="详细地址" v-model="info.addressDetail"></el-input>
                </el-form-item>
                <el-form-item label="是否在逃 " prop="escape">
                    <el-radio-group v-model="info.escape">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否为吸毒涉毒人员" prop="drug">
                    <el-radio-group v-model="info.drug">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否有重大前科" prop="criminal">
                    <el-radio-group v-model="info.criminal">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="0">否</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel('info')">取 消</el-button>
                <el-button type="primary" @click="sure('info')" :loading="loading1">确 定</el-button>
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
      cp: 1,
      total: 0,
      ps: 10,
      keyword: '',
      list: [],
      name: '新增核验信息',
      visible: false,
      info: {
        idcard: '',
        name: '',
        sex: '',
        ethnic: '',
        birthday: '',
        addressFirst: '',
        addressSecond: '',
        addressThird: '',
        addressDetail: '',
        escape: '',
        drug: '',
        criminal: '',
        test: '1'
      },
      infoRule: {
        idcard: [
          {required: true, message: '请输入身份证', trigger: 'blur' },
          {pattern: /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '请输入合格的身份证号码', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        sex: [
          {required: true, message: '请选择性别', trigger: 'change'}
        ],
        ethnic: [
          {required: true, message: '请输入民族', trigger: 'blur'}
        ],
        birthday: [
          {required: true, message: '请选择出生日期', trigger: 'change'}
        ],
        addressFirst: [
          {required: true, message: '请输入地址', trigger: 'change'}
        ],
        escape: [
          {required: true, message: '请选择是否在逃', trigger: 'change'}
        ],
        drug: [
          {required: true, message: '请选择是否为吸毒涉毒人员', trigger: 'change'}
        ],
        criminal: [
          {required: true, message: '请选择是否有重大前科', trigger: 'change'}
        ]
      },
      loading: false,
      loading1: false,
      areaList: [],
      areaList1: [],
      areaList2: [],
      num: 0,
      num1: 0
    }
  },
  methods: {
    handleCurrentChange () {
      this.cp = val
      this.getList()
    },
    handleSizeChange () {
      this.ps = val
      this.getList()
    },
    getList () {
      this.loading = true
      this.API.get('/api/identity/list',
        {
          'ps': this.ps,
          'pn': this.cp,
          'key': this.keyword
        })
        .then((res) => {
          if (res.code == 0) {
            this.list = res.data.records
            this.list.forEach((val, index) => {
              if (this.list[index].sex == 1) {
                this.$set(this.list[index], 'sex1', '男')
              } else {
                this.$set(this.list[index], 'sex1', '女')
              };
              if (this.list[index].escape == 1) {
                this.$set(this.list[index], 'escape1', '是')
              } else {
                this.$set(this.list[index], 'escape1', '否')
              };
              if (this.list[index].drug == 1) {
                this.$set(this.list[index], 'drug1', '是')
              } else {
                this.$set(this.list[index], 'drug1', '否')
              };
              if (this.list[index].criminal == 1) {
                this.$set(this.list[index], 'criminal1', '是')
              } else {
                this.$set(this.list[index], 'criminal1', '否')
              };
            })
            this.total = res.data.total
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
        .finally((err) => {
          this.loading = false
        })
    },
    cancel (formName) {
      this.visible = false
      this.info = {
        idcard: '',
        name: '',
        sex: '',
        ethnic: '',
        birthday: '',
        addressFirst: '',
        addressSecond: '',
        addressThird: '',
        addressDetail: '',
        escape: '',
        drug: '',
        criminal: '',
        test: '1'
      }
      this.$refs[formName].resetFields()
    },
    sure (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let Data
          if (this.name == '编辑') {
            Data = {
              'id': this.info.id,
              'idcard': this.info.idcard,
              'name': this.info.name,
              'sex': this.info.sex,
              'ethnic': this.info.ethnic,
              'addressDetail': this.info.addressDetail,
              'addressFirst': this.info.addressFirst,
              'addressSecond': this.info.addressSecond,
              'addressThird': this.info.addressThird,
              'birthday': this.info.birthday,
              'escape': this.info.escape,
              'drug': this.info.drug,
              'criminal': this.info.criminal
            }
          } else {
            Data = {
              'idcard': this.info.idcard,
              'name': this.info.name,
              'sex': this.info.sex,
              'ethnic': this.info.ethnic,
              'addressDetail': this.info.addressDetail,
              'addressFirst': this.info.addressFirst,
              'addressSecond': this.info.addressSecond,
              'addressThird': this.info.addressThird,
              'birthday': this.info.birthday,
              'escape': this.info.escape,
              'drug': this.info.drug,
              'criminal': this.info.criminal
            }
          }
          this.update(Data)
        } else {
          return false
        }
      })
    },
    update (val) {
      this.loading1 = true
      this.API.post('/api/identity/update', val)
        .then((res) => {
          if (res.code == 0) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.visible = false
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
        .finally(() => {
          this.loading1 = false
        })
    },
    add () {
      this.visible = true
    },
    query () {
      this.cp = 1
      this.getList()
    },
    firstChange (val) {
      for (let i = 0; i < this.areaList.length; i++) {
        if (this.areaList[i].id == val) {
          this.num = i
        }
      }
      this.info.addressSecond = ''
      this.info.addressThird = ''
      this.areaList1 = this.areaList[this.num].children
    },
    secondChange (val) {
      for (let i = 0; i < this.areaList1.length; i++) {
        if (this.areaList1[i].id == val) {
          this.num1 = i
        }
      }
      this.info.addressThird = ''
      if (this.areaList1[this.num].children) {
        this.areaList2 = this.areaList1[this.num].children
      } else {
        this.areaList2 = []
      }
    },
    edit (val) {
      this.name = '编辑'
      this.visible = true
      this.info = val
      this.$set(this.info, 'test', '1')
    },
    del (val) {
      this.Delete(val.id)
    },
    Delete (id) {
      this.$confirm('是否删除该数据', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      })
        .then(() => {
          this.loading = true
          this.API.post('/api/identity//delete/' + id)
            .then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功'
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
            .finally(() => {
              this.loading = false
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
    #idCard{
        text-align: left;
        width: 100%;
        padding: 20px;
        box-sizing: border-box
    }
    #idCard #main{
        background-color: #fff;
    }
    #idCard #main .queryInput{
        width: 30%;
    }
    #idCard #main .first{
        color: #fff;
        background-color: #798bf2;
    }
    #idCard .formData .el-select{
        width: 20%;
        min-width: 120px
    }
    #idCard .addressInput{
        width:50%;
        padding-top: 10px;
    }
    #idCard .third{
        background-color: #fef0f0;
        color:#f56c6c;
        border:1px solid #fbc4c4 ;
    }
    #idCard .edit{
        background-color:#f0f9eb;
        color:#7dc35b;
        border: 1px solid #c2e7b0;
    }
</style>
