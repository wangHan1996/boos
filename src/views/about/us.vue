<template>
    <div id="us">
        <el-form label-width="30%" label-position="left">
            <el-form-item label="软件名称">
                {{name}}
            </el-form-item>
            <el-form-item label="版权所有">
                {{corpy}}
            </el-form-item>
            <el-form-item label="软件简称">
                {{easyName}}
            </el-form-item>
            <el-form-item label="版本号">
                {{versions}}
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  data () {
    return {
      name: '拉曼光谱检测云平台',
      corpy: '公安部第一研究所 北京中盾安民分析技术有限公司',
      easyName: 'RamanCloud',
      versions: 'V1.0'
    }
  }
}
</script>

<style>
#us{
    width: calc(100% - 40px);
    margin: 20px;
    box-sizing: border-box;
    background-color: #fff;
}
#us form{
    padding: 20px;
}
#us .el-form-item{
    margin-bottom: 0;
    border-left: 1px solid #666;
    border-right: 1px solid #666;
    border-bottom: 1px solid #666;
    text-align: left;
}
#us .el-form-item:nth-of-type(1){
    border-top: 1px solid #666;
}
#us .el-form-item > label {
    padding-left:10px;
    font-weight: bold;
    font-size: 16px;
}
#us .el-form-item__content{
    border-left: 1px solid #000;
    padding-left: 10px;
}
</style>
