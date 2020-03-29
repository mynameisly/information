<template>
  <div id="course">
      <el-form :inline="true">
      <el-row>
        <el-form-item>
          <el-button type="warning" size="medium" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增课表</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table
      border
      height="400px"
      :data="courseList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      @cell-mouse-enter="mouseEnter"
      >
       <el-table-column label="序号" type="index" width="55">
        <template slot-scope="scope">
          <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1  -->
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程" prop="cname"/>
      <el-table-column label="教室" prop="classRoom"/>
      <el-table-column label="老师" prop="teacher"/>
      <el-table-column label="节次" prop="festivalsList"/>
      <el-table-column label="星期" prop="week"/>
      <el-table-column label="上课周次（周）" prop="remark"/>
      <el-table-column label="操作" prop="operation" width="100">
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="delcourse">
          删除
        </el-button>
      </el-table-column>
    </el-table>
    <add-dialog ref="addDialog" title="新增课程"  @confirmData="(item) => addcourse(item)"/>
    <!-- <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" /> -->
  </div>
</template>

<script>
import axios from 'axios'
import AddDialog from './add'
// import PageComponent from '@/components/Pagenation/index'
export default {
  name: 'allCourse',
  components: {
    // PageComponent,
    AddDialog
  },
  data () {
    return {
      loading: true,
      userId: '',
      courseList: [],
      courseData: {},
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.userId = sessionStorage.getItem('userId')
    console.log(this.userId)
    this.getCourseList()
  },
  methods: {
    getCourseList () {
      axios.get('/json/course/find?userId=' + this.userId).then((res) => {
        // this.page.currentPage = res.data.page.page
        // this.page.pageSize = res.data.page.limit
        // this.page.totalPage = res.data.page.totalPages
        // this.page.totalSize = res.data.page.totalRows
        if(res.data.code === 0) {
          this.courseList = res.data.data
          this.loading = false
        } else if (res.data.code === 3) {
          this.$message({
            type: 'info',
            message: '登录已过期，请重新登录'
          })
          this.$router.push({name: 'login'})
        }
      })
    },
    mouseEnter (data) {
      this.courseData = Object.assign({}, data)
    },
    addcourse (item) {
      let list = []
      let params = {
        userId: Number(this.userId),
        cName: item.cname,
        week: Number(item.week),
        festivals: item.festivals,
        classRoom: item.classRoom,
        teacher: item.teacher,
        remark: item.remark
      }
      list.push(params)
      this.$http({
        url: '/json/course/add',
        method: 'post',
        headers: { 'content-type': 'application/json;charset=utf-8' },
        data: JSON.stringify(list)
      }).then((res) => {
        console.log(2222222)
        console.log(res)
        // console.log(res.data)
        // console.log('返回结果是',res.data.code)
        if (res === undefined) {
          this.$message({
            type: 'success',
            message: '新增课程成功'
          })
        }
        this.getCourseList()
      })
    },
    delcourse () {
      this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then((res) => {
        axios.get('/json/course/delete?userId=' + this.userId + '&cId=' + this.courseData.cid).then((res) => {
          if (res.data.msg === '无权限') {
            this.$router.push({path: '/401'})
          } else if (res.data.code === 0) {
            console.log('删除数据返回', res.data)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.getCourseList()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
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
#course .el-table__body-wrapper {
  // height: 320px;
}
</style>
