<template>
  <div id="upload">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="文件id：">
            <el-input v-model="searchForm.fileId" placeholder="请输入文件id" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户id：">
            <el-input v-model="searchForm.userId" placeholder="请输入用户id" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文件后缀名：">
            <el-input v-model="searchForm.fileSuffix" placeholder="请输入文件后缀名" clearable/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="第几页：">
            <el-input v-model="searchForm.page" placeholder="请输入第几页" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="每页条数：">
            <el-input v-model="searchForm.limit" placeholder="请输入每页条数" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="排序规则：">
            <el-input v-model="searchForm.orderByClause" placeholder="请输入排序规则（默认按创建时间降序）" clearable/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="文件真实名：">
            <el-input v-model="searchForm.fileRealName" placeholder="请输入文件上传时真实名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文件类型：">
            <el-select v-model="searchForm.state" placeholder="请输入文件类型" clearable>
              <el-option label="头像图片" value="头像图片"></el-option>
              <el-option label="学习资料" value="学习资料"></el-option>
              <el-option label="网课视频" value="网课视频"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文件状态：">
            <el-select v-model="searchForm.state" placeholder="请输入文件状态" clearable>
              <el-option label="审核不通过" value="审核不通过"></el-option>
              <el-option label="未审核" value="未审核"></el-option>
              <el-option label="通过审核" value="通过审核"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item>
          <el-button type="success" size="medium" icon="el-icon-search" @click="getUploadList(searchForm)">查询文件</el-button>
          <el-button type="warning" size="mini" @click="$refs.addDialog.open(null)">新增文件</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      :data="uploadList"
      height="80%"
      :cell-style="addBgColorByState"
      @cell-mouse-enter="mouseEnter"
        >
      <el-table-column label="序号" type="index" width="55">
      <!-- <template scope="scope"> -->
            <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1 -->
            <!-- <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span> -->
          <!-- </template> -->
      </el-table-column>
      <el-table-column label="文件名" prop="fileRealName"/>
      <el-table-column label="文件后缀名" prop="fileSuffix"/>
      <el-table-column label="文件类型" prop="type"/>
      <el-table-column label="状态" prop="state"/>
      <el-table-column label="操作" prop="operation">
        <el-button
          type="success"
          size="mini"
          @click="download">
          下载
        </el-button>
        <el-button
          type="primary"
          size="mini"
          @click="$refs.updateDialog.open(uploadData)">
          修改
        </el-button>
        <el-button
          type="danger"
          size="mini"
          @click="del">
          删除
        </el-button>
      </el-table-column>
    </el-table>
    <add-dialog ref="addDialog" title="新增文件" @confirmData="(item) => add(item)" />
    <update-dialog ref="updateDialog" title="修改文件" @confirmData="(item) => update(item)" />
  </div>
</template>

<script>
import AddDialog from './add'
import UpdateDialog from './add'
import axios from 'axios'
export default {
  components: {
    AddDialog,
    UpdateDialog
  },
  data () {
    return {
      searchForm: {
        fileId: '',
        userId: '',
        page: '',
        limit: '',
        orderByClause: '',
        fileRealName: '',
        fileSuffix: '',
        type: '',
        state: ''
      },
      uploadList: [
        {
          fileRealName: 'aaa',
          fileSuffix: '.png',
          type: '图像',
          state: '审核不通过'
        },
        {
          fileRealName: 'bbb',
          fileSuffix: '.txt',
          type: '文本文件',
          state: '未审核'
        },
        {
          fileRealName: 'ccc',
          fileSuffix: '.js',
          type: '脚本文件',
          state: '通过审核'
        }
      ],
      uploadData: {}
    }
  },
  mounted () {
    this.getUploadList()
  },
  methods: {
    getUploadList () {
      const fileId = this.searchForm.fileId
      const userId = this.searchForm.userId
      const page = this.searchForm.page
      const limit = this.searchForm.limit
      const orderByClause = this.searchForm.orderByClause
      const fileRealName = this.searchForm.fileRealName
      const fileSuffix = this.searchForm.fileSuffix
      const type = this.searchForm.type
      const state = this.searchForm.state
      axios.get('/json/file/list?page=' + page + '&limit=' + limit + '&orderByClause=' + orderByClause + '&fileId=' + fileId + '&userId=' + userId +
      '&fileRealName=' + fileRealName + '&fileSuffix=' + fileSuffix + '&type=' + type + '&state=' + state)
        .then((res) => {
          console.log(res.data)
          this.uploadList = res.data
        })
    },
    mouseEnter (data) {
      this.uploadData = Object.assign({}, data)
    },
    addBgColorByState ({row, columnIndex}) {
      if (columnIndex === 4) {
        if (row.state === '审核不通过') {
          return 'color: #e5323e'
        } else if (row.state === '通过审核') {
          return 'color: #22c32e'
        } else if (row.state === '未审核') {
          return 'color: #4cabce'
        }
      }
    },
    add () { // 增加

    },
    update () { // 修改

    },
    download () { // 资料下载
      const fileId = this.uploadData.id;
      axios.get('/json/file/download?fileId=' + fileId).then((res) => {
        console.log(res.data)
        this.uploadList = res.data
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '下载成功'
          })
        } else {
          this.$message({
            type: 'warning',
            message: '下载失败' // 文件不存在或者是其他情况
          })
        }
      })
    },
    del () { // 根据分类id，删除文件，可批量删除，多个id逗号分隔，非管理员只能删除自己上传的文件
      const fileId = this.uploadData.id
      axios.get('/json/file/delete?fileIds=' + fileId).then((res) => {
        console.log(res.data)
        this.uploadList = res.data
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .el-table td, .el-table th {
    text-align: center;
  }
</style>
