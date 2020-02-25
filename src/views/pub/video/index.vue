<template>
  <div id="video">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="上传时间：">
            <el-date-picker
              v-model="searchForm.createTimeRange"
              type="daterange"
              range-separator="-"
              start-placeholder="上传时间"
              end-placeholder="上传时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="网课名称：">
            <el-input v-model="searchForm.courseName" placeholder="请输入网课名称" clearable/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="网课简介：">
            <el-input v-model="searchForm.courseIntroduction" placeholder="请输入网课简介" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="教师名称：">
            <el-input v-model="searchForm.teacherName" placeholder="请输入教师名称" clearable/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="success" size="medium" icon="el-icon-search" @click="getVideoList(searchForm)">查询网课</el-button>
          <el-button type="warning" size="medium" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增网课</el-button>
          <el-button type="danger" size="medium" icon="el-icon-delete" @click="delSelect">删除已选</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="65%"
      :data="videoList"
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
      <el-table-column label="网课名称" prop="courseName"/>
      <el-table-column label="网课简介" prop="courseIntroduction"/>
      <el-table-column label="教师名称" prop="teacherName"/>
      <el-table-column label="教师简介" prop="teacherIntroduction"/>
      <el-table-column label="参考教材" prop="teachingMaterial"/>
      <!-- <el-table-column label="课程主视频url" prop="mainVideoUrl"/> -->
      <el-table-column label="教学方式简介" prop="teachingMethods"/>
      <el-table-column label="主讲内容简介" prop="lectureContent"/>
      <el-table-column label="教学目的简介" prop="instructionalObjective"/>
      <el-table-column label="操作" prop="operation" width="100">
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-edit"
          @click="$refs.updateDialog.open(videoData)">
          修改
        </el-button>
      </el-table-column>
    </el-table>
    <add-dialog ref="addDialog" title="新增网课视频"  @confirmData="(item) => addVideo(item)"/>
    <update-dialog ref="updateDialog" title="修改网课视频" @confirmData="(item) => updateVideo(item)" />
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
  </div>
</template>

<script>
import AddDialog from './add'
import UpdateDialog from './add'
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
      loading: true,
      searchForm: {
        createTimeRange: '',
        startCreateTime: '',
        endCreateTime: '',
        courseName: '',
        courseIntroduction: '',
        teacherName: ''
      },
      videoList: [],
      videoData: {},
      multipleSelection: [], // 批量删除
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 10, // 每页条数，对应接口中的limit
        totalSize: 0, // 总条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getVideoList()
  },
  methods: {
    getVideoList () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      if (this.searchForm.createTimeRange == null || this.searchForm.createTimeRange == '') {
        this.searchForm.startCreateTime = ''
        this.searchForm.endCreateTime = ''
      } else {
        this.searchForm.startCreateTime = this.formatDateTime(this.searchForm.createTimeRange[0])
        this.searchForm.endCreateTime = this.formatDateTime(this.searchForm.createTimeRange[1])
      }
      axios.get(('/json/onlineCourse/list'), {
        params: {
          limit: 10,
          startCreateTime: this.searchForm.startCreateTime,
          endCreateTime: this.searchForm.endCreateTime,
          courseName: this.searchForm.courseName,
          courseIntroduction: this.searchForm.courseIntroduction,
          teacherName: this.searchForm.teacherName
        }
      }).then((res) => {
        this.page.currentPage = res.data.page.page // 当前页
        // this.page.pageSize = res.data.page.limit // 每页显示条数
        this.page.pageSize = 10 // 每页显示条数
        this.page.totalPage = res.data.page.totalPages // 页数
        this.page.totalSize = res.data.page.totalRows // 总行数

        // this.page.currentPage = res.data.currentPage;
        // this.page.pageSize = res.data.size;
        // this.page.totalPage = res.data.pages;
        // this.page.totalSize = res.data.total;
        this.videoList = res.data.data
        console.log(res.data.page)
        this.loading = false
      })
    },
    formatDateTime (date) {
      var y = date.getFullYear()
      var m = date.getMonth() + 1
      m = m < 10 ? ('0' + m) : m
      var d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      return y + '-' + m + '-' + d
    },
    mouseEnter (data) {
      this.videoData = Object.assign({}, data)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    addVideo (item) { // 新增视频
      axios.post('/json/onlineCourse/add?courseName=' + item.courseName + '&courseIntroduction=' + item.courseIntroduction +
      '&teacherName=' + item.teacherName + '&teacherIntroduction=' + item.teacherIntroduction + '&teachingMethods=' + item.teachingMethods + '&lectureContent=' + item.lectureContent +
      '&instructionalObjective=' + item.instructionalObjective + '&teachingMaterial=' + item.teachingMaterial + '&mainVideoUrl=' + item.mainVideoUrl)
        .then((res) => {
          if (res.data.msg === '无权限') {
            this.$router.push({path: '/401'})
          } else if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增文件成功'
            })
            this.getVideoList()
          }
        })
    },
    updateVideo (item) { // 修改视频
      axios.put('/json/onlineCourse/update?courseId=' + item.courseId + '&courseName=' + item.courseName + '&courseIntroduction=' + item.courseIntroduction +
      '&teacherName=' + item.teacherName + '&teacherIntroduction=' + item.teacherIntroduction + '&teachingMethods=' + item.teachingMethods + '&lectureContent=' + item.lectureContent +
      '&instructionalObjective=' + item.instructionalObjective + '&teachingMaterial=' + item.teachingMaterial + '&mainVideoUrl=' + item.mainVideoUrl)
        .then((res) => {
          if (res.data.msg === '无权限') {
            this.$router.push({path: '/401'})
          } else if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
          this.getVideoList()
        })
    },
    delSelect () {
      if (this.multipleSelection.length) {
        let videoIds = [] // 保存选中的数据的id
        for (let i = 0; i < this.multipleSelection.length; i++) {
          videoIds.push(this.multipleSelection[i].courseId)
        }
        this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then((res) => {
        // 点击确定后发送请求
          axios.delete('/json/onlineCourse/delete?ids=' + videoIds).then((res) => {
            if (res.data.msg === '无权限') {
              this.$router.push({path: '/401'})
            } else if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getVideoList()
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
    console.log('进入到分页');// currentPage=1  pageSize=每页30条 totalPage=1页 totalSize=5条
    console.log(item);// currentPage=1  pageSize=30条
    // const para = { currentPage: item.currentPage, pageSize: item.pageSize }
    // this.getVideoList(para)
      // console.log(item) // currentPage=1=item.currentPage  pageSize: 0=item.pageSize totalPage: 0  totalSize: 0
      // axios.get('/json/onlineCourse/list?page=' + item.currentPage + '&limit=' + item.pageSize).then((res) => {
      //   if (res.data.code === 0) {
      //     this.page.currentPage = res.data.page.page
      //     this.page.pageSize = res.data.page.limit
      //     this.page.totalPage = res.data.page.totalPages
      //     this.page.totalSize = res.data.page.totalRows
      //     this.videoList = res.data.data
      //   }
      // })
    }
  }
}
</script>

<style lang="scss">

</style>
