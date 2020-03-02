<template>
  <div id="watch">
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="观看管理" name="allWatch">
        <childWatch v-if="isChildWatch" />
      </el-tab-pane>
      <el-tab-pane label="数量分布" name="statNum">
        <childNum v-if="isChildNum" />
      </el-tab-pane>
      <el-tab-pane label="性别分布" name="statSex">
        <childSex v-if="isChildSex" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import watchList from './watchList'
import statNum from './statNum'
import statSex from './statSex'
export default {
  components: {
    childWatch: watchList,
    childNum: statNum,
    childSex: statSex
  },
  data () {
    return {
      activeName: 'allWatch',
      isChildWatch: true,
      isChildNum: false,
      isChildSex: false,
      searchForm: {
        userId: '',
        targetId: '',
        startWatchTime: '',
        endWatchTime: ''
      }
    }
  },
  methods: {
    handleClick (tab) {
      if (tab.name === 'allWatch') {
        this.isChildWatch = true
        this.isChildNum = false
        this.isChildSex = false
      } else if (tab.name === 'statNum') {
        this.isChildWatch = false
        this.isChildNum = true
        this.isChildSex = false
      } else if (tab.name === 'statSex') {
        this.isChildWatch = false
        this.isChildNum = false
        this.isChildSex = true
      }
    }
  }
}
</script>

<style lang="scss">

</style>
