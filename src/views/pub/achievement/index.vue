<template>
  <div id="course">
    <div class="container">
      <el-form v-model="searchForm" :inline="true" class="demo-form-inline">
        <el-form-item label="姓名:">
          <el-input v-model="searchForm.username" clearable placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="准考证号:">
          <el-input v-model="searchForm.ticketNumber" clearable placeholder="请输入准考证号" />
        </el-form-item>
        <el-form-item>
          <el-button type="success" size="medium" icon="el-icon-search" @click="getCourseList(searchForm)">查询成绩</el-button>
        </el-form-item>
      </el-form>
      <el-table
        border
        height="80%"
        :data="courseList">
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="学校" prop="schoolName" />
        <el-table-column label="准考证号" prop="ticketNumber" />
        <el-table-column label="听力" prop="listenScore" />
        <el-table-column label="阅读" prop="readScore" />
        <el-table-column label="写作和翻译" prop="writeScore" />
        <el-table-column label="总分" prop="score" />
      </el-table>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      courseList: [],
      searchForm: {
        username: '',
        ticketNumber: ''
      }
    }
  },
  methods: {
    getCourseList(param) {
      this.$ajax.get('/cet/find?username=' + this.searchForm.username + '&ticketNumber=' + this.searchForm.ticketNumber)
        .then(res => {
         this.courseList = Array(res.data.data)
      })
    },
    // 导出excel
    // downloadExcel(param) {
    //   return downloadExcel(param).then(res => {
    //     const filename = "XXX";
    //     const exceldata = res.data;
    //     const tHeader = [
    //     "姓名",
    //     "学校",
    //     "准考证号",
    //     "听力",
    //     "阅读",
    //     "写作和翻译",
    //     "总分"
    //     ];
    //     const filterVal = [
    //       "name",
    //       "schoolName",
    //       "ticketNumber",
    //       "listenScore",
    //       "readScore",
    //       "writeScore",
    //       "score"
    //     ];
    //     download(filename, tHeader, filterVal, exceldata);
    //     return res;
    //   }).then((res) => {
    //     if (res.code == 200) {
    //       this.$message({
    //         message: '导出成功！',
    //         type: 'success'
    //       })
    //     }
    //   })
    // }
  }
}
</script>
<style lang="scss">

</style>
