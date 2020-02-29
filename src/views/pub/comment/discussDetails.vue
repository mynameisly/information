<template>
  <div id="discussDetails">
    <!-- 评论详情 -->
    <el-form v-model="searchFormDetails" :inline="true">
      <!-- <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="动态ID：">
            <el-input v-model="searchFormDetails.commentId" placeholder="请输入动态ID" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="用户ID：">
            <el-input v-model="searchFormDetails.userId" placeholder="请输入用户ID" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目标ID">
            <el-input v-model="searchFormDetails.targetId" placeholder="请输入目标ID" clearable/>
          </el-form-item>
        </el-col>
      </el-row> -->

      <el-row>
        <el-col :span="6" :offset="1">
          <el-form-item label="内容：">
            <el-input v-model="searchFormDetails.context" placeholder="请输入内容" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="类型：">
            <el-select v-model="searchFormDetails.type"  palceholder="请选择类型" clearable>
              <el-option
                v-for="item in commentsType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
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

      <!-- <el-row>
        <el-col :span="10" :offset="1">
          <el-form-item label="评分：">
            <div style="display:flex">
            <el-input v-model.number="searchFormDetails.startScore" min="0"  @keyup.native="proving($event)" placeholder="请输入最小评分数" clearable/>
            -<el-input v-model.number="searchFormDetails.endScore" min="0"  @keyup.native="proving($event)" placeholder="请输入最大评分数" clearable/>
            </div>
          </el-form-item>
        </el-col>
      </el-row> -->
      <el-row>
        <el-form-item>
          <el-button type="success" size="medium" icon="el-icon-search" @click="getCommentListDetails(searchFormDetails)">查询评论</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="365px"
      stripe
      :data="commentListDetails"
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
          <el-table
            :data="props.row.children"
            :show-header="false"
          >
            <!-- <el-table-column
              label="类型"
              prop="type"
            >
              <template slot-scope="oscope">{{ oscope.row.type }}</template>
            </el-table-column>
            <el-table-column
              label="用户ID"
              prop="userId"
            >
              <template slot-scope="oscope">{{ oscope.row.userId}}</template>
            </el-table-column>
            <el-table-column
              label="目标ID"
              prop="targetId"
              :show-overflow-tooltip="true"
              >
              <template slot-scope="oscope">{{ oscope.row.targetId}}</template>
            </el-table-column>
            <el-table-column
              label="评分"
              prop="score"
              :show-overflow-tooltip="true"
              >
              <template slot-scope="oscope">{{ oscope.row.score}}</template>
            </el-table-column> -->
            <el-table-column
              label="内容"
              prop="context"
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
        </template>
      </el-table-column>
     <el-table-column label="类型" prop="type"/>
       <!-- <el-table-column label="用户ID" prop="userId"/>
      <el-table-column label="目标ID" prop="targetId"/>
      <el-table-column label="评分" prop="score"/> -->
      <el-table-column label="内容" prop="context"/>
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
  name: 'childDiscussDetails',
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
      commentListDetails: [],
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
    this.getCommentListDetails() // 查询评论详情
  },
  methods: {
    getCommentListDetails () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      if (this.searchFormDetails.createTimeRange == null || this.searchFormDetails.createTimeRange == '') {
        this.searchFormDetails.startCreateTime = ''
        this.searchFormDetails.endCreateTime = ''
      } else {
        this.searchFormDetails.startCreateTime = this.formatDateTime(this.searchFormDetails.createTimeRange[0])
        this.searchFormDetails.endCreateTime = this.formatDateTime(this.searchFormDetails.createTimeRange[1])
      }
      axios.get(('/json/comment/listDetails'), {
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
        this.commentListDetails = this.handleType(res.data.data)
        this.loading = false
      })
    },
    handlePageChangeDetails (item) { // 分页查询
      // console.log(item) // currentPage=1=item.currentPage  pageSize: 0=item.pageSize totalPage: 0  totalSize: 0
      if (this.searchFormDetails.createTimeRange == null || this.searchFormDetails.createTimeRange == '') {
        this.searchFormDetails.startCreateTime = ''
        this.searchFormDetails.endCreateTime = ''
      } else {
        this.searchFormDetails.startCreateTime = this.formatDateTime(this.searchFormDetails.createTimeRange[0])
        this.searchFormDetails.endCreateTime = this.formatDateTime(this.searchFormDetails.createTimeRange[1])
      }
      axios.get(('/json/comment/listDetails'), {
        params: {
          page: item.currentPage,
          limit: item.pageSize,
          startCreateTime: this.searchFormDetails.startCreateTime,
          endCreateTime: this.searchFormDetails.endCreateTime,
          context: this.searchFormDetails.context
        }
      }).then((res) => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          // this.commentListDetails = res.data.data
          this.commentListDetails = this.handleType(res.data.data)
        }
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
    }
  }
}
</script>

<style lang="scss">
  
</style>
