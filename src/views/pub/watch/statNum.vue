<template>
  <div id="stat">
    <el-form v-model="searchForm" :inline="true">
      <el-row>
        <el-col :span="7" :offset="1">
          <el-form-item label="起始-时间：">
            <el-date-picker
                clearable
                v-model="searchForm.startTime"
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
                v-model="searchForm.endTime"
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
      <el-tabs tab-position="left" style="height: 530px;">
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
  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
export default {
  name: 'childNum',
  data () {
    return {
      loading: false,
      // tabPosition: 'left', // 设置标签的方向
      searchForm: {
        startTime: '',
        endTime: ''
      },
      chart: null,
      optionDate: { // 按日统计的配置项
        title: {
          text: '按天统计'
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
          text: '按月统计'
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
          text: '按时统计'
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
    this.getstatList()
  },
  methods: {
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
      axios.get('/json/watch/statNumber?startTime=' + this.searchForm.startTime + '&endTime=' + this.searchForm.endTime).then((res) => {
        if (res.data.code === 0) {
          // console.log('进入到所有的统计数据')
          // console.log(res.data)
          // console.log(res.data.data)
          const returnData = res.data.data
          this.optionHour.xAxis.data = this.handleXAxisData(returnData.hourThread)
          this.optionHour.series[0].data = this.handleSeriesData(returnData.hourThread)
          this.optionMonth.xAxis.data = this.handleXAxisData(returnData.monthThread)
          this.optionMonth.series[0].data = this.handleSeriesData(returnData.monthThread)
          this.optionDate.xAxis.data = this.handleXAxisData(returnData.dateThread)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.byMonth, .byDate, .byHour {
  width: 1200px;
  height:540px;
  margin: 0 auto;
}
</style>
