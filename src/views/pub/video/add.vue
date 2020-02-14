<template>
  <div id="videoAdd">
    <el-dialog :title="title" :visible.sync="visible" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="videoForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="网课名称：" prop="courseName">
          <el-input v-model="item.courseName"  palceholder="请输入网课名称" clearable/>
        </el-form-item>
        <el-form-item label="网课简介：" prop="courseIntroduction">
          <el-input type="textarea" :rows="4" v-model="item.courseIntroduction" resize="none" maxlength="200" show-word-limit palceholder="请输入网课简介"></el-input>
        </el-form-item>

        <el-form-item label="教师名称：" prop="teacherName">
          <el-input v-model="item.teacherName"  palceholder="请输入教师名称" clearable/>
        </el-form-item>
        <el-form-item label="教师简介：" prop="teacherIntroduction">
          <el-input type="textarea" :rows="4" v-model="item.teacherIntroduction" resize="none" maxlength="200" show-word-limit palceholder="请输入教师简介"></el-input>
        </el-form-item>

        <el-form-item label="参考教材：" prop="teachingMaterial">
          <el-input v-model="item.teachingMaterial"  palceholder="请输入参考教材" clearable/>
        </el-form-item>
        <el-form-item label="课程主视频url：" prop="mainVideoUrl">
          <el-input v-model="item.mainVideoUrl"  palceholder="请输入课程主视频url" clearable/>
        </el-form-item>

        <el-form-item label="教学方式简介" prop="teachingMethods">
          <el-input type="textarea" :rows="4" v-model="item.teachingMethods" resize="none" maxlength="200" show-word-limit palceholder="请输入教学方式简介"></el-input>
        </el-form-item>
        <el-form-item label="主讲内容简介" prop="lectureContent">
          <el-input type="textarea" :rows="4" v-model="item.lectureContent" resize="none" maxlength="200" show-word-limit palceholder="请输入主讲内容简介"></el-input>
        </el-form-item>
        <el-form-item label="教学目的简介" prop="instructionalObjective">
          <el-input type="textarea" :rows="4" v-model="item.instructionalObjective" resize="none" maxlength="200" show-word-limit palceholder="请输入教学目的简介"></el-input>
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
      item: {
        type: '',
        fileDescribe: ''
      },
      rules: {
        courseName: [{ required: true, message: '请输入网课名称', trigger: 'blur' }],
        courseIntroduction: [{ required: true, message: '请输入网课简介', trigger: 'blur' }],
        teacherName: [{ required: true, message: '请输入教师名称', trigger: 'blur' }],
        teacherIntroduction: [{ required: true, message: '请输入教师简介', trigger: 'blur' }],
        teachingMaterial: [{ required: true, message: '请输入参考教材', trigger: 'blur' }],
        mainVideoUrl: [{ required: true, message: '请输入课程主视频url', trigger: 'blur' }],
        teachingMethods: [{ required: true, message: '请输入教学方式简介', trigger: 'blur' }],
        lectureContent: [{ required: true, message: '请输入主讲内容简介', trigger: 'blur' }],
        instructionalObjective: [{ required: true, message: '请输入教学目的简介', trigger: 'blur' }]
      }
    }
  },
  methods: {
    open (item) {
      this.visible = true
      if (item === null || item === undefined) {
        console.log('add')
      } else {
        this.item = item
      }
    },
    submitForm (videoForm) {
      this.$refs.videoForm.validate(valid => {
        if (valid) {
          axios({
            method: 'post',
            url: '/json/file/add',
            data: this.param
          }).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '新增文件成功'
              })
              // this.$emit('confirmData', (this.item, res.data.data))
              this.resetForm('uploadForm')
            }
          })
        }
      })
    },
    resetForm (videoForm) {
      this.$nextTick(() => {
        this.$refs[videoForm].clearValidate();
      })
      this.visible = false
    }
  }
}
</script>

<style lang="scss">

</style>
