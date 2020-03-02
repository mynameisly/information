<template>
  <div>
    <el-table
      :data="timeData"
      stripe
      style="width: 100%">
      <el-table-column width="80" label="周" fixed="left" prop="label" align="center"></el-table-column>

      <el-table-column label="上午" align="center">
        <el-table-column
          v-for="(v,i) in titleData" :key="i"
          v-if="v.label==='上午'" align="center">
          <template slot="header">
            <div class="tabletitle-timeline">
              第{{v.count}}节 <br/>
              {{v.startTime}}-{{v.endTime}}
            </div>
          </template>
          <template slot-scope="scope">
              <div>
                {{scope.row[cname[i]]}}<br/>
                {{scope.row[teacher[i]]}}<br/>
                {{scope.row[classRoom[i]]}}<br/>
                {{scope.row[remark[i]]}}
              </div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="下午" align="center">
        <el-table-column
          v-for="(v,i) in titleData" :key="i"
          v-if="v.label==='下午'" align="center">
          <template slot="header">
            <div class="tabletitle-timeline">
              第{{v.count}}节 <br/>
              {{v.startTime}}-{{v.endTime}}
          </div>
          </template>
          <template slot-scope="scope">
              <div>
                {{scope.row[cname[i]]}}<br/>
                {{scope.row[teacher[i]]}}<br/>
                {{scope.row[classRoom[i]]}}<br/>
                {{scope.row[remark[i]]}}
              </div>
          </template>
        </el-table-column>
      </el-table-column>

      <el-table-column label="晚上" align="center">
        <el-table-column
          v-for="(v,i) in titleData" :key="i"
          v-if="v.label==='晚上'"
          align="center">
          <template slot="header">
            <div class="tabletitle-timeline">
              第{{v.count}}节 <br/>
              {{v.startTime}}-{{v.endTime}}
            </div>
          </template>
          <template slot-scope="scope">
              <div>
                {{scope.row[cname[i]]}}<br/>
                {{scope.row[teacher[i]]}}<br/>
                {{scope.row[classRoom[i]]}}<br/>
                {{scope.row[remark[i]]}}
              </div>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      cname: ['oneN', 'twoN', 'threeN', 'fourN', 'fiveN', 'sixN', 'sevenN', 'eightN', 'nineN', 'tenN'], // 课程
      teacher: ['oneT', 'twoT', 'threeT', 'fourT', 'fiveT', 'sixT', 'sevenT', 'eightT', 'nineT', 'tenT'], // 老师
      classRoom: ['oneC', 'twoC', 'threeC', 'fourC', 'fiveC', 'sixC', 'sevenC', 'eightC', 'nineC', 'tenC'], // 教室
      remark: ['oneR', 'twoR', 'threeR', 'fourR', 'fiveR', 'sixR', 'sevenR', 'eightR', 'nineR', 'tenR'], // 上课周次（周）
      timeData: [
        {
          id: '1',
          label: '周一',
          oneN: 'java教程',
          oneT: '郑老师',
          oneC: '东教305',
          oneR: '1-12周',
          twoN: '计算机基础',
          twoT: '李老师',
          twoC: '西教201',
          twoR: '1-16周',
          threeN: '',
          threeT: '',
          threeC: '',
          threeR: '',
          fourN: '',
          fourT: '',
          fourC: '',
          fourR: '',
          fiveN: 'C语言程序设计',
          fiveT: '王老师',
          fiveC: '3C207',
          fiveR: '1-16周',
          sixN: 'C#程序设计',
          sixT: '王老师',
          sixC: '3C207',
          sixR: '1-16周',
          sevenN: '',
          sevenT: '',
          sevenC: '',
          sevenR: '',
          eightN: '',
          eightT: '',
          eightC: '',
          eightR: '',
          nineN: '算法与结构',
          nineT: '王老师',
          nineC: '3C207',
          nineR: '1-16周',
          tenN: '线性代数',
          tenT: '王老师',
          tenC: '3C207',
          tenR: '1-16周'
        },
        {
          id: '2',
          label: '周二',
          oneN: 'java教程',
          oneT: '郑老师',
          oneC: '东教305',
          oneR: '1-12周',
          twoN: '计算机基础',
          twoT: '李老师',
          twoC: '西教201',
          twoR: '1-16周',
          threeN: '',
          threeT: '',
          threeC: '',
          threeR: '',
          fourN: '',
          fourT: '',
          fourC: '',
          fourR: '',
          fiveN: '',
          fiveT: '',
          fiveC: '',
          fiveR: '',
          sixN: '',
          sixT: '',
          sixC: '',
          sixR: '',
          sevenN: 'Linux操作系统',
          sevenT: '王老师',
          sevenC: '3C207',
          sevenR: '1-16周',
          eightN: '大学生就业与创业',
          eightT: '王老师',
          eightC: '3C207',
          eightR: '1-16周',
          nineN: '',
          nineT: '',
          nineC: '',
          nineR: '',
          tenN: '',
          tenT: '',
          tenC: '',
          tenR: ''
        },
        {
          id: '3',
          label: '周三',
          oneN: '',
          oneT: '',
          oneC: '',
          oneR: '',
          twoN: '',
          twoT: '',
          twoC: '',
          twoR: '',
          threeN: '计算机基础',
          threeT: '孙老师',
          threeC: '西教505',
          threeR: '1-16周',
          fourN: '计算机网络',
          fourT: '张老师',
          fourC: '2C203',
          fourR: '1-16周',
          fiveN: '',
          fiveT: '',
          fiveC: '',
          fiveR: '',
          sixN: 'C#程序设计',
          sixT: '王老师',
          sixC: '3C207',
          sixR: '1-16周',
          sevenN: 'Linux操作系统',
          sevenT: '王老师',
          sevenC: '3C207',
          sevenR: '1-16周',
          eightN: '',
          eightT: '',
          eightC: '',
          eightR: '',
          nineN: '算法与结构',
          nineT: '王老师',
          nineC: '3C207',
          nineR: '1-16周',
          tenN: '线性代数',
          tenT: '王老师',
          tenC: '3C207',
          tenR: '1-16周'
        },
        {
          id: '4',
          label: '周四'
          // oneN: '',
          // oneT: '',
          // oneC: '',
          // oneR: '',
          // twoN: '计算机基础',
          // twoT: '李老师',
          // twoC: '西教201',
          // twoR: '1-16周',
          // threeN: '',
          // threeT: '',
          // threeC: '',
          // threeR: '',
          // fourN: '',
          // fourT: '',
          // fourC: '',
          // fourR: '',
          // fiveN: 'C语言程序设计',
          // fiveT: '王老师',
          // fiveC: '3C207',
          // fiveR: '1-16周',
          // sixN: 'C#程序设计',
          // sixT: '王老师',
          // sixC: '3C207',
          // sixR: '1-16周',
          // sevenN: '',
          // sevenT: '',
          // sevenC: '',
          // sevenR: '',
          // eightN: '大学生就业与创业',
          // eightT: '王老师',
          // eightC: '3C207',
          // eightR: '1-16周',
          // nineN: '',
          // nineT: '',
          // nineC: '',
          // nineR: '',
          // tenN: '线性代数',
          // tenT: '王老师',
          // tenC: '3C207',
          // tenR: '1-16周',
        },
        {
          id: '5',
          label: '周五',
          oneN: '',
          oneT: '',
          oneC: '',
          oneR: '',
          twoN: '计算机基础',
          twoT: '李老师',
          twoC: '西教201',
          twoR: '1-16周',
          threeN: '',
          threeT: '',
          threeC: '',
          threeR: '',
          fourN: '计算机网络',
          fourT: '张老师',
          fourC: '2C203',
          fourR: '1-16周',
          fiveN: '',
          fiveT: '',
          fiveC: '',
          fiveR: '',
          sixN: 'C#程序设计',
          sixT: '王老师',
          sixC: '3C207',
          sixR: '1-16周',
          sevenN: '',
          sevenT: '',
          sevenC: '',
          sevenR: '',
          eightN: '大学生就业与创业',
          eightT: '王老师',
          eightC: '3C207',
          eightR: '1-16周',
          nineN: '',
          nineT: '',
          nineC: '',
          nineR: '',
          tenN: '线性代数',
          tenT: '王老师',
          tenC: '3C207',
          tenR: '1-16周'
        }
      ],
      timeData1: [
        [{cname: '计算机基础', teacher: '张老师', classRoom: '2C203', remark: '1-12周'}, { }, { }, { }, { }, { }, { }, { }, { }, { }],
        [{ }, { }, { }, { }, { }, { }, { }, { }, { }, { }],
        [{ }, { }, { }, { }, { }, { }, { }, { }, { }, { }],
        [{ }, { }, { }, { }, { }, { }, { }, { }, { }, { }],
        [{ }, { }, { }, { }, { }, { }, { }, { }, { }, { }],
        [{ }, { }, { }, { }, { }, { }, { }, { }, { }, { }],
        [{ }, { }, { }, { }, { }, { }, { }, { }, { }, { }]
      ],
      titleData: [
        {
          id: '1',
          count: 1,
          label: '上午',
          startTime: '08:30',
          endTime: '09:15'
        },
        {
          id: '2',
          count: 2,
          label: '上午',
          startTime: '09:25',
          endTime: '10:10'
        },
        {
          id: '3',
          count: 3,
          label: '上午',
          startTime: '10:30',
          endTime: '11:15'
        },
        {
          id: '4',
          count: 4,
          label: '上午',
          startTime: '11:25',
          endTime: '12:10'
        },
        {
          id: '5',
          count: 5,
          label: '下午',
          startTime: '14:00',
          endTime: '14:45'
        },
        {
          id: '6',
          count: 6,
          label: '下午',
          startTime: '14:55',
          endTime: '15:40'
        },
        {
          id: '7',
          count: 7,
          label: '下午',
          startTime: '16:00',
          endTime: '16:45'
        },
        {
          id: '8',
          count: 8,
          label: '下午',
          startTime: '16:55',
          endTime: '17:40'
        },
        {
          id: '9',
          count: 9,
          label: '晚上',
          startTime: '19:00',
          endTime: '19:50'
        },
        {
          id: '10',
          count: 10,
          label: '晚上',
          startTime: '20:00',
          endTime: '20:50'
        }
      ]
    }
  },
  mounted () {

  },
  methods: {
    getTimeTableFind () {

    }
  }
}
</script>
<style>
  .tabletitle-timeline{
    line-height: 18px!important;
  }
</style>
