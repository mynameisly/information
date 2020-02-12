<template>
<div id="upload">
      <!--elementui的上传图片的upload组件-->
      <el-upload class="upload-demo"
                 ref="upload"
                 list-type="picture-card"
                 action="/ApiUrl?s=/api/sudoku/uploadClock"
                 :limit="9"
                 :on-preview="handlePictureCardPreview"
                 :before-upload="beforeupload"
                 :on-exceed="exceedHandle"
                 :auto-upload="false"
                 :multiple='true'>
        <i class="el-icon-plus"></i>
      </el-upload>
      <!--展示选中图片的区域-->
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%"
             :src="dialogImageUrl"
             alt="">
      </el-dialog>
      <!--elementui的form组件-->
      <el-form ref="form"
               :model="form"
               label-width="80px">
        <el-form-item label="文件类型">
          <el-input v-model="form.name"
                    name="names"
                    style="width:360px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>
<script>
// import { mapMutations } from 'vuex' // 判断token
import axios from 'axios' // 引入axios
axios.defaults.withCredentials = true // 引入axios
export default {
  data () {
    return {
      company_id: '10001',
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      form: {// form里面的参数
        name: ''
      },
      param: '', // 表单要提交的参数
      src: '' // 展示图片的地址
    }
  },
  methods: {
    // ...mapMutations(['changeLogin']),
    // 1，上传前移除事件
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 2，上传前事件
    beforeupload (file) {
      // 2.1，重新写一个表单上传的方法
      this.param = new FormData()
      this.fileList.push(file) // 把单个文件变成数组
      let images = [...this.fileList] // 把数组存储为一个参数，便于后期操作
      // 2.2，遍历数组
      images.forEach((img, index) => {
        this.param.append(`img_${index}`, img) // 把单个图片重命名，存储起来（给后台）
      })
      return false
    },
    // 3，点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 4，表单提交的事件
    onSubmit () {
      let _this = this
      var names = _this.form.name
      this.$refs.upload.submit()
      // 4.1，下面append的东西就会到form表单数据的this.param中；
      this.param.append('company_id', _this.company_id)
      this.param.append('caption', names)
      // this.param.append('token', localStorage.getItem('Authorization'))
      // 4.2，赋予提交请求头，格式为：'multipart/form-data'（必须！！）
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      // 4.3，然后通过下面的方式把内容通过axios来传到后台
      // axios.post('/json/file/add?multipartFiles=' + this.param + '&fileDescribe=头像头像头像&type=headImg', config).then(function (result) {
      axios.post('/json/file/add?type=headImg&fileDescribe=头像文件上传测试&multipartFiles=[]', this.param, config).then(function (result) {
        console.log('111111111111')
        console.log(result.data)
      })
    },
    // 5设置超过9张图给与提示
    exceedHandle () {
      alert('您现在选择已超过9张图，请重新选择')
    }
  }
}
</script>
