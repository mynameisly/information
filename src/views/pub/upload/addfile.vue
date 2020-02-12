<template>
  <div id="addfile">
<el-upload
class="upload-demo"
ref="upload"
:action="saveMeals"
:file-list="myFileList"
:on-remove="handleRemove"
:before-upload="beforeUpload"
name="meals"
:data="mdata"
:on-change="fileChange"
:on-success="handleUploadSuccess"
:auto-upload="false">
<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
<font color="red">只能上传xls/xlsx文件</font><br/><br/>
<el-button size="medium" type="success" @click="submitUpload">

<i class="el-icon-upload el-icon--right"> </i>上传到服务器

</el-button>
</el-upload>
  <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
  <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
</el-upload> -->
  </div>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'
export default {
  data () {
    return {
      myFileList:[],
      saveMeals:'',
    }
  },
   created() { // 当 vm 实例 的 data 和 methods 初始化完毕后，vm实例会自动执行created 这个生命周期函数
      this.saveMeals=saveMealsUrl;//controller地址
  },
  methods: {
          
//  beforeUpload (file) {//上传前
//             let Xls = file.name.split('.');
//             if(Xls[1] === 'xls'||Xls[1] === 'xlsx'){
//                 if(this.selectValue==""){
//                     this.$message.error('请选择公司!')
//                     return false
//                 }
//                 this.mdata.corpId=this.selectValue
//                 this.mdata.issue=formatTimeToStr(this.selectIssue, "yyyy-MM");
//                 return file
//             }else {
//                 this.$message.error('上传文件只能是 xls/xlsx 格式!')
//                 return false
//             }
//         },
        submitUpload(){//上传餐费
            if(this.myFileList==null||this.myFileList==''){
                this.$message({type:'error',message:"请选择文件！"})
                return false;
            }
            
            this.$confirm('确认要上传餐费吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {

                 this.$refs.upload.submit();
              });   
        },

      // 上传成功的钩子函数

      handleUploadSuccess(response, file, fileList){
            this.$refs.upload.clearFiles();//移除文件，防止重复上传
            this.$message(response);//显示上传结果
        },

        handleRemove(){//移除文件
            this.myFileList=[];
        },
        fileChange(file, fileList){//限制只能选中一个文件
            this.myFileList=fileList.slice(-1);
        },

  }
}
</script>
