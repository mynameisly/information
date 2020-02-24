<template>
  <div id="comment">
    <el-tabs type="card" v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="动态管理" name="dynamic">
        <childDynamic v-if="ischildDynamic" />
      </el-tab-pane>
      <el-tab-pane label="动态详情" name="dynamicDetails">
        <childDynamicDetails v-if="ischildDynamicDetails" />
      </el-tab-pane>
      <el-tab-pane label="评论管理" name="discuss">
        <childDiscuss v-if="ischildDiscuss" />
      </el-tab-pane>
      <el-tab-pane label="评论详情" name="discussDetails">
        <childDiscussDetails v-if="ischildDiscussDetails" />
      </el-tab-pane>
      <el-tab-pane label="评论统计" name="statNum">
        <childStatNumber v-if="ischildStatNumber" />
      </el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import axios from 'axios'
import dynamicList from './dynamic'
import dynamicDetails from './dynamicDetails'
import discussList from './discuss'
import discussDetails from './discussDetails'
import statNumber from './statNumber'
export default {
  components: {
    childDynamic: dynamicList,
    childDynamicDetails: dynamicDetails,
    childDiscuss: discussList,
    childDiscussDetails: discussDetails,
    childStatNumber: statNumber
  },
  data () {
    return {
      loading: false,
      activeName: 'dynamic',
      ischildDynamic: true,
      ischildDynamicDetails: false,
      ischildDiscuss: false,
      ischildDiscussDetails: false,
      ischildStatNumber: false
    }
  },
  mounted () {
    
  },
  methods: {
    handleClick (tab) {
      if (tab.name === 'dynamic') {
        this.ischildDynamic = true
        this.ischildDynamicDetails = false
        this.ischildDiscuss = false
        this.ischildDynamicDetails = false
        this.ischildStatNumber = false
      } else if (tab.name === 'dynamicDetails') {
        this.ischildDynamic = false
        this.ischildDynamicDetails = true
        this.ischildDiscuss = false
        this.ischildDynamicDetails = false
        this.ischildStatNumber = false
      } else if (tab.name === 'discuss') {
        this.ischildDynamic = false
        this.ischildDynamicDetails = false
        this.ischildDiscuss = true
        this.ischildDynamicDetails = false
        this.ischildStatNumber = false
      } else if (tab.name === 'discussDetails') {
        this.ischildDynamic = false
        this.ischildDynamicDetails = false
        this.ischildDiscuss = false
        this.ischildDynamicDetails = true
        this.ischildStatNumber = false
      } else if (tab.name === 'statNum') {
        this.ischildDynamic = false
        this.ischildDynamicDetails = false
        this.ischildDiscuss = false
        this.ischildDynamicDetails = false
        this.ischildStatNumber = true
      }
    }
  }
}
</script>

<style lang="scss">

</style>
