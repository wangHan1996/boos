<template>
    <el-pagination id="pagination" @size-change="handleSizeChange" background layout="total, sizes, prev, pager, next, jumper" @current-change="handleCurrentChange"
      :current-page="cp"
      :page-sizes='[5,10,15,20]'
      :page-size="ps"
      :total="total">
    </el-pagination>
</template>

<script>
export default{
  name: 'pagination',
  data () {
    return {
    }
  },
  props: ['total', 'cp', 'ps'],
  methods: {
    handleCurrentChange (val) {
      this.$emit('CurrentChange', val)
    },
    handleSizeChange (val) {
      this.$emit('SizeChange', val)
    }
  }
}
</script>

<style>
    #pagination{
        padding:10px 0;
        text-align: right;
    }
    #pagination .el-pager .active{
        background-color: #798bf2;
    }
</style>
