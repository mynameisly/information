<template>
  <div id="watch">
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态管理" name="dynamic">
        <childDynamic v-if="ischildDynamic" />
      </el-tab-pane>
      <el-tab-pane label="动态详情" name="dynamicDetails">
        <childDynamicDetails v-if="ischildDynamic" />
      </el-tab-pane>
      <el-tab-pane label="评论管理" name="discuss">
        <childNum v-if="ischildDiscuss" />
      </el-tab-pane>
      <el-tab-pane label="评论详情" name="discussDetails">
        <childNum v-if="ischildDiscuss" />
      </el-tab-pane>
      <el-tab-pane label="评论统计" name="statNum">
        <childSex v-if="ischildStatNumber" />
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
import dynamicList from './dynamic'
import dynamicDetails from './dynamicDetails'
import discussList from './discuss'
import statNumber from './statNumber'
import dynamicDetailsVue from './dynamicDetails.vue'
export default {
  components: {
    childDynamic: dynamicList,
    childDynamicDetails: dynamicDetails,
    childDiscuss: discussList,
    childStatNumber: statNumber
  },
  data () {
    return {
      loading: false,
      activeName: 'dynamic',
      ischildDynamic: true,
      ischildDiscuss: false,
      ischildStatNumber: false,
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
      if (tab.name === 'dynamic') {
        this.ischildDynamic = true
        this.ischildDiscuss = false
        this.ischildStatNumber = false
      } else if (tab.name === 'discuss') {
        this.ischildDynamic = false
        this.ischildDiscuss = true
        this.ischildStatNumber = false
      } else if (tab.name === 'statNum') {
        this.ischildDynamic = false
        this.ischildDiscuss = false
        this.ischildStatNumber = true
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

</style>
