<template>
  <div id="discuss">
    <!-- 评论管理 -->
    <el-form v-model="searchForm" :inline="true">
      <el-row>
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
      </el-row>
      <el-row>
        <el-col :span="10" :offset="1">
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
        <el-col :span="8">
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
      </el-row>

      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="评分：">
            <div style="display:flex">
            <el-input type="number" v-model.number="searchForm.startScore" min="0"  @keyup.native="proving($event)" placeholder="请输入最小评分数" clearable/>
            -<el-input type="number" v-model.number="searchForm.endScore" min="0"  @keyup.native="proving($event)" placeholder="请输入最大评分数" clearable/>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="内容：">
            <el-input v-model="searchForm.context" placeholder="请输入内容" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="success" size="medium" icon="el-icon-search" @click="getCommentList(searchForm)">查询评论</el-button>
          <el-button type="warning" size="medium" icon="el-icon-plus" @click="$refs.addDialog.open(null, falg)">新增评论</el-button>
          <el-button type="danger" size="medium" icon="el-icon-delete" @click="delSelect">删除已选</el-button>
          <!-- <el-button type="primary" size="medium" icon="el-icon-view" @click="$refs.detailsDialog.open()">查看评论详情</el-button> -->
          <!-- <el-button type="info" size="medium" icon="el-icon-view" @click="$refs.statNumber.open()">查看评论统计</el-button> -->
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="65%"
      :data="commentList"
      v-loading="loading"
      element-loading-text="拼命加载中"
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
      <el-table-column label="类型" prop="type"/>
      <el-table-column label="用户ID" prop="userId"/>
      <el-table-column label="目标ID" prop="targetId"/>
      <el-table-column label="评分" prop="score"/>
      <el-table-column label="内容" prop="context" width="400"/>
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
    <add-dialog ref="addDialog" title="新增评论/回复/弹幕/动态"  @confirmData="(item) => addComment(item)"/>
    <update-dialog ref="updateDialog" title="修改评论/回复/弹幕/动态" @confirmData="(item) => updateComment(item)" />
    <!-- <details-dialog ref="detailsDialog" title="查看评论详情" /> -->
    <!-- <details-dialog ref="statNumber" title="查看评论统计" /> -->
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChangeIndex(item)" />
  </div>
</template>

<script>
import axios from 'axios'
import PageComponent from '@/components/Pagenation/index'
export default {
  components: {
    PageComponent
  },
  data () {
    return {
      loading: false,
      flag: false, // 默认可以编辑
      searchForm: {
        commentId: '',
        userId: '',
        targetId: '',
        createTimeRange: '',
        startCreateTime: '',
        endCreateTime: '',
        type: '',
        startScore: '',
        endScore: '',
        context: ''
      },
      commentsType: [
        {
          label: '动态',
          value: '动态'
        },
        {
          label: '评论回复',
          value: '评论回复'
        },
        {
          label: '评论视频',
          value: '评论视频'
        },
        {
          label: '弹幕',
          value: '弹幕'
        }
      ],
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
          commentId: this.searchForm.commentId,
          userId: this.searchForm.userId,
          targetId: this.searchForm.targetId,
          startCreateTime: this.searchForm.startCreateTime,
          endCreateTime: this.searchForm.endCreateTime,
          type: this.searchForm.type,
          startScore: this.searchForm.startScore,
          endScore: this.searchForm.endScore,
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
    proving(e) {
      var keyNum = window.event ? e.keyCode : e.which; // 获取键盘码
      var keyChar = String.fromCharCode(keyNum); // 获取键盘码对应的字符
      if (keyNum==189 || keyNum==190 || keyNum==110 || keyNum==109) {
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
    handlePageChangeIndex (item) { // 分页查询
      // console.log(item) // currentPage=1=item.currentPage  pageSize: 0=item.pageSize totalPage: 0  totalSize: 0
      axios.get('/json/comment/list?page=' + item.currentPage + '&limit=' + item.pageSize).then((res) => {
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
