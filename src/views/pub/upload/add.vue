<template>
  <div id="uploadAdd">
    <el-dialog :title="title" :visible.sync="visible" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="uploadForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="文件类型" prop="type">
          <el-select v-model="type"  palceholder="请选择文件类型">
            <el-option
              v-for="item in filesType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件" prop="multipartFiles">
          <el-upload
            drag
            action="https://jsonplaceholder.typicode.com/posts/"
            multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖拽到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">只能上传jpg/png格式的用户头像，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="文件描述" prop="fileDescribe">
          <el-input type="textarea" :rows="4" resize="none" maxlength="200" show-word-limit v-model="item.fileDescribe" palceholder="请输入文件描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button type="warning" plain @click="resetForm('uploadForm')">取消</el-button>
      <el-button type="success" plain @click="submitForm('uploadForm')">提交</el-button>
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
  data() {
    return {
      visible: false,
      type: '',
      item: {
        fileDescribe: ''
      },
      filesType: [
        {
          label: '头像图片',
          value: '头像图片'
        },
        {
          label: '学习资料文件',
          value: '学习资料文件'
        },
        {
          label: '网课视频',
          value: '网课视频'
        }
      ],
      rules: {
        type: [ {required: true, message: '请选择文件类型', trigger: 'change' }],
        multipartFiles: [{ required: true, message: '上传文件', trigger: 'blur' }],
        fileDescribe: [{ required: true, message: '请描述文件', trigger: 'blur' }]
      }
    }
  },
  methods: {
    open(item) {
      this.visible = true
      if (item === null || item === undefined) {
        console.log('add')
      } else {
        this.item = item
      }
    },
    submitForm(uploadForm) {
      this.$refs[uploadForm].validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then( () => {
            this.$emit('confirmData', this.item);
            this.resetForm('uploadForm')
          })
        }
      })
    },
    resetForm(uploadForm) {
      this.$nextTick(() => {
        this.$refs[uploadForm].clearValidate();
      })
      this.visible = false;
    }
  }
}
</script>