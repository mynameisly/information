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
          <!-- 页面上是视频，实际上传给后台的是视频URL -->
          <el-upload
            ref="upload"
            action="https://jsonplaceholder.typicode.com/posts/"
            drag
            :limit="1"
            :on-remove="handleRemove"
            :on-progress="onProgress"
            :on-success="onSuccess"
            :before-upload="beforeupload"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将视频文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <el-progress :percentage="nowPercent"></el-progress>
          <!-- <el-input v-model="item.mainVideoUrl"  palceholder="请输入课程主视频url" clearable/> -->
        </el-form-item>

        <el-form-item label="教学方式简介:" prop="teachingMethods">
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
      param: '', // 表单要提交的参数
      nowPercent: 0, // 当前文件上传的进度
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
    beforeupload (file) { // 上传视频文件之前限制格式和大小
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
      return extension1 || extension2 || extension3 || extension4 || extension5 || extension6 || extension7 || extension8 || extension9
    },
    onProgress (file) { // 文件上传过程中
      this.nowPercent = Math.floor(event.percent) // 显示视频上传时进度
    },
    onSuccess (file) { // 文件上传成功之后，这里指的是上传到https://jsonplaceholder.typicode.com/posts/成功后拿到mainVideoUrl
      this.param = new FormData()
      this.param.append('type', 'onlineCourseVideo')
      this.videoList.push(file) // 把单个文件变成数组
      let videos = [...this.videoList] // 把数组存储为一个参数，便于后期操作
      videos.forEach((vid, index) => {
        this.param.append('multipartFiles', vid)
      })
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
        console.log(res.data.data[0].previewUrl) // 视频上传成功之后返回的视频的url
        this.item.mainVideoUrl = res.data.data[0].previewUrl
      }).catch(() => false)
    },
    handleRemove (file) {
      // this.$refs.upload.abort() // 取消上传
      // this.$message({message: '成功移除' + file.name, type: 'success'})
    },
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
        this.handleRemove()
        this.$refs.videoForm.clearValidate()
      })
      this.item = {}
      this.nowPercent = 0
      this.visible = false
    }
  }
}
</script>

<style lang="scss">

</style>
