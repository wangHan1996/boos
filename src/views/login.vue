<template>
    <div id="login">
        <div id="loginbox">
            <div id="top" :style="{'height':lineHeight+'px'}">      
                <img style="height:70%;margin-right:20px;" src="../../static/image/login/title.png">
                <span :style="{'font-size':fontSize+'px'}">拉曼光谱检测云平台</span>
            </div>
            <div id="bottom">
                <div id="left">
                    <img src="../../static/image/login/logo.png" alt="">
                </div>
                <div id="right">
                    <h1 :style="{'font-size':fontSize+'px'}">登录后台系统</h1>
                    <el-form :model="formData" ref="formData" :rules="loginRule" style="width:70%;min-width:200px;margin:0 auto 60px;">
                        <el-form-item prop="userName">
                            <el-input v-model="formData.userName" placeholder="请输入用户名">
                                <i slot="prefix" class="iconfont icon-denglu"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="passWord">
                            <el-input v-model="formData.passWord" type="password" placeholder="请输入密码">
                                <i slot="prefix" class="iconfont icon-mima"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button :loading="loading" @click="login('formData')">登 录</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import API from '../common/api'
export default {
    data(){
        return {
            loading:false,
            lineHeight:0,
            Width:0,
            isRememb:false,
            formData:{
                userName:'',
                passWord:''
            },
            loginRule:{
                userName:[
                    {required:true,message:'请输入账号',trigger:'blur'},
                    {min:1,max:32,message:'长度为1~32位字符',trigger:'blur'}
                ],
                passWord:[
                    {required:true,message:'请输入密码',trigger:'blur'},
                    {min:6,max:32,message:'长度为6~32位字符',trigger:'blur'}
                ]
            }
        }
    },
    computed:{
        fontSize(){
            if(this.Width/1920*36>18){
                this.lineHeight=this.Width/1920*36+10
                return this.Width/1920*36;
            }else{
                this.lineHeight=24;
                return 18;
            }
        }
    },
    methods:{
        login(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    this.loading=true;
                    API.post('/api/login',{'username':this.formData.userName,'password':this.formData.passWord},{'Content-Type': 'application/json'})
                    .then((res)=>{
                        if(res.code==0){
                            sessionStorage.setItem('token',res.data.token);
                            sessionStorage.setItem('userName',this.formData.userName);
                            this.$router.push('/equipmentMap');
                            this.$message({
                                type:'success',
                                message:res.message
                            })
                        }else{
                            this.$message({
                                type:'info',
                                message:res.message
                            })
                        }
                    })
                    .catch((err)=>{
                        console.log(err);
                        this.$message({
                            type:'error',
                            message:err.message
                        });
                    })
                    .finally(()=>{
                        this.loading=false;
                    })
                }else{
                    return false;
                }
            })
            
        },
    },
    mounted(){
        document.addEventListener('keydown',(e)=>{
            if(e.keyCode==13){
                this.login('formData');
            }
        });
        window.addEventListener('resize',()=>{
            this.Width=document.body.clientWidth;
        });
        this.Width=document.body.clientWidth;
        // this.fontSize=this.Width/1920*36;
    }
}
</script>

<style>
    #login{
        display: flex;
        justify-content: center;
        align-items: center;
        height:100%;
        background-image:url('../../static/image/login/bgc.png');
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }
    #login #loginbox{
        width:60%;
        min-width: 600px;
        max-width:1000px;
    }
    #login .el-button{
        width:100%;
        background-color: #6a7eec;
        color: #fff;
    }
    #login h1{ 
        font-weight: 500;
        color: #4151b6;
        margin-bottom: 60px;
    }
    #login #top{
        margin-bottom:30px;
        width: 100%;
        display: flex;
        align-items: center;
    }
    #login #top span{
        color: #fff;
        font-weight: 500;
    }
    #login #bottom{
        width:100%;
        border: 10px solid #6668ca;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.349019607843137);
        overflow:hidden;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        /* padding: 50px 0; */
    }
    #login #left{
        float: left;
        width: 50%;
    }
    #login #left img{
        width:80%;
    }
    #login #right{
        float: left;
        width:50%;
        margin: 30px 0;
    }
    #login #right .el-input__inner{
        border: none;
        border-bottom: 1px solid #ccc;
        border-radius: 0;
    }
</style>