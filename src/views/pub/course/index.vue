<template>
  <div id="course">
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="所有课程" name="allCourse">
        <childCourse v-if="isChildCourse" />
      </el-tab-pane>
      <el-tab-pane label="按周查看" name="myWeek">
        <childWeek v-if="isChildWeek" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AllCourse from './allCourse'
import MyWeek from './myWeek'
export default {
  components: {
    childCourse: AllCourse,
    childWeek: MyWeek
  },
  data () {
    return {
      activeName: 'allCourse',
      isChildCourse: true,
      isChildWeek: false
    }
  },
  mounted () {
    this.userId = sessionStorage.getItem('userId')
  },
  methods: {
    handleClick (tab) {
      if (tab.name === 'allCourse') {
        this.isChildCourse = true
        this.isChildWeek = false
      } else if (tab.name === 'myWeek') {
        this.isChildCourse = false
        this.isChildWeek = true
      }
    }
  }
}
</script>

<style lang="scss">

</style>
