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
        <el-select v-model="item.sex" placeholder="请输入性别" clearable>
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
      <el-button type="warning" plain @click="resetForm('userForm')">取消</el-button>
      <el-button type="success" plain @click="submitForm('userForm')">提交</el-button>
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
      type: '',
      uptoken: '',
      userId: '', // 保存从index传过来的userId
      item: {},
      rules: {
        headImg: [{required: true, message: '请选择文件类型', trigger: 'blur'}],
        nickName: [{required: true, message: '请选择文件类型', trigger: 'blur'}],
        telPhone: [{required: true, message: '请选择文件类型', trigger: 'blur'}],
        email: [{required: true, message: '请选择文件类型', trigger: 'blur'}],
        qq: [{required: true, message: '请选择文件类型', trigger: 'blur'}],
        weiXin: [{required: true, message: '请选择文件类型', trigger: 'blur'}],
        sex: [{required: true, message: '请选择文件类型', trigger: 'blur'}],
        readName: [{required: true, message: '请选择文件类型', trigger: 'blur'}],
        birthday: [{required: true, message: '请选择文件类型', trigger: 'blur'}],
        introduce: [{required: true, message: '请选择文件类型', trigger: 'blur'}],
        type: [{required: true, message: '请选择文件类型', trigger: 'blur'}]
      }
    }
  },
  methods: {
    open (item) {
      console.log(item)
      this.visible = true
      if (item === null || item === undefined) {
        this.item = {}
      } else {
        this.userId = item.userId
        this.update()
      }
    },
    update () { // 修改GET /json/user/getUserById 根据id查询用户详情信息
      axios.get('/json/user/getUserById?userId=' + this.userId).then((res) => {
        console.log('enter add update')
        console.log(res.data)
        console.log(res.data.data)
        this.item = res.data.data
      })
    },
    onchange () {

    },
    handleAvatarSuccess () {

    },
    beforeAvatarUpload () {

    },
    submitForm (item) {
      this.$refs.userForm.validate((valid) => {
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
</style>
