<template>
  <div id="watch">
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="观看管理" name="allWatch">
        <childWatch v-if="isChildWatch" />
      </el-tab-pane>
      <el-tab-pane label="数量分布" name="statNum">
        <childNum v-if="isChildNum" />
      </el-tab-pane>
      <el-tab-pane label="性别分布" name="statSex">
        <childSex v-if="isChildSex" />
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
import watchList from './watchList'
import statNum from './statNum'
import statSex from './statSex'
export default {
  components: {
    childWatch: watchList,
    childNum: statNum,
    childSex: statSex
  },
  data () {
    return {
      loading: false,
      activeName: 'allWatch',
      isChildWatch: true,
      isChildNum: false,
      isChildSex: false,
      searchForm: {
        userId: '',
        targetId: '',
        startWatchTime: '',
        endWatchTime: ''
      },
      watchList: [],
      watchData: {},
      multipleSelection: [], // 批量删除
    }
  },
  mounted () {
    this.getWatchList()
  },
  methods: {
    handleClick (tab) {
      if (tab.name === 'allWatch') {
        this.isChildWatch = true
        this.isChildNum = false
        this.isChildSex = false
      } else if (tab.name === 'statNum') {
        this.isChildWatch = false
        this.isChildNum = true
        this.isChildSex = false
      } else if (tab.name === 'statSex') {
        this.isChildWatch = false
        this.isChildNum = false
        this.isChildSex = true
      }
    },
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
      axios.post('/json/watch/add?targetId=' + item.targetId)
        .then((res) => {
          if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增文件成功'
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
    }
  }
}
</script>

<style lang="scss">
#watch .el-table__body-wrapper {
  height: 285px;
}
</style>
