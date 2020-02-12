<template>
  <div id="uploadAdd">
    <el-dialog :title="title" :visible.sync="visible" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="uploadForm" :model="item" :rules="rules" label-width="100px">
        <el-form-item label="文件类型" prop="type">
          <el-select v-model="item.type"  palceholder="请选择文件类型" clearable>
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
            ref="headImgFile"
            :show-file-list="false"
            :auto-upload="false"
            drag
            action="none"
            :on-change="checkType"
            :http-request="uploadFile"
            accept="image/jpeg, image/png, image/jpg"
            >
            <i class="el-icon-upload"></i>
            <!-- <div>
              <el-avatar icon="el-icon-user-solid" shape="circle" :size="100" fit="cover" :src="headImgUrl"></el-avatar>
            </div> -->
            <!-- <div class="el-upload__text">将文件拖拽到此处，或<em>点击上传</em></div> -->
            <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png格式的用户头像，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
        <el-form-item label="文件描述" prop="fileDescribe">
          <el-input type="textarea" :rows="4" resize="none" maxlength="200" show-word-limit v-model="item.fileDescribe" palceholder="请输入文件描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button type="warning" @click="resetForm('uploadForm')">取消</el-button>
      <el-button type="success" @click="submitForm('uploadForm')">提交</el-button>
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
      currentFile: null, // 代表当前文件，每次用户选择文件，就调用 on-change钩子
      headImgFile: null, // 用户头像文件，每次用户选择头像此属性就会改变，提交时就使用此属性
      headImgUrl: '', 
      formDate: '',
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
        type: [{ required: true, message: '请选择文件类型', trigger: 'change' }],
        // multipartFiles: [{ required: true, message: '请上传文件', trigger: 'blur' }],
        fileDescribe: [{ required: true, message: '请描述文件', trigger: 'blur' }]
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
    uploadFile (file) {
      console.log(file.file)
      console.log("uploadFile")
      this.formDate.append('org_files', file.file)
    },
    checkType (file, fileList) {
      // 截取文件类型
      let fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
      fileList = []
      if (fileType !== 'jpeg' && fileType !== 'jpg' && fileType !== 'png') {
        this.message({
          message: '头像格式不正确'
        })
        return false
      }
      if (file.size / 1024 / 1024 > 1.5) {
        this.message({
          message: '头像大小不能超过1.5M'
        })
        return false
      }
      this.headImgFile = file
      this.headImgUrl = URL.createObjectURL(this.headImgFile.raw)
      console.log('进入checkType')
    }, 
    submitForm (uploadForm) {
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          console.log("submitUpload")
          this.formDate = new FormData()
          this.$refs.upload.submit(); // 执行此步骤 相当于执行 http-request 的自定义实现方法
          // this.formDate.append('其他参数名称', "*****")
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          let formData = new FormData()
          console.log(this.headImgFile)
          formData.append('headImgFile', this.headImgFile.raw)
          axios.post('/json/file/add?multipartFiles=' + this.formDate + '&fileDescribe=头像头像头像&type=headImg', config).then((res) => {
            console.log('点击了提交')
            console.log(res.data)
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '新增文件成功'
              })
            }
          })
          // this.$confirm('确认保存吗？', '是否保存', {
          //   cancelButtonText: '取消',
          //   confirmButtonText: '确认',
          //   lockScroll: false,
          //   type: 'warning'
          // }).then( () => {
          //   this.$emit('confirmData', this.item);
          //   this.resetForm('uploadForm')
          // })
        }
      })
    },
    resetForm (uploadForm) {
      this.$nextTick(() => {
        this.$refs[uploadForm].clearValidate();
      })
      this.visible = false
    }
  }
}
</script>

<style lang="scss">

</style>
