<template>
  <div id="stat">
    <el-form v-model="searchForm" :inline="true">
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
          <el-form-item>
            <el-button type="success" size="medium" icon="el-icon-search" @click="getstatList(searchForm)">查询评论</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="panel" style="height: 90%">
      <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
        <el-radio-button label="top">top</el-radio-button>
        <el-radio-button label="right">right</el-radio-button>
        <el-radio-button label="bottom">bottom</el-radio-button>
        <el-radio-button label="left">left</el-radio-button>
      </el-radio-group>

      <el-tabs :tab-position="tabPosition" style="height: 540px;">
        <el-tab-pane label="按月统计">
          <div id="byMonth" style="border: 1px solid black;width: 100%; height: 540px">按月统计</div>
        </el-tab-pane>
        <el-tab-pane label="按时统计">
          <div id="byHour" style="border: 1px solid black;width: 100%; height: 540px">按时统计</div>
        </el-tab-pane>
        <el-tab-pane label="按天统计">
          <div id="byDate" style="border: 1px solid black;width: 100%; height: 540px"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
let echarts = require('echarts/lib/echarts') // 引入柱状图组件
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data () {
    return {
      loading: false,
      tabPosition: 'left', // 设置标签的方向
      searchForm: {
        startTime: '',
        endTime: ''
      }
    }
  },
  mounted () {
    this.setupCanvas()
    this.getstatList()
    this.drawDate()
    this.drawHour()
    this.drawMonth()
  },
  methods: {
    getstatList () { // 根据多个筛选条件查询,需管理员权限; 筛选条件为空时，默认查询所有数据
      axios.get(('/json/comment/statNumber'), {
        params: {
          startTime: this.searchForm.startTime,
          endTime: this.searchForm.endTime
        }
      }).then((res) => {
        this.statList = res.data.data
        this.loading = false
      })
    },
    drawDate () {
      var myChartDate = echarts.init(document.getElementById('byDate'))
      var option = {
        title: {
          text: '按日统计'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: ['AA', 'BB', 'VV', 'DD']
        },
        yAxis: {},
        series: [{
          name: '今日数量',
          type: 'bar',
          data: [10, 2, 7, 10],
          // barWidth: 20 // 设置柱子宽度，单位为px
        }]
      }
      myChartDate.setOption(option)
    },

    // 
    drawMonth () {
      var myChartMonth = echarts.init(document.getElementById('byMonth'))
      var option = {
        title: {
          text: '按月统计'
        },
        tooltip: {},
        xAxis: {
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
        },
        yAxis: {},
        series: [{
          name: '今日数量',
          type: 'bar',
          data: [14, 12, 17, 10, 7, 10, 12, 14, 18, 10, 11, 5],
          // barWidth: 20 // 设置柱子宽度，单位为px
        }],
        grid: {
          left: '10%',
          right: '5%',
          top: '16%',
          bottom: '6%',
          containLabel: true
        }
      }
      myChartMonth.setOption(option)
    },

    //
    drawHour () {
      var myChartHour = echarts.init(document.getElementById('byHour'))
      var option = {
        title: {
          text: '按时统计'
        },
        tooltip: {},
        xAxis: {
          data: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
        },
        yAxis: {},
        series: [{
          name: '今日数量',
          type: 'bar',
          data: [10, 2, 7, 10, 12, 5, 16, 6, 9, 22, 16, 20, 16, 12, 14, 13, 4, 6, 4, 10, 12, 14, 24, 10],
          // barWidth: 20 // 设置柱子宽度，单位为px
        }],
        grid: {
          left: '10%',
          right: '5%',
          top: '16%',
          bottom: '6%',
          containLabel: true
        }
      }
      myChartHour.setOption(option)
    },
    // 计算设备的dpr
    setupCanvas (canvas) {
      var dpr = (scale = window.devicePixelRatio || 1)
      var rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      return canvas
    }
  }
}
</script>

<style lang="scss">
#byDate div{
  width: 1000px !important;
  // background: pink;
  canvas {
    // width: 500px !important;
  }
}
</style>
