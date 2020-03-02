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
      weeks: [], // 周集合
      coursesLen: 0, // 最大课节数
      classTableData: { // mock模拟的数据
        period: ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00'], // 时间段
        weekCourse: [
          {
            'week': 1,
            'courses': [
              { 'index': 1, 'context': '物理,王老师', 'teacher': '王老师' },
              { 'index': 3, 'context': '语文,王老师', 'teacher': '王老师' }
            ]
          },
          {
            'week': 2,
            'courses': [
              { 'index': 3, 'context': '生物', 'teacher': '王老师' },
              { 'index': 4, 'context': '语文', 'teacher': '王老师' },
              { 'index': 5, 'context': '历史', 'teacher': '王老师' },
              { 'index': 6, 'context': '数学', 'teacher': '王老师' },
              { 'index': 7, 'context': '英语', 'teacher': '王老师' },
              { 'index': 8, 'context': '生物', 'teacher': '王老师' },
              { 'index': 1, 'context': '生物', 'teacher': '王老师' },
              { 'index': 9, 'context': '生物', 'teacher': '王老师' },
              { 'index': 10, 'context': '生物', 'teacher': '王老师' }
            ]
          },
          {
            'week': 3,
            'courses': [
              { 'index': 5, 'context': '英语', 'teacher': '王老师' },
              { 'index': 6, 'context': '英语', 'teacher': '王老师' },
              { 'index': 7, 'context': '物理', 'teacher': '王老师' },
              { 'index': 8, 'context': '英语', 'teacher': '王老师' },
              { 'index': 1, 'context': '生物', 'teacher': '王老师' },
              { 'index': 2, 'context': '数学', 'teacher': '王老师' },
              { 'index': 3, 'context': '英语', 'teacher': '王老师' },
              { 'index': 9, 'context': '生物', 'teacher': '王老师' },
              { 'index': 10, 'context': '生物', 'teacher': '王老师' }
            ]
          },
          {
            'week': 4,
            'courses': [
              { 'index': 4, 'context': '语文', 'teacher': '王老师' },
              { 'index': 5, 'context': '英语', 'teacher': '王老师' },
              { 'index': 6, 'context': '生物', 'teacher': '王老师' },
              { 'index': 7, 'context': '历史', 'teacher': '王老师' },
              { 'index': 9, 'context': '生物', 'teacher': '王老师' },
              { 'index': 10, 'context': '生物', 'teacher': '王老师' }
            ]
          },
          {
            'week': 5,
            'courses': [
              { 'index': 8, 'context': '化学', 'teacher': '王老师' },
              { 'index': 1, 'context': '英语', 'teacher': '王老师' }
            ]
          }
        ]
      }
    }
  },
  created () {
    this.updateData()
    this.initWeekCourses()
    this.getCourseList()
  },
  methods: {
    getCourseList () {
      axios.get('/json/course/find?userId=1' + this.userId).then((res) => {
        console.log(res.data.data)
        this.courseList = res.data.data
        let cList = res.data.data
        let oneCourse = []
        for (let i = 0; i < this.courseList.length; i++) {
          oneCourse.push(cList[i].classRoom, cList[i].teacher, cList[i].cname, cList[i].remark)
        }
        console.log(oneCourse)
      })
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

      // console.log(JSON.stringify(this.classTableData.weekCourse))
    },
    /**
         * 计算周数据及课节数
         */
    initWeekCourses () {
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
