<template>
    <div id="authority">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-bottom:20px;">
            <el-breadcrumb-item >用户权限管理</el-breadcrumb-item>
            <el-breadcrumb-item >角色管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="main" v-loading="loading1">
            <el-button type="primary" @click="openAdd">添加角色</el-button>
            <el-table :border="true" :highlight-current-row="true" :data="list" style="margin-top:30px">
                <el-table-column label="角色名称" prop="nameZh" header-align="center" align="center"></el-table-column>
                <el-table-column label="角色描述" prop="description" header-align="center" align="center"></el-table-column>
                <el-table-column label="操作" prop="" header-align="center" align="center">
                    <template slot-scope="scope">
                        <el-button class="third" size="mini" @click="openSetLimit(scope.row.id)">设置权限</el-button>
                        <el-button class="first" size="mini" @click="editUser(scope.row)" >编辑</el-button>
                        <el-button class="second" size="mini" @click="deleteUser(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <Pagination :cp="cp" :total="total" :ps="ps" @CurrentChange="handleCurrentChange" @SizeChange="handleSizeChange"></Pagination>
        </div>

        <el-dialog :title="dialogName" :visible.sync="dialogVisible" width="400px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form ref="addUser" :model="addUser" :rules="addUserRules" label-width="100px">
                <el-form-item label="角色名称：" prop="name">
                    <el-input v-model="addUser.name"></el-input>
                </el-form-item>
                <el-form-item label="角色描述：" prop="description">
                    <el-input type="textarea" :min-row='2' v-model="addUser.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelAdd('addUser')">取 消</el-button>
                <el-button type="primary" @click="sureAdd('addUser')" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="设置权限" :visible.sync="dialogVisible1" width="400px" center :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form label-width="120px">
                <el-form-item label="">
                    <el-tree
                        :data="menuList"
                        show-checkbox
                        default-expand-all
                        node-key="id"
                        ref="tree"
                        highlight-current
                        :props="defaultProps">
                    </el-tree>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelSetLimit">取 消</el-button>
                <el-button type="primary" @click="sureSetLimit" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from '@/components/pagination'
export default{
    components:{Pagination},
    data(){
        return {
            loading1:false,
            roleId:'',
            list:[],
            cp:1,
            ps:10,
            total:0,
            loading:false,
            dialogVisible:false,
            dialogVisible1:false,
            dialogName:'',
            addUser:{
                name:'',
                description:'',
                id:''
            },
            addUserRules:{
                name:[
                    {required:'true',message:'请输入角色姓名',trigger: 'blur'},
                    {min:1,max:32,message:'长度为1~32位字符',trigger: 'blur'}
                ],
                description:[
                    {required:'true',message:'请输入角色描述',trigger: 'blur'}
                ]
            },
            menuList:[],
            limitMenuList:[],
            defaultProps: {
                children: 'children',
                label: 'name'
            }
        }
    },
    methods:{
        //打开添加用户窗口
        openAdd(){
            this.dialogName="添加角色";
            this.dialogVisible=true;
        },
        //取消添加用户
        cancelAdd(formName){
            this.$refs[formName].resetFields();
            this.addUser.name='';
            this.addUser.description='';
            this.addUser.id='';
            this.dialogVisible=false;
        },
        //确认添加用户
        sureAdd(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    this.loading=true;
                    this.saveUser(formName);
                }else{
                    return false;
                }
            })
        },
        //分页
        handleCurrentChange(val){
            this.cp=val;
        },
        handleSizeChange(val){
            this.ps=val;
        },
        //编辑用户
        editUser(val){
            console.log(val);
            this.dialogName="编辑角色";
            this.addUser.name=val.nameZh;
            this.addUser.description=val.description;
            this.addUser.id=val.id;
            this.dialogVisible=true;
        },
        //删除用户
        deleteUser(id){
            this.$confirm('是否删除该用户？','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
            .then(()=>{
                this.remove(id);
            })
        },
        //打开设置权限窗口
        openSetLimit(id){
            this.roleId=id;
            this.getRoleListId(id);
        },
        //取消设置权限
        cancelSetLimit(){
            this.dialogVisible1=false;
        },
        //确认设置权限
        sureSetLimit(){
            this.loading=true;
            if(this.$refs.tree.getCheckedKeys().length>0){
                this.setRight(this.$refs.tree.getCheckedKeys())
            }else{
                this.$message({
                    type:'info',
                    message:'请至少勾选一个'
                });
            }
            
        },
        getMenuList(){
            this.API.get('/api/menu/listAll')
            .then((res)=>{
                if(res.code==0){
                    this.menuList=res.data;
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
        getRoleListId(id){
            this.API.get('/api/menu/list/'+id)
            .then((res)=>{
                if(res.code==0){
                    this.dialogVisible1=true;
                    this.limitMenuList=res.data.menuList;
                    setTimeout(()=>{
                        this.$refs.tree.setCheckedKeys(this.limitMenuList);
                    },10)
                }else{
                    this.$message({
                        type:'info',
                        message:res.message
                    })
                }
            })
            .catch((err)=>{
                this.$message({
                    tyep:'error',
                    message:err.message
                })
            })
        },
        saveUser(formName){
            let data={
                'nameZh':this.addUser.name,
                'description':this.addUser.description,
                'id':this.addUser.id
            };
            this.API.post('/api/menu/updateRole',data)
            .then((res)=>{
                if(res.code==0){
                    this.getList();
                    this.dialogVisible=false;
                    this.$refs[formName].resetFields();
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
                this.$message({
                    type:'error',
                    message:err.message
                })
            })
            .finally(()=>{
                this.loading=false;
            })
        },
        getList(){
            this.loading1=true;
            this.API.get('/api/menu/listRole?type=1')
            .then((res)=>{
                if(res.code==0){
                    this.list=res.data;
                    this.total=res.data.length;
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
            this.API.post('/api/menu/deleteRole/'+id)
            .then((res)=>{
                if(res.code==0){
                    this.getList();
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
                this.$message({
                    type:'error',
                    message:err.message
                })
            })
        },
        setRight(List){
            let data={
                'menuList':List
            };
            this.API.post('/api/menu/setRight/'+this.roleId,data)
            .then((res)=>{
                if(res.code==0){
                    this.dialogVisible1=false;
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
                this.$message({
                    type:'error',
                    message:err.message
                })
            })
            .finally(()=>{
                this.loading=false;
            })
        }
    },
    created(){
        this.getMenuList();
        this.getList();
    }
}
</script>

<style scoped>
    #authority{
        text-align: left;
        width: 100%;
        height:100%;
        box-sizing: border-box;
        padding: 20px;
    }
    #authority .el-checkbox{
        width:100%;
    }
    #authority .el-checkbox+.el-checkbox{
        margin-left:0;
    }
    #main{
        padding: 20px;
        background-color: #fff;
    }
    #main .el-button{
        color: #fff;
        background-color: #798bf2;
    }
    #main .first{
        background-color:#f0f9eb;
        color:#7dc35b;
        border: 1px solid #c2e7b0;
    }
    #main .second{
        background-color:#fef0f0;
        color:#f66c96;
        border: 1px solid #fbc4c4;
    }
    #main .third{
        background-color:#2a96f9;
        color:#fff;
        border: none;
    }
</style>

