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
      <el-form-item label="头像图片url" prop="headImg">
          <!-- 图片的url和数据库里面的varchar是一样的 -->
          <el-upload
            ref="upload"
            action="none"
            drag
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :before-upload="beforeupload"
            :on-exceed="exceedHandle"
            :on-change="fileSaveToUrl"
            >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
          <el-input type="textarea"  v-model="item.headImg" :rows="4" resize="none" maxlength="255" show-word-limit palceholder="请输入头像图片url"></el-input>
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
      <el-button type="success" plain @click="submitForm('userForm')">提交</el-button>
      <el-button type="warning" plain @click="resetForm('userForm')">取消</el-button>
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
          }
        }
      }
    }
    return {
      visible: false,
      type: '',
      uptoken: '',
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
      rules: {
        // headImg: [{required: true, message: '请上传头像', trigger: 'blur'}],
        // nickName: [{required: true, message: '请输入昵称', trigger: 'blur'}],
        // qq: [{required: true, message: '请输入QQ号', trigger: 'blur'}],
        // weiXin: [{required: true, message: '请输入微信号', trigger: 'blur'}],
        // birthday: [{required: true, message: '请输入出生日期', trigger: 'blur'}],
        // introduce: [{required: true, message: '请输入个人简介', trigger: 'blur'}],
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
    handlePictureCardPreview () {

    },
    beforeupload (file) {
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
      return isJPG || isPNG && isLt2M
    },
    exceedHandle () {

    },
    fileSaveToUrl (file) {
      let URL = window.URL || window.webkitURL
      this.item.headImg = URL.createObjectURL(file.raw)
    },
    updateById () { // 修改GET /json/user/getUserById 根据id查询用户详情信息
      axios.get('/json/user/getUserById?userId=' + this.userId).then((res) => {
        this.item = res.data.data
      })
    },
    submitForm (item) {
      // this.$refs.userForm.validate((valid) => {
        // if (valid) {
          console.log('if')
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            console.log('进入到submit方法')
            this.resetForm('userForm')
          })
        // }
      // })
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
</style>
