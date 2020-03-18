<template>
  <div id="notice">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="标题：">
            <el-input v-model="searchForm.title" placeholder="请输入通知标题" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="success" size="medium" icon="el-icon-search" @click="getnoticeList(searchForm)">查询通知</el-button>
          <el-button type="warning" size="medium" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增通知</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="72%"
      :data="noticeList"
      :default-sort = "{prop: 'createTime', order: 'descending'}"
      v-loading="loading"
      element-loading-text="拼命加载中"
      @cell-mouse-enter="mouseEnter"
        >
      <el-table-column type="selection" align="center" />
       <el-table-column label="序号" type="index" width="55">
        <template slot-scope="scope">
          <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1  -->
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title"/>
      <el-table-column label="内容" prop="content"/>
      <el-table-column label="发布人" prop="createPerson"/>
      <el-table-column label="发布时间" prop="createTime" sortable/>
      <el-table-column label="操作" prop="operation" width="200">
        <template slot-scope="scope">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-download"
            :disabled="scope.row.fileId == null"
            @click="download">
            下载附件
          </el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="delNotice">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-dialog ref="addDialog" title="新增教务通知"  @confirmData="(item) => addnotice(item)"/>
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
  </div>
</template>

<script>
import AddDialog from './add'
import axios from 'axios'
import PageComponent from '@/components/Pagenation/index'
export default {
  components: {
    PageComponent,
    AddDialog
  },
  data () {
    return {
      loading: true,
      searchForm: {
        title: ''
      },
      noticeList: [],
      noticeData: {},
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getnoticeList()
  },
  methods: {
    getnoticeList () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      // axios.get('/json/academic/find?limit=&title=' + this.searchForm.title).then((res) => {
      axios.get('/json/academic/find?page=1&limit=10&title=' + this.searchForm.title).then((res) => {
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        this.noticeList = res.data.data
        // console.log(res.data.data)
        this.loading = false
      })
    },
    mouseEnter (data) {
      this.noticeData = Object.assign({}, data)
      console.log('this.noticeData',this.noticeData)
    },
    addnotice (item) { // 文件id和人员集合我先写死，回头问问后台
      console.log('新增通知', item)
      axios.get('/json/academic/add?createPerson=' + item.createPerson + '&title=' + item.title + '&content=' + item.content +
      '&createTime=' + item.createTime + '&fileId=' + item.fileId + '&userIdList=1' + item.userIdList)
        .then((res) => {
          if (res.data.msg === '无权限') {
            this.$router.push({path: '/401'})
          } else if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增通知成功'
            })
            this.getnoticeList()
          }
        })
    },
    download () {
      console.log('noticeData',this.noticeData)
      window.location.href = 'http://49.235.55.224:12346/json/file/download?fileId=' + this.noticeData.fileId
    },
    delNotice () {
      this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then((res) => {
        axios.get('/json/academic/delete?noticeId=' + this.noticeData.noticeId).then((res) => {
          if (res.data.msg === '无权限') {
            this.$router.push({path: '/401'})
          } else if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getnoticeList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handlePageChange (item) { // 分页查询
      // console.log('进入到分页', item)// currentPage=1  pageSize=每页30条 totalPage=1页 totalSize=5条
      axios.get('/json/academic/find?page=' + item.currentPage + '&limit=' + item.pageSize + '&title=' + this.searchForm.title).then((res) => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.noticeList = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>

