<template>
    <div id="versions">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
            <el-breadcrumb-item >版本管理</el-breadcrumb-item>
            <el-breadcrumb-item >版本列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main" v-loading="loading1">
            <el-button @click="upDateNew">上传新版本</el-button>
            <el-table :border="true" :highlight-current-row="true" style="margin-top:30px;" :data="list">
                <el-table-column label="版本号" prop="code" header-align="center" align="center"></el-table-column>
                <el-table-column label="版本名称" prop="name" header-align="center" align="center"></el-table-column>
                <el-table-column label="版本描述" prop="description" header-align="center" align="center"></el-table-column>
                <el-table-column label="apk大小" prop="fileSize" header-align="center" align="center"></el-table-column>
                <el-table-column label="apk文件" prop="" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button class="down" @click="uploadDown(scope.row)" size="mini" type="primary">下载</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" class="danger"  @click="deleteVersions(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :cp="cp" :total="total" :ps="ps" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
        </div>
       
        <el-dialog title="上传新版本" :visible.sync="dialogVisible" width="400px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
           <el-form label-width="100px" :model="newVersions" ref="newVersions" :rules="newVersionsRules">
               <el-form-item label="版本号：" prop="code">
                   <el-input v-model="newVersions.code"></el-input>
               </el-form-item>
               <el-form-item label="版本名称：" prop="name">
                   <el-input v-model="newVersions.name"></el-input>
               </el-form-item>
               <el-form-item label="版本描述：" prop="description">
                   <el-input type="textarea" :rows="3" v-model="newVersions.description"></el-input>
               </el-form-item>
               <el-form-item label="上传新版本：">
                   <el-upload
                    class="upload-demo"
                    ref="upload"
                    action="/api/admin/version/upload"
                    :limit="1"
                    :before-upload="beforeUpdate"
                    :on-success="updateSuccess"
                    :on-error="updateError"
                    :on-exceed="updateExceed"
                    :on-remove="fileRemove">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
               </el-form-item>
           </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelUpdate('newVersions')">取 消</el-button>
                <el-button type="primary" @click="sureUpdate('newVersions')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from '../../components/pagination'
export default{
    components:{Pagination},
    data(){
        return{
            loading1:false,
            dialogVisible:false,
            loading:false,
            newVersions:{
                code:'',
                name:'',
                description:'',
                file:'',
                fileSize:''
            },
            updateFile:false,
            newVersionsRules:{
                code:[
                    {required:'true',message:'请输入版本号', trigger: 'blur' },
                    {pattern:/^[0-9]+$/,message:'只能输入整数', trigger: 'blur'}
                ],
                name:[
                    {required:'true',message:'请输入版本名称',trigger: 'blur'},
                ],
                description:[
                    {required:'true',message:'请输入版本描述', trigger: 'blur'},
                ]
            },
            list:[],
            total:0,
            cp:1,
            ps:10
        }
    },
    methods:{
        //添加版本
        upDateNew(){
            this.dialogVisible=true;
        },
        //取消添加版本
        cancelUpdate(formName){
            this.$refs[formName].resetFields();
            this.$refs.upload.clearFiles();
            this.updateFile=false;
            this.dialogVisible = false;
            this.newVersions.code='';
            this.newVersions.name='';
            this.newVersions.description='';
        },
        //确认添加版本
        sureUpdate(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    if(this.updateFile){
                        this.loading=true;
                        this.addVersions(formName);
                    }else{
                        this.$message({
                            type:'info',
                            message:'请上传文件'
                        })
                    }
                }else{
                    return false;
                }
            }) 
        },
        //新增版本接口
        addVersions(formName){
            this.API.post('/api/admin/version/update',this.newVersions)
            .then((res)=>{
                if(res.code==0){
                    this.dialogVisible=false;
                    this.$message({
                        type:'success',
                        message:res.message
                    });
                    this.$refs[formName].resetFields();
                    this.$refs.upload.clearFiles();
                    this.getList();
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
                this.loading=false;
            })
        },
        //上传版本之前
        beforeUpdate(file){
            if(file.type===''){
                if(!file.name.includes('.apk')){
                    this.$message.error('只能上传APK文件');
                }
                return file.name.includes('.apk');
            }else{
                const isAPK=file.type==='application/vnd.android.package-archive';
                if(!isAPK){
                    this.$message.error('只能上传APK文件');
                }
                return isAPK;
            }
        },
        //上传版本数量
        updateExceed(){
            this.$message({
                type:'info',
                message:'如要替换上传文件，请先删除之前的文件。'
            });
        },
        //上传版本成功
        updateSuccess(res){
            console.log(res);
            this.updateFile=true;
            this.newVersions.file=res.data.file;
            this.newVersions.fileSize=res.data.size;
            this.$message({
                type:'success',
                message:'上传成功'
            })
        },
        //上传版本失败
        updateError(){
            this.updateFile=false;
            this.$message({
                type:'error',
                message:'上传失败'
            });
            this.$refs.upload.clearFiles();
        },
        fileRemove(){
            this.newVersions.file='';
            this.newVersions.fileSize='';
            this.updateFile=false;
        },
        //下载APK文件
        uploadDown(val){
            let a=document.createElement('a');
            a.href=val.file,
            a.download="拉曼";
            a.click();
        },
        //删除版本
        deleteVersions(id){
            this.$confirm('是否删除该版本？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(()=>{
                this.remove(id);
            })
        },
        getList(){
            this.loading1=true;
            let data={
                'pn':this.cp,
                'ps':this.ps,
                'keyword':''
            };
            this.API.get('/api/admin/version/list',data)
            .then((res)=>{
                if(res.code==0){
                    this.list=res.data.records;
                    this.total=res.data.total;
                    this.cp=res.data.current;
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
        },
        remove(id){
            this.API.post('/api/admin/version/delete'+'?id='+id,)
            .then((res)=>{
                if(res.code==0){
                    this.$message({
                        type:'success',
                        message:res.message
                    });
                    this.getList();
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
        },
        handleCurrentChange(val){
            this.cp=val;
            this.getList();
        },
        handleSizeChange(val){
            this.ps=val;
            this.getList();
        }
        
    },
    created(){
        this.getList();
    }
}
</script>

<style scoped>
    #versions{
        text-align: left;
        width: 100%;
        height: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    #versions #main{
        background-color: #fff;
        padding: 20px;
    }
    #versions .el-button{
        background-color:#798bf2;
        color: #fff;
    }
    #versions .danger{
        background-color:#fef0f0;
        color: #f56c6c;
        border: 1px #fbc4c4 solid;
    }
    #versions .down{
        background-color:#ecf5ff;
        color: #409eff;
        border: 1px #b3d8ff solid;
    }
    #versions h1{
        margin-top: 0;
    }
</style>

