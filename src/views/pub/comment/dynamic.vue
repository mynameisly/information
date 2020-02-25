<template>
  <div id="dynamic">
    <!-- 动态管理 -->
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="动态内容：">
            <el-input v-model="searchForm.context" placeholder="请输入动态内容" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发布时间：">
            <el-date-picker
              v-model="searchForm.createTimeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="起始发布时间"
              end-placeholder="结束发布时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="success" size="medium" icon="el-icon-search" @click="getDynamicList(searchForm)">查询动态</el-button>
          <el-button type="warning" size="medium" icon="el-icon-plus" @click="$refs.addDialog.open(null, falg)">新增动态</el-button>
          <el-button type="danger" size="medium" icon="el-icon-delete" @click="delSelect">删除已选</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="365px"
      :data="commentList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      @cell-mouse-enter="mouseEnter"
      @selection-change="handleSelectionChange"
        >
      <el-table-column type="selection" align="center" />
      <el-table-column label="序号" type="index" width="55">
        <template slot-scope="scope">
          <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1  -->
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="类型" prop="type"/>
      <el-table-column label="用户ID" prop="userId"/>
      <el-table-column label="目标ID" prop="targetId"/>
      <el-table-column label="评分" prop="score"/> -->
      <el-table-column label="内容" prop="context" width="800"/>
      <el-table-column label="昵称" prop="userNickName"/>
      <el-table-column label="发布时间" prop="createTime" />
      <el-table-column label="操作" prop="operation"  width="100">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-edit"
          @click="$refs.updateDialog.open(commentData, flag)">
          修改
        </el-button>
      </el-table-column>
    </el-table>
    <add-dialog ref="addDialog" title="新增动态"  @confirmData="(item) => addComment(item)"/>
    <update-dialog ref="updateDialog" title="修改动态" @confirmData="(item) => updateComment(item)" />
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChangeIndex(item)" />
  </div>
</template>

<script>
import axios from 'axios'
import AddDialog from './addDynamic'
import UpdateDialog from './addDynamic'
import PageComponent from '@/components/Pagenation/index'
export default {
  name: 'childDynamic',
  components: {
    AddDialog,
    UpdateDialog,
    PageComponent
  },
  data () {
    return {
      loading: false,
      flag: false, // 默认可以编辑
      searchForm: {
        createTimeRange: '',
        startCreateTime: '',
        endCreateTime: '',
        context: ''
      },
      commentList: [],
      commentData: {},
      multipleSelection: [], // 批量删除
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getDynamicList() // 查询动态
  },
  methods: {
    getDynamicList () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      if (this.searchForm.createTimeRange == null || this.searchForm.createTimeRange == '') {
        this.searchForm.startCreateTime = ''
        this.searchForm.endCreateTime = ''
      } else {
        this.searchForm.startCreateTime = this.formatDateTime(this.searchForm.createTimeRange[0])
        this.searchForm.endCreateTime = this.formatDateTime(this.searchForm.createTimeRange[1])
      }
      axios.get(('/json/comment/dynamicList'), {
        params: {
          startCreateTime: this.searchForm.startCreateTime,
          endCreateTime: this.searchForm.endCreateTime,
          context: this.searchForm.context
        }
      }).then((res) => {
        // console.log('进入动态管理的查询所有')
        // console.log(res)
        // console.log(res.data)
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        this.commentList = res.data.data
        // console.log('打印动态管理的查询所有')
        // console.log(this.commentList)
        this.loading = false
      })
    },
    formatDateTime (date) { // 把标准格式转换为年月日
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    mouseEnter (data) {
      this.commentData = Object.assign({}, data)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    addComment (item) { // 新增动态
      axios.post('/json/comment/add?targetId=' + item.targetId + '&type=dynamic' + item.type + '&score=' + item.score + '&context=' + item.context)
        .then((res) => {
          // console.log('进入新增动态请求')
          // console.log(res.data)
          if (res.data.msg === '未登录') {
            this.$message({
              type: 'dangert',
              message: '请登录'
            })
            this.$router.push({jpath: '/login'})
          } else if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增动态成功'
            })
            this.getDynamicList()
          }
        })
    },
    updateComment (item) { // 修改动态
      axios.put('/json/comment/update?commentId=' + item.commentId + '&context=' + item.context)
        .then((res) => {
          // console.log('进入修改动态请求')
          // console.log(res.data)
          if (res.data.msg === '未登录') {
            this.$message({
              type: 'dangert',
              message: '请登录'
            })
            this.$router.push({jpath: '/login'})
          } else if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '修改动态成功'
            })
          }
          this.getDynamicList()
        })
    },
    delSelect () {
      if (this.multipleSelection.length) {
        let commentIds = [] // 保存选中的数据的id
        for (let i = 0; i < this.multipleSelection.length; i++) {
          commentIds.push(this.multipleSelection[i].commentId)
        }
        this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then((res) => {
        // 点击确定后发送请求
          axios.delete('/json/comment/delete?ids=' + commentIds).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getDynamicList()
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
    handlePageChangeIndex (item) { // 分页查询
      // console.log(item) // currentPage=1=item.currentPage  pageSize: 0=item.pageSize totalPage: 0  totalSize: 0
      axios.get('/json/comment/list?page=' + item.currentPage + '&limit=' + item.pageSize).then((res) => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.commentList = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
