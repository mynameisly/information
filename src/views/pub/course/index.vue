<template>
  <div id="course">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="用户ID：">
            <el-input v-model="searchForm.userId" placeholder="请输入通知用户ID" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="success" size="medium" icon="el-icon-search" @click="getCourseList(searchForm)">查询通知</el-button>
          <el-button type="warning" size="medium" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增通知</el-button>
          <el-button type="info" size="medium" icon="el-icon-watch" @click="$refs.searchMyWeek.open(null)">按周查看课表</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="72%"
      :data="courseList"
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
      <el-table-column label="课程" prop="cname"/>
      <el-table-column label="教室" prop="classRoom"/>
      <el-table-column label="老师" prop="teacher"/>
      <el-table-column label="节次" prop="festivals"/>
      <el-table-column label="周次" prop="week"/>
      <el-table-column label="上课时间" prop="remark"/>
      <!-- <el-table-column label="操作" prop="operation" width="100">
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="delcourse">
          删除
        </el-button>
      </el-table-column> -->
    </el-table>
    <add-dialog ref="addDialog" title="新增课程"  @confirmData="(item) => addcourse(item)"/>
    <my-week ref="searchMyWeek" title="我的周课"/>
    <!-- <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" /> -->
  </div>
</template>

<script>
import axios from 'axios'
import AddDialog from './add'
import MyWeek from './myWeek'
// import PageComponent from '@/components/Pagenation/index'
export default {
  components: {
    // PageComponent,
    AddDialog,
    MyWeek
  },
  data () {
    return {
      loading: true,
      searchForm: {
        userId: ''
      },
      courseList: [],
      // courseData: {},
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getCourseList()
  },
  methods: {
    getCourseList () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      // axios.get('/json/academic/find?limit=&title=' + this.searchForm.title).then((res) => {
      axios.get('/json/course/find?userId=1' + this.searchForm.userId).then((res) => {
        // this.page.currentPage = res.data.page.page
        // this.page.pageSize = res.data.page.limit
        // this.page.totalPage = res.data.page.totalPages
        // this.page.totalSize = res.data.page.totalRows
        this.courseList = res.data.data
        console.log(res.data.data)
        this.loading = false
      })
    },
    mouseEnter (data) {
      // this.courseData = Object.assign({}, data)
    },
    addcourse (item) {
      console.log('新增课程', item)
      axios.get('/json/course/find?userId=')
        .then((res) => {
          if (res.data.msg === '无权限') {
            this.$router.push({path: '/401'})
          } else if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增通知成功'
            })
            this.getcourseList()
          }
        })
    },
    // delcourse () {
    //   this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     center: true
    //   }).then((res) => {
    //     axios.get('/json/academic/delete?courseId=' + this.courseData.courseId).then((res) => {
    //       if (res.data.msg === '无权限') {
    //         this.$router.push({path: '/401'})
    //       } else if (res.data.code === 0) {
    //         this.$message({
    //           type: 'success',
    //           message: '删除成功'
    //         })
    //         this.getcourseList()
    //       }
    //     })
    //   }).catch(() => {
    //     this.$message({
    //       type: 'info',
    //       message: '已取消删除'
    //     })
    //   })
    // },
    // handlePageChange (item) { // 分页查询
    //   // console.log('进入到分页', item)// currentPage=1  pageSize=每页30条 totalPage=1页 totalSize=5条
    //   axios.get('/json/course/find?page=' + item.currentPage + '&limit=' + item.pageSize + '&userId=' + this.searchForm.userId).then((res) => {
    //     if (res.data.code === 0) {
    //       this.page.currentPage = res.data.page.page
    //       this.page.pageSize = res.data.page.limit
    //       this.page.totalPage = res.data.page.totalPages
    //       this.page.totalSize = res.data.page.totalRows
    //       this.courseList = res.data.data
    //     }
    //   })
    // }
  }
}
</script>

<style lang="scss">

</style>
