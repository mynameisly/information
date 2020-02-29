<template>
  <div id="discuss">
    <!-- 评论管理 -->
    <el-form v-model="searchForm" :inline="true">
      <!-- <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="动态ID：">
            <el-input v-model="searchForm.commentId" placeholder="请输入动态ID" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户ID：">
            <el-input v-model="searchForm.userId" placeholder="请输入用户ID" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目标ID">
            <el-input v-model="searchForm.targetId" placeholder="请输入目标ID" clearable/>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="6" :offset="1">
          <el-form-item label="内容：">
            <el-input v-model="searchForm.context" placeholder="请输入内容" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="类型：">
            <el-select v-model="searchForm.type"  palceholder="请选择类型" clearable>
              <el-option
                v-for="(item, index) in commentsType"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
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

      <!-- <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="评分：">
            <div style="display:flex">
            <el-input type="number" v-model.number="searchForm.startScore" min="0"  @keyup.native="proving($event)" placeholder="请输入最小评分数" clearable/>
            -<el-input type="number" v-model.number="searchForm.endScore" min="0"  @keyup.native="proving($event)" placeholder="请输入最大评分数" clearable/>
            </div>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-form-item>
          <el-button type="success" size="medium" icon="el-icon-search" @click="getCommentList(searchForm)">查询评论</el-button>
          <el-button type="warning" size="medium" icon="el-icon-plus" @click="$refs.addDialog.open(null, flag)">新增评论</el-button>
          <el-button type="danger" size="medium" icon="el-icon-delete" @click="delSelect">删除已选</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="365px"
      :data="commentList"
      :default-sort = "{prop: 'createTime', order: 'descending'}"
      v-loading="loading"
      element-loading-text="拼命加载中"
      @cell-mouse-enter="mouseEnter"
      @selection-change="handleSelectionChange"
        >
      <el-table-column type="selection" align="center" />
      <el-table-column label="序号" type="index" width="55">
        <template slot-scope="scope">
          <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1 -->
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="用户ID" prop="userId"/>
      <el-table-column label="目标ID" prop="targetId"/>
      <el-table-column label="评分" prop="score"/> -->
      <el-table-column label="类型" prop="type"/>
      <el-table-column label="内容" prop="context" width="700"/>
      <el-table-column label="昵称" prop="userNickName"/>
      <el-table-column label="评论时间" prop="createTime" sortable/>
      <el-table-column label="操作" prop="operation" width="100">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-edit"
          @click="$refs.updateDialog.open(commentData, flag)">
          修改
        </el-button>
      </el-table-column>
    </el-table>
    <add-dialog ref="addDialog" title="新增评论"  @confirmData="(item) => addComment(item)"/>
    <update-dialog ref="updateDialog" title="修改评论" @confirmData="(item) => updateComment(item)" />
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChangeIndex(item)" />
  </div>
</template>

<script>
import axios from 'axios'
import AddDialog from './addDiscuss'
import UpdateDialog from './addDiscuss'
import PageComponent from '@/components/Pagenation/index'
export default {
  name: 'childDiscuss',
  components: {
    AddDialog,
    UpdateDialog,
    PageComponent
  },
  data () {
    return {
      loading: true,
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
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getCommentList() // 查询评论
  },
  methods: {
    getCommentList () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      if (this.searchForm.createTimeRange == null || this.searchForm.createTimeRange == '') {
        this.searchForm.startCreateTime = ''
        this.searchForm.endCreateTime = ''
      } else {
        this.searchForm.startCreateTime = this.formatDateTime(this.searchForm.createTimeRange[0])
        this.searchForm.endCreateTime = this.formatDateTime(this.searchForm.createTimeRange[1])
      }
      axios.get(('/json/comment/list'), {
        params: {
          limit: 10,
          startCreateTime: this.searchForm.startCreateTime,
          endCreateTime: this.searchForm.endCreateTime,
          context: this.searchForm.context
        }
      }).then((res) => {
        // console.log('进入评论管理的查询所有')
        // console.log(res)
        // console.log(res.data)
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        this.commentList = this.handleType(res.data.data)
        // console.log('打印评论管理的查询所有')
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
    proving (e) {
      var keyNum = window.event ? e.keyCode : e.which // 获取键盘码
      // var keyChar = String.fromCharCode(keyNum) // 获取键盘码对应的字符
      if (keyNum === 189 || keyNum === 190 || keyNum === 110 || keyNum === 109) {
        e.target.value = ''
      }
    },
    mouseEnter (data) {
      this.commentData = Object.assign({}, data)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    addComment (item) { // 新增评论
      axios.post('/json/comment/add?targetId=' + item.targetId + '&type=' + item.type + '&score=' + item.score + '&context=' + item.context)
        .then((res) => {
          // console.log('进入新增评论请求')
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
              message: '新增评论成功'
            })
            this.getCommentList()
          }
        })
    },
    updateComment (item) { // 修改评论
      axios.put('/json/comment/update?commentId=' + item.commentId + '&context=' + item.context)
        .then((res) => {
          // console.log('进入修改评论请求')
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
              message: '修改评论成功'
            })
          }
          this.getCommentList()
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
              this.getCommentList()
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
    handleType (data) { // 处理评论管理和评论详情的类型，dynamic=动态,commentReply=评论回复,video=评论视频，barrage=弹幕
      for (let i = 0; i < data.length; i++) {
        if (data[i].type === 'dynamic') {
          this.$set(data[i], 'type', '动态')
        } else if (data[i].type === 'commentReply') {
          this.$set(data[i], 'type', '评论回复')
        } else if (data[i].type === 'video') {
          this.$set(data[i], 'type', '评论视频')
        } else if (data[i].type === 'barrage') {
          this.$set(data[i], 'type', '弹幕')
        }
      }
      return data
    },
    handlePageChangeIndex (item) { // 分页查询
      // console.log(item) // currentPage=1=item.currentPage  pageSize: 0=item.pageSize totalPage: 0  totalSize: 0
      if (this.searchForm.createTimeRange == null || this.searchForm.createTimeRange == '') {
        this.searchForm.startCreateTime = ''
        this.searchForm.endCreateTime = ''
      } else {
        this.searchForm.startCreateTime = this.formatDateTime(this.searchForm.createTimeRange[0])
        this.searchForm.endCreateTime = this.formatDateTime(this.searchForm.createTimeRange[1])
      }
      axios.get(('/json/comment/list'), {
        params: {
          page: item.currentPage,
          limit: item.pageSize,
          startCreateTime: this.searchForm.startCreateTime,
          endCreateTime: this.searchForm.endCreateTime,
          context: this.searchForm.context
        }
      }).then((res) => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.commentList = this.handleType(res.data.data)
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
