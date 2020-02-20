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
        <el-tab-pane label="总览">
          <div ref="echartOverview" class="overview"></div>
        </el-tab-pane>
        <el-tab-pane label="按月统计">
          <div ref="echartMonth" class="byMonth"></div>
        </el-tab-pane>
        <el-tab-pane label="按天统计">
          <div ref="echartDate" class="byDate"></div>
        </el-tab-pane>
        <el-tab-pane label="按时统计">
          <div ref="echartHour" class="byHour"></div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
export default {
  name: 'childSex',
  data () {
    let manNumBgColor = { // 设置manNum的背景渐变颜色
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
    let womanNumBgColor = { // 设置womanNum的背景渐变颜色
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
          color: '#00FF7F'
        }, {
          offset: 1,
          color: '#339900'
        }]),
        barBorderRadius: 4 // 柱状角成椭圆形
      }
    }
    let unknownNumBgColor = { // 设置womanNum的背景渐变颜色
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
          color: '#FF7F50'
        }, {
          offset: 1,
          color: '#CC0000'
        }]),
        barBorderRadius: 4 // 柱状角成椭圆形
      }
    }
    return {
      loading: false,
      searchForm: {
        startTime: '',
        endTime: ''
      },
      chart: null,
      optionOverview: { // 性别总览的配置项
        // backgroundColor: '#ccc',
        title: {
          text: '男女观看总览',
          left: 'center',
          top: 20,
          textStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        visualMap: {
          show: false,
          min: 0,
          max: 100, // 最大值，默认为10，后台绑定
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: '性别分布',
            type: 'pie',
            radius: '70%',
            center: ['40%', '50%'],
            data: [
              {value: 0, name: '男性用户'},
              {value: 0, name: '女性用户'},
              {value: 0, name: '游客（性别未知）'}
            ].sort(function (a, b) { return a.value - b.value }),
            roseType: 'radius',
            label: {
              color: '#000'
            },
            labelLine: {
              lineStyle: {
                color: '#000'
              },
              smooth: 0.1,
              length: 60,
              length2: 40
            },
            itemStyle: {
              // color: '#c23531,
              // shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200
            }
          }
        ]
      },
      optionDate: { // 按天统计的配置项
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            // ['天', '2012', '2013', '2014', '2015'],
            // ['男性用户', 40, 30, 35, 50],
            // ['女性用户', 42, 37, 35, 52],
            // ['游客（未知用户）', 44, 37, 30, 53]
            ['按天统计数据'],
            ['男性用户'],
            ['女性用户'],
            ['游客（未知用户）']
          ]
        },
        xAxis: [
          {type: 'category', gridIndex: 0}
        ],
        yAxis: [
          {gridIndex: 0}
        ],
        grid: [
          {left: '3%'},
          {bottom: '4%'},
          {top: '55%'}
        ],
        series: [
          {type: 'bar', seriesLayoutBy: 'row', itemStyle: manNumBgColor},
          {type: 'bar', seriesLayoutBy: 'row', itemStyle: womanNumBgColor},
          {type: 'bar', seriesLayoutBy: 'row', itemStyle: unknownNumBgColor}
        ]
      },
      optionMonth: { // 按月统计的配置项
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['按月统计数据'],
            ['男性用户'],
            ['女性用户'],
            ['游客（未知用户）']
          ]
        },
        xAxis: [
          {type: 'category', gridIndex: 0}
        ],
        yAxis: [
          {gridIndex: 0}
        ],
        grid: [
          {left: '3%'},
          {bottom: '4%'},
          {top: '55%'}
        ],
        series: [
          {type: 'bar', seriesLayoutBy: 'row', itemStyle: manNumBgColor},
          {type: 'bar', seriesLayoutBy: 'row', itemStyle: womanNumBgColor},
          {type: 'bar', seriesLayoutBy: 'row', itemStyle: unknownNumBgColor}
        ]
      },
      optionHour: { // 按时统计的配置项
        legend: {},
        tooltip: {},
        dataset: {
          source: [
            ['按时统计数据'],
            ['男性用户'],
            ['女性用户'],
            ['游客（性别未知）']
          ]
        },
        xAxis: [
          {type: 'category', gridIndex: 0}
        ],
        yAxis: [
          {gridIndex: 0}
        ],
        grid: [
          {left: '3%'},
          {bottom: '4%'},
          {top: '55%'}
        ],
        series: [
          {type: 'bar', seriesLayoutBy: 'row', itemStyle: manNumBgColor},
          {type: 'bar', seriesLayoutBy: 'row', itemStyle: womanNumBgColor},
          {type: 'bar', seriesLayoutBy: 'row', itemStyle: unknownNumBgColor}
        ]
      }
    }
  },
  mounted () {
    this.getstatList()
  },
  methods: {
    drawOverview () {
      this.chart = echarts.init(this.$refs.echartOverview)
      this.chart.setOption(this.optionOverview)
    },
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
      axios.get('/json/watch/statSex?startTime=' + this.searchForm.startTime + '&endTime=' + this.searchForm.endTime).then((res) => {
        if (res.data.code === 0) {
          // console.log('进入到所有男女性别的统计数据')
          // console.log(res.data)
          // console.log(res.data.data)
          const returnData = res.data.data
          this.optionOverview.series[0].data[0].value = returnData.count.manNum
          this.optionOverview.series[0].data[1].value = returnData.count.womanNum
          this.optionOverview.series[0].data[2].value = returnData.count.unknownNum
          this.optionOverview.visualMap.max = returnData.count.manNum + returnData.count.womanNum + returnData.count.unknownNum

          this.optionDate.dataset.source[0] = this.handleDateData(returnData.dateThread).source[0]
          this.optionDate.dataset.source[1] = this.handleDateData(returnData.dateThread).source[1]
          this.optionDate.dataset.source[2] = this.handleDateData(returnData.dateThread).source[2]
          this.optionDate.dataset.source[3] = this.handleDateData(returnData.dateThread).source[3]

          this.optionHour.dataset.source[0] = this.handleHourData(returnData.hourThread).source[0]
          this.optionHour.dataset.source[1] = this.handleHourData(returnData.hourThread).source[1]
          this.optionHour.dataset.source[2] = this.handleHourData(returnData.hourThread).source[2]
          this.optionHour.dataset.source[3] = this.handleHourData(returnData.hourThread).source[3]

          this.optionMonth.dataset.source[0] = this.handleMonthData(returnData.monthThread).source[0]
          this.optionMonth.dataset.source[1] = this.handleMonthData(returnData.monthThread).source[1]
          this.optionMonth.dataset.source[2] = this.handleMonthData(returnData.monthThread).source[2]
          this.optionMonth.dataset.source[3] = this.handleMonthData(returnData.monthThread).source[3]
          this.drawOverview()
          this.drawMonth()
          this.drawDate()
          this.drawHour()
        }
      })
    },
    handleDateData (data) { // data是returnData.dateThread
      const temp = data
      for (let i = 0; i < temp.length; i++) {
        this.optionDate.dataset.source[0].push(temp[i].date)
        this.optionDate.dataset.source[1].push(temp[i].manNum)
        this.optionDate.dataset.source[2].push(temp[i].womanNum)
        this.optionDate.dataset.source[3].push(temp[i].unknownNum)
      }
      return this.optionDate.dataset
    },
    handleHourData (data) { // data是returnData.hourThread
      const temp = data
      for (let i = 0; i < temp.length; i++) {
        this.optionHour.dataset.source[0].push(temp[i].date)
        this.optionHour.dataset.source[1].push(temp[i].manNum)
        this.optionHour.dataset.source[2].push(temp[i].womanNum)
        this.optionHour.dataset.source[3].push(temp[i].unknownNum)
      }
      return this.optionHour.dataset
    },
    handleMonthData (data) { // data是returnData.monthThread
      const temp = data
      for (let i = 0; i < temp.length; i++) {
        this.optionMonth.dataset.source[0].push(temp[i].date)
        this.optionMonth.dataset.source[1].push(temp[i].manNum)
        this.optionMonth.dataset.source[2].push(temp[i].womanNum)
        this.optionMonth.dataset.source[3].push(temp[i].unknownNum)
      }
      return this.optionMonth.dataset
    }
  }
}
</script>

<style lang="scss" scoped>
.overview, .byMonth, .byDate, .byHour {
  width: 1200px;
  height:540px;
  // margin: 0 auto;
}
</style>
