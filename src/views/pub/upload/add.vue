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
            ref="upload"
            action="none"
            drag
            multiple
            :auto-upload="false"
            :limit="9"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeupload"
            :on-exceed="exceedHandle"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <!--展示选中图片的区域-->
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%"
              :src="dialogImageUrl"
              alt=""
              >
          </el-dialog>
        </el-form-item>
        <el-form-item label="文件描述" prop="fileDescribe">
          <el-input type="textarea" :rows="4" v-model="item.fileDescribe" resize="none" maxlength="200" show-word-limit palceholder="请输入文件描述"></el-input>
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
      dialogImageUrl: '',
      dialogVisible: false,
      item: {
        type: '',
        fileDescribe: ''
      },
      param: '', // 表单要提交的参数
      src: '', // 展示图片的地址
      fileList: [], // 保存图片的数组
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
        // multipartFiles: [{ required: true, message: '请上传文件', trigger: 'change' }], // 用blur或change都不行，都要拦截掉
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
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传前事件
    beforeupload (file) {
      // 重新写一个表单上传的方法
      this.param = new FormData()
      this.fileList.push(file) // 把单个文件变成数组
      let images = [...this.fileList] // 把数组存储为一个参数，便于后期操作
      // 遍历数组
      images.forEach((img, index) => {
        this.param.append('multipartFiles', img) // 把单个图片重命名，存储起来（给后台）
      })
      return false
    },
    // 设置超过9张图给与提示
    exceedHandle () {
      alert('您现在选择已超过9张图，请重新选择')
    },
    submitForm (uploadForm) {
      this.$refs.uploadForm.validate(valid => {
        if (valid) {
          let _this = this
          this.$refs.upload.submit()
          // 下面append的东西就会到form表单数据的this.param中；
          this.param.append('type', _this.item.type)
          this.param.append('fileDescribe', _this.item.fileDescribe)
          // 赋予提交请求头，格式为：'multipart/form-data'（必须！！）
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
          // 然后通过下面的方式把内容通过axios来传到后台
          axios({
            method: 'post',
            url: '/json/file/add',
            headers: config,
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
