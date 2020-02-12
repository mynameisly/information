 <template>
    <div id="file">
      <div class="fileItem">
        <!-- //上传文件的input，type设置为file -->
        <input type="file" ref="fileId" @change="getFile">
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      xlsxFile:''
    }
  },
  methods:{
    getFile () {
      // 获取file内容
      let files = this.$refs.fileId.files[0]
      this.xlsxFile = files
    },
    // 上传文件
    importRow () {
      let that = this
      if (that.xlsxFile == '') {
        that.$message.error('请先添加文件')
        return
      }
      // vue 中使用 window.FormData(),否则会报 'FormData isn't definded'
      // 创建一个FormData对象，然后通过append() 方法向对象中添加键值对
      let formData = new window.FormData()
      formData.append("file", that.xlsxFile)
      // that.importUrl 上传的接口url
      that.$axios.post(
        // that.importUrl,
        'E:/files',
        formData
      ).then(function (response) {
        that.$message.success('上传成功')
      }).catch(function (error) {
        that.$message.error(res.data.msg)
      })
    }
  }
}
</script>
