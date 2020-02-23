<template>
  <div id="comment">
    <el-tabs type="border-card">
      <el-tab-pane label="评论管理">
        <!-- 评论管理模块 -->
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
            <el-col :span="10" :offset="1">
              <el-form-item label="发布时间：">
                <el-date-picker
                  v-model="searchForm.createTimeRange"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="起始发布时间"
                  end-placeholder="结束发布时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="类型：">
                <el-select v-model="searchForm.type"  palceholder="请选择类型" clearable>
                  <el-option
                    v-for="(item, index) in commentsType"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="10" :offset="1">
              <el-form-item label="评分：">
                <div style="display:flex">
                <el-input type="number" v-model.number="searchForm.startScore" min="0"  @keyup.native="proving($event)" placeholder="请输入最小评分数" clearable/>
                -<el-input type="number" v-model.number="searchForm.endScore" min="0"  @keyup.native="proving($event)" placeholder="请输入最大评分数" clearable/>
                </div>
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
              <el-button type="success" size="medium" icon="el-icon-search" @click="getCommentList(searchForm)">查询评论</el-button>
              <el-button type="warning" size="medium" icon="el-icon-plus" @click="$refs.addDialog.open(null, falg)">新增评论</el-button>
              <el-button type="danger" size="medium" icon="el-icon-delete" @click="delSelect">删除已选</el-button>
              <!-- <el-button type="primary" size="medium" icon="el-icon-view" @click="$refs.detailsDialog.open()">查看评论详情</el-button> -->
              <!-- <el-button type="info" size="medium" icon="el-icon-view" @click="$refs.statNumber.open()">查看评论统计</el-button> -->
            </el-form-item>
          </el-row>
        </el-form>
        <!-- el-table中的height用于固定表头 -->
        <el-table
          border
          height="65%"
          :data="commentList"
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
          <el-table-column label="类型" prop="type"/>
          <el-table-column label="用户ID" prop="userId"/>
          <el-table-column label="目标ID" prop="targetId"/>
          <el-table-column label="评分" prop="score"/>
          <el-table-column label="内容" prop="context" width="400"/>
          <el-table-column label="操作" prop="operation" width="100">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="$refs.updateDialog.open(commentData, flag)">
              修改
            </el-button>
          </el-table-column>
        </el-table>
        <add-dialog ref="addDialog" title="新增评论/回复/弹幕/动态"  @confirmData="(item) => addComment(item)"/>
        <update-dialog ref="updateDialog" title="修改评论/回复/弹幕/动态" @confirmData="(item) => updateComment(item)" />
        <!-- <details-dialog ref="detailsDialog" title="查看评论详情" /> -->
        <!-- <details-dialog ref="statNumber" title="查看评论统计" /> -->
        <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChangeIndex(item)" />
      </el-tab-pane>
      <el-tab-pane label="评论详情">
        <!-- 评论详情模块 -->
        <el-form v-model="searchFormDetails" :inline="true">
          <el-row>
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
          </el-row>

          <el-row>
            <el-col :span="10" :offset="1">
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
            <el-col :span="8">
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
          </el-row>

          <el-row>
            <el-col :span="10" :offset="1">
              <el-form-item label="评分：">
                <div style="display:flex">
                <el-input v-model.number="searchFormDetails.startScore" min="0"  @keyup.native="proving($event)" placeholder="请输入最小评分数" clearable/>
                -<el-input v-model.number="searchFormDetails.endScore" min="0"  @keyup.native="proving($event)" placeholder="请输入最大评分数" clearable/>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="内容：">
                <el-input v-model="searchFormDetails.context" placeholder="请输入内容" clearable/>
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
        <page-component :total="page.totalSize" :page="page" @pageChange="(item)=>handlePageChangeDetails(item)" />
        </el-tab-pane>
      <el-tab-pane label="评论统计">
        <!-- 评论统计模块 -->
        <el-form v-model="searchFormStat" :inline="true">
          <el-row>
            <el-col :span="7" :offset="1">
              <el-form-item label="起始-时间：">
                <el-date-picker
                    clearable
                    v-model="searchFormStat.startTime"
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
                    v-model="searchFormStat.endTime"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="请输入结束-时间"
                  />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button type="success" size="medium" icon="el-icon-search" @click="getstatList(searchForm)">查询评论</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="panel">
          <el-tabs tab-position="left" style="height: 450px;">
            <el-tab-pane label="按月统计">
              <div ref="echartMonth" class="byMonth"></div>
            </el-tab-pane>
            <el-tab-pane label="按时统计">
              <div ref="echartHour" class="byHour"></div>
            </el-tab-pane>
            <el-tab-pane label="按天统计">
              <div ref="echartDate" class="byDate"></div>
            </el-tab-pane>
          </el-tabs>
        </div>
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AddDialog from './add'
import UpdateDialog from './add'
// import detailsDialog from './details'
// import statNumber from './stat'
import axios from 'axios'
import echarts from 'echarts'
import PageComponent from '@/components/Pagenation/index'
export default {
  components: {
    PageComponent,
    AddDialog,
    UpdateDialog
    // detailsDialog,
    // statNumber
  },
  data () {
    return {
      loading: false,
      flag: false, // 默认可以编辑
      searchForm: {
        commentId: '',
        userId: '',
        targetId: '',
        createTimeRange: '',
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
          value: '动态'
        },
        {
          label: '评论回复',
          value: '评论回复'
        },
        {
          label: '评论视频',
          value: '评论视频'
        },
        {
          label: '弹幕',
          value: '弹幕'
        }
      ],
      commentList: [],
      commentData: {},
      multipleSelection: [], // 批量删除
      page: {
        currentPage: 0, // 当前页，对应接口中的page
        pageSize: 0, // 每页条数，对应接口中的limit
        totalSize: 0, // 中条数，对应接口中的res.data.page.totalRows
        totalPage: 0 // 总页数，对应接口中的res.data.page.totalPages
      },
      // 下面的数据为评论详情的
      searchFormDetails: {
        commentId: '',
        userId: '',
        targetId: '',
        createTimeRange: '',
        startCreateTime: '',
        endCreateTime: '',
        type: '',
        startScore: '',
        endScore: '',
        context: ''
      },
      commentListDetails: [],
      // 下面的数据是评论统计的
      searchFormStat: {
        startTime: '',
        endTime: ''
      },
      chart: null,
      optionDate: { // 按日统计的配置项
        title: {
          // text: '按天统计'
        },
        grid: {
          x: '2%', // 相当于距离左边效果:padding-left
          y: '5%',  // 相当于距离上边效果:padding-top
          bottom: '3%',
          containLabel: true
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {},
        series: [{
          name: '今日数量',
          type: 'bar',
          data: [],
          // barWidth: 50, // 设置柱子的宽度，如果数量太少，柱子不美观
          itemStyle: { // 设置柱子的样式
            normal: {
              label: {
                show: true, // 开启显示
                position: 'top', // 在上方显示
                textStyle: { // 数值样式
                  color: '#0679e3',
                  fontSize: 16
                }
              },
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#5DB6F3'
              }, {
                offset: 1,
                color: '#5A91E1'
              }]),
              barBorderRadius: 4 // 柱状角成椭圆形
            }
          }
        }]
      },
      optionMonth: { // 按月统计的配置项
        title: {
          // text: '按月统计'
        },
        grid: {
          x: '2%', // 相当于距离左边效果:padding-left
          y: '5%',  // 相当于距离上边效果:padding-top
          bottom: '3%',
          containLabel: true
        },
        tooltip: {},
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [{
          name: '今日数量',
          type: 'bar',
          data: [],
          itemStyle: {
            normal: {
              label: {
                show: true, // 开启显示
                position: 'top', // 在上方显示
                textStyle: { // 数值样式
                  color: '#0679e3',
                  fontSize: 16
                }
              },
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#5DB6F3'
              }, {
                offset: 1,
                color: '#5A91E1'
              }]),
              barBorderRadius: 4 // 柱状角成椭圆形
            }
          }
        }]
      },
      optionHour: { // 按时统计的配置项
        title: {
          // text: '按时统计'
        },
        grid: {
          x: '2%', // 相当于距离左边效果:padding-left
          y: '5%',  // 相当于距离上边效果:padding-top
          bottom: '3%',
          containLabel: true
        },
        tooltip: {},
        xAxis: {
          data: []
        },
        yAxis: {},
        series: [{
          name: '今日数量',
          type: 'bar',
          data: [],
          itemStyle: {
            normal: {
              label: {
                show: true, // 开启显示
                position: 'top', // 在上方显示
                textStyle: { // 数值样式
                  color: '#0679e3',
                  fontSize: 16
                }
              },
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: '#5DB6F3'
              }, {
                offset: 1,
                color: '#5A91E1'
              }]),
              barBorderRadius: 4 // 柱状角成椭圆形
            }
          }
        }]
      }
    }
  },
  mounted () {
    this.getCommentList() // 查询评论
    this.getCommentListDetails() // 查询评论详情
    this.getstatList() // 查询评论统计
  },
  methods: {
    getCommentList () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      if (this.searchForm.createTimeRange == null || this.searchForm.createTimeRange == '') {
        this.searchForm.startCreateTime = ''
        this.searchForm.endCreateTime = ''
      } else {
        this.searchForm.startCreateTime = this.formatDateTime(this.searchForm.createTimeRange[0])
        this.searchForm.endCreateTime = this.formatDateTime(this.searchForm.createTimeRange[1])
      }
      axios.get(('/json/comment/list'), {
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
        // console.log('进入评论管理的查询所有')
        // console.log(res)
        // console.log(res.data)
        this.page.currentPage = res.data.page.page
        this.page.pageSize = res.data.page.limit
        this.page.totalPage = res.data.page.totalPages
        this.page.totalSize = res.data.page.totalRows
        this.commentList = this.handleType(res.data.data)
        // console.log('打印评论管理的查询所有')
        // console.log(this.commentList)
        this.loading = false
      })
    },
    formatDateTime (date) { // 把标准格式转换为年月日
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? ('0' + m) : m;
      var d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      return y + '-' + m + '-' + d;
    },
    proving(e) {
      var keyNum = window.event ? e.keyCode : e.which; // 获取键盘码
      var keyChar = String.fromCharCode(keyNum); // 获取键盘码对应的字符
      if (keyNum==189 || keyNum==190 || keyNum==110 || keyNum==109) {
        e.target.value = ''
      }
    },
    mouseEnter (data) {
      this.commentData = Object.assign({}, data)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    addComment (item) { // 新增评论
      axios.post('/json/comment/add?targetId=' + item.targetId + '&type=' + item.type + '&score=' + item.score + '&context=' + item.context)
        .then((res) => {
          // console.log('进入新增评论请求')
          // console.log(res.data)
          if (res.data.msg === '未登录') {
            this.$message({
              type: 'dangert',
              message: '请登录'
            })
            this.$router.push({jpath: '/login'})
          } else if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '新增评论成功'
            })
            this.getCommentList()
          }
        })
    },
    updateComment (item) { // 修改评论
      axios.put('/json/comment/update?commentId=' + item.commentId + '&context=' + item.context)
        .then((res) => {
          // console.log('进入修改评论请求')
          // console.log(res.data)
          if (res.data.msg === '未登录') {
            this.$message({
              type: 'dangert',
              message: '请登录'
            })
            this.$router.push({jpath: '/login'})
          } else if (res.data.code === 0) {
            this.$message({
              type: 'success',
              message: '修改评论成功'
            })
          }
          this.getCommentList()
        })
    },
    delSelect () {
      if (this.multipleSelection.length) {
        let commentIds = [] // 保存选中的数据的id
        for (let i = 0; i < this.multipleSelection.length; i++) {
          commentIds.push(this.multipleSelection[i].commentId)
        }
        this.$confirm('此操作将永久删除该数据，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then((res) => {
        // 点击确定后发送请求
          axios.delete('/json/comment/delete?ids=' + commentIds).then((res) => {
            if (res.data.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功'
              })
              this.getCommentList()
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
    handlePageChangeIndex (item) { // 分页查询
      // console.log(item) // currentPage=1=item.currentPage  pageSize: 0=item.pageSize totalPage: 0  totalSize: 0
      axios.get('/json/comment/list?page=' + item.currentPage + '&limit=' + item.pageSize).then((res) => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
          this.commentList = this.handleType(res.data.data)
        }
      })
    },
    //  下面的代码为details的
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
          commentId: this.searchFormDetails.commentId,
          userId: this.searchFormDetails.userId,
          targetId: this.searchFormDetails.targetId,
          startCreateTime: this.searchFormDetails.startCreateTime,
          endCreateTime: this.searchFormDetails.endCreateTime,
          type: this.searchFormDetails.type,
          startScore: this.searchFormDetails.startScore,
          endScore: this.searchFormDetails.endScore,
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
      axios.get('/json/comment/listDetails?page=' + item.currentPage + '&limit=' + item.pageSize).then((res) => {
        if (res.data.code === 0) {
          this.page.currentPage = res.data.page.page
          this.page.pageSize = res.data.page.limit
          this.page.totalPage = res.data.page.totalPages
          this.page.totalSize = res.data.page.totalRows
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
    },
    // 下面的代码为评论统计的
    drawMonth () {
      this.chart = echarts.init(this.$refs.echartMonth)
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(this.optionMonth)
    },
    drawDate () {
      this.chart = echarts.init(this.$refs.echartDate)
      this.chart.setOption(this.optionDate)
    },
    drawHour () {
      this.chart = echarts.init(this.$refs.echartHour)
      this.chart.setOption(this.optionHour)
    },
    getstatList () { // 接口中提供的搜索参数有startTime, endTime, userId, targetId, type, threadType, 但实际可以使用的就只有两个时间，其他的先不写
      axios.get('/json/comment/statNumber?startTime=' + this.searchFormStat.startTime + '&endTime=' + this.searchFormStat.endTime).then((res) => {
        if (res.data.code === 0) {
          // console.log('进入到所有的统计数据')
          // console.log(res.data.data)
          const returnData = res.data.data
          this.optionHour.xAxis.data = this.handleXAxisData(returnData.hourThread)
          this.optionHour.series[0].data = this.handleSeriesData(returnData.hourThread)
          this.optionMonth.xAxis.data = this.handleXAxisData(returnData.monthThread)
          this.optionMonth.series[0].data = this.handleSeriesData(returnData.monthThread)
          this.optionDate.xAxis.data = this.handleDateXAxisData(returnData.dateThread)
          this.optionDate.series[0].data = this.handleSeriesData(returnData.dateThread)
          this.drawMonth()
          this.drawDate()
          this.drawHour()
        }
      })
    },
    handleXAxisData (data) {
      const temp = data
      const xAxisData = []
      for (let i = 0; i < temp.length; i++) {
        xAxisData.push(temp[i].name)
      }
      return xAxisData
    },
    handleSeriesData (data) {
      const temp = data
      let seriesData = []
      for (let i = 0; i < temp.length; i++) {
        seriesData.push(temp[i].value)
      }
      return seriesData
    },
    handleDateXAxisData (data) { // 处理按天统计的xAxis格式为：月-日
      const temp = data
      const xAxisData = []
      for (let i = 0; i < temp.length; i++) {
        let dateStr = temp[i].name
        xAxisData.push(dateStr.substring(dateStr.length - 5))
      }
      return xAxisData
    }
  }
}
</script>

<style lang="scss" scoped>
.byMonth, .byDate, .byHour {
  width: 1200px;
  height:450px;
  // border: 1px solid red;
  margin: 0 auto;
}
</style>

<style lang="scss">
#comment .el-table__body-wrapper {
  height: 245px;
}
</style>
