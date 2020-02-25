<template>
  <div id="dynamicDetails">
    <!-- 评论详情 -->
    <el-form v-model="searchFormDetails" :inline="true">
      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="动态内容：">
            <el-input v-model="searchFormDetails.context" placeholder="请输入内容" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item label="发布时间：">
            <el-date-picker
              v-model="searchFormDetails.createTimeRange"
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
          <el-button type="success" size="medium" icon="el-icon-search" @click="getDynamicListDetails(searchFormDetails)">查询评论</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="330px"
      stripe
      :data="dynamicListDetails"
      v-loading="loading"
      element-loading-text="拼命加载中"
      row-key="commentId"
        >
      <!--<el-table-column label="序号" type="index" width="55">
        <template slot-scope="scope">
          (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1 
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>-->

      <el-table-column type="expand">
        <template slot-scope="props">
          <!-- <el-form label-position="left" inline class="table-expand" :data="props.row.children"><!--el-form里面的内容是显示在展开行里面的
          <el-form-item label="类型">
            <template  slot-scope="oscope">{{ oscope.row.type }}</template>
          </el-form-item>
          <el-form-item label="用户ID">
            <template  slot-scope="oscope">{{ oscope.row.userId }}</template>
          </el-form-item>
          <el-form-item label="目标ID">
            <template  slot-scope="oscope">{{ oscope.row.targetId }}</template>
          </el-form-item>
          <el-form-item label="评分">
            <template  slot-scope="oscope">{{ oscope.row.score }}</template>
          </el-form-item> -->
          <el-table
            :data="props.row.children"
            label-position="center"
            inline
            class="table-expand"
            :show-header="false"
          >
            <!-- <el-table-column
              label="类型"
              prop="type"
            >
              <template slot-scope="oscope">{{ oscope.row.type }}</template>
            </el-table-column> -->
            <el-table-column
              label="内容"
              prop="context"
              width="800"
              :show-overflow-tooltip="true"
              >
              <template slot-scope="oscope">{{ oscope.row.context}}</template>
            </el-table-column>
            <el-table-column
              label="用户名"
              prop="number"
              :show-overflow-tooltip="true"
              >
              <template slot-scope="oscope">{{ oscope.row.user.number}}</template>
            </el-table-column>
            <el-table-column
              label="昵称"
              prop="nickName"
              :show-overflow-tooltip="true"
              >
              <template slot-scope="oscope">{{ oscope.row.user.nickName}}</template>
            </el-table-column>
          </el-table>
          <!-- </el-form> -->
        </template>
      </el-table-column>
      <!-- <el-table-column label="类型" prop="type"/> -->
      <!-- <el-table-column label="用户ID" prop="userId"/> -->
      <!-- <el-table-column label="目标ID" prop="targetId"/> -->
      <!-- <el-table-column label="评分" prop="score"/> -->
      <el-table-column label="内容" prop="context" width="800"/>
      <el-table-column label="用户名" prop="user.number"/>
      <el-table-column label="昵称" prop="user.nickName"/>
    </el-table>
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChangeDetails(item)" />
  </div>
</template>

<script>
import axios from 'axios'
import PageComponent from '@/components/Pagenation/index'
export default {
  name: 'childDynamicDetails',
  components: {
    PageComponent
  },
  data () {
    return {
      loading: true,
      searchFormDetails: {
        createTimeRange: '',
        startCreateTime: '',
        endCreateTime: '',
        context: ''
      },
      dynamicListDetails: [],
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getDynamicListDetails() // 查询评论详情
  },
  methods: {
    getDynamicListDetails () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      if (this.searchFormDetails.createTimeRange == null || this.searchFormDetails.createTimeRange == '') {
        this.searchFormDetails.startCreateTime = ''
        this.searchFormDetails.endCreateTime = ''
      } else {
        this.searchFormDetails.startCreateTime = this.formatDateTime(this.searchFormDetails.createTimeRange[0])
        this.searchFormDetails.endCreateTime = this.formatDateTime(this.searchFormDetails.createTimeRange[1])
      }
      axios.get(('/json/comment/dynamicListDetails'), {
        params: {
          limit: 10,
          startCreateTime: this.searchFormDetails.startCreateTime,
          endCreateTime: this.searchFormDetails.endCreateTime,
          context: this.searchFormDetails.context
        }
      }).then((res) => {
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        this.dynamicListDetails = this.handleType(res.data.data)
        console.log(this.dynamicListDetails)
        this.loading = false
      })
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
    handlePageChangeDetails (item) { // 分页查询
      // console.log(item) // currentPage=1=item.currentPage  pageSize: 0=item.pageSize totalPage: 0  totalSize: 0
      axios.get('/json/comment/dynamicListDetails?page=' + item.currentPage + '&limit=' + item.pageSize).then((res) => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.dynamicListDetails = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss">
  
</style>
