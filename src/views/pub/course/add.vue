<template>
  <div id="courseAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="courseForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="课程:" prop="cname">
          <el-input v-model="item.cname" placeholder="请输入教室" clearable/>
        </el-form-item>
        <el-form-item label="教室:" prop="classRoom">
          <el-input v-model="item.classRoom" placeholder="请输入教室" clearable/>
        </el-form-item>
        <el-form-item label="老师:" prop="teacher">
          <el-input v-model="item.teacher" placeholder="请输入老师" clearable/>
        </el-form-item>
        <el-form-item label="节次:" prop="festivals">
          <el-input v-model="item.festivals" placeholder="节次之间以英文逗号分隔如5,6" @input="changeCode" clearable/>
        </el-form-item>
        <el-form-item label="星期:" prop="week">
          <el-input type="number" v-model.number="item.week" placeholder="请输入星期" min="1" max="7" clearable/>
        </el-form-item>
        <el-form-item label="上课周次:" prop="remark">
          <el-input v-model="item.remark" placeholder="请输入上课周次" clearable/>
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
export default {
  props: {
    title: String,
    default: 'title'
  },
  data () {
    return {
      visible: false,
      item: {
        cname: '',
        classRoom: '',
        teacher: '',
        festivals: '',
        festivalsList: [],
        week: '',
        remark: ''
      },
      rules: {
        cname: [{ required: true, message: '请输入课程', trigger: 'blur' }],
        classRoom: [{ required: true, message: '请输入教室', trigger: 'blur' }],
        teacher: [{ required: true, message: '请输入老师', trigger: 'blur' }],
        festivals: [{ required: true, message: '请输入节次', trigger: 'blur' }],
        week: [{ required: true, message: '请输入周次', trigger: 'blur' }],
        remark: [{ required: true, message: '请输入上课周次', trigger: 'blur' }]
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
      }
    },
    changeCode () { // 限制节次只能输入数字和英文逗号
      this.item.festivals = this.item.festivals.replace(/[^\d\,]/g,'')
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
