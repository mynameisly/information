<template>
  <div id="comment_details">
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
        <el-col :span="7" :offset="1">
          <el-form-item label="起始-时间：">
            <el-date-picker
                clearable
                v-model="searchForm.startCreateTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请输入起始-时间"
              />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束-时间：">
            <el-date-picker
                clearable
                v-model="searchForm.endCreateTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请输入结束-时间"
              />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="类型：">
            <el-select v-model="searchForm.type"  palceholder="请选择类型" clearable>
              <el-option
                v-for="item in commentsType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="起始-分数：">
            <el-input v-model="searchForm.startScore" placeholder="请输入起始-分数" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束-分数：">
            <el-input v-model="searchForm.endScore" placeholder="请输入结束-分数" clearable/>
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
          <el-button type="success" size="medium" icon="el-icon-search" @click="getCommentListDetails(searchForm)">查询评论</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="65%"
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
            <el-table-column
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
            </el-table-column>
            <el-table-column
              label="内容"
              prop="context"
              :show-overflow-tooltip="true"
              >
              <template slot-scope="oscope">{{ oscope.row.context}}</template>
            </el-table-column>
            <el-table-column
              label="评论人"
              prop="number"
              :show-overflow-tooltip="true"
              >
              <template slot-scope="oscope">{{ oscope.row.user.number}}</template>
            </el-table-column>
            <el-table-column
              label="评论人昵称"
              prop="nickName"
              :show-overflow-tooltip="true"
              >
              <template slot-scope="oscope">{{ oscope.row.user.nickName}}</template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type"/>
      <el-table-column label="用户ID" prop="userId"/>
      <el-table-column label="目标ID" prop="targetId"/>
      <el-table-column label="评分" prop="score"/>
      <el-table-column label="内容" prop="context"/>
      <el-table-column label="评论人" prop="number"/>
      <el-table-column label="评论人昵称" prop="nickName"/>
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
      loading: false,
      searchForm: {
        commentId: '',
        userId: '',
        targetId: '',
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
          value: 'dynamic'
        },
        {
          label: '评论回复',
          value: 'commentReply'
        },
        {
          label: '评论视频',
          value: 'video'
        },
        {
          label: '弹幕',
          value: 'barrage'
        }
      ],
      commentListDetails: [],
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getCommentListDetails()
  },
  methods: {
    getCommentListDetails () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      axios.get(('/json/comment/listDetails'), {
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
        console.log(res)
        console.log(res.data)
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        this.commentListDetails = res.data.data
        this.loading = false
      })
    },
    handlePageChange (item) { // 分页查询
      console.log(item) // currentPage=1=item.currentPage  pageSize: 0=item.pageSize totalPage: 0  totalSize: 0
      axios.get('/json/comment/listDetails?page=' + item.currentPage + '&limit=' + item.pageSize).then((res) => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.commentListDetails = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
