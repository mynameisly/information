<template>
  <div id="uploadAdd">
    <el-dialog :title="title" :visible.sync="visible" top="1.5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="userForm" :model="item" :rules="rules" label-width="120px">
      <el-form-item label="用户名:" prop="number">
        <el-input v-model="item.number" placeholder="请输入用户名" clearable/>
      </el-form-item>
      <el-form-item label="真实姓名:" prop="readName">
        <el-input v-model="item.readName" placeholder="请输入真实姓名" clearable/>
      </el-form-item>
      <el-form-item label="昵称:" prop="nickName">
        <el-input v-model="item.nickName" placeholder="请输入昵称" clearable/>
      </el-form-item>
      <el-form-item label="性别:" prop="sex">
        <el-select v-model="item.sex" placeholder="请选择性别" clearable>
          <el-option label="男" value="男"></el-option>
          <el-option label="女" value="女"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生日:" prop="birthday">
        <el-date-picker
            clearable
            v-model="item.birthday"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请输入生日"
          />
      </el-form-item>
      <el-form-item label="头像" prop="headImg">
          <!-- 图片的url和数据库里面的varchar是一样的 -->
          <el-upload
            class="avatar-uploader"
            action=""
            :data="uptoken"
            :show-file-list="false"
            :on-change="onchange"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="item.headImg" :src="item.headImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过2M</div>
          </el-upload>
        </el-form-item>
      <el-form-item label="手机号码:" prop="telPhone">
        <el-input v-model="item.telPhone" placeholder="请输入手机号码" clearable/>
      </el-form-item>
      <el-form-item label="微信:" prop="weiXin">
        <el-input v-model="item.weiXin" placeholder="请输入微信" clearable/>
      </el-form-item>
      <el-form-item label="qq:" prop="qq">
        <el-input v-model="item.qq" placeholder="请输入qq" clearable/>
      </el-form-item>
      <el-form-item label="email:" prop="email">
        <el-input v-model="item.email" placeholder="请输入email" clearable/>
      </el-form-item>
        <el-form-item label="个人简介" prop="introduce">
          <el-input type="textarea"  v-model="item.introduce" :rows="4" resize="none" maxlength="200" show-word-limit palceholder="请输入个人简介"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="warning" @click="resetForm('userForm')">取消</el-button>
        <el-button type="success" @click="submitForm('userForm')">提交</el-button>
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
    const validateTelPhone = (rule, value, callback) => { // 验证手机号码
      if (value === '') {
        callback(new Error('请输入手机号码'))
      } else {
        if (value !== '') {
          var regTelPhone = /^1[3456789]\d{9}$/
          if (!regTelPhone.test(value)) {
            callback(new Error('请输入有效的手机号码'))
          } else {
            callback()
          }
        }
      }
    }
    const validateEmail = (rule, value, callback) => { // 验证邮箱
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else {
        if (value !== '') {
          var regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          if (!regEmail.test(value)) {
            callback(new Error('请输入有效的邮箱'))
          } else {
            callback()
          }
        }
      }
    }
    return {
      visible: false,
      param: '', // 表单要提交的参数
      type: '',
      uptoken: {
        key: ''
      },
      userId: '', // 保存从index传过来的userId
      item: {
        headImg: '',
        nickName: '',
        qq: '',
        weiXin: '',
        birthday: '',
        introduce: '',
        telPhone: '',
        email: '',
        sex: '',
        readName: '',
      },
      fileList: [], // 保存图片的数组
      rules: {
        // headImg: [{required: true, message: '请上传头像', trigger: 'blur'}],
        // qq: [{required: true, message: '请输入QQ号', trigger: 'blur'}],
        // weiXin: [{required: true, message: '请输入微信号', trigger: 'blur'}],
        // birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        // introduce: [{required: true, message: '请输入个人简介', trigger: 'blur'}],
        nickName: [{required: true, message: '请输入昵称', trigger: 'blur'}],
        telPhone: [{required: true, validator: validateTelPhone, trigger: 'blur'}],
        email: [{required: true, validator: validateEmail, trigger: 'blur'}],
        sex: [{required: true, message: '请选择性别', trigger: 'blur'}],
        readName: [{required: true, message: '请输入真实姓名', trigger: 'blur'}]
      }
    }
  },
  methods: {
    open (item) {
      this.visible = true
      if (item === null || item === undefined) {
        this.item = {}
      } else {
        this.userId = item.userId
        this.updateById()
      }
    },
    // 检测选择的图片是否合适
    beforeAvatarUpload (file) {
      this.uptoken.key = file.name
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG && !isPNG) { // 如果不是jpg，也不是png的时候就弹出这条信息
        this.$message.error('上传头像图片只能是 JPG或PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      console.log('上传前事件')
      // 重新写一个表单上传的方法
      // this.param = new FormData()
      this.fileList.push(file) // 把单个文件变成数组
      let images = [...this.fileList] // 把数组存储为一个参数，便于后期操作
      // 遍历数组
      images.forEach((img, index) => {
        this.param.append('multipartFiles', img) // 把单个图片重命名，存储起来（给后台）
      })

      return isJPG || isPNG && isLt2M
    },
    onchange (file) { // 当上传图片后，调用onchange方法，获取图片本地路径
      this.param = new FormData()
      this.param.append('type', 'headImg')
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
        console.log('通过url接口得到图片url')
        console.log(res.data.data[0].previewUrl) // 图片上传成功之后返回的图片的url
        this.item.headImg = res.data.data[0].previewUrl
      }).catch(() => false)
    },
    updateById () { // 修改GET /json/user/getUserById 根据id查询用户详情信息
      axios.get('/json/user/getUserById?userId=' + this.userId).then((res) => {
        this.item = res.data.data
      })
    },
    submitForm (userForm) {
      this.$refs.userForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('userForm')
          })
        }
      })
    },
    resetForm (userForm) {
      this.$nextTick(() => {
        this.$refs.userForm.clearValidate()
      })
      this.visible = false
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  text-align: left;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.el-upload__tip {
  margin-top: 0;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>
