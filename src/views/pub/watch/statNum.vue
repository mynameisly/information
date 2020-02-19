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
            <el-button type="success" size="medium" icon="el-icon-search" @click="getstatList(searchForm)">观看数量统计</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="panel" style="height: 90%; border: 1px solid red">
      <!-- <el-tabs tab-position="left" style="height: 540px;"> -->
        <!-- <el-tab-pane label="观看数量统计"> -->
          <div ref="echartNumber" class="byNumber"></div>
        <!-- </el-tab-pane> -->
      <!-- </el-tabs> -->
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import echarts from 'echarts'
export default {
  data () {
    return {
      loading: false,
      // tabPosition: 'left', // 设置标签的方向
      searchForm: {
        startTime: '',
        endTime: ''
      },
      chart: null,
      optionNumber: { // 按日统计的配置项
        title: {
          text: '观看数量统计'
        },
        tooltip: {},
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {},
        series: [{
          name: '数量统计',
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
      }
    }
  },
  mounted () {
    this.getstatList()
  },
  methods: {
    drawWatchNumber () {
      this.chart = echarts.init(this.$refs.echartNumber)
      // 使用刚指定的配置项和数据显示图表。
      this.chart.setOption(this.optionNumber)
    },
    getstatList () { // 接口中提供的搜索参数有startTime, endTime, userId, targetId, type, threadType, 但实际可以使用的就只有两个时间，其他的先不写
      axios.get('/json/comment/statNumber?startTime=' + this.searchForm.startTime + '&endTime=' + this.searchForm.endTime).then((res) => {
        if (res.data.code === 0) {
          console.log('进入到观看数量统计')
          console.log(res.data)
          console.log(res.data.data)
          const returnData = res.data.data
          this.optionMonth.xAxis.data = this.handleXAxisData(returnData.monthThread)
          this.optionMonth.series[0].data = this.handleSeriesData(returnData.monthThread)
          this.drawWatchNumber()
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
.byNumber {
  width: 1200px;
  height:540px;
  margin: 0 auto;
  border: 1px solid blue;
}
</style>
