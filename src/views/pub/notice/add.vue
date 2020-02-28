<template>
  <div id="noticeAdd">
    <el-dialog :title="title" :visible.sync="visible" top="0.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="noticeForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="发布人:" prop="createPerson">
          <el-input v-model="item.createPerson"  palceholder="请输入发布人" clearable/>
        </el-form-item>
        <el-form-item label="发布时间:" prop="createTime">
          <el-date-picker
            v-model="item.createTime"
            type="datetime"
            placeholder="请输入发布时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="标题:" prop="title">
          <el-input v-model="item.title"  palceholder="请输入标题" clearable/>
        </el-form-item>
        <el-form-item label="通知内容:" prop="content">
          <el-input type="textarea" :rows="2" v-model="item.content" resize="none" maxlength="200" show-word-limit palceholder="请输入通知内容"></el-input>
        </el-form-item>
        <!-- <el-form-item label="文件ID:" prop="fileId">
          <el-input v-model="item.fileId"  palceholder="请输入文件ID" clearable/>
        </el-form-item>
        <el-form-item label="人员集合:" prop="userIdList">
          <el-input v-model="item.userIdList"  palceholder="请输入人员集合" clearable/>
        </el-form-item> -->
      </el-form>
      <span slot="footer">
      <el-button type="warning" @click="resetForm('noticeForm')">取消</el-button>
      <el-button type="success" @click="submitForm('noticeForm')">提交</el-button>
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
        createPerson: '',
        createTime: '',
        title: '',
        content: '',
        fileId: '',
        userIdList: ''
      },
      rules: {
        createPerson: [{ required: true, message: '请输入发布人', trigger: 'blur' }],
        createTime: [{ required: true, message: '请输入发布时间', trigger: 'change' }],
        title: [{ required: true, message: '请输入通知标题', trigger: 'blur' }],
        content: [{ required: true, message: '请输入通知内容', trigger: 'blur' }],
        // fileId: [{ required: true, message: '请输入文件ID', trigger: 'blur' }],
        // userIdList: [{ required: true, message: '请输入人员集合', trigger: 'blur' }]
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
    formateDate (date) {
      let theDate = new Date(date)
      let year = theDate.getFullYear()
      let month = theDate.getMonth() + 1
      let day = theDate.getDate()
      let hour = theDate.getHours()
      let minute = theDate.getMinutes()
      let second = theDate.getSeconds()
      return year + '-' + this.formatTen(month) + '-' + this.formatTen(day) + ' ' + this.formatTen(hour) + ':' + this.formatTen(minute) + ':' + this.formatTen(second)
    },
    formatTen (num) {
      return num > 9 ? (num + '') : ('0' + num)
    },
    submitForm (noticeForm) {
      this.item.createTime = this.formateDate(this.item.createTime)
      this.$refs.noticeForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('noticeForm')
          })
        }
      })
    },
    resetForm (noticeForm) {
      this.$nextTick(() => {
        this.$refs.noticeForm.clearValidate()
      })
      this.item = {}
      this.visible = false
    }
  }
}
</script>

<style lang="scss">

</style>
