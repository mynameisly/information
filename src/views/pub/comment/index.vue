<template>
  <div id="comment">
    <el-tabs type="border-card">
      <el-tab-pane label="评论管理">
        <!-- 评论管理模块 -->
        
      </el-tab-pane>
      <el-tab-pane label="评论详情">
        <!-- 评论详情模块 -->
        
        </el-tab-pane>
      <el-tab-pane label="评论统计">
        <!-- 评论统计模块 -->
        
        </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import AddDialog from './add'
import UpdateDialog from './add'
// import detailsDialog from './details'
// import statNumber from './stat'
import axios from 'axios'
import echarts from 'echarts'
import PageComponent from '@/components/Pagenation/index'
export default {
  components: {
    PageComponent,
    AddDialog,
    UpdateDialog
    // detailsDialog,
    // statNumber
  },
  data () {
    return {
      
      // 下面的数据为评论详情的
      
      // 下面的数据是评论统计的
      
    }
  },
  mounted () {
    
    
  },
  methods: {
    
    //  下面的代码为details的
    
    // 下面的代码为评论统计的
    
  }
}
</script>

// <style lang="scss" scoped>
// .byMonth, .byDate, .byHour {
//   width: 1200px;
//   height:450px;
//   // border: 1px solid red;
//   margin: 0 auto;
// }
// </style>

<style lang="scss">
#comment .el-table__body-wrapper {
  height: 245px;
}
</style>
