<template>
  <div id="videoAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
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
        <el-form-item label="课程主视频url:" prop="mainVideoUrl">
          <el-upload
            ref="upload"
            action="none"
            drag
            multiple
            :auto-upload="false"
            :limit="9"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeupload"
            :on-exceed="exceedHandle"
            :on-change="fileSaveToUrl"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
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
      localFile: {},
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
        // courseIntroduction: [{ required: true, message: '请输入网课简介', trigger: 'blur' }],
        teacherName: [{ required: true, message: '请输入教师名称', trigger: 'blur' }],
        // teacherIntroduction: [{ required: true, message: '请输入教师简介', trigger: 'blur' }],
        // teachingMaterial: [{ required: true, message: '请输入参考教材', trigger: 'blur' }],
        mainVideoUrl: [{ required: true, message: '请输入课程主视频url', trigger: 'blur' }],
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
        // this.item = null
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
    handlePictureCardPreview() {

    },
    beforeupload () {

    },
    exceedHandle () {

    },
    fileSaveToUrl (file) {
      this.localFile = file.raw
      let render = new FileReader() // 转换操作，可以不放在这里面，多次触发
      render.readAsDataURL(this.localFile)
      render.onload = () => {
        console.log('进入到file转换为URL')
        console.log(render.result)
      }
      /* 另外一种本地预览方法 */
      let URL = window.URL || window.webkitURL;
      console.log(URL.createObjectURL(file.raw)); 
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
        this.$refs.videoForm.clearValidate()
      })
      this.visible = false
    }
  }
}
</script>

<style lang="scss">

</style>
