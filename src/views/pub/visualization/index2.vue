<template>
  <div id="visualization">
    <div id="video" style="width: 600px;height:400px;"></div>
    <!-- <div id="comment" style="width: 600px;height:400px;"></div> -->
  </div>
</template>

<script>
export default {
  name: "visualization",
  mounted() {
    this.drawVideoChart();
    // this.drawCommentChart();
  },
  methods: {
    drawVideoChart() {
      // 基于准备好的dom，初始化echarts实例
      let myVideoChart = this.$echarts.init(document.getElementById("video"));

      app.config = {
        rotate: 90,
        align: 'left',
        verticalAlign: 'middle',
        position: 'insideBottom',
        distance: 15,
        onChange: function () {
            var labelOption = {
                normal: {
                    rotate: app.config.rotate,
                    align: app.config.align,
                    verticalAlign: app.config.verticalAlign,
                    position: app.config.position,
                    distance: app.config.distance
                }
            };
            myVideoChart.setOption({
                series: [{
                    label: labelOption
                }, {
                    label: labelOption
                }, {
                    label: labelOption
                }, {
                    label: labelOption
                }]
            });
        }
    };
    let videoOption = {
        color: ['#003366', '#006699', '#4cabce', '#e5323e'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
        },
        legend: {
          data: ['00:00—06:00', '06:00—12:00', '12:00—18:00', '18:00—24:00']
        },
        toolbox: { // 工具栏，内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
              mark: {show: true},
              dataView: {show: true, readOnly: false},
              magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
              restore: {show: true},
              saveAsImage: {show: true}
          }
        },
        xAxis: [
          {
              type: 'category',
              axisTick: {show: false},
              data: ['周一', '周二', '周三', '周四', '周五', '周六', '周天']
          }
        ],
        yAxis: [
          {
              type: 'value'
          }
        ],
        series: [
          {
              name: '00:00—06:00',
              type: 'bar',
              barGap: 0,
              label: labelOption,
              data: [320, 332, 301, 334, 390, 355, 370]
          },
          {
              name: '06:00—12:00',
              type: 'bar',
              label: labelOption,
              data: [220, 182, 191, 234, 290, 180, 256]
          },
          {
              name: '12:00—18:00',
              type: 'bar',
              label: labelOption,
              data: [150, 232, 201, 154, 190, 200, 120]
          },
          {
              name: '18:00—24:00',
              type: 'bar',
              label: labelOption,
              data: [98, 77, 101, 99, 40, 40, 100]
          }
        ]
      };

      var labelOption = {
        show: true,
        position: app.config.position,
        distance: app.config.distance,
        align: app.config.align,
        verticalAlign: app.config.verticalAlign,
        rotate: app.config.rotate,
        formatter: '{c}  {name|{a}}',
        fontSize: 16,
        rich: {
          name: {
            textBorderColor: '#fff'
          }
        }
      };
      // 使用刚指定的配置项和数据显示图表。
      myVideoChart.setOption(videoOption);
    },
  }
}



</script>

<style lang="scss">
  
</style>