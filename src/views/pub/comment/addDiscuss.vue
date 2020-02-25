<template>
  <div id="videoAdd">
    <el-dialog :title="title" :visible.sync="visible" top="5rem" :lock-scroll="false" :show-close="false" :close-on-click-modal="false">
      <el-form ref="commentForm" :model="item" :rules="rules" label-width="100px">
        <!-- <el-form-item label="目标ID：" prop="targetId">
          <el-input v-model="item.targetId"  palceholder="请输入目标ID" clearable disabled="flag"/>
        </el-form-item> -->
        <el-form-item label="类型：" prop="type">
          <el-select v-model="item.type"  palceholder="请选择类型" clearable :disabled="flag">
            <el-option
              v-for="(item, index) in commentsType"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="分数：" prop="score">
          <el-input v-model="item.score"  palceholder="请输入分数" clearable disabled="flag"/>
        </el-form-item> -->
        <el-form-item label="内容：" prop="context">
          <el-input type="textarea" :rows="2" v-model="item.context" resize="none" maxlength="200" show-word-limit palceholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
      <el-button type="warning" @click="resetForm('commentForm')">取消</el-button>
      <el-button type="success" @click="submitForm('commentForm')">提交</el-button>
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
      flag: false,
      item: {
        targetId: '',
        score: '',
        type: '',
        context: ''
      },
      commentsType: [
        {
          label: '动态评论', // 即评论回复
          value: 'commentReply'
        },
        {
          label: '视频评论',
          value: 'video'
        },
        {
          label: '弹幕',
          value: 'barrage'
        }
      ],
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        context: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      }
    }
  },
  methods: {
    open (item, flag) {
      this.visible = true
      if (item === null || item === undefined) {
        flag = false // 新增的时候所有的都可以编辑
      } else {
        this.item = item
        this.commentId = item.commentId
        flag = true // 修改的时候让目标ID、类型、分数禁用
      }
    },
    submitForm (commentForm) {
      this.$refs.commentForm.validate(valid => {
        if (valid) {
          this.$confirm('确认保存吗？', '是否保存', {
            cancelButtonText: '取消',
            confirmButtonText: '确认',
            lockScroll: false,
            type: 'warning'
          }).then(() => {
            this.$emit('confirmData', this.item)
            this.resetForm('commentForm')
          })
        }
      })
    },
    resetForm (commentForm) {
      this.$nextTick(() => {
        this.$refs.commentForm.clearValidate()
      })
      this.item.context = ''
      this.visible = false
    }
  }
}
</script>

<style lang="scss">

</style>
