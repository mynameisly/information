<template>
  <el-dialog id="myFiles" :title="title" :visible.sync="visible" :lock-scroll="false" width="80%" append-to-body top="1rem" :close-on-click-modal="false" :show-close="false">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="7">
          <el-form-item label="文件名：">
            <el-input v-model="searchForm.fileRealName" placeholder="请输入文件名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="后缀名：">
            <el-input v-model="searchForm.fileSuffix" placeholder="请输入文件后缀名" clearable/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="文件状态：">
            <el-select v-model="searchForm.state"  palceholder="请选择文件状态" clearable>
              <el-option
                v-for="item in states"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button type="success" size="medium" icon="el-icon-search" @click="getMyFiles(searchForm)">查询文件</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table
     border
      :data="myFilesList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      :cell-style="addBgColorByState"
      height="340">
      <el-table-column label="序号" type="index" width="55">
        <template slot-scope="scope">
          <!-- (当前页 - 1) * 当前显示数据条数 + 当前行数据的索引 + 1  -->
          <span>{{ (page.currentPage - 1) * page.pageSize + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="fileRealName"/>
      <el-table-column label="文件后缀名" prop="fileSuffix" width="100"/>
      <!-- <el-table-column label="文件类型" prop="type"/> -->
      <el-table-column label="文件简介" prop="introduce"/>
      <el-table-column label="状态" prop="state" width="100"/>
    </el-table>
    <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChange(item)" />
    <span slot="footer">
      <el-button type="warning" @click="visible = false">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import axios from 'axios'
import PageComponent from '@/components/Pagenation/index'
export default {
  props: {
    title: String,
    default: 'title'
  },
  components: {
    PageComponent
  },
  data () {
    return {
      loading: false,
      myFilesList: [],
      visible: false,
      searchForm: {
        fileRealName: '',
        fileSuffix: '',
        state: ''
      },
      states: [
        {label: '未审核', value: 0},
        {label: '通过审核', value: 1},
        {label: '审核不通过', value: 10}
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
    this.getMyFiles()
  },
  methods: {
    open () {
      this.visible = true
    },
    getMyFiles () {
      axios.get(('/json/file/listMyFiles'), {
        params: {
          fileRealName: this.searchForm.fileRealName,
          fileSuffix: this.searchForm.fileSuffix,
          state: this.searchForm.state
        }
      }).then((res) => {
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        this.myFilesList = this.handleState(res.data.data)
        this.loading = false
      })
    },
    handleState (data) { // 处理文件状态 0:未审核，1：通过审核，10：审核不通过 参数data就是res.data.data
      const uploadArr = data
      let upload
      for (var k in uploadArr) {
        upload = uploadArr[k]
        if (upload.state === 0) {
          this.$set(upload, 'state', '未审核')
        } else if (upload.state === 1) {
          this.$set(upload, 'state', '通过审核')
        } else if (upload.state === 10) {
          this.$set(upload, 'state', '审核不通过')
        }
      }
      return uploadArr
    },
    addBgColorByState ({row, columnIndex}) {
      if (columnIndex === 4) {
        if (row.state === '审核不通过') {
          return 'color: #e5323e'
        } else if (row.state === '通过审核') {
          return 'color: #22c32e'
        } else if (row.state === '未审核') {
          return 'color: #4cabce'
        }
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    handlePageChange (item) {
      axios.get(('/json/file/listMyFiles'), {
        params: {
          page: item.currentPage,
          limit: item.pageSize,
          fileRealName: this.searchForm.fileRealName,
          fileSuffix: this.searchForm.fileSuffix,
          state: this.searchForm.state
        }
      }).then((res) => {
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        this.myFilesList = this.handleState(res.data.data)
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss">
  
</style>
