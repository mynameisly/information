<template>
  <div id="videoAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" width="60%" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="videoForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="网课名称:" prop="courseName">
          <el-input v-model="item.courseName"  palceholder="请输入网课名称" clearable/>
        </el-form-item>
        <el-form-item label="网课简介:" prop="courseIntroduction">
          <el-input type="textarea" :rows="2" v-model="item.courseIntroduction" resize="none" maxlength="200" show-word-limit palceholder="请输入网课简介"></el-input>
        </el-form-item>

        <el-form-item label="教师名称:" prop="teacherName">
          <el-input v-model="item.teacherName"  palceholder="请输入教师名称" clearable/>
        </el-form-item>
        <el-form-item label="教师简介:" prop="teacherIntroduction">
          <el-input type="textarea" :rows="2" v-model="item.teacherIntroduction" resize="none" maxlength="200" show-word-limit palceholder="请输入教师简介"></el-input>
        </el-form-item>

        <el-form-item label="参考教材:" prop="teachingMaterial">
          <el-input v-model="item.teachingMaterial"  palceholder="请输入参考教材" clearable/>
        </el-form-item>
        <el-form-item label="课程视频:" prop="mainVideoUrl">
          <el-upload class="avatar-uploader el-upload--text" 
            action=""
            drag
            :show-file-list="false" 
            :on-change="onchange"
            :before-upload="beforeUploadVideo" 
            :on-progress="uploadVideoProcess">
            <video
              id="myVideo"
              v-if="item.mainVideoUrl !='' && videoFlag == false" 
              :src="item.mainVideoUrl" 
              muted
              class="avatar" 
              width="500px"
              height="300px"
              controls="controls"
              @mouseenter="playVideo"
              @mouseleave="pauseVideo">您的浏览器不支持视频播放</video>
            <i v-else-if="item.mainVideoUrl =='' && videoFlag == false" 
            class="el-icon-plus avatar-uploader-icon"></i>
            <el-progress 
              v-if="videoFlag == true" 
              type="circle" 
              :percentage="videoUploadPercent" 
              style="margin-top:30px;">
            </el-progress>
            <div class="el-upload__tip" slot="tip">支持asx，asf，mpg，wmv，3gp，mp4，mov，avi，flv格式，且不超过10M</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="教学方式简介:" prop="teachingMethods" style="margin-top: 10px">
          <el-input type="textarea" :rows="2" v-model="item.teachingMethods" resize="none" maxlength="200" show-word-limit palceholder="请输入教学方式简介"></el-input>
        </el-form-item>
        <el-form-item label="主讲内容简介:" prop="lectureContent">
          <el-input type="textarea" :rows="2" v-model="item.lectureContent" resize="none" maxlength="200" show-word-limit palceholder="请输入主讲内容简介"></el-input>
        </el-form-item>
        <el-form-item label="教学目的简介:" prop="instructionalObjective">
          <el-input type="textarea" :rows="2" v-model="item.instructionalObjective" resize="none" maxlength="200" show-word-limit palceholder="请输入教学目的简介"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="warning" @click="resetForm('videoForm')">取消</el-button>
        <el-button type="success" @click="submitForm('videoForm')">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  props: {
    title: String,
    default: 'title'
  },
  data () {
    return {
      visible: false,
      uptoken: {
        key: ''
      },
      videoFlag: false,
      videoUploadPercent: 0,
      param: '', // 表单要提交的参数
      videoList: [],
      item: {
        courseName: '',
        courseIntroduction: '',
        teacherName: '',
        teacherIntroduction: '',
        teachingMaterial: '',
        mainVideoUrl: '',
        teachingMethods: '',
        lectureContent: '',
        instructionalObjective: ''
      },
      rules: {
        courseName: [{ required: true, message: '请输入网课名称', trigger: 'blur' }],
        teacherName: [{ required: true, message: '请输入教师名称', trigger: 'blur' }],
        // mainVideoUrl: [{ required: true, message: '请输入课程主视频url', trigger: 'blur' }],
        // courseIntroduction: [{ required: true, message: '请输入网课简介', trigger: 'blur' }],
        // teacherIntroduction: [{ required: true, message: '请输入教师简介', trigger: 'blur' }],
        // teachingMaterial: [{ required: true, message: '请输入参考教材', trigger: 'blur' }],
        // teachingMethods: [{ required: true, message: '请输入教学方式简介', trigger: 'blur' }],
        // lectureContent: [{ required: true, message: '请输入主讲内容简介', trigger: 'blur' }],
        // instructionalObjective: [{ required: true, message: '请输入教学目的简介', trigger: 'blur' }]
      }
    }
  },
  methods: {
    open (item) {
      this.visible = true
      if (item === null || item === undefined) {
        this.item = {}
      } else {
        this.item = item
        this.courseId = item.courseId
        this.update()
      }
    },
    update () { // 根据id查询 网课视频 详情信息
      axios.get('/json/onlineCourse/findById?id=' + this.courseId)
        .then((res) => {
          this.item = res.data.data
        })
    },
    playVideo () {
      document.getElementById('myVideo').play()
    },
    pauseVideo () {
      document.getElementById('myVideo').pause()
    },
    beforeUploadVideo (file) { // 上传视频文件之前限制格式和大小
      let videoFormat = file.name.substring(file.name.lastIndexOf('.') + 1) // 获取上传的文件的格式
      const extension1 = videoFormat === 'asx'
      const extension2 = videoFormat === 'asf'
      const extension3 = videoFormat === 'mpg'
      const extension4 = videoFormat === 'wmv'
      const extension5 = videoFormat === '3gp'
      const extension6 = videoFormat === 'mp4'
      const extension7 = videoFormat === 'mov'
      const extension8 = videoFormat === 'avi'
      const extension9 = videoFormat === 'flv'
      if (!extension1 && !extension2 && !extension3 && !extension4 && !extension5 && !extension6 && !extension7 && !extension8 && !extension9) {
        this.$message({
          type: 'danger',
          message: '上传视频只能是asx，asf，mpg，wmv，3gp，mp4，mov，avi，flv格式'
        })
      }
      const isLt10M = file.size / 1024 / 1024  < 10;
      if (!isLt10M) {
        this.$message.error('上传视频大小不能超过 10MB!')
        return false
      }
      this.videoList.push(file)
      let videos = [...this.videoList]
      videos.forEach((video, index) => {
        this.param.append('multipartFiles', video)
      })
      return extension1 || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8 || extension9 && isLt10M
    },
    uploadVideoProcess(event, file, fileList){
      this.videoFlag = true;
      this.videoUploadPercent = Math.floor(event.percent)
    },
    onchange (file) { //获取视频在服务器上路径
      this.param = new FormData()
      this.param.append('type', 'onlineCourseVideo')
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      axios({
        method: 'post',
        url: '/json/file/add',
        headers: config,
        data: this.param
      }).then((res) => {
        console.log('通过url接口得到视频url')
        this.item.mainVideoUrl = res.data.data[0].previewUrl
        console.log(this.item.mainVideoUrl)
      }).catch(() => false)
    },
    onRemove (file, fileList) {
      
    },
    // onSuccess(res, file) {//获取上传图片地址
    //   this.videoFlag = false;
    //   this.videoUploadPercent = 0;
    //   if(res.status == 200){
    //       // this.videoForm.videoUploadId = res.data.uploadId;
    //       console.log(11111111)
    //     this.item.mainVideoUrl = res.data.data[0].previewUrl
    //   }else{
    //       this.$message.error('视频上传失败，请重新上传！');
    //   }
    // },
    submitForm (videoForm) {
      this.$refs.videoForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('videoForm')
          })
        }
      })
    },
    resetForm (videoForm) {
      this.$nextTick(() => {
        this.$refs.videoForm.clearValidate()
      })
      this.item = {}
      this.pauseVideo()
      this.videoFlag = false;
      this.videoUploadPercent = 0
      this.visible = false
    }
  }
}
</script>

<style lang="scss">

</style>
