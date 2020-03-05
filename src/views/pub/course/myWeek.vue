<template>
    <div class="class-table">
        <div class="table-wrapper">
            <div class="tabel-container">
                <table>
                    <thead>
                        <tr>
                            <th>时间</th>
                            <th v-for="(weekNum, weekIndex) in weeks" :key="weekIndex"> {{'周' + digital2Chinese(weekNum, 'week')}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(courseNum, courseIndex) in coursesLen" :key="courseIndex">

                            <td>
                                <p>{{'第' + digital2Chinese(courseNum) + "节"}}</p>
                                <p class="period">{{ classTableData.period[courseIndex] }}</p>
                            </td>

                            <td v-for="(weekNum, weekIndex) in weeks" :key="weekIndex">
                                {{ fieldCharacter(weekIndex, courseIndex) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      courseList: [],
      userId: 0,
      weeks: [], // 周集合
      coursesLen: 0, // 最大课节数
      classTableData: { // mock模拟的数据
        period: ['08:30-09:15', '09:25-10:10', '10:30-11:15', '11:25-12:10', '14:30-15:15', '15:25-16:10', '16:30-17:15', '17:25-18:10', '19:00-19:50', '20"00-20:50'], // 一共有10节课
        weekCourse: []
      }
    }
  },
  created () {
    this.userId = sessionStorage.getItem('userId')
    console.log('userId', this.userId)
  },
  mounted () {
    this.getCourseList()
  },
  methods: {
    getCourseList () {
      axios.get('/json/course/find?userId=' + this.userId).then((res) => {
        // console.log(res.data.data)
        if (res.data.data !== [] && res.data.data !== 0) {
          this.classTableData.weekCourse = this.handleReturnData(res.data.data)
          this.updateData()
          this.initWeekCourses()
        } else {
          this.$message({
            type: 'info',
            message: '暂无课程！'
          })
        }
      })
    },
    handleReturnData (data) {
      let cList = data
      cList.forEach(ele => {
        ele.week = ele.week
        // ele.courses = this.handleFestivalList(data)

        let context = ele.cname + '\n' + ele.classRoom + '\n' + ele.teacher + '\n' + ele.remark
        console.log(context)
        console.log(typeof (context))
        let arr = []
        ele.festivalsList.forEach((f) => {
          let param = {
            'index': f,
            'context': context
          }
          arr.push(param)
        })
        // console.log(111, arr)
        ele.courses = arr

        delete ele.cid
        delete ele.classRoom
        delete ele.cname
        delete ele.teacher
        delete ele.remark
        delete ele.festivals
      })
      // console.log('cList是', cList)
      return cList
    },

    /**
     * 更新mock模拟的数据，对数据进行排序
     */
    updateData () {
      /* 将数据按从周日到周六排序 */
      this.classTableData.weekCourse.sort((a, b) => {
        return a.week - b.week
      })

      /* 将数据按从第一节到第n节排序 */
      for (let v of this.classTableData.weekCourse) {
        for (let k in v) {
          if (k === 'courses') {
            v[k].sort((a, b) => {
              return a.index - b.index
            })
          }
        }
      }
    },
    /**
         * 计算周数据及课节数
         */
    initWeekCourses () {
      // console.log(444,this.classTableData.weekCourse)
      const that = this
      this.weeks = [] // 周集合
      this.coursesLen = 0 // 最大的课节数

      this.weeks = this.classTableData.weekCourse.map((item, index) => {
        for (let k in item) {
          if (k === 'courses') {
            let maxCoursesLen = 0
            /* 取出一周中最大的课节数及当天的最大课节数 */
            for (let j of item[k]) {
              j.index > that.coursesLen && (that.coursesLen = j.index) // 取所有一周里最大课节值
              j.index > maxCoursesLen && (maxCoursesLen = j.index) // 取当天最大课节值
            }

            /* 如果当天的课节总数小于当天的最大课节值 */
            if (item[k].length < maxCoursesLen) {
              for (let i = 0; i < maxCoursesLen; i++) { // 以最大课节值为终点遍历当天课节
                if (!item[k][i] || item[k][i].index != (i + 1)) { // 如果下标课节不存在或着与循环的下标不匹配
                  item[k].splice(i, 0, '') // 填充空课节
                }
              }
            }
          }
        }
        return item.week
      })

      // console.log(JSON.stringify(this.classTableData.weekCourse))
    },
    /**
         * 处理格子数据，无数据转换为字符串'-'
         * @param {Number} weekIndex 周几对应的下标
         * @param {Number} courseNum 第几节课对应的下标
         * @returns {String} 返回对应的字符
         */
    fieldCharacter (weekIndex, courseIndex) {
      if (
        this.classTableData.weekCourse[weekIndex] &&
        this.classTableData.weekCourse[weekIndex].courses[courseIndex] &&
        this.classTableData.weekCourse[weekIndex].courses[courseIndex].index === courseIndex + 1
      ) {
        return this.classTableData.weekCourse[weekIndex].courses[courseIndex].context
      }
      return '-'
    },

    /**
        * 数字转中文
        * @param {Number} num 需要转换的数字
        * @param {Boolean} identifier 标识符
        * @returns {String} 转换后的中文
        */
    digital2Chinese (num, identifier) {
      const character = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
      return identifier === 'week' && (num === 0 || num === 7) ? '日' : character[num]
    }
  }
}
</script>

<style lang="scss" scoped>
.class-table {
    .table-wrapper {
        width: 100%;
        height: 100%;
        overflow: auto;
    }
    .tabel-container {
        margin: 7px;

        table {
            table-layout: fixed;
            width: 100%;

            thead {
                background-color: #67a1ff;
                th {
                  color: #fff;
                  line-height: 17px;
                  font-weight: normal;
                }
            }
            tbody {
                background-color: #eaf2ff;
                td {
                  color: #677998;
                  line-height: 0px;
                }
            }
            th,
            td {
                width: 60px;
                padding: 12px 2px;
                font-size: 12px;
                text-align: center;
            }

            tr td:first-child {
                color: #333;
                .period {
                    font-size: 8px;
                }
            }
        }
    }
}
</style>
