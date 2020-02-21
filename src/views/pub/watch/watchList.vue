<template>
  <div id="watch">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="用户ID：">
            <el-input v-model="searchForm.userId" placeholder="请输入用户ID" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="目标视频ID：">
            <el-input v-model="searchForm.targetId" placeholder="请输入目标视频ID" clearable/>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="起始-观看时间：">
            <el-date-picker
                clearable
                v-model="searchForm.startWatchTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请输入起始-观看时间"
              />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="结束-观看时间：">
            <el-date-picker
                clearable
                v-model="searchForm.endWatchTime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="请输入结束-观看时间"
              />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-form-item>
          <el-button type="success" size="medium" icon="el-icon-search" @click="getWatchList(searchForm)">查询观看记录</el-button>
          <el-button type="warning" size="medium" icon="el-icon-plus" @click="$refs.addDialog.open(null)">新增观看记录</el-button>
          <el-button type="danger" size="medium" icon="el-icon-delete" @click="delSelect">删除已选</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <!-- el-table中的height用于固定表头 -->
    <el-table
      border
      height="65%"
      :data="watchList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      @cell-mouse-enter="mouseEnter"
      @selection-change="handleSelectionChange"
        >
      <el-table-column type="selection" align="center" />
      <!--<el-table-column label="序号" type="index" width="55">
        <template slot-scope="scope">
          (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1 
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="用户ID" prop="userId"/>
      <el-table-column label="用户名名称" prop="userName"/>
      <el-table-column label="目标视频ID" prop="targetId"/>
      <el-table-column label="目标视频名称" prop="targetName"/>
      <el-table-column label="观看时间" prop="watchTime"/>
    </el-table>
    <add-dialog ref="addDialog" title="新增观看记录"  @confirmData="(item) => addWatch(item)"/>
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
  </div>
</template>

<script>
import axios from 'axios'
import AddDialog from './add'
import PageComponent from '@/components/Pagenation/index'
export default {
  name: 'childWarch',
  components: {
    AddDialog,
    PageComponent
  },
  data () {
    return {
      loading: false,
      searchForm: {
        userId: '',
        targetId: '',
        startWatchTime: '',
        endWatchTime: ''
      },
      watchList: [],
      watchData: {},
      multipleSelection: [], // 批量删除
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      }
    }
  },
  mounted () {
    this.getWatchList()
  },
  methods: {
    getWatchList () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      axios.get(('/json/watch/list'), {
        params: {
          userId: this.searchForm.userId,
          targetId: this.searchForm.targetId,
          startWatchTime: this.searchForm.startWatchTime,
          endWatchTime: this.searchForm.endWatchTime
        }
      }).then((res) => {
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        this.watchList = res.data.data
        this.loading = false
      })
    },
    mouseEnter (data) {
      this.watchData = Object.assign({}, data)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    addWatch (item) { // 新增观看记录
      // console.log('进入新增观看记录')
      // console.log(item)
      axios.post('/json/watch/add?targetId=' + item.targetId)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增观看记录成功'
            })
            this.getWatchList()
          }
        })
    },
    delSelect () {
      if (this.multipleSelection.length) {
        let watchIds = [] // 保存选中的数据的id
        for (let i = 0; i < this.multipleSelection.length; i++) {
          watchIds.push(this.multipleSelection[i].watchId)
        }
        this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then((res) => {
        // 点击确定后发送请求
          axios.delete('/json/onlineCourse/delete?ids=' + watchIds).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getWatchList()
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
      // console.log(item) // currentPage=1=item.currentPage  pageSize: 0=item.pageSize totalPage: 0  totalSize: 0
      axios.get('/json/watch/list?page=' + item.currentPage + '&limit=' + item.pageSize).then((res) => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.watchList = res.data.data
        }
      })
    }
  }
}
</script>

<style lang="scss">

</style>
