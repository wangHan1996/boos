<template>
    <div id="statistics">
        <!-- <h5>设备统计</h5> -->
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
            <el-breadcrumb-item >设备统计</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main">
            <div id='Echarts'></div>
            <div id="tables" v-loading="loading1">
                <h5>列表统计</h5>
                <el-table :border="true" :highlight-current-row="true" :data="statistic" >
                    <!-- <el-table-column label="设备序列号" prop="id" header-align="center" align="center"></el-table-column> -->
                    <el-table-column label="省份" prop="areaName" header-align="center" align="center"></el-table-column>
                    <el-table-column label="设备数量" prop="deviceCount" header-align="center" align="center"></el-table-column>
                    <el-table-column label="企业数量" prop="companyCount" header-align="center" align="center"></el-table-column>
                </el-table>
                <Pagination :cp="cp" :total="total" :ps="ps" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
            </div>
        </div>
        
    </div>
</template>

<script>
import Pagination from '@/components/pagination'
import API from '../../common/api'
export default{
    name:'statistic',
    components:{Pagination},
    data(){
        return {
            loading1:false,
            cp:1,
            ps:5,
            total:0,
            statistic:[],
            areaName:[],
            areaCount:[]
        }
    },
    methods:{
        //绘图
        drawChart(){
            var myChart=this.$echarts.init(document.getElementById('Echarts'));
            myChart.setOption({
                title:{
                    text:'设备地区统计图',
                    left:'center',
                    textStyle:{
                        color:'#000',
                    }
                },
                xAxis: {
                    type:'category',
                    name:'',
                    data:this.areaName,
                    axisTick: {
                        show:false,
                    }
                },
                yAxis: {
                    type:'value',
                    // name:'设备数量/台'
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
                    itemStyle:{
                        color:(params)=>{
                            let colors=['#2a96f9','#fe9d8e', '#2a96f9', '#8595ef', '#3cc6d0','#f7b547',  '#6c8dec', '#fe9d8e','#8595ef', '#c18cf8'];
                            let len=colors.length;
                            let mul=Math.floor(params.dataIndex/len);
                            return colors[params.dataIndex-mul*len]
                        },
                    },
                    data: this.areaCount
                }]
            })
        },
        //分页
        handleCurrentChange(val){
            this.cp=val;
        },
        handleSizeChange(val){
            this.ps=val;
        },
        getList(){
            this.loading1=true;
            API.get('/api/device/count')
            .then((res)=>{
                if(res.code==0){
                    console.log(res);
                    res.data.forEach((key,index,arr)=>{
                        if(arr[index].companyCount!=0 ||arr[index].deviceCount!=0){
                            this.statistic.push(arr[index]);
                            this.total++;
                            this.areaName.push(arr[index].areaName);
                            this.areaCount.push(arr[index].deviceCount)
                        }
                    });
                    this.drawChart()
                }else{
                    this.$message({
                        type:'info',
                        message:res.message
                    })
                }
            })
            .catch((err)=>{
                this.$message({
                    type:'error',
                    message:err.message
                })
            })
            .finally(()=>{
                this.loading1=false;
            })
        }
    },
    created(){
        this.getList();
    },
    mounted(){
        // this.drawChart();
    },
}
</script>

<style>
    #statistics{
        width: 100%;
        height: 100%;
        padding: 20px;
        background-color: #ebeef5;
        box-sizing: border-box;
    }
    #statistics #Echarts{
        width:100%;
        height:300px;
        padding-top: 30px;
        background-color: #fff;
    }
    #statistics #tables{
        text-align: left;
        background-color: #fff;
        margin-top: 20px;
        height: calc(100% - 387px);
        padding: 20px 20px 0;
        box-sizing: border-box;
    }
</style>

