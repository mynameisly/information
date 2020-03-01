<template>
  <div id="courseAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="courseForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="课程:" prop="classRoom">
          <el-input v-model="item.classRoom"  palceholder="请输入教室" clearable/>
        </el-form-item>
        <el-form-item label="上课时间:" prop="remark">
          <el-input v-model="item.remark"  palceholder="请输入上课时间" clearable/>
        </el-form-item>
        <el-form-item label="老师:" prop="teacher">
          <el-input v-model="item.teacher"  palceholder="请输入老师" clearable/>
        </el-form-item>
        <el-form-item label="节次:" prop="festivals">
          <el-input v-model="item.festivals"  palceholder="请输入节次" clearable/>
        </el-form-item>
        <el-form-item label="周次:" prop="week">
          <el-input v-model="item.week"  palceholder="请输入周次" clearable/>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button type="warning" @click="resetForm('courseForm')">取消</el-button>
      <el-button type="success" @click="submitForm('courseForm')">提交</el-button>
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
        classRoom: '',
        teacher: '',
        festivals: '',
        week: '',
        remark: ''
      },
      rules: {
        classRoom: [{ required: true, message: '请输入教室', trigger: 'blur' }],
        teacher: [{ required: true, message: '请输入老师', trigger: 'change' }],
        festivals: [{ required: true, message: '请输入节次', trigger: 'blur' }],
        week: [{ required: true, message: '请输入周次', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入上课时间', trigger: 'blur' }]
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
      }
    },
    submitForm (courseForm) {
      this.$refs.courseForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('courseForm')
          })
        }
      })
    },
    resetForm (courseForm) {
      this.$nextTick(() => {
        this.$refs.courseForm.clearValidate()
      })
      this.item = {}
      this.visible = false
    }
  }
}
</script>

<style lang="scss">

</style>
