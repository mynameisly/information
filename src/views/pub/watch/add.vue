<template>
  <div id="watchAdd">
    <el-dialog :title="title" :visible.sync="visible" top="10rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="watchForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="视频目标ID：" prop="targetId">
          <el-input v-model="item.targetId"  palceholder="请输入视频目标ID" clearable/>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button type="warning" @click="resetForm('watchForm')">取消</el-button>
      <el-button type="success" @click="submitForm('watchForm')">提交</el-button>
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
        targetId: ''
      },
      rules: {
        targetId: [{ required: true, message: '请输入视频目标ID', trigger: 'blur' }]
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
    submitForm (watchForm) {
      this.$refs.watchForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('watchForm')
          })
        }
      })
    },
    resetForm (watchForm) {
      this.$nextTick(() => {
        this.$refs.watchForm.clearValidate()
      })
      this.visible = false
    }
  }
}
</script>

<style lang="scss">

</style>
