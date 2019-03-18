<template>
    <div id="maps">
        <div id="top">
            <el-select v-model="firstSelect" @change="firstChange" clearable>
                <el-option v-for="item in areaList" :key="item.id" :value="item.id" :label="item.areaName"></el-option>
            </el-select>
            <el-select v-model="secondSelect" clearable>
                <el-option  v-for="items in areaSonList" :key="items.id" :value="items.id" :label="items.areaName"></el-option>
            </el-select>
            <el-button @click="query">查询</el-button>
            <span class="rightSpan">当前区域设备数量：{{sum}}</span>
        </div>
        <div id="mapContainer">

        </div>

    </div>    
</template>

<script>
import AMap from 'AMap'
export default {
    name:'maps',
    data(){
        return {
            firstSelect:'',
            secondSelect:'',
            sum:0,
            areaList:[],
            areaSonList:[],
            equipmentList:[],
            index:null,
            map:null,
            markerList:[],
        }
    },
    methods:{
        getMapInfo(){
            this.API.get('/api/device/map',{
                'addressFirst':this.firstSelect,
                'addressSecond':this.secondSelect,
            })
            .then((res)=>{
                if(res.code==0){
                    this.sum=0;
                    this.equipmentList=res.data;
                    this.equipmentList.forEach((val,index)=>{
                        if(this.equipmentList[index].lng&&this.equipmentList[index].lat){
                            this.markerList.push(new BMap.Marker(new BMap.Point(this.equipmentList[index].lng, this.equipmentList[index].lat)))      // 创建标注    
                            this.sum++;
                        }
                    });
                    var markerClusterer = new BMapLib.MarkerClusterer(this.map, {markers:this.markerList});
                    
                    this.markerList.forEach((val,index)=>{
                        this.markerList[index].addEventListener('click',(e)=>{
                            this.$alert(`设备序列号：${this.equipmentList[index].deviceId}<br>
                                        设备ID：${this.equipmentList[index].serialNumber}<br>
                                         所属公司：${this.equipmentList[index].companyName}<br>
                                         最近使用时间：${this.equipmentList[index].modifyTime}<br>
                                         位置信息：${this.equipmentList[index].address}`, '设备基本信息', {
                                dangerouslyUseHTMLString: true,
                            });
                        })
                    });
                }else{
                    this.$message({
                        type:'info',
                        message:res.message
                    })
                }
            })
            .catch((err)=>{
                this.$message({
                    type:'info',
                    message:err.message
                })
            })
        },
        getArea(){
            this.API.get('/api/area/list')
            .then((res)=>{
                if(res.code==0){
                    this.areaList=res.data;
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
                    message:res.message
                }) 
            })
        },
        firstChange(val){
            this.areaSonList=[];
            for(let i=0;i<this.areaList.length;i++){
                if(this.areaList[i].id==val){
                    this.areaSonList=this.areaList[i].children;
                    this.secondSelect=''
                    return i;
                }
            };
        },
        query(){
            this.markerList.forEach((val,index)=>{
                this.map.removeOverlay(val)
            });
            this.markerList=[];
            this.getMapInfo();
        }
    },
    mounted(){
        this.areaList=JSON.parse(sessionStorage.getItem('area'));
        this.map= new BMap.Map("mapContainer"); 
        var point = new BMap.Point(116.404, 39.915); 
        this.map.centerAndZoom(point, 5); 
        this.map.enableScrollWheelZoom(true); 
        this.getMapInfo();
    }
}
</script>

<style scoped>
    #maps{
        height:100%;
        position:relative
    }
    #top{
        text-align: left;
        position:absolute;
        top:0;
        z-index: 2;
        width: 100%;
        background-color: rgba(255,255,255,0.8);
        padding: 10px;
        box-sizing: border-box;
    }
    #top .el-select{
        width:15%;
    }
    #top .el-button{
        color: #fff;
        background-color: #798bf2;
    }
    #mapContainer{
        width: 100%;
        height: 100%;
    }
    .rightSpan{
        float:right;
        font-size:18px;
        display: inline-block;
        height: 40px;
        line-height: 40px;
    }
</style>

