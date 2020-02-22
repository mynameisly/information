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
            <el-select v-model="searchForm.userId" placeholder="请选择用户id" clearable>
              <el-option
                v-for="item in userIds"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <!-- <el-input v-model="searchForm.userId" placeholder="请输入用户id" clearable/> -->
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
          <el-form-item label="文件真实名：">
            <el-input v-model="searchForm.fileRealName" placeholder="请输入文件上传时真实名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文件类型：">
            <el-select v-model="searchForm.type"  palceholder="请选择文件类型" clearable>
              <el-option
                v-for="item in filesType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="文件状态：">
            <el-select v-model="searchForm.state"  palceholder="请选择文件状态" clearable>
              <el-option
                v-for="item in states"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item>
          <el-button type="success" size="medium" icon="el-icon-search" @click="getUploadList(searchForm)">查询文件</el-button>
          <el-button type="warning" size="medium" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增文件</el-button>
          <el-button type="danger" size="medium" icon="el-icon-delete" @click="delSelect">删除已选</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      :data="uploadList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      height="65%"
      :cell-style="addBgColorByState"
      @cell-mouse-enter="mouseEnter"
      @selection-change="handleSelectionChange"
      >
      <el-table-column type="selection" align="center" />
       <!--<el-table-column label="序号" type="index" width="55">
        <template slot-scope="scope">
          (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1 
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="文件名" prop="fileRealName"/>
      <!-- <el-table-column label="文件后缀名" prop="fileSuffix" width="70"/> -->
      <el-table-column label="文件后缀名" prop="fileSuffix"/>
      <el-table-column label="文件类型" prop="type"/>
      <el-table-column label="上传者" prop="uploadUser"/>
      <el-table-column label="文件简介" prop="introduce"/>
      <el-table-column label="状态" prop="state"/>
      <el-table-column label="操作" prop="operation" width="180">
        <el-button
          type="success"
          size="mini"
          icon="el-icon-download"
          @click="download">
          下载
        </el-button>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-edit"
          @click="$refs.updateDialog.open(uploadData)">
          修改
        </el-button>
      </el-table-column>
    </el-table>
    <add-dialog ref="addDialog" title="新增文件"/>
    <update-dialog ref="updateDialog" title="修改文件" @confirmData="(item) => update(item)" />
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
  </div>
</template>

<script>
import AddDialog from './add'
import UpdateDialog from './modify'
import axios from 'axios'
import PageComponent from '@/components/Pagenation/index'
export default {
  components: {
    PageComponent,
    AddDialog,
    UpdateDialog
  },
  data () {
    return {
      loading: false,
      searchForm: {
        fileId: '',
        userId: '',
        page: '',
        limit: '',
        orderByClause: '',
        fileRealName: '',
        fileSuffix: '',
        type: '',
        introduce: '',
        state: ''
      },
      userIds: [],
      uploadList: [],
      uploadData: {},
      multipleSelection: [], // 批量删除
      filesType: [
        {label: '头像图片', value: 'headImg'},
        {label: '学习资料文件', value: 'learningResource'},
        {label: '网课视频', value: 'onlineCourseVideo'}
      ],
      states: [
        {label: '未审核', value: 0},
        {label: '通过审核', value: 1},
        {label: '审核不通过', value: 10}
      ],
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getUploadList()
  },
  methods: {
    getUploadList () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      axios.get(('/json/file/list'), {
        params: {
          fileId: this.searchForm.fileId,
          userId: this.searchForm.userId,
          fileRealName: this.searchForm.fileRealName,
          fileSuffix: this.searchForm.fileSuffix,
          type: this.searchForm.type,
          state: this.searchForm.state
        }
      }).then((res) => {
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        this.uploadList = this.handleState(res.data.data)
        this.loading = false
      })
    },
    handleState (data) { // 处理文件状态 0:未审核，1：通过审核，10：审核不通过 参数data就是res.data.data
      const uploadArr = data
      let upload
      const userIdArr = []
      let noRepeatUserArr = []
      for (var k in uploadArr) {
        upload = uploadArr[k]
        if (upload.state === 0) {
          this.$set(upload, 'state', '未审核')
        } else if (upload.state === 1) {
          this.$set(upload, 'state', '通过审核')
        } else if (upload.state === 10) {
          this.$set(upload, 'state', '审核不通过')
        }

        if (upload.type === 'headImg') {
          this.$set(upload, 'type', '头像图片')
        } else if (upload.type === 'learningResource') {
          this.$set(upload, 'type', '学习资料文件')
        } else if (upload.type === 'onlineCourseVideo') {
          this.$set(upload, 'type', '网课视频')
        }
        upload = uploadArr[k]
        userIdArr.push(upload.userId)
        noRepeatUserArr= Array.from(new Set(userIdArr)) // 用户ID去重后的数组
        upload.uploadUser = upload.uploadUser.number // 上传者为用户账户，因为昵称不是必填项
      }
      for (let i = 0; i < noRepeatUserArr.length; i++) {
        console.log(11111111)
        this.userIds.push({label: noRepeatUserArr[i],value: noRepeatUserArr[i]})
        // this.userIds.push({label: userIdArr[i], value: userIdArr[i]})
        console.log(this.userIds)
      }
      return uploadArr
    },
    mouseEnter (data) {
      this.uploadData = Object.assign({}, data)
      // console.log(this.uploadData)
    },
    addBgColorByState ({row, columnIndex}) {
      if (columnIndex === 6) {
        if (row.state === '审核不通过') {
          return 'color: #e5323e'
        } else if (row.state === '通过审核') {
          return 'color: #22c32e'
        } else if (row.state === '未审核') {
          return 'color: #4cabce'
        }
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    update (item) { // 修改
      axios.put('/json/file/update?fileId=' + item.fileId + '&type=' + item.type + '&state=' + item.state + '&remark=' + item.remark)
        .then((res) => {
          // console.log(res)
          // console.log(res.data)
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
          this.getUploadList()
        })
    },
    download () {
      window.location.href = 'http://120.24.186.190:12346/json/file/download?fileId=' + this.uploadData.fileId
    },
    delSelect () {
      if (this.multipleSelection.length) {
        let fileIds = [] // 保存选中的数据的id
        for (let i = 0; i < this.multipleSelection.length; i++) {
          fileIds.push(this.multipleSelection[i].fileId)
        }
        this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then((res) => {
        // 点击确定后发送请求
          axios.delete('/json/file/delete?fileIds=' + fileIds).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getUploadList()
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$message({
          type: 'warning',
          message: '至少选择一项'
        })
      }
    },
    handlePageChange (item) { // 分页查询
      // console.log(item) // currentPage=1=item.currentPage  pageSize: 0=item.pageSize totalPage: 0  totalSize: 0
      axios.get('/json/file/list?page=' + item.currentPage + '&limit=' + item.pageSize).then((res) => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.uploadList = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
