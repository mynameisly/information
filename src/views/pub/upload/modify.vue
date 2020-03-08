<template>
  <div id="modify">
    <el-dialog :title="title" :visible.sync="visible" top="10rem" :lock-scroll="false" :close-on-click-modal="false">
      <el-form ref="fileForm" :model="item" :rules="rules" label-width="120px">
         <el-form-item label="文件类型" prop="type">
           <el-input v-model="item.type"  disabled/>
          <!-- <el-select v-model="item.type"  palceholder="请选择文件类型" clearable>
            <el-option
              v-for="item in filesType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="文件状态:" prop="state">
          <el-select v-model="item.state"  palceholder="请选择文件状态" clearable>
              <el-option
                v-for="item in states"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea"  v-model="item.remark" :rows="4" resize="none" maxlength="200" show-word-limit palceholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button type="warning" @click="resetForm('fileForm')">取消</el-button>
      <el-button type="success" @click="submitForm('fileForm')">提交</el-button>
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
        type: '',
        state: '',
        remark: ''
      },
      // filesType: [
      //   {
      //     label: '头像图片',
      //     value: 'headImg'
      //   },
      //   {
      //     label: '学习资料文件',
      //     value: 'learningResource'
      //   },
      //   {
      //     label: '网课视频',
      //     value: 'onlineCourseVideo'
      //   }
      // ],
      states: [
        {
          label: '未审核',
          value: 0
        },
        {
          label: '通过审核',
          value: 1
        },
        {
          label: '审核不通过',
          value: 10
        }
      ],
      rules: {
        type: [{ required: true, message: '请选择文件类型', trigger: 'change' }],
        state: [{ required: true, message: '请上传文件', trigger: 'blur' }],
        remark: [{ required: true, message: '请描述文件', trigger: 'blur' }]
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
        this.item.type = '学习资料文件'
      }
    },
    submitForm (item) {
      this.$refs.fileForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('fileForm')
          })
        }
      })
    },
    resetForm (fileForm) {
      this.$nextTick(() => {
        this.$refs.fileForm.clearValidate()
      })
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
</style>
