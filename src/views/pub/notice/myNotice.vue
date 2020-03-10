<template>
  <div id="myNotice">
    <el-table
      border
      height="86%"
      :data="myNoticeList"
      :default-sort = "{prop: 'createTime', order: 'descending'}"
      v-loading="loading"
      element-loading-text="拼命加载中"
        >
      <!-- <el-table-column type="selection" align="center" /> -->
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
    </el-table>
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
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
      loading: true,
      userId: '',
      myNoticeList: [],
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getMyNoticeList()
    this.userId = sessionStorage.getItem('userId')
  },
  methods: {
    getMyNoticeList () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      // axios.get('/json/academic/find?limit=&title=' + this.searchForm.title).then((res) => {
      axios.get('/json/academic/find?page=1&limit=10&userId=' + this.userId).then((res) => {
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        this.myNoticeList = res.data.data
        console.log('我的教务通知是，',res.data.data)
        this.loading = false
      })
    },
    handlePageChange (item) { // 分页查询
      axios.get('/json/academic/find?page=' + item.currentPage + '&limit=' + item.pageSize + '&userId=' + this.userId).then((res) => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.myNoticeList = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
