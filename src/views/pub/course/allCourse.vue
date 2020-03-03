<template>
  <div id="course">
      <el-form :inline="true">
      <!--<el-row>
       <el-col :span="7" :offset="1">
          <el-form-item label="用户ID：">
            <el-input v-model="searchForm.userId" placeholder="请输入通知用户ID" clearable/>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-form-item>
          <!-- <el-button type="success" size="medium" icon="el-icon-search" @click="getCourseList(searchForm)">查询课表</el-button> -->
          <el-button type="warning" size="medium" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增课表</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="400px"
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
      <el-table-column label="节次" prop="festivalsList"/>
      <el-table-column label="星期" prop="week"/>
      <el-table-column label="上课周次（周）" prop="remark"/>
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
    <!-- <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" /> -->
  </div>
</template>

<script>
import axios from 'axios'
import AddDialog from './add'
import qs from 'qs'
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
    this.getCourseList()
    this.userId = sessionStorage.getItem('userId')
  },
  methods: {
    getCourseList () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      axios.get('/json/course/find?userId=1' + this.userId).then((res) => {
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
      this.courseData = Object.assign({}, data)
    },
    addcourse (item) {
      console.log('新增课程', item)
      // console.log(typeof(item))

      // this.$http.post("/demo/testListParam",{"jsonStr":JSON.stringify(list),"id":parseInt(this.id),"reason":this.reason} , {
      //             }).then(res => {
      //               if (res.resultCode == 200 ) {
      //                 console.log("data:"+res.data);

      //               } else {
      //                 setTimeout(() => {
      //                   this.instance("error", "提示",  res.message);
      //                 }, 500);
      //               }
      // const data = {
      //   userId: 13,
      //   cName: item.cname,
      //   classRoom: item.classRoom,
      //   teacher: item.teacher,
      //   // festivalsList: (this.item.festivals).split(','),
      //   festivals: '1,2',
      //   week: item.week,
      //   remark: item.remark
      // }
      // const s = qs.stringify(data)
      // const options = {
      //   method: 'POST',
      //   headers: {'content-type': 'application/x-www-form-urlencoded'},
      //   data: s,
      //   url: '/json/course/add'
      // }
      // this.$http(options).then((res) => {
      //   console.log('新增的返回值是', res.data.data)
      // })

      // let params = {
      //   "userId": 13,
      //   "festivals": '1,2',
      //   "cName": item.cname,
      //   "classRoom": item.classRoom,
      //   "teacher": item.teacher,
      //   "remark": item.remark,
      //   "week": 1
      // }
      // console.log(JSON.stringify(params))
      // console.log([JSON.stringify(params)])

      let params = {
        userId: 13,
        festivals: '1,2',
        cName: item.cname,
        classRoom: item.classRoom,
        teacher: item.teacher,
        remark: item.remark,
        week: 1
      }
      // console.log(JSON.stringify(params.classRoom))
      // console.log(params)
      // let list = []
      // list.push(params)
      // let a = JSON.stringify(params)
      // let b = JSON.parse(a)
      // let a = list
      // let list = []
      // list.push(params)
      axios.post('/json/course/add', [ {'userId': params.userId, 'festivals': params.festivals, 'cName': params.cName, 'classRoom': params.classRoom, 'teacher': params.teacher, 'remark': params.remark, 'week': params.week} ])
      // axios.post('/json/course/add', params)
        .then((res) => {
          if (res.data.msg === '无权限') {
            this.$router.push({path: '/401'})
          } else if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增课表成功'
            })
            console.log('新增课表的返回值是', res.data.data)
            this.getCourseList()
          }
        })
    }
    // delcourse () {
    //   this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //     center: true
    //   }).then((res) => {
    //     axios.get('/json/academic/delete?noticeId=' + this.courseData.noticeId).then((res) => {
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
#course .el-table__body-wrapper {
  // height: 320px;
}
</style>
